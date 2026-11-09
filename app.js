const form = document.querySelector('#task-form');
const list = document.querySelector('#task-list');
const message = document.querySelector('#message');
const emptyMessage = document.querySelector('#empty-message');

const priorityLabels = {
  pas_urgent: 'Pas urgent',
  moyennement_urgent: 'Moyennement urgent',
  urgent: 'Urgent',
};

const tasks = [];
let nextId = 1;

function formatDate(isoDate) {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

function addButton(parent, label, action) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', action);
  parent.append(button);
}

function render() {
  list.replaceChildren();
  emptyMessage.hidden = tasks.length > 0;

  for (const task of tasks) {
    const item = document.createElement('li');
    item.className = task.done ? 'task done' : 'task';

    const title = document.createElement('strong');
    title.className = 'task-title';
    title.textContent = task.title;

    const details = document.createElement('p');
    details.textContent = `${priorityLabels[task.priority]} · Échéance : ${formatDate(task.dueDate)} · ${task.done ? 'Terminée' : 'À faire'}`;

    const actions = document.createElement('div');
    actions.className = 'actions';
    addButton(actions, 'Modifier', () => showEditForm(item, task));
    addButton(actions, task.done ? 'Remettre à faire' : 'Terminer', () => {
      task.done = !task.done;
      render();
    });
    addButton(actions, 'Supprimer', () => {
      const index = tasks.findIndex((candidate) => candidate.id === task.id);
      if (index !== -1) tasks.splice(index, 1);
      render();
    });

    item.append(title, details, actions);
    list.append(item);
  }
}

function showEditForm(item, task) {
  if (item.querySelector('form')) return;

  const editForm = document.createElement('form');
  editForm.className = 'edit-form';

  const titleLabel = document.createElement('label');
  titleLabel.textContent = 'Titre';
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.value = task.title;
  titleInput.required = true;
  titleLabel.append(titleInput);

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

  const dateLabel = document.createElement('label');
  dateLabel.textContent = "Date d'échéance";
  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.value = task.dueDate;
  dateInput.required = true;
  dateLabel.append(dateInput);

  const saveButton = document.createElement('button');
  saveButton.type = 'submit';
  saveButton.textContent = 'Enregistrer';
  addButton(editForm, 'Annuler', render);
  editForm.append(titleLabel, priorityLabel, dateLabel, saveButton);

  editForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newTitle = titleInput.value.trim();
    if (!newTitle) {
      titleInput.setCustomValidity('Saisis un titre pour la tâche.');
      titleInput.reportValidity();
      return;
    }
    task.title = newTitle;
    task.priority = prioritySelect.value;
    task.dueDate = dateInput.value;
    render();
  });
  titleInput.addEventListener('input', () => titleInput.setCustomValidity(''));
  item.append(editForm);
  titleInput.focus();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = form.elements.title.value.trim();
  if (!title) {
    message.textContent = 'Saisis un titre pour la tâche.';
    form.elements.title.focus();
    return;
  }

  tasks.push({
    id: nextId++,
    title,
    priority: form.elements.priority.value,
    dueDate: form.elements.dueDate.value,
    done: false,
  });
  message.textContent = '';
  form.reset();
  render();
});

render();
