const todoListEl = document.getElementById('todo-items');
const newTodoItemEl = document.getElementById('new-todo-item');
const formEl = document.querySelector('form');

var OldElement = '';

var deleteId = 0;

formEl.addEventListener('submit',(e) => {
    e.preventDefault();
    
    let todoItem = newTodoItemEl.value;
    const addItemEl = document.createElement('div');
    addItemEl.classList.add('todo-item');
    addItemEl.setAttribute("id", 'del' + deleteId);
    addItemEl.innerHTML = 
    `
    <input type="checkbox" name="check" class="item">
    <p class="todo">${todoItem}</p>
    <button class="delete-button" id=${deleteId} onclick="deleteTodo(this.id)"><i class="fas fa-times"></i></button>
    `;
    deleteId++;
    if(OldElement) {
        todoListEl.insertBefore(addItemEl,OldElement);
        OldElement = addItemEl;
    } else {
        todoListEl.appendChild(addItemEl);
        OldElement = addItemEl;
    }
    newTodoItemEl.value = '';
});

function deleteTodo(e) {
    const deleteTodoEL = document.getElementById('del' + e);
    deleteTodoEL.remove();
        OldElement = '';
}
