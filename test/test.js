import {
    sanitize,
    addTask,
    loadTasks,
    deleteTask,
    addGrocery,
    loadGroceries,
    deleteGrocery,
    addGift,
    loadGifts,
    deleteGift
} from '../js/main.js';

// -----------------------------
// Utility Functions
// -----------------------------
QUnit.module("Utility Functions", hooks => {
    QUnit.test("sanitize() escapes HTML", assert => {
        const result = sanitize('<script>alert("XSS")</script>');
        assert.equal(result, '&lt;script&gt;alert("XSS")&lt;/script&gt;');
    });

    QUnit.test("sanitize() returns empty string for empty input", assert => {
        const result = sanitize('');
        assert.equal(result, '');
    });
});

// -----------------------------
// Task Functions
// -----------------------------
QUnit.module("Task Functions", hooks => {
    QUnit.test("loadTasks() returns a Promise", assert => {
        assert.ok(loadTasks() instanceof Promise, "loadTasks returns a Promise");
    });

    QUnit.test("addTask() throws error if empty", async assert => {
        try {
            await addTask("", "2025-12-25");
            assert.ok(false, "Expected error not thrown");
        } catch (err) {
            assert.equal(err.message, "Task cannot be empty");
        }
    });

    QUnit.test("deleteTask() returns a Promise", assert => {
        const result = deleteTask("fake-id");
        assert.ok(result instanceof Promise, "deleteTask returns a Promise");
    });
});

// -----------------------------
// Grocery Functions
// -----------------------------
QUnit.module("Grocery Functions", hooks => {
    QUnit.test("loadGroceries() returns a Promise", assert => {
        assert.ok(loadGroceries() instanceof Promise, "loadGroceries returns a Promise");
    });

    QUnit.test("addGrocery() returns an object", async assert => {
        const result = await addGrocery("Milk", 2, "L");
        assert.equal(result.item, "Milk");
        assert.equal(result.qty, 2);
        assert.equal(result.unit, "L");
    });

    QUnit.test("deleteGrocery() returns a Promise", assert => {
        const result = deleteGrocery("fake-id");
        assert.ok(result instanceof Promise, "deleteGrocery returns a Promise");
    });
});

// -----------------------------
// Gift Functions
// -----------------------------
QUnit.module("Gift Functions", hooks => {
    QUnit.test("loadGifts() returns a Promise", assert => {
        assert.ok(loadGifts() instanceof Promise, "loadGifts returns a Promise");
    });

    QUnit.test("addGift() returns an object", async assert => {
        const result = await addGift("John", "Toy");
        assert.equal(result.recipient, "John");
        assert.equal(result.item, "Toy");
    });

    QUnit.test("deleteGift() returns a Promise", assert => {
        const result = deleteGift("fake-id");
        assert.ok(result instanceof Promise, "deleteGift returns a Promise");
    });
});