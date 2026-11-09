// Fonctions de sécurité locales. Elles ne remplacent pas un serveur d'authentification.
const TaskFlowSecurity = (() => {
  const encoder = new TextEncoder();

  function passwordRules(password) {
    const length = [...password].length;
    return {
      length: length >= 8 && length <= 64,
      uppercase: /\p{Lu}/u.test(password),
      lowercase: /\p{Ll}/u.test(password),
      number: /\p{N}/u.test(password),
      special: /[\p{P}\p{S}]/u.test(password),
    };
  }

  function assessPassword(password, username = '') {
    const rules = passwordRules(password);
    const length = [...password].length;
    const simplePattern = /(password|motdepasse|azerty|qwerty|1234|abcd|(.)\2{3,})/i.test(password);
    const containsUsername = username.length >= 3 && password.toLocaleLowerCase().includes(username.toLocaleLowerCase());
    if (!Object.values(rules).every(Boolean) || simplePattern || containsUsername) return 'weak';
    if (length >= 16) return 'strong';
    if (length >= 12) return 'medium';
    return 'weak';
  }

  function toBase64(bytes) {
    return btoa(String.fromCharCode(...bytes));
  }

  function fromBase64(value) {
    return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
  }

  async function deriveKey(password, salt) {
    const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: fromBase64(salt), iterations: 250000, hash: 'SHA-256' },
      material,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
    );
  }

  async function encrypt(key, data) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(JSON.stringify(data)));
    return { iv: toBase64(iv), ciphertext: toBase64(new Uint8Array(ciphertext)) };
  }

  async function decrypt(key, encrypted) {
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromBase64(encrypted.iv) },
      key,
      fromBase64(encrypted.ciphertext),
    );
    return JSON.parse(new TextDecoder().decode(plaintext));
  }

  async function importMasterKey(raw) {
    return crypto.subtle.importKey('raw', fromBase64(raw), 'AES-GCM', false, ['encrypt', 'decrypt']);
  }

  async function newMasterKey() {
    const raw = toBase64(crypto.getRandomValues(new Uint8Array(32)));
    return { raw, key: await importMasterKey(raw) };
  }

  async function wrapMaster(password, raw) {
    const salt = toBase64(crypto.getRandomValues(new Uint8Array(16)));
    const key = await deriveKey(password, salt);
    return { salt, wrappedKey: await encrypt(key, { master: raw }) };
  }

  async function unwrapMaster(password, wrapper) {
    const key = await deriveKey(password, wrapper.salt);
    const result = await decrypt(key, wrapper.wrappedKey);
    return { raw: result.master, key: await importMasterKey(result.master) };
  }

  function normalizeRecoveryCode(code) {
    return code.replace(/[\s-]/g, '').toUpperCase();
  }

  async function createRecovery(raw) {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
    const code = hex.match(/.{1,4}/g).join('-');
    return { code, wrapper: await wrapMaster(hex, raw) };
  }

  function lockoutMinutes(failures) {
    return failures < 3 ? 0 : 5 * 2 ** (failures - 3);
  }

  return { passwordRules, assessPassword, toBase64, deriveKey, encrypt, decrypt, newMasterKey, wrapMaster, unwrapMaster, normalizeRecoveryCode, createRecovery, lockoutMinutes };
})();

const form = document.querySelector('#task-form');
const list = document.querySelector('#task-list');
const message = document.querySelector('#message');
const calendar = document.querySelector('#calendar');
const calendarDays = document.querySelector('#calendar-days');
const dateTrigger = document.querySelector('#due-date');
const dateValue = document.querySelector('#due-date-value');
const timeInput = document.querySelector('#due-time');
const sidebar = document.querySelector('#sidebar');
const backdrop = document.querySelector('#sidebar-backdrop');
const authScreen = document.querySelector('#auth-screen');
const appShell = document.querySelector('#app-shell');
const authForm = document.querySelector('#auth-form');
const authUsername = document.querySelector('#auth-username');
const authPassword = document.querySelector('#auth-password');
const authMessage = document.querySelector('#auth-message');
const authSubmit = document.querySelector('#auth-submit');
const recoveryCodeInput = document.querySelector('#recovery-code-input');

const storageKey = 'taskflow-v2';
const accountStorageKey = 'taskflow-account-v1';
const priorityLabels = {
  pas_urgent: 'Pas urgent',
  moyennement_urgent: 'Moyennement urgent',
  urgent: 'Urgent',
};
const viewLabels = {
  all: ['Toutes les tâches', 'VUE D\'ENSEMBLE'],
  todo: ['À faire', 'TÂCHES À FAIRE'],
  done: ['Terminées', 'TÂCHES TERMINÉES'],
  trash: ['Corbeille', 'TÂCHES SUPPRIMÉES'],
};

let tasks = [];
let trash = [];
let nextId = 1;
let nextCompletionOrder = 1;
let view = 'all';
let calendarTarget = null;
let calendarMonth = new Date();
let account = null;
let encryptionKey = null;
let saveQueue = Promise.resolve();
let authMode = 'register';
let authBusy = false;
let afterRecoveryNotice = 'app';

function localDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDate(isoDate) {
  if (!isoDate) return 'Sans date';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

function validDeadline(date, time) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return false;
  const deadline = new Date(`${date}T${time}:00`);
  return !Number.isNaN(deadline.getTime()) && deadline >= new Date();
}

function load(saved) {
  try {
    if (!saved || !Array.isArray(saved.tasks) || !Array.isArray(saved.trash)) return;
    tasks = saved.tasks.filter((task) => task && Number.isInteger(task.id) && typeof task.title === 'string' && priorityLabels[task.priority] && typeof task.dueDate === 'string');
    trash = saved.trash.filter((task) => task && Number.isInteger(task.id) && typeof task.title === 'string');
    nextId = Math.max(1, ...tasks.map((task) => task.id + 1), ...trash.map((task) => task.id + 1));
    nextCompletionOrder = Math.max(1, ...tasks.map((task) => (task.completedOrder || 0) + 1));
  } catch (error) {
    message.textContent = 'Les tâches enregistrées sont illisibles. Une nouvelle liste a été ouverte.';
  }
}

function save() {
  const snapshot = { tasks: structuredClone(tasks), trash: structuredClone(trash) };
  saveQueue = saveQueue.catch(() => {}).then(async () => {
    if (!encryptionKey || !account) return false;
    const encrypted = await TaskFlowSecurity.encrypt(encryptionKey, snapshot);
    account.data = encrypted;
    localStorage.setItem(accountStorageKey, JSON.stringify(account));
    return true;
  }).catch(() => {
    message.textContent = "Impossible d'enregistrer sur cet appareil. Vérifie l'espace disponible dans le navigateur.";
    return false;
  });
  return saveQueue;
}

function button(label, action, className = 'subtle-button') {
  const element = document.createElement('button');
  element.type = 'button';
  element.className = className;
  element.textContent = label;
  element.setAttribute('aria-label', label);
  element.title = label;
  element.addEventListener('click', action);
  return element;
}

async function updateTask(task, changes) {
  Object.assign(task, changes);
  await save();
  render();
}

function render() {
  list.replaceChildren();
  const activeCount = tasks.filter((task) => !task.done).length;
  const doneCount = tasks.length - activeCount;
  document.querySelector('#count-all').textContent = tasks.length;
  document.querySelector('#count-todo').textContent = activeCount;
  document.querySelector('#count-done').textContent = doneCount;
  document.querySelector('#count-trash').textContent = trash.length;
  document.querySelector('#view-heading').textContent = viewLabels[view][0];
  document.querySelector('#list-eyebrow').textContent = viewLabels[view][1];
  document.querySelector('#composer').hidden = view === 'trash';
  document.querySelector('#view-description').textContent = view === 'trash' ? 'Récupère une tâche supprimée par erreur.' : 'Organise tes tâches et garde une vue claire sur la suite.';
  document.querySelectorAll('[data-view]').forEach((navButton) => {
    const selected = navButton.dataset.view === view;
    navButton.classList.toggle('active', selected);
    if (selected) navButton.setAttribute('aria-current', 'page');
    else navButton.removeAttribute('aria-current');
  });

  let visible;
  if (view === 'trash') visible = [...trash].reverse();
  else if (view === 'todo') visible = tasks.filter((task) => !task.done);
  else if (view === 'done') visible = tasks.filter((task) => task.done).sort((a, b) => (a.completedOrder || 0) - (b.completedOrder || 0));
  else visible = [...tasks.filter((task) => !task.done), ...tasks.filter((task) => task.done).sort((a, b) => (a.completedOrder || 0) - (b.completedOrder || 0))];

  document.querySelector('#visible-count').textContent = `${visible.length} tâche${visible.length > 1 ? 's' : ''}`;
  document.querySelector('#empty-message').hidden = visible.length > 0;
  document.querySelector('#empty-message').textContent = view === 'trash' ? 'La corbeille est vide.' : 'Aucune tâche dans cette vue.';
  for (const task of visible) list.append(renderTask(task));
}

function renderTask(task) {
  const item = document.createElement('li');
  item.className = `task${task.done ? ' done' : ''}`;
  const main = document.createElement('div');
  main.className = 'task-main';
  if (view !== 'trash') {
    const complete = button(task.done ? 'Remettre à faire' : 'Terminer', () => {
      updateTask(task, { done: !task.done, completedOrder: task.done ? null : nextCompletionOrder++ });
    }, 'complete-button');
    complete.textContent = task.done ? '✓' : '';
    main.append(complete);
  }
  const content = document.createElement('div');
  content.className = 'task-content';
  const title = document.createElement('strong');
  title.className = 'task-title';
  title.textContent = task.title;
  const meta = document.createElement('div');
  meta.className = 'task-meta';
  const priority = document.createElement('span');
  priority.className = `priority-pill ${priorityLabels[task.priority] ? task.priority : 'pas_urgent'}`;
  priority.textContent = priorityLabels[task.priority] || 'Pas urgent';
  const deadline = document.createElement('span');
  deadline.textContent = `${formatDate(task.dueDate)} · ${task.dueTime || '18:00'}`;
  meta.append(priority, deadline);
  if (task.done) {
    const status = document.createElement('span');
    status.textContent = 'Terminée';
    meta.append(status);
  }
  content.append(title, meta);
  const actions = document.createElement('div');
  actions.className = 'actions';
  if (view === 'trash') {
    actions.append(button('Restaurer', async () => {
      trash = trash.filter((candidate) => candidate.id !== task.id);
      tasks.push(task);
      await save();
      render();
    }));
  } else {
    actions.append(button('Modifier', () => showEditForm(item, task)));
    const remove = button('Supprimer vers la corbeille', async () => {
      tasks = tasks.filter((candidate) => candidate.id !== task.id);
      trash.push(task);
      await save();
      render();
    }, 'icon-button');
    remove.textContent = '🗑';
    actions.append(remove);
  }
  main.append(content, actions);
  item.append(main);
  return item;
}

function showEditForm(item, task) {
  if (item.querySelector('form')) return;
  const edit = document.createElement('form');
  edit.className = 'edit-form';
  const titleField = document.createElement('div');
  titleField.className = 'field';
  const titleLabel = document.createElement('label');
  titleLabel.textContent = 'Titre';
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.required = true;
  titleInput.value = task.title;
  titleLabel.append(titleInput);
  titleField.append(titleLabel);
  const row = document.createElement('div');
  row.className = 'form-row';
  const priorityField = document.createElement('div');
  priorityField.className = 'field';
  const priorityLabel = document.createElement('label');
  priorityLabel.textContent = 'Priorité';
  const prioritySelect = document.createElement('select');
  for (const [value, label] of Object.entries(priorityLabels)) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    prioritySelect.append(option);
  }
  prioritySelect.value = task.priority;
  priorityLabel.append(prioritySelect);
  priorityField.append(priorityLabel);
  const dateField = document.createElement('div');
  dateField.className = 'field';
  const dateLabel = document.createElement('label');
  dateLabel.textContent = 'Échéance';
  const dateButton = button(formatDate(task.dueDate) + ' ▦', () => toggleCalendar(dateButton, dateInput));
  dateButton.className = 'date-trigger';
  dateButton.setAttribute('aria-haspopup', 'dialog');
  dateButton.setAttribute('aria-expanded', 'false');
  const dateInput = document.createElement('input');
  dateInput.type = 'hidden';
  dateInput.value = task.dueDate;
  dateLabel.append(dateButton, dateInput);
  dateField.append(dateLabel);
  const timeField = document.createElement('div');
  timeField.className = 'field';
  const timeLabel = document.createElement('label');
  timeLabel.textContent = 'Heure';
  const editTime = document.createElement('input');
  editTime.type = 'time';
  editTime.required = true;
  editTime.value = task.dueTime || '18:00';
  timeLabel.append(editTime);
  timeField.append(timeLabel);
  row.append(priorityField, dateField, timeField);
  const editActions = document.createElement('div');
  editActions.className = 'edit-actions';
  editActions.append(button('Annuler', () => { closeCalendar(); render(); }));
  const saveButton = document.createElement('button');
  saveButton.type = 'submit';
  saveButton.className = 'primary-button';
  saveButton.textContent = 'Enregistrer';
  editActions.append(saveButton);
  edit.append(titleField, row, editActions);
  edit.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = titleInput.value.trim();
    if (!title) { titleInput.setCustomValidity('Saisis un titre.'); titleInput.reportValidity(); return; }
    if (!validDeadline(dateInput.value, editTime.value)) { message.textContent = 'Choisis une date et une heure futures.'; return; }
    message.textContent = '';
    closeCalendar();
    updateTask(task, { title, priority: prioritySelect.value, dueDate: dateInput.value, dueTime: editTime.value });
  });
  titleInput.addEventListener('input', () => titleInput.setCustomValidity(''));
  item.append(edit);
  titleInput.focus();
}

function closeCalendar() {
  if (calendarTarget) calendarTarget.button.setAttribute('aria-expanded', 'false');
  calendarTarget = null;
  calendar.hidden = true;
}

function toggleCalendar(buttonElement, inputElement) {
  if (calendarTarget?.button === buttonElement) { closeCalendar(); return; }
  closeCalendar();
  calendarTarget = { button: buttonElement, input: inputElement };
  buttonElement.setAttribute('aria-expanded', 'true');
  const selected = inputElement.value ? new Date(`${inputElement.value}T12:00:00`) : new Date();
  calendarMonth = new Date(selected.getFullYear(), selected.getMonth(), 1);
  renderCalendar();
  calendar.hidden = false;
  const rect = buttonElement.getBoundingClientRect();
  const top = rect.bottom + 8 + calendar.offsetHeight > window.innerHeight ? rect.top - calendar.offsetHeight - 8 : rect.bottom + 8;
  calendar.style.top = `${Math.max(8, top)}px`;
  calendar.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - calendar.offsetWidth - 8))}px`;
}

function renderCalendar() {
  calendarDays.replaceChildren();
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  document.querySelector('#calendar-month').textContent = calendarMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  for (let i = 0; i < firstWeekday; i++) calendarDays.append(document.createElement('span'));
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const iso = localDate(new Date(year, month, day));
    const dayButton = document.createElement('button');
    dayButton.type = 'button';
    dayButton.textContent = day;
    dayButton.setAttribute('aria-label', new Date(year, month, day).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    dayButton.disabled = iso < localDate();
    if (iso === localDate()) dayButton.classList.add('today');
    if (iso === calendarTarget?.input.value) dayButton.classList.add('selected');
    dayButton.addEventListener('click', () => {
      calendarTarget.input.value = iso;
      calendarTarget.button.textContent = `${formatDate(iso)} ▦`;
      message.textContent = '';
      closeCalendar();
    });
    calendarDays.append(dayButton);
  }
  document.querySelector('#previous-month').disabled = year === new Date().getFullYear() && month === new Date().getMonth();
}

document.querySelector('#previous-month').addEventListener('click', () => { calendarMonth.setMonth(calendarMonth.getMonth() - 1); renderCalendar(); });
document.querySelector('#next-month').addEventListener('click', () => { calendarMonth.setMonth(calendarMonth.getMonth() + 1); renderCalendar(); });
document.querySelector('#calendar-today').addEventListener('click', () => {
  calendarTarget.input.value = localDate();
  calendarTarget.button.textContent = `${formatDate(localDate())} ▦`;
  closeCalendar();
});
dateTrigger.addEventListener('click', () => toggleCalendar(dateTrigger, dateValue));
document.addEventListener('pointerdown', (event) => {
  if (!calendar.hidden && !calendar.contains(event.target) && !calendarTarget?.button.contains(event.target)) closeCalendar();
});
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeCalendar(); });

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = form.elements.title.value.trim();
  if (!title) { message.textContent = 'Saisis un titre pour la tâche.'; form.elements.title.focus(); return; }
  if (!validDeadline(dateValue.value, timeInput.value)) { message.textContent = 'Choisis une date et une heure futures.'; return; }
  tasks.push({ id: nextId++, title, priority: form.elements.priority.value, dueDate: dateValue.value, dueTime: timeInput.value, done: false, completedOrder: null });
  message.textContent = '';
  await save();
  form.reset();
  dateValue.value = '';
  dateTrigger.textContent = 'Choisir une date ▦';
  timeInput.value = '18:00';
  view = 'all';
  render();
});

function closeSidebar() {
  sidebar.classList.remove('open');
  backdrop.hidden = true;
  document.querySelector('#open-sidebar').setAttribute('aria-expanded', 'false');
}
document.querySelector('#open-sidebar').addEventListener('click', () => {
  sidebar.classList.add('open');
  backdrop.hidden = false;
  document.querySelector('#open-sidebar').setAttribute('aria-expanded', 'true');
});
document.querySelector('#close-sidebar').addEventListener('click', closeSidebar);
backdrop.addEventListener('click', closeSidebar);
document.querySelectorAll('[data-view]').forEach((navButton) => navButton.addEventListener('click', () => {
  view = navButton.dataset.view;
  closeCalendar();
  closeSidebar();
  render();
}));

function showApp() {
  authPassword.value = '';
  authScreen.hidden = true;
  appShell.hidden = false;
  render();
}

function maskPassword() {
  authPassword.type = 'password';
  const toggle = document.querySelector('#toggle-password');
  toggle.textContent = 'Afficher';
  toggle.setAttribute('aria-label', 'Afficher le mot de passe');
  toggle.setAttribute('aria-pressed', 'false');
}

function showLogin() {
  authMode = 'login';
  authScreen.hidden = false;
  appShell.hidden = true;
  authForm.hidden = false;
  document.querySelector('#recovery-notice').hidden = true;
  document.querySelector('#auth-heading').textContent = 'Se connecter';
  document.querySelector('#auth-intro').textContent = 'Entre ton pseudonyme et ton mot de passe pour retrouver tes tâches.';
  document.querySelector('#auth-password-label').textContent = 'Mot de passe';
  document.querySelector('#recovery-code-field').hidden = true;
  document.querySelector('#forgot-password').hidden = false;
  document.querySelector('#back-to-login').hidden = true;
  authPassword.autocomplete = 'current-password';
  authSubmit.textContent = 'Se connecter';
  authPassword.value = '';
  maskPassword();
  recoveryCodeInput.value = '';
  authMessage.textContent = '';
  updateStrength();
  updateLockout();
}

function showRecovery() {
  authMode = 'recovery';
  document.querySelector('#auth-heading').textContent = 'Retrouver mon compte';
  document.querySelector('#auth-intro').textContent = 'Entre le code de récupération conservé lors de la création du compte, puis choisis un nouveau mot de passe.';
  document.querySelector('#auth-password-label').textContent = 'Nouveau mot de passe';
  document.querySelector('#recovery-code-field').hidden = false;
  document.querySelector('#forgot-password').hidden = true;
  document.querySelector('#back-to-login').hidden = false;
  authPassword.autocomplete = 'new-password';
  authPassword.value = '';
  maskPassword();
  authSubmit.textContent = 'Changer le mot de passe';
  authMessage.textContent = account.recovery ? '' : "Aucun code de récupération n'a encore été créé pour ce compte. Connecte-toi d'abord avec ton mot de passe.";
  updateStrength();
  updateLockout();
}

function showRecoveryNotice(code, nextAction) {
  afterRecoveryNotice = nextAction;
  authMode = 'notice';
  authScreen.hidden = false;
  appShell.hidden = true;
  authForm.hidden = true;
  document.querySelector('#recovery-notice').hidden = false;
  document.querySelector('#recovery-code-display').textContent = code;
  document.querySelector('#auth-heading').textContent = 'Code de récupération';
  document.querySelector('#auth-intro').textContent = 'Enregistre ce code avant de continuer.';
}

function updateStrength() {
  const password = authPassword.value;
  const rules = TaskFlowSecurity.passwordRules(password);
  for (const [name, met] of Object.entries(rules)) {
    document.querySelector(`#rule-${name}`).classList.toggle('met', met);
  }
  const level = password ? TaskFlowSecurity.assessPassword(password, authUsername.value) : 'neutral';
  const label = document.querySelector('#password-strength');
  const fill = document.querySelector('#strength-fill');
  label.className = `strength ${level}`;
  fill.className = level;
  label.textContent = { neutral: 'À évaluer', weak: 'Faible', medium: 'Moyen', strong: 'Fort' }[level];
}

function updateLockout() {
  if (!account) { authSubmit.disabled = authBusy; return; }
  const remaining = Math.max(0, account.lockedUntil - Date.now());
  authSubmit.disabled = remaining > 0 || authBusy || (authMode === 'recovery' && !account.recovery);
  if (remaining > 0) {
    const totalSeconds = Math.ceil(remaining / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    if (authMode !== 'notice') authMessage.textContent = `Compte temporairement bloqué. Réessaie dans ${minutes}:${seconds}.`;
  } else if (account.lockedUntil) {
    account.lockedUntil = 0;
    localStorage.setItem(accountStorageKey, JSON.stringify(account));
    authMessage.textContent = 'Tu peux réessayer de te connecter.';
  }
}

function recordFailure() {
  account.failedAttempts += 1;
  const minutes = TaskFlowSecurity.lockoutMinutes(account.failedAttempts);
  if (minutes) account.lockedUntil = Date.now() + minutes * 60_000;
  localStorage.setItem(accountStorageKey, JSON.stringify(account));
  authMessage.textContent = 'Pseudonyme ou mot de passe incorrect.';
  updateLockout();
}

async function createAccount(username, password) {
  if (!username.trim()) { authMessage.textContent = 'Saisis un pseudonyme.'; return; }
  const rules = TaskFlowSecurity.passwordRules(password);
  if (!Object.values(rules).every(Boolean)) {
    authMessage.textContent = 'Le mot de passe doit contenir 8 à 64 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.';
    return;
  }
  const legacy = localStorage.getItem(storageKey);
  if (legacy) load(JSON.parse(legacy));
  const master = await TaskFlowSecurity.newMasterKey();
  const passwordWrapper = await TaskFlowSecurity.wrapMaster(password, master.raw);
  const recovery = await TaskFlowSecurity.createRecovery(master.raw);
  const data = await TaskFlowSecurity.encrypt(master.key, { tasks, trash });
  const createdAccount = { version: 2, username, ...passwordWrapper, recovery: recovery.wrapper, data, failedAttempts: 0, lockedUntil: 0 };
  localStorage.setItem(accountStorageKey, JSON.stringify(createdAccount));
  if (legacy) localStorage.removeItem(storageKey);
  account = createdAccount;
  encryptionKey = master.key;
  showRecoveryNotice(recovery.code, 'app');
}

async function login(username, password) {
  if (account.lockedUntil > Date.now()) { updateLockout(); return; }
  if (username !== account.username) { recordFailure(); return; }
  let key;
  let data;
  let recoveryCode = null;
  try {
    if (account.version === 2) {
      key = (await TaskFlowSecurity.unwrapMaster(password, account)).key;
      data = await TaskFlowSecurity.decrypt(key, account.data);
    } else {
      const oldKey = await TaskFlowSecurity.deriveKey(password, account.salt);
      data = await TaskFlowSecurity.decrypt(oldKey, account.data);
      const master = await TaskFlowSecurity.newMasterKey();
      const passwordWrapper = await TaskFlowSecurity.wrapMaster(password, master.raw);
      const recovery = await TaskFlowSecurity.createRecovery(master.raw);
      const migrated = { ...account, version: 2, ...passwordWrapper, recovery: recovery.wrapper, data: await TaskFlowSecurity.encrypt(master.key, data) };
      localStorage.setItem(accountStorageKey, JSON.stringify(migrated));
      account = migrated;
      key = master.key;
      recoveryCode = recovery.code;
    }
  } catch (error) {
    recordFailure();
    return;
  }
  encryptionKey = key;
  load(data);
  account.failedAttempts = 0;
  account.lockedUntil = 0;
  localStorage.setItem(accountStorageKey, JSON.stringify(account));
  authMessage.textContent = '';
  if (recoveryCode) showRecoveryNotice(recoveryCode, 'app');
  else showApp();
}

async function recoverAccount(username, code, newPassword) {
  if (account.lockedUntil > Date.now()) { updateLockout(); return; }
  if (!Object.values(TaskFlowSecurity.passwordRules(newPassword)).every(Boolean)) {
    authMessage.textContent = 'Choisis un nouveau mot de passe de 8 à 64 caractères avec majuscule, minuscule, chiffre et caractère spécial.';
    return;
  }
  if (username !== account.username || !account.recovery || !/^[A-F0-9]{32}$/.test(TaskFlowSecurity.normalizeRecoveryCode(code))) {
    recordFailure();
    return;
  }
  let master;
  try {
    master = await TaskFlowSecurity.unwrapMaster(TaskFlowSecurity.normalizeRecoveryCode(code), account.recovery);
    await TaskFlowSecurity.decrypt(master.key, account.data);
  } catch (error) {
    recordFailure();
    return;
  }
  const passwordWrapper = await TaskFlowSecurity.wrapMaster(newPassword, master.raw);
  const recovery = await TaskFlowSecurity.createRecovery(master.raw);
  const updated = { ...account, ...passwordWrapper, recovery: recovery.wrapper, failedAttempts: 0, lockedUntil: 0 };
  localStorage.setItem(accountStorageKey, JSON.stringify(updated));
  account = updated;
  recoveryCodeInput.value = '';
  showRecoveryNotice(recovery.code, 'login');
}

authPassword.addEventListener('input', updateStrength);
authUsername.addEventListener('input', updateStrength);
document.querySelector('#toggle-password').addEventListener('click', () => {
  const visible = authPassword.type === 'password';
  authPassword.type = visible ? 'text' : 'password';
  const toggle = document.querySelector('#toggle-password');
  toggle.textContent = visible ? 'Masquer' : 'Afficher';
  toggle.setAttribute('aria-label', visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
  toggle.setAttribute('aria-pressed', String(visible));
  authPassword.focus();
});
document.querySelector('#forgot-password').addEventListener('click', showRecovery);
document.querySelector('#back-to-login').addEventListener('click', showLogin);
document.querySelector('#recovery-notice-done').addEventListener('click', () => {
  document.querySelector('#recovery-code-display').textContent = '';
  if (afterRecoveryNotice === 'login') showLogin();
  else showApp();
});
authForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (authSubmit.disabled || authBusy) return;
  const username = authUsername.value;
  const password = authPassword.value;
  authBusy = true;
  updateLockout();
  authMessage.textContent = '';
  try {
    if (authMode === 'recovery') await recoverAccount(username, recoveryCodeInput.value, password);
    else if (account) await login(username, password);
    else await createAccount(username, password);
  } catch (error) {
    authMessage.textContent = 'Impossible de traiter le compte sur cet appareil. Vérifie que le stockage local est disponible.';
  } finally {
    if (authMode !== 'register') authPassword.value = '';
    authBusy = false;
    updateLockout();
    updateStrength();
  }
});

document.querySelector('#logout').addEventListener('click', async () => {
  await saveQueue;
  encryptionKey = null;
  tasks = [];
  trash = [];
  closeCalendar();
  closeSidebar();
  showLogin();
});

try {
  const rawAccount = localStorage.getItem(accountStorageKey);
  if (rawAccount) {
    account = JSON.parse(rawAccount);
    if (typeof account.username !== 'string' || !account.salt || !account.data) throw new Error('Compte invalide');
    if (account.version === 2 && (!account.wrappedKey || !account.recovery)) throw new Error('Compte invalide');
    account.failedAttempts = Number.isInteger(account.failedAttempts) ? account.failedAttempts : 0;
    account.lockedUntil = Number.isFinite(account.lockedUntil) ? account.lockedUntil : 0;
    showLogin();
  }
} catch (error) {
  account = null;
  authSubmit.disabled = true;
  authMessage.textContent = 'Le compte local est illisible. Les données existantes ont été conservées.';
}
setInterval(updateLockout, 1000);
