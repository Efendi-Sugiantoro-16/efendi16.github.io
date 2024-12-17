const DEVICE_STORAGE_KEY = "network_devices";

// Fungsi untuk memuat data perangkat dari LocalStorage
function loadDevices() {
    return JSON.parse(localStorage.getItem(DEVICE_STORAGE_KEY)) || [];
}

// Fungsi untuk menyimpan data perangkat ke LocalStorage
function saveDevices(devices) {
    localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(devices));
}

// Fungsi untuk menambahkan perangkat baru
function addDevice(device) {
    const devices = loadDevices();
    devices.push(device);
    saveDevices(devices);
}

// Fungsi untuk menghapus perangkat berdasarkan index
function deleteDevice(index) {
    const devices = loadDevices();
    devices.splice(index, 1);
    saveDevices(devices);
}

// Fungsi untuk memperbarui perangkat berdasarkan index
function updateDevice(index, updatedDevice) {
    const devices = loadDevices();
    devices[index] = updatedDevice;
    saveDevices(devices);
}

// Fungsi untuk merender tabel perangkat
function renderDeviceTable() {
    const devices = loadDevices();
    const tableBody = document.getElementById("deviceTableBody");
    tableBody.innerHTML = ""; // Kosongkan isi tabel sebelum merender ulang

    devices.forEach((device, index) => {
        tableBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${device.name}</td>
                <td>${device.ip}</td>
                <td>${device.type}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="loadDeviceToEdit(${index})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="confirmDeleteDevice(${index})">Hapus</button>
                </td>
            </tr>`;
    });
}

// Fungsi untuk menangani konfirmasi penghapusan perangkat
function confirmDeleteDevice(index) {
    if (confirm("Apakah Anda yakin ingin menghapus perangkat ini?")) {
        deleteDevice(index);
        renderDeviceTable();
        alert("Perangkat berhasil dihapus.");
    }
}

// Fungsi untuk menampilkan data perangkat di form edit
function loadDeviceToEdit(index) {
    const devices = loadDevices();
    const device = devices[index];

    // Isi form dengan data perangkat yang akan diedit
    document.getElementById("editDeviceName").value = device.name;
    document.getElementById("editDeviceIp").value = device.ip;
    document.getElementById("editDeviceType").value = device.type;

    // Simpan index perangkat yang sedang diedit di form
    document.getElementById("editDeviceForm").dataset.deviceIndex = index;

    // Tampilkan modal edit
    const editModal = new bootstrap.Modal(document.getElementById("editDeviceModal"));
    editModal.show();
}

// Event listener untuk form tambah perangkat
document.getElementById("addDeviceForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Ambil nilai dari form
    const name = document.getElementById("deviceName").value.trim();
    const ip = document.getElementById("deviceIp").value.trim();
    const type = document.getElementById("deviceType").value;

    // Validasi input
    if (!name || !ip || !type) {
        alert("Semua data perangkat harus diisi!");
        return;
    }

    // Tambahkan perangkat baru
    addDevice({ name, ip, type });

    // Bersihkan form dan tutup modal
    document.getElementById("addDeviceForm").reset();
    const addModal = bootstrap.Modal.getInstance(document.getElementById("addDeviceModal"));
    addModal.hide();

    // Render ulang tabel
    renderDeviceTable();
    alert("Perangkat baru berhasil ditambahkan.");
});

// Event listener untuk form edit perangkat
document.getElementById("editDeviceForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Ambil index perangkat yang sedang diedit
    const index = document.getElementById("editDeviceForm").dataset.deviceIndex;

    // Ambil nilai baru dari form
    const name = document.getElementById("editDeviceName").value.trim();
    const ip = document.getElementById("editDeviceIp").value.trim();
    const type = document.getElementById("editDeviceType").value;

    // Validasi input
    if (!name || !ip || !type) {
        alert("Semua data perangkat harus diisi!");
        return;
    }

    // Perbarui perangkat
    updateDevice(index, { name, ip, type });

    // Bersihkan form dan tutup modal
    document.getElementById("editDeviceForm").reset();
    const editModal = bootstrap.Modal.getInstance(document.getElementById("editDeviceModal"));
    editModal.hide();

    // Render ulang tabel
    renderDeviceTable();
    alert("Perangkat berhasil diperbarui.");
});

// Render tabel saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", renderDeviceTable);
