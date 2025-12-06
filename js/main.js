console.log("main.js loaded!");  // debug check

const API_BASE = "https://xpb1nihcul.execute-api.us-east-2.amazonaws.com/holiday";
const HOLIDAY = "Christmas"; // adjust if needed

// Handle Add Task form
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("task-form");
    const taskList = document.getElementById("task-list");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            addTask();
        });
    }

    loadTasks();
});

// ----------------------
// ADD TASK
// ----------------------
async function addTask() {
    const taskText = document.getElementById("taskInput").value.trim();
    const date = document.getElementById("taskDate").value;
    const id = crypto.randomUUID();

    if (!taskText) {
        alert("Task cannot be empty");
        return;
    }

    const newTask = {
        id,
        task: taskText,
        date,
        completed: false,
        holiday: HOLIDAY
    };

    console.log("Sending POST:", newTask);

    const response = await fetch(`${API_BASE}/${HOLIDAY}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask)
    });

    const data = await response.json();
    console.log("POST response:", data);

    if (response.ok) {
        alert("Task added!");
        loadTasks();
        document.getElementById("taskInput").value = "";
    } else {
        alert("Error: " + data.error);
    }
}

// ----------------------
// LOAD TASKS
// ----------------------
async function loadTasks() {
    const taskList = document.getElementById("task-list");
    if (!taskList) return;

    taskList.innerHTML = "<li>Loading...</li>";

    const response = await fetch(`${API_BASE}/${HOLIDAY}/tasks`);
    const tasks = await response.json();

    console.log("GET tasks:", tasks);

    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.task + " — " + (task.date ?? "");

        const btn = document.createElement("button");
        btn.textContent = "Delete";
        btn.onclick = () => deleteTask(task.sk.replace("TASK#", ""));
        
        li.appendChild(btn);
        taskList.appendChild(li);
    });
}

// ----------------------
// DELETE TASK
// ----------------------
async function deleteTask(id) {
    console.log("Deleting ID:", id);

    const response = await fetch(`${API_BASE}/${HOLIDAY}/tasks/${id}`, {
        method: "DELETE"
    });

    const data = await response.json();
    console.log("DELETE response:", data);

    if (response.ok) {
        loadTasks();
    } else {
        alert("Error deleting task");
    }
}
