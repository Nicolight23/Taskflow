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

const storageKey = 'taskflow-v2';
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

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
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
  try {
    localStorage.setItem(storageKey, JSON.stringify({ tasks, trash }));
  } catch (error) {
    message.textContent = "Impossible d'enregistrer sur cet appareil. Vérifie l'espace disponible dans le navigateur.";
  }
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

function updateTask(task, changes) {
  Object.assign(task, changes);
  save();
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
    actions.append(button('Restaurer', () => {
      trash = trash.filter((candidate) => candidate.id !== task.id);
      tasks.push(task);
      save();
      render();
    }));
  } else {
    actions.append(button('Modifier', () => showEditForm(item, task)));
    const remove = button('Supprimer vers la corbeille', () => {
      tasks = tasks.filter((candidate) => candidate.id !== task.id);
      trash.push(task);
      save();
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

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = form.elements.title.value.trim();
  if (!title) { message.textContent = 'Saisis un titre pour la tâche.'; form.elements.title.focus(); return; }
  if (!validDeadline(dateValue.value, timeInput.value)) { message.textContent = 'Choisis une date et une heure futures.'; return; }
  tasks.push({ id: nextId++, title, priority: form.elements.priority.value, dueDate: dateValue.value, dueTime: timeInput.value, done: false, completedOrder: null });
  message.textContent = '';
  save();
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

load();
render();
