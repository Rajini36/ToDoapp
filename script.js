// Load tasks from localStorage on page load
window.onload = function () {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => createTask(task.text, task.completed));
  applyFilter("all");
};

let currentFilter = "all";

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  createTask(taskText, false);
  saveTasks();
  taskInput.value = "";
  applyFilter(currentFilter);
}

function createTask(taskText, isCompleted) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = taskText;
  if (isCompleted) span.classList.add("completed");

  // ✅ Toggle complete
  span.onclick = function () {
    span.classList.toggle("completed");
    saveTasks();
    applyFilter(currentFilter);
  };

  // ✏ Edit on double-click
  span.ondblclick = function () {
    const input = document.createElement("input");
    input.type = "text";
    input.value = span.textContent;

    input.onblur = function () {
      span.textContent = input.value;
      span.classList.remove("completed");
      li.replaceChild(span, input);
      saveTasks();
      applyFilter(currentFilter);
    };

    li.replaceChild(input, span);
    input.focus();
  };

  li.appendChild(span);

  // ❌ Delete button
  const delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.onclick = function () {
    li.remove();
    saveTasks();
  };

  li.appendChild(delBtn);
  document.getElementById("taskList").appendChild(li);
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li span").forEach(span => {
    tasks.push({
      text: span.textContent,
      completed: span.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function filterTasks(filter) {
  currentFilter = filter;
  applyFilter(filter);
}

function applyFilter(filter) {
  document.querySelectorAll("#taskList li").forEach(li => {
    const span = li.querySelector("span");
    const isCompleted = span.classList.contains("completed");

    li.style.display =
      filter === "all" ||
      (filter === "completed" && isCompleted) ||
      (filter === "pending" && !isCompleted)
        ? "flex"
        : "none";
  });
}

// 🌙 Dark Mode toggle
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}
