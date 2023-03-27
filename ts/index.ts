const BACKEND_ROOT_URL = 'https://todo-backend-rq05.onrender.com';
import { Task } from './task.js';
import { Todos } from './todos.js';

const todos = new Todos(BACKEND_ROOT_URL);
const list = <HTMLUListElement>(
  document.querySelector('#todolist')
);
const input = <HTMLInputElement>(
  document.querySelector('#newtodo')
);

input.disabled = true;

// fetch(BACKEND_ROOT_URL)
//   .then((response) => response.json())
//   .then(
//     (response) => {
//       response.forEach((node) => {
//         renderTask(node.description);
//       });
//       input.disabled = false;
//     },
//     (error) => {
//       alert(error);
//     }
//   );

todos
  .getTasks()
  .then((tasks: Array<Task>) => {
    tasks.forEach((task) => {
      renderTask(task);
    });
    input.disabled = false;
  })
  .catch((error) => {
    alert(error);
  });

input.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const text = input.value.trim();
    if (text !== '') {
      todos.addTask(text).then((task) => {
        input.value = '';
        input.focus();
        renderTask(<Task>task);
      });
    }
    event.preventDefault();
  }
});

//Create a function to render task
const renderTask = (task: Task) => {
  const list_item = document.createElement('li');
  list_item.setAttribute('class', 'list-group-item');
  list_item.setAttribute('data-key', task.id.toString());
  renderSpan(list_item, task.text);
  renderLink(list_item, task.id);
  list.append(list_item);
};

const renderSpan = (
  list_item: HTMLElement,
  text: string
) => {
  const span = list_item.appendChild(
    document.createElement('span')
  );
  span.innerHTML = text;
};

const renderLink = (list_item: HTMLElement, id: number) => {
  const link = list_item.appendChild(
    document.createElement('a')
  );
  link.innerHTML = '<i class="bi bi-trash"></i>';
  link.setAttribute('style', 'float:right');

  link.addEventListener('click', (event) => {
    todos
      .removeTask(id)
      .then((id) => {
        const elementToRemove: HTMLElement =
          document.querySelector(`[data-key='${id}']`);
        if (elementToRemove) {
          list.removeChild(elementToRemove);
        }
      })
      .catch((error) => {
        alert(error);
      });
  });
};
