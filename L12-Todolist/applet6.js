class TodoList {
    constructor() {
        this.editingIndex = -1;
        this.addButton = document.getElementById('addButton');
        this.todoInput = document.getElementById('todoInput');
        this.dueDateInput = document.getElementById('dueDateInput');
        this.todoList = document.getElementById('todoList');

        this.addButton.addEventListener('click', () => this.addOrUpdateTask());
        this.todoList.addEventListener('click', (e) => this.handleListClick(e));
    }

    handleListClick(event) {
        const target = event.target;
        if (target.classList.contains('removeButton')) {
            this.removeTask(target);
        } else if (target.classList.contains('editButton')) {
            this.editTask(target);
        } else if (target.classList.contains('doneButton')) {
            this.doneTask(target);
        }
    }

    addOrUpdateTask() {
        const taskText = this.todoInput.value.trim();
        const dueDate = this.dueDateInput.value;
        if (taskText) {
            this.editingIndex === -1 ? this.addTask(taskText, dueDate) : this.updateTask(taskText, dueDate);
            this.todoInput.value = '';
            this.dueDateInput.value = '';  
        }
    }

    addTask(taskText, dueDate) {
        const listItem = this.createTaskElement(taskText, dueDate);
        this.todoList.appendChild(listItem);
    }

    createTaskElement(taskText, dueDate) {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item todo-item';
        listItem.innerHTML = `
            <span class="task-text">${taskText}</span>
            <span class="timestamp" style="display: block; margin-top: 0.5rem; color: gray;">Date Added: ${new Date().toLocaleString()}</span>
            <span class="due-date" style="display: block; color: red;">Due Date and Time: ${dueDate ? new Date(dueDate).toLocaleString() : 'No due date'}</span>
            <div style="margin-top: 0.5rem;">
                <button class="btn btn-success btn-sm doneButton">Done</button>
                <button class="btn btn-warning btn-sm editButton">Edit</button>
                <button class="btn btn-danger btn-sm removeButton">Remove</button>
            </div>
        `;
        return listItem;
    }

    doneTask(target) {
        const taskItem = target.closest('.todo-item');
        taskItem.querySelector('.task-text').classList.toggle('completed');
        this.disableButtons(taskItem);
    }

    updateTask(taskText, dueDate) {
        const taskItem = this.todoList.children[this.editingIndex];
        taskItem.querySelector('.task-text').textContent = taskText;
        taskItem.querySelector('.due-date').textContent = `Due Date: ${dueDate ? new Date(dueDate).toLocaleString() : 'No due date'}`;
        this.resetEditing();
    }

    removeTask(target) {
        this.todoList.removeChild(target.closest('.todo-item'));
    }

    editTask(target) {
        const taskItem = target.closest('.todo-item');
        this.todoInput.value = taskItem.querySelector('.task-text').textContent;
        const dueDateText = taskItem.querySelector('.due-date').textContent.replace('Due Date: ', '');
        this.dueDateInput.value = new Date(dueDateText).toISOString().slice(0, -1);  // Set due date input
        this.editingIndex = Array.from(this.todoList.children).indexOf(taskItem);
        this.addButton.textContent = 'Update';
    }

    resetEditing() {
        this.editingIndex = -1;
        this.addButton.textContent = 'Add';
    }

    disableButtons(taskItem) {
        const buttons = taskItem.querySelectorAll('button');
        buttons.forEach(button => button.disabled = true);
    }
}

document.addEventListener('DOMContentLoaded', () => new TodoList());