const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyMessage = document.getElementById('empty-message');

const STORAGE_KEY = 'todo-list-items';

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTaskItem(task) {
  const li = document.createElement('li');
  li.className = 'todo-item' + (task.completed ? ' completed' : '');
  li.dataset.id = task.id;

  const label = document.createElement('label');
  label.className = 'todo-label';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => toggleTask(task.id));

  const text = document.createElement('span');
  text.textContent = task.text;

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = '×';
  deleteButton.title = 'Remove task';
  deleteButton.addEventListener('click', () => removeTask(task.id));

  label.appendChild(checkbox);
  label.appendChild(text);
  li.appendChild(label);
  li.appendChild(deleteButton);

  return li;
}

function renderTasks() {
  const tasks = loadTasks();
  todoList.innerHTML = '';

  if (tasks.length === 0) {
    emptyMessage.style.display = 'block';
    return;
  }

  emptyMessage.style.display = 'none';

  tasks.forEach((task) => {
    const item = createTaskItem(task);
    todoList.appendChild(item);
  });
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const tasks = loadTasks();
  tasks.push({
    id: Date.now().toString(),
    text: trimmed,
    completed: false,
  });

  saveTasks(tasks);
  renderTasks();
}

function toggleTask(id) {
  const tasks = loadTasks();
  const updated = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasks(updated);
  renderTasks();
}

function removeTask(id) {
  const tasks = loadTasks().filter((task) => task.id !== id);
  saveTasks(tasks);
  renderTasks();
}

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addTask(todoInput.value);
  todoInput.value = '';
  todoInput.focus();
});

window.addEventListener('DOMContentLoaded', renderTasks);
