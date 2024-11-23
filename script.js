document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("task-form");
    const taskList = document.getElementById("task-list");
    const searchBox = document.getElementById("search-box");
    const priorityFilter = document.getElementById("priority-filter");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Function to render tasks
    function displayTasks(tasks) {
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("task", task.priority);
            taskDiv.innerHTML = `
                <div class="task-details">
                    <div class="task-title">${escapeHtml(task.title)}</div>
                    <div class="task-description">${escapeHtml(task.description)}</div>
                    <div class="task-deadline">Due: ${new Date(task.deadline).toLocaleString()}</div>
                </div>
                <div class="task-buttons">
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            `;
            taskList.appendChild(taskDiv);
        });

        // Attach delete event to buttons
        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                deleteTask(index);
            });
        });
    }

    // Function to escape HTML characters to prevent XSS attacks
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Delete Task Handler
    function deleteTask(index) {
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        displayTasks(tasks);
    }

    // Input validation function
    function validateTaskInput(title, description, deadline) {
        // Validate non-empty fields
        if (!title.trim() || !description.trim()) {
            alert("Title and Description are required.");
            return false;
        }

        // Validate deadline format (datetime-local)
        const currentDate = new Date();
        const taskDate = new Date(deadline);
        if (taskDate <= currentDate) {
            alert("Deadline must be in the future.");
            return false;
        }

        return true;
    }

    // Add Task Handler
    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("task-title").value;
        const description = document.getElementById("task-description").value;
        const deadline = document.getElementById("task-deadline").value;
        const priority = document.getElementById("task-priority").value;

        // Validate input
        if (!validateTaskInput(title, description, deadline)) {
            return; // Don't proceed if validation fails
        }

        const newTask = {
            title: title,
            description: description,
            deadline: deadline,
            priority: priority
        };

        tasks.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        displayTasks(tasks);
        taskForm.reset();
    });

    // Search Handler
    searchBox.addEventListener("input", () => {
        const searchText = searchBox.value.toLowerCase();
        const filteredTasks = tasks.filter(task =>
            task.title.toLowerCase().includes(searchText) ||
            task.description.toLowerCase().includes(searchText)
        );
        displayTasks(filteredTasks);
    });

    // Filter Tasks by Priority
    priorityFilter.addEventListener("change", () => {
        const selectedPriority = priorityFilter.value;
        const filteredTasks = tasks.filter(task =>
            selectedPriority === "all" || task.priority === selectedPriority
        );
        displayTasks(filteredTasks);
    });

    // Initial Display of Tasks
    displayTasks(tasks);
});