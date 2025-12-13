console.log("main.js loaded!");

export const API_BASE = "https://xpb1nihcul.execute-api.us-east-2.amazonaws.com/holiday";
export const HOLIDAY = "Christmas";

// ---------------------------------------------------------------------
// UTILITY FUNCTION
// ---------------------------------------------------------------------
export function sanitize(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// ---------------------------------------------------------------------
// TASK FUNCTIONS
// ---------------------------------------------------------------------
export async function addTask(taskText, date) {
    const text = sanitize(taskText.trim());
    const id = crypto.randomUUID();

    if (!text) throw new Error("Task cannot be empty");

    const newTask = { id, task: text, date, completed: false, holiday: HOLIDAY };

    const res = await fetch(`${API_BASE}/${HOLIDAY}/tasks`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(newTask)
    });

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Unknown error adding task");
    }
    return newTask;
}

export async function loadTasks() {
    const res = await fetch(`${API_BASE}/${HOLIDAY}/tasks`);
    return res.json();
}

export async function deleteTask(id) {
    const res = await fetch(`${API_BASE}/${HOLIDAY}/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error deleting task");
}

// ---------------------------------------------------------------------
// GROCERY FUNCTIONS
// ---------------------------------------------------------------------
export async function addGrocery(item, qty, unit = "") {
    const id = crypto.randomUUID();
    const newItem = { id, item, qty, unit, holiday: HOLIDAY };

    const res = await fetch(`${API_BASE}/${HOLIDAY}/grocery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem)
    });

    if (!res.ok) throw new Error("Error adding grocery");
    return newItem;
}

export async function loadGroceries() {
    const res = await fetch(`${API_BASE}/${HOLIDAY}/grocery?holiday=${HOLIDAY}`);
    return res.json();
}

export async function deleteGrocery(id) {
    const res = await fetch(`${API_BASE}/${HOLIDAY}/grocery/${id}?holiday=${HOLIDAY}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error deleting grocery");
}

// ---------------------------------------------------------------------
// GIFT FUNCTIONS
// ---------------------------------------------------------------------
export async function addGift(recipient, item) {
    const id = crypto.randomUUID();
    const newGift = { id, recipient, item, budget: 0, holiday: HOLIDAY };

    const res = await fetch(`${API_BASE}/${HOLIDAY}/gifts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGift)
    });

    if (!res.ok) throw new Error("Error adding gift");
    return newGift;
}

export async function loadGifts() {
    const res = await fetch(`${API_BASE}/${HOLIDAY}/gifts?holiday=${HOLIDAY}`);
    return res.json();
}

export async function deleteGift(id) {
    const res = await fetch(`${API_BASE}/${HOLIDAY}/gifts/${id}?holiday=${HOLIDAY}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error deleting gift");
}

// ---------------------------------------------------------------------
// DOM INTERACTIONS (runs only in browser)
// ---------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // -------------------
    // TASK FORM
    // -------------------
    const taskForm = document.getElementById("task-form");
    if (taskForm) {
        taskForm.addEventListener("submit", async e => {
            e.preventDefault();
            const taskText = document.getElementById("taskInput").value;
            const taskDate = document.getElementById("taskDate").value;

            try {
                await addTask(taskText, taskDate);
                document.getElementById("taskInput").value = "";

                // Reload full task list if exists (todo.html)
                if (document.getElementById("task-list")) {
                    await loadTasksToDOM();
                }

                // Reload today's tasks if exists (homepage)
                if (document.getElementById("today-task-list")) {
                    await loadTodaysTasksToDOM();
                }
            } catch (err) {
                alert(err.message);
            }
        });
    }

    // -------------------
    // GROCERY FORM
    // -------------------
    const groceryForm = document.getElementById("grocery-add-form");
    if (groceryForm) {
        loadGroceriesToDOM();
        groceryForm.addEventListener("submit", async e => {
            e.preventDefault();
            const item = document.getElementById("itemName").value;
            const qty = document.getElementById("quantity").value;
            const unit = document.getElementById("unit")?.value || "";

            try {
                await addGrocery(item, qty, unit);
                loadGroceriesToDOM();
            } catch (err) {
                alert(err.message);
            }
        });
    }

    // -------------------
    // GIFT FORM
    // -------------------
    const giftForm = document.getElementById("gift-add-form");
    if (giftForm) {
        loadGiftsToDOM();
        giftForm.addEventListener("submit", async e => {
            e.preventDefault();
            const recipient = document.getElementById("recipient").value;
            const item = document.getElementById("giftName").value;

            try {
                await addGift(recipient, item);
                loadGiftsToDOM();
            } catch (err) {
                alert(err.message);
            }
        });
    }

    // -------------------
    // Load Tasks Immediately if task lists exist
    // -------------------
    if (document.getElementById("task-list")) loadTasksToDOM();
    if (document.getElementById("today-task-list")) loadTodaysTasksToDOM();
    if (document.getElementById("grocery-list")) loadGroceriesToDOM();
    if (document.getElementById("gift-list")) loadGiftsToDOM();
});

// ---------------------------------------------------------------------
// DOM HELPER FUNCTIONS
// ---------------------------------------------------------------------

// Full Task List (todo.html)
async function loadTasksToDOM() {
    const ul = document.getElementById("task-list");
    if (!ul) return;

    ul.innerHTML = "<li>Loading...</li>";
    try {
        const tasks = await loadTasks();
        ul.innerHTML = "";

        if (!tasks.length) {
            ul.innerHTML = "<li>No tasks yet.</li>";
            return;
        }

        tasks.forEach(t => {
            const li = document.createElement("li");
            li.textContent = `${sanitize(t.task)} — ${sanitize(t.date || "")}`;

            const btn = document.createElement("button");
            btn.textContent = "Delete";
            btn.onclick = async () => {
                await deleteTask(t.sk?.replace("TASK#", "") || t.id);
                loadTasksToDOM();
            };

            li.appendChild(btn);
            ul.appendChild(li);
        });
    } catch (err) {
        ul.innerHTML = "<li>Error loading tasks</li>";
        console.error(err);
    }
}

// Today's Tasks List (homepage)
async function loadTodaysTasksToDOM() {
    const ul = document.getElementById("today-task-list");
    if (!ul) return;

    ul.innerHTML = "<li>Loading...</li>";
    try {
        const tasks = await loadTasks();
        ul.innerHTML = "";

        const today = new Date().toISOString().split("T")[0];
        const todaysTasks = tasks.filter(t => t.date === today);

        if (!todaysTasks.length) {
            ul.innerHTML = "<li>No tasks for today.</li>";
            return;
        }

        todaysTasks.forEach(t => {
            const li = document.createElement("li");
            li.textContent = `${sanitize(t.task)} — ${sanitize(t.date)}`;
            ul.appendChild(li);
        });
    } catch (err) {
        ul.innerHTML = "<li>Error loading today's tasks</li>";
        console.error(err);
    }
}

// Grocery List DOM
async function loadGroceriesToDOM() {
    const ul = document.getElementById("grocery-list");
    if (!ul) return;

    ul.innerHTML = "<li>Loading...</li>";
    try {
        const items = await loadGroceries();
        ul.innerHTML = "";
        if (!items.length) ul.innerHTML = "<li>No grocery items yet.</li>";

        items.forEach(g => {
            const li = document.createElement("li");
            li.textContent = `${g.item} (${g.qty} ${g.unit || ""})`;

            const btn = document.createElement("button");
            btn.textContent = "Delete";
            btn.onclick = async () => {
                await deleteGrocery(g.sk?.replace("GROCERY#", "") || g.id);
                loadGroceriesToDOM();
            };

            li.appendChild(btn);
            ul.appendChild(li);
        });
    } catch (err) {
        ul.innerHTML = "<li>Error loading groceries</li>";
        console.error(err);
    }
}

// Gift List DOM
async function loadGiftsToDOM() {
    const ul = document.getElementById("gift-list");
    if (!ul) return;

    ul.innerHTML = "<li>Loading...</li>";
    try {
        const items = await loadGifts();
        ul.innerHTML = "";
        if (!items.length) ul.innerHTML = "<li>No gifts yet</li>";

        items.forEach(g => {
            const li = document.createElement("li");
            li.textContent = `${g.recipient} — ${g.item}`;

            const btn = document.createElement("button");
            btn.textContent = "Delete";
            btn.onclick = async () => {
                await deleteGift(g.sk?.replace("GIFT#", "") || g.id);
                loadGiftsToDOM();
            };

            li.appendChild(btn);
            ul.appendChild(li);
        });
    } catch (err) {
        ul.innerHTML = "<li>Error loading gifts</li>";
        console.error(err);
    }
}