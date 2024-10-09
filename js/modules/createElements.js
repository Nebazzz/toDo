// Функция для генерации уникального ID
const generateId = () => Math.random().toString().substring(2, 10);

// Авторизация пользователя
const userName = prompt("Пожалуйста, введите ваше имя:");

if (!userName) {
  alert("Имя пользователя обязательно!");
  throw new Error("Имя по��ьзователя обязательно!");
}

// Функция для загрузки задач из localStorage
const loadTasks = () => {
  const storedTasks = JSON.parse(localStorage.getItem(userName) || "[]");
  storedTasks.forEach(task => {
    renderTask(task);
  });
};

// Функция для сохранения задач в localStorage
const saveTasks = (tasks) => {
  localStorage.setItem(userName, JSON.stringify(tasks));
};

// Функция для отрисовки задачи в таблице
const renderTask = (task) => {
  const tbody = tableElement.querySelector('tbody');
  const newRow = document.createElement('tr');
  newRow.className = task.status === 'Выполнена' ? 'table-success' : 'table-light';
  const columns = [
    {
      text: `${tbody.rows.length + 1}`,
      className: ''
    },
    {
      text: task.text,
      className: 'task'
    },
    {
      text: task.status,
      className: ''
    },
    {
      html: `
        <button class="btn btn-danger">Удалить</button>
        <button class="btn btn-success">Завершить</button>
      `,
      className: ''
    }
  ];
  columns.forEach((column, index) => {
    const td = document.createElement('td');
    td.className = column.className;
    if (column.html) {
      td.innerHTML = column.html;
    } else {
      td.textContent = column.text;
    }
    newRow.appendChild(td);
  });
  tbody.appendChild(newRow);

  const deleteButton = newRow.querySelector('.btn-danger');
  const finishButton = newRow.querySelector('.btn-success');

  deleteButton.addEventListener('click', () => {
    newRow.remove();
    let tasks = JSON.parse(localStorage.getItem(userName) || "[]");
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks(tasks);
  });

  finishButton.addEventListener('click', () => {
    newRow.className = 'table-success';
    const taskElement = newRow.querySelector('.task');
    taskElement.className = 'text-decoration-line-through task';
    const statusElement = newRow.querySelector('td:nth-child(3)');
    statusElement.textContent = 'Выполнена';

    let tasks = JSON.parse(localStorage.getItem(userName) || "[]");
    tasks = tasks.map(t => t.id === task.id ? { ...t, status: 'Выполнена' } : t);
    saveTasks(tasks);
  });
};

// Создание элементов страницы
const createContainer = () => {
  const container = document.querySelector(".app-container");
  container.className = 'app-container vh-100 w-100 d-flex align-items-center justify-content-center flex-column';
  return container;
};

const container = createContainer();

const createTitle = () => {
  const mainTitle = document.createElement("h3");
  mainTitle.textContent = 'Todo App';
  container.appendChild(mainTitle);
  return mainTitle;
};

createTitle();

const createForm = () => {
  const formElement = document.createElement("form");
  formElement.className = 'd-flex align-items-center mb-3';
  container.appendChild(formElement);
  return formElement;
};

const formElement = createForm();

const createFormLabel = () => {
  const formLabelElement = document.createElement("label");
  formLabelElement.className = 'form-group me-3 mb-0';
  formElement.appendChild(formLabelElement);
  return formLabelElement;
};

const formLabelElement = createFormLabel();

const createInputForm = (formLabel) => {
  const inputFormElement = document.createElement("input");
  inputFormElement.className = 'form-control';
  inputFormElement.type = 'text';
  inputFormElement.placeholder = 'ввести задачу';
  formLabel.appendChild(inputFormElement);
  return inputFormElement;
};

const inputFormElement = createInputForm(formLabelElement);

const createSubmitButton = () => {
  const submitButtonFormElement = document.createElement('button');
  submitButtonFormElement.className = 'btn btn-primary me-3';
  submitButtonFormElement.type = 'submit';
  submitButtonFormElement.textContent = 'Сохранить';
  formElement.appendChild(submitButtonFormElement);
  return submitButtonFormElement;
};

createSubmitButton();

const createResetButton = () => {
  const resetButtonFormElement = document.createElement('button');
  resetButtonFormElement.className = 'btn btn-warning';
  resetButtonFormElement.type = 'reset';
  resetButtonFormElement.textContent = 'Очистить';
  formElement.appendChild(resetButtonFormElement);
  return resetButtonFormElement;
};

createResetButton();

const createTableWrapper = () => {
  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'table-wrapper';
  container.appendChild(tableWrapper);
  return tableWrapper;
};

const tableWrapper = createTableWrapper();

const createTable = (wrapper) => {
  const tableElement = document.createElement('table');
  tableElement.className = 'table table-hover table-bordered';
  wrapper.appendChild(tableElement);
  tableElement.insertAdjacentHTML('afterbegin', `
    <thead>
      <tr>
        <th>№</th>
        <th>Задача</th>
        <th>Статус</th>
        <th>Действия</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  `);
  return tableElement;
};

const tableElement = createTable(tableWrapper);

// Отрисовка таблицы
const createTableRow = () => {
  const taskText = inputFormElement.value.trim();
  if (taskText) {
    const task = {
      id: generateId(),
      text: taskText,
      status: 'В процессе'
    };

    renderTask(task);

    const tasks = JSON.parse(localStorage.getItem(userName) || "[]");
    tasks.push(task);
    saveTasks(tasks);

    inputFormElement.value = '';
  }
};

formElement.addEventListener('submit', (e) => {
  e.preventDefault();
  createTableRow();
});

// Загружаем задачи при старте приложения
loadTasks();