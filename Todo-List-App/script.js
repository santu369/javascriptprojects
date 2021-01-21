const todoListEl = document.getElementById('todo-items');
const newTodoItemEl = document.getElementById('new-todo-item');
const formEl = document.querySelector('form');

let todoItems = [];

document.addEventListener("DOMContentLoaded", function() {
    loadFromLS();
});

function loadFromLS() {
    todoItems = getLS();
    todoListEl.innerHTML = '';
    if(todoItems) {
        todoItems.forEach((todoItem) => {
            addTodo(todoItem);
        });
    } else {
        todoItems = []
    }
    newTodoItemEl.focus();
}

formEl.addEventListener('submit',(e) => {
    e.preventDefault();
    let todoExists = false;
    let todoItem = newTodoItemEl.value.trim();
    if(todoItems) {
        for (let i = 0; i < todoItems.length; i++) {
            if(todoItems[i].todo == todoItem) {
                newTodoItemEl.value = '';
                todoExists = true;
                break;
            }
        }
    }
    if(todoExists) {
        alert(todoItem + " Todo Item Exists");
    } else { 
        addTodo({"todo": todoItem, "status": "unchecked"});
        newTodoItemEl.value = '';
        console.log(todoItem);
        todoItems.push({"todo": todoItem, "status": "unchecked"});
        setLS();
    }
});

function addTodo(todoItem) {
    const addItemEl = document.createElement('div');
    addItemEl.classList.add('todo-item');
    addItemEl.innerHTML = 
    `
    <input type="checkbox" class="item" onclick="toggleTodoStatus(this)" ${todoItem.status}>
    <p class="todo">${todoItem.todo}</p>
    <button class="delete-button" onclick="deleteTodo(this)"><i class="fas fa-times"></i></button>
    `;
    todoListEl.prepend(addItemEl);
}

function deleteTodo(e) {
    for (let i = 0; i < todoItems.length; i++) {
        if(todoItems[i].todo == e.previousElementSibling.innerText) {
            todoItems.splice(i, 1);
        }
    }
    setLS();
    e.parentNode.remove();
}

function toggleTodoStatus(e) {
    for (let i = 0; i < todoItems.length; i++) {
        if(todoItems[i].todo == e.nextElementSibling.innerText) {
            if(e.checked) {
                todoItems[i].status = 'checked';
                break;
            } else {
                todoItems[i].status = 'unchecked';
                break;
            }
        }
    }
    setLS();
}

function setLS() {
    localStorage.setItem('todoItems', JSON.stringify(todoItems));
}

function getLS() {
    return JSON.parse(localStorage.getItem('todoItems'));
}