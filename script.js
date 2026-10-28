
const todoForm = document.querySelector("#todo-form");
const taskInput = document.querySelector("#task-input");
const submitBtn = document.querySelector("#submit-btn");
const taskList = document.querySelector("#task-list");

// Local storage se tasks load karein
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editId = null;

// Tasks ko localStorage mein save karein
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// READ: Tamam tasks display karein
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.classList.add("task-item");

    li.innerHTML = `
      <span class="${task.completed ? "completed" : ""}">
        ${escapeHTML(task.text)}
      </span>

      <div class="task-actions">
        <button type="button" class="complete-btn">
          ${task.completed ? "Undo" : "Complete"}
        </button>

        <button type="button" class="edit-btn">
          Edit
        </button>

        <button type="button" class="delete-btn">
          Delete
        </button>
      </div>
    `;

    // CREATE/UPDATE ke baad task status toggle karna
    li.querySelector(".complete-btn").addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    // UPDATE: Task edit karein
    li.querySelector(".edit-btn").addEventListener("click", () => {
      taskInput.value = task.text;
      editId = task.id;
      submitBtn.textContent = "Update Task";
      taskInput.focus();
    });

    // DELETE: Task remove karein
    li.querySelector(".delete-btn").addEventListener("click", () => {
      const confirmed = confirm("Kya aap is task ko delete karna chahti hain?");

      if (confirmed) {
        tasks = tasks.filter((item) => item.id !== task.id);

        if (editId === task.id) {
          resetForm();
        }

        saveTasks();
        renderTasks();
      }
    });

    taskList.appendChild(li);
  });
}

// Input text ko HTML ke taur par interpret hone se bachayein
function escapeHTML(text) {
  return text.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// CREATE aur UPDATE
todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (text === "") {
    alert("Please task enter karein!");
    return;
  }

  if (editId !== null) {
    // Existing task update karein
    tasks = tasks.map((task) =>
      task.id === editId
        ? { ...task, text: text }
        : task
    );

  } else {
    // Naya task create karein
    const newTask = {
      id: Date.now().toString(),
      text: text,
      completed: false
    };

    tasks.push(newTask);
  }

  saveTasks();
  renderTasks();
  resetForm();
});

// Form reset karein
function resetForm() {
  taskInput.value = "";
  editId = null;
  submitBtn.textContent = "Add Task";
}

// Page load par saved tasks display karein
renderTasks();
