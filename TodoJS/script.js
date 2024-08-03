document.addEventListener("DOMContentLoaded", loadTasks);

document.getElementById("add-task").addEventListener("click", addTask);
document.querySelectorAll(".filters button").forEach((button) => {
  button.addEventListener("click", filterTasks);
});

let tasks = [];

function addTask() {
  const taskInput = document.getElementById("task-input");
  const dueDate = document.getElementById("due-date").value;
  const priority = document.getElementById("priority").value;
  const category = document.getElementById("category-input").value;

  if (taskInput.value === "") return;

  const task = {
    id: Date.now(),
    text: taskInput.value,
    completed: false,
    dueDate: dueDate,
    priority: priority,
    category: category,
  };

  tasks.push(task);
  saveTasks();
  renderTasks(tasks);
  taskInput.value = "";
  document.getElementById("due-date").value = "";
  document.getElementById("priority").value = "medium";
  document.getElementById("category-input").value = "";
}

function renderTasks(tasksToRender) {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  tasksToRender.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.className = `task-item ${task.completed ? "completed" : ""}`;
    taskItem.setAttribute("data-id", task.id);

    taskItem.innerHTML = `
            <span>${task.text} - ${task.dueDate} - ${task.priority} - ${
      task.category
    }</span>
            <div>
                <button onclick="toggleComplete(${task.id})">${
      task.completed ? "Undo" : "Complete"
    }</button>
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

    taskList.appendChild(taskItem);
  });
}

function toggleComplete(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) task.completed = !task.completed;
    return task;
  });
  saveTasks();
  renderTasks(tasks);
}

function editTask(id) {
  const task = tasks.find((task) => task.id === id);
  document.getElementById("task-input").value = task.text;
  document.getElementById("due-date").value = task.dueDate;
  document.getElementById("priority").value = task.priority;
  document.getElementById("category-input").value = task.category;
  deleteTask(id);
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks(tasks);
}

function filterTasks(event) {
  const filter = event.target.getAttribute("data-filter");
  if (filter === "all") {
    renderTasks(tasks);
  } else if (filter === "completed") {
    renderTasks(tasks.filter((task) => task.completed));
  } else if (filter === "pending") {
    renderTasks(tasks.filter((task) => !task.completed));
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
  renderTasks(tasks);
}
