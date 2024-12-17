// IndexedDB Initialization
let db;
const request = indexedDB.open("BackupScheduleDB", 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;
    const objectStore = db.createObjectStore("schedules", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("deviceName", "deviceName", { unique: false });
    objectStore.createIndex("scheduleTime", "scheduleTime", { unique: false });
};

request.onsuccess = function (event) {
    db = event.target.result;
    renderSchedules();
};

request.onerror = function () {
    console.error("Error opening IndexedDB.");
};

// Add a schedule
document.getElementById("addScheduleForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const deviceName = document.getElementById("deviceName").value;
    const scheduleTime = document.getElementById("scheduleTime").value;

    const transaction = db.transaction(["schedules"], "readwrite");
    const objectStore = transaction.objectStore("schedules");

    const newSchedule = { deviceName, scheduleTime };
    objectStore.add(newSchedule);

    transaction.oncomplete = function () {
        document.getElementById("addScheduleForm").reset();
        renderSchedules();
    };

    transaction.onerror = function () {
        console.error("Error adding schedule.");
    };
});

// Render schedules
function renderSchedules() {
    const transaction = db.transaction(["schedules"], "readonly");
    const objectStore = transaction.objectStore("schedules");

    const scheduleTableBody = document.getElementById("scheduleTableBody");
    scheduleTableBody.innerHTML = "";

    objectStore.openCursor().onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
            const { id, deviceName, scheduleTime } = cursor.value;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${id}</td>
                <td>${deviceName}</td>
                <td>${scheduleTime}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteSchedule(${id})">Hapus</button>
                </td>
            `;
            scheduleTableBody.appendChild(row);

            cursor.continue();
        }
    };
}

// Delete a schedule
function deleteSchedule(id) {
    const transaction = db.transaction(["schedules"], "readwrite");
    const objectStore = transaction.objectStore("schedules");

    objectStore.delete(id);

    transaction.oncomplete = function () {
        renderSchedules();
    };

    transaction.onerror = function () {
        console.error("Error deleting schedule.");
    };
}
