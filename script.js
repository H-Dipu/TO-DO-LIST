document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.getElementById('addTaskButton');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const filterButtons = document.querySelectorAll('.filterButton');

    // Load tasks from local storage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskElement = createTaskElement(task.text, task.completed);
            taskList.appendChild(taskElement);
        });
    }

    function saveTasks() {
        const tasks = Array.from(taskList.children).map(task => {
            return {
                text: task.querySelector('span').textContent,
                completed: task.classList.contains('completed')
            };
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function createTaskElement(taskText, completed = false) {
        const li = document.createElement('li');
        li.className = 'task' + (completed ? ' completed' : '');
        li.innerHTML = `
            <span>${taskText}</span>
            <input type="text" class="editInput" value="${taskText}">
            <button class="editButton">Edit</button>
            <button class="deleteButton">Delete</button>
            <input type="checkbox" class="completeCheckbox" ${completed ? 'checked' : ''}>
        `;
        return li;
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const taskElement = createTaskElement(taskText);
        taskList.appendChild(taskElement);
        taskInput.value = '';

        saveTasks();
    }

    function handleTaskListClick(event) {
        const target = event.target;

        if (target.classList.contains('deleteButton')) {
            target.parentElement.remove();
            saveTasks();
        } else if (target.classList.contains('completeCheckbox')) {
            const taskElement = target.parentElement;
            taskElement.classList.toggle('completed');
            saveTasks();
        } else if (target.classList.contains('editButton')) {
            const taskElement = target.parentElement;
            const span = taskElement.querySelector('span');
            const editInput = taskElement.querySelector('.editInput');

            if (target.textContent === 'Edit') {
                span.style.display = 'none';
                editInput.style.display = 'block';
                target.textContent = 'Save';
            } else {
                span.textContent = editInput.value;
                span.style.display = 'block';
                editInput.style.display = 'none';
                target.textContent = 'Edit';
                saveTasks();
            }
        }
    }

    function handleFilterClick(event) {
        const filter = event.target.dataset.filter;
        Array.from(taskList.children).forEach(task => {
            if (filter === 'all') {
                task.style.display = '';
            } else if (filter === 'completed' && task.classList.contains('completed')) {
                task.style.display = '';
            } else if (filter === 'active' && !task.classList.contains('completed')) {
                task.style.display = '';
            } else {
                task.style.display = 'none';
            }
        });
    }

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });
    taskList.addEventListener('click', handleTaskListClick);
    filterButtons.forEach(button => button.addEventListener('click', handleFilterClick));

    // Initial load of tasks
    loadTasks();
});
