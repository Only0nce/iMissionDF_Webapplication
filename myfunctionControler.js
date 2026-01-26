// JavaScript Document
var wsUri;
var ws;
var userID = 0;
var userLevel = 0;
WebSocketTest();
function WebSocketTest() {

	if ("WebSocket" in window) {
	   // Let us open a web socket
	   wsUri = "ws://" + location.host + ":1235";
	   ws = new WebSocket(wsUri);

	   ws.onopen = function() {
		  // Web Socket is connected, send data using send()
		//   ws.send("web:home");
		ws.send('{"menuID":"getRegisterDevicePageWeb"}');
	};

	   ws.onmessage = function (evt) { 
		  var received_msg = evt.data;
		  processMsg(received_msg);
	   };

	   ws.onclose = function() { 
		  // websocket is closed.
		  
		  alert("Connection is closed..."); 
		  
	   };
	} else {

	   // The browser doesn't support WebSocket
	   alert("WebSocket NOT supported by your Browser!");
	}
}
function setCurrentUserID(_userID, _userLevel)
{
	userID = _userID;
	userLevel = _userLevel;
	console.log(userID,userLevel);
}
function updateControler(id)
{
	console.log("Update Controler ID:",id,document.getElementById("ctrlURI"+id).value); 
	if (document.getElementById("ctrlURI"+id).value == "") return;
	
	var jsonMessage = '{"menuID":"updateControler",'
					+'"sipUser":"' + document.getElementById("ctrlURI"+id).value + '",'
					+'"keepAlivePeroid":' + '200' + ','
					+'"sipPort":' + document.getElementById("sipPort"+id).value + ','
					+'"rtpStartPort":' + document.getElementById("rtpStartPort"+id).value + ','
					+'"userID":' + userID + ', '
					+'"id":' + id + ''
					+'}';
	if (ws.readyState == 1)
	{
		ws.send(jsonMessage)
		setTimeout(() => {location.reload();}, 2000);
	}else{
		alert("Connection is closed...");
	}
}
function updateRelay(ctrlID)
{
	console.log("Update Relay ctrlID:",ctrlID,document.getElementById("ctrlURI"+ctrlID).value); 
	var relayModeSelect = document.getElementById("relayMode"+ctrlID).value
	var jsonMessage = '{"menuID":"updateRelayOutputMode",'
					+'"RelayOutputMode":' + document.getElementById("relayMode"+ctrlID).value + ','
					+'"softPhoneID":' + ctrlID + ''
					+'}';
	if (ws.readyState == 1){
		ws.send(jsonMessage)
		setTimeout(() => {location.reload();}, 2000);
	}else{
		alert("Connection is closed...");
	}
}

function newRadio()
{
	console.log("Update RadioID:",document.getElementById("radioName").value, document.getElementById("radioUri").value,document.getElementById("radioIP").value,document.getElementById("sipPort").value);
	var trxMode = "";
	if (document.getElementById("nodetype").value == 1) trxMode = "TRx";
	else if (document.getElementById("nodetype").value == 2) trxMode = "Tx";
	else if (document.getElementById("nodetype").value == 3) trxMode = "Rx";
	else
	{
		setTimeout(() => {location.reload();}, 2000);
		return;
	}
	if (document.getElementById("radioName").value == "") return;
	if (document.getElementById("radioUri").value == "") return;
	if (document.getElementById("sipPort").value == "") return;
	
	var jsonMessage = '{"menuID":"newRadio",'
					+'"radioName":"' + document.getElementById("radioName").value + '",'
					+'"trxMode":"' + trxMode + '",'
					+'"uri":"' + document.getElementById("radioUri").value + '",'
					+'"ipAddress":"' + document.getElementById("radioIP").value + '",'
					+'"r2sPeroid":' + '200' + ','
					+'"sipPort":' + document.getElementById("sipPort").value + ','
					+'"frequency":"' + '0' + '"'
					+'}';
	if (ws.readyState == 1){
		ws.send(jsonMessage)
		setTimeout(() => {location.reload();}, 2000);
	}else{
		alert("Connection is closed...");
	}
}
function removeRadio(radioID)
{
	console.log("Remove RadioID:",radioID,document.getElementById("radioName"+radioID).value, document.getElementById("radioUri"+radioID).value,document.getElementById("radioIP"+radioID).value,document.getElementById("sipPort"+radioID).value);
	var jsonMessage = '{"menuID":"removeRadio",'
					+'"radioID":' + radioID + ''
					+'}';
	if (ws.readyState == 1){
		ws.send(jsonMessage)
		setTimeout(() => {location.reload();}, 2000);
	}else{
		alert("Connection is closed...");
	}
}
function toggleGPIOOut( gpioNum,  gpioVal){
	if(gpioNum == 1){
		alert("GPIO Define as PTT Out");
		return;
	}
	var jsonMessage = '{"command":"toggleGpioOut", "gpioNum":' + gpioNum + ', "gpioVal":' + gpioVal + '}';
	if (ws.readyState == 1){
		ws.send(jsonMessage)
	}else{
		alert("Connection is closed...");
	}
}

function processMsg(message) {
    var obj = JSON.parse(message);
    console.log("Received message:", obj);

    if (obj.menuID === "deviceList") {
        console.log("Device List received:", obj.devices);
        generateDeviceCardGrid(obj.devices); // แสดง card grid แทน table
    } else if (obj.menuID === "updateDeviceWeb") {
        console.log("Device updated:", obj);
        // Refresh device list after update
        ws.send('{"menuID":"getRegisterDevicePageWeb"}');
    } else if (obj.menuID === "updateDevice") {
        console.log("Device updated:", obj);
    } else if (obj.menuID === "deleteDeviceWeb") {
        console.log("Device deleted:", obj);
        // Refresh device list after delete
        ws.send('{"menuID":"getRegisterDevicePageWeb"}');
    } else if (obj.menuID === "deleteDevice") {
        console.log("Device deleted:", obj);
    } else if (obj.menuID === "currentDirectoryPath") {
        console.log("currentDirectoryPath:", obj.currentRecordDirectory);
        const currentPathInput = document.getElementById("CurrentpathDirectory");
        if (currentPathInput) {
            currentPathInput.value = obj.currentRecordDirectory;
            currentPathInput.setAttribute("readonly", true);
    
            saveCurrentDirectoryPath(obj.currentRecordDirectory);
        }
    } else if (obj.menuID === "defaultPath") {
        console.log("defaultPath:", obj);
    
        const currentBackupPath = obj.currentBackupPath;
    
        const storageTypeElement = document.getElementById("storageType");
        if (storageTypeElement) {
            if (currentBackupPath === "/home/orinnx/audioRec") {
                storageTypeElement.value = "internal";
            } else if (currentBackupPath === "/media/SSD1") {
                storageTypeElement.value = "external1";
            } else if (currentBackupPath === "/media/SSD2") {
                storageTypeElement.value = "external2";
            } else {
                console.warn("Unknown backup path:", currentBackupPath);
            }
        } else {
            console.error("Storage Type element not found!");
        }
    
        // ✅ เพิ่มตรงนี้เพื่ออัปเดต input
        const currentPathInput = document.getElementById("CurrentpathDirectory");
        if (currentPathInput) {
            currentPathInput.value = currentBackupPath;
        } else {
            console.error("Input with id='CurrentpathDirectory' not found!");
        }
    }else if(obj.menuID === "UpdatePathDirectory"){


    }
}
function saveCurrentDirectoryPath(newPath) {
    console.log("Saving Current Directory Path:", newPath);

    const jsonMessage = JSON.stringify({
        menuID: "saveCurrentDirectoryPath",
        currentRecordDirectory: newPath,
    });

    if (ws.readyState === 1) {
        ws.send(jsonMessage);
        alert("Current Directory Path saved successfully!");
    } else {
        alert("Connection is closed...");
    }
}
// function generateDeviceTable(deviceList) {
//     const tableContainer = document.getElementById("deviceTableContainer");
//     tableContainer.innerHTML = ""; // Clear previous table

//     const table = document.createElement("table");
//     table.className = "device-table";

//     // Create the table header
//     const thead = document.createElement("thead");
//     thead.innerHTML = `
//         <tr>
//             <th>Select</th>
//             <th>ID</th>
//             <th>Device ID</th>
//             <th>Frequency</th>
//             <th>Mode</th>
//             <th>IP Address</th>
//             <th>Time Interval</th>
//             <th>Path Directory</th>
//             <th>Company Name</th>
//             <th>Update</th>
//             <th>Delete</th>
//         </tr>
//     `;
//     table.appendChild(thead);

//     // Create the table body
//     const tbody = document.createElement("tbody");
//     deviceList.forEach(device => {
//         const row = document.createElement("tr");

//         // Checkbox column
//         const checkboxCell = document.createElement("td");
//         const checkbox = document.createElement("input");
//         checkbox.type = "checkbox";
//         checkbox.addEventListener("change", () => toggleRowEdit(checkbox)); // เรียกใช้ toggleRowEdit
//         checkboxCell.appendChild(checkbox);
//         row.appendChild(checkboxCell);

//         // ID column
//         row.innerHTML += `
//             <td>${device.id || "N/A"}</td>
//             <td><input type="text" value="${device.deviceId || "N/A"}" readonly /></td>
//             <td><input type="text" value="${device.frequency || "N/A"}" readonly /></td>
//             <td>
//                 <select disabled>
//                     <option value="Rx" ${device.mode === "Rx" ? "selected" : ""}>Rx</option>
//                     <option value="Tx" ${device.mode === "Tx" ? "selected" : ""}>Tx</option>
//                     <option value="TRX" ${device.mode === "TRX" ? "selected" : ""}>TRX</option>
//                 </select>
//             </td>
//             <td class="ipaddress"><input type="ip" value="${device.ip || "N/A"}" readonly /></td>
//             <td><input type="text" value="${device.timeInterval || "N/A"}" readonly /></td>
//             <td class="path-directory"><input type="path" value="${device.pathDirectory || "N/A"}" readonly /></td>
//             <td><input type="text" value="${device.companyName || "N/A"}" readonly /></td>
//         `;

//         // Update button column
//         const updateCell = document.createElement("td");
//         const updateButton = document.createElement("button");
//         updateButton.className = "update";
//         updateButton.textContent = "Update";
//         updateButton.disabled = true; // Disabled by default
//         updateButton.onclick = () => updateDevice(device.id);
//         updateCell.appendChild(updateButton);
//         row.appendChild(updateCell);

//         // Delete button column
//         const deleteCell = document.createElement("td");
//         const deleteButton = document.createElement("button");
//         deleteButton.className = "delete";
//         deleteButton.textContent = "Delete";
//         deleteButton.disabled = true; // Disabled by default
//         deleteButton.onclick = () => deleteDevice(device.id);
//         deleteCell.appendChild(deleteButton);
//         row.appendChild(deleteCell);

//         tbody.appendChild(row);
//     });
//     table.appendChild(tbody);

//     tableContainer.appendChild(table);
// }

function generateDeviceTable(deviceList) {
    console.log("Generating Device Table with deviceList:", deviceList);
    // Legacy function - now uses card grid instead of table
    generateDeviceCardGrid(deviceList);
    return;
    const headerCols = document.querySelectorAll('#deviceTable thead th').length;

    // helper to escape HTML
    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    const buildRowHtml = (device) => {
        // Build cells in the exact order as header and add group classes
        const id = escapeHtml(device.id);
        const name = escapeHtml(device.name);
        const sid = escapeHtml(device.sid);
        const payload = escapeHtml(device.payload_size);
        const terminal = escapeHtml(device.terminal_type);
        const ip = escapeHtml(device.ip);
        const uri = escapeHtml(device.uri);
        const freqNum = device.freq ? (parseInt(device.freq, 10)).toFixed(3) : '';
        const freq = escapeHtml(freqNum);
        const group = escapeHtml(device.group);
        const visible = escapeHtml(device.visible);
        const ambient = (device.ambient === 'NULL' || !device.ambient) ? '-' : escapeHtml(device.ambient);
        const last_access = (device.last_access === 'NULL' || !device.last_access) ? '-' : escapeHtml(device.last_access);
        const chunk = escapeHtml(device.chunk);
        const updated_at = escapeHtml(device.updated_at);

        return `
            <tr data-device-id="${id}">
                <td class="group-select"><input type="checkbox" class="select-device" data-id="${id}" /></td>
                <td class="group-id text-center">${id}</td>
                <td class="group-device"><input class="form-control form-control-sm" name="nameDevice" id="name-${id}" value="${name}" readonly /></td>
                <td class="group-device text-center"><input class="form-control form-control-sm text-center small-input" id="sid-${id}" value="${sid}" readonly /></td>
                <td class="group-device text-center"><input class="form-control form-control-sm text-center small-input" id="payload-${id}" value="${payload}" readonly /></td>
                <td class="group-network text-center"><input class="form-control form-control-sm text-center small-input" id="terminal-${id}" value="${terminal}" readonly /></td>
                <td class="group-network"><input class="form-control form-control-sm" name="ipDevice" id="ip-${id}" value="${ip}" readonly /></td>
                <td class="group-network"><input class="form-control form-control-sm" name="uriDevice" id="uri-${id}" value="${uri}" readonly /></td>
                <td class="group-network text-end"><input class="form-control form-control-sm text-end small-input" name="freqDevice" id="freq-${id}" value="${freq}" readonly /></td>
                <td class="group-meta text-center"><input class="form-control form-control-sm text-center small-input" id="group-${id}" value="${group}" readonly /></td>
                <td class="group-meta text-center"><input class="form-control form-control-sm text-center small-input" id="visible-${id}" value="${visible}" readonly /></td>
                <td class="group-meta text-center">${ambient}</td>
                <td class="group-meta text-center">${last_access}</td>
                <td class="group-meta text-center"><input class="form-control form-control-sm text-center small-input" id="chunk-${id}" value="${chunk}" readonly /></td>
                <td class="group-meta"><input class="form-control form-control-sm" name="updatedAt" id="updated_at-${id}" value="${updated_at}" readonly /></td>
                <td class="group-action text-end"><button class="btn btn-success btn-sm me-1" onclick="updateDevice(${id})">Update</button></td>
                <td class="group-action text-end"><button class="btn btn-danger btn-sm" onclick="deleteDevice(${id})">Delete</button></td>
            </tr>
        `;
    };

    if (existingBody) {
        // populate only tbody so header stays intact
        let rowsHtml = '';
        deviceList.forEach(device => {
            rowsHtml += buildRowHtml(device);
        });

    existingBody.innerHTML = rowsHtml;
    // mark tbody as filled by JS so CSS can animate/highlight
    existingBody.classList.add('populated-by-js');

        // Quick verification: check header columns vs first row cells
        const firstRow = existingBody.querySelector('tr');
        const rowCols = firstRow ? firstRow.children.length : 0;
        if (headerCols && rowCols && headerCols !== rowCols) {
            console.warn('Header columns (%d) != row columns (%d).', headerCols, rowCols);
        } else {
            console.log('Header columns match row columns:', headerCols);
        }

    // attach checkbox listeners (delegated would be better but keep simple)
    existingBody.querySelectorAll('.select-device').forEach(cb => cb.addEventListener('change', (e) => toggleRowEdit(e.target)));
    // wire up simple search/clear UI
    setupDeviceTableUI();
    return;
    }

    // Fallback: build full table if no server skeleton exists
    const container = document.getElementById("deviceTableContainer");
    container.innerHTML = ""; // clear
    const table = document.createElement("table");
    table.className = "device-table";
    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
            <th>Select</th>
            <th>ID</th>
            <th>Name</th>
            <th>SID</th>
            <th>Payload</th>
            <th>Terminal Type</th>
            <th>IP</th>
            <th>URI</th>
            <th>Freq(MHz)</th>
            <th>Group</th>
            <th>Visible</th>
            <th>Ambient</th>
            <th>Last Access</th>
            <th>Chunk</th>
            <th>Updated At</th>
            <th>Update</th>
            <th>Delete</th>
        </tr>
    `;
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    deviceList.forEach(device => {
        tbody.innerHTML += buildRowHtml(device);
    });
    table.appendChild(tbody);
    container.appendChild(table);
    // wire up simple search/clear UI after fallback build
    setupDeviceTableUI();
}

// Small UI helpers for device table (search + clear)
let searchUIInitialized = false;

function setupDeviceTableUI(){
    if (searchUIInitialized) {
        console.log('Search UI already initialized, skipping...');
        return;
    }
    
    const search = document.getElementById('deviceSearch');
    const clearBtn = document.getElementById('clearSearch');
    
    if(!search) {
        console.error('deviceSearch element not found!');
        return;
    }
    
    console.log('Setting up device table search...');
    
    const applyFilter = () => {
        const q = (search.value || '').toLowerCase().trim();
        const tbody = document.getElementById('deviceTableBody');
        
        if (!tbody) {
            console.error('deviceTableBody not found!');
            return;
        }
        
        const rows = tbody.querySelectorAll('tr');
        let visibleCount = 0;
        
        rows.forEach(tr => {
            // Get text content
            let text = (tr.textContent || '').toLowerCase();
            
            // Also get all input values in this row
            const inputs = tr.querySelectorAll('input[type="text"], input[type="number"], input');
            inputs.forEach(input => {
                if (input.value) {
                    text += ' ' + input.value.toLowerCase();
                }
            });
            
            const shouldShow = q === '' || text.includes(q);
            tr.style.display = shouldShow ? '' : 'none';
            if (shouldShow) visibleCount++;
        });
        
        console.log(`Filter: "${q}" - Showing ${visibleCount} of ${rows.length} rows`);
    };
    
    // Add input event listener
    search.addEventListener('input', applyFilter);
    search.addEventListener('keyup', applyFilter);
    
    // Setup clear button
    if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
            e.preventDefault();
            search.value = '';
            applyFilter();
        });
    }
    
    searchUIInitialized = true;
    console.log('Device table search ready!');
}


// document.addEventListener("change", function (event) {
//     if (event.target.type === "checkbox") {
//         console.log("Checkbox:", event.target);
//         toggleRowEdit(event.target);
//         toggleEditPath(event.target);

//     }
// });
document.addEventListener("change", function (event) {
    if (event.target.type === "checkbox") {
        const id = event.target.id;

        if (id === "CurrentPathDirectory") {
            console.log("CurrentPathDirectory:", event.target);
            toggleRowEdit(event.target);
        } else if (id === "changepathDirectory") {
            console.log("changepathDirectory:", event.target);
            toggleEditPath(event.target);
        }else{
            console.log("CurrentPathDirectory:", event.target);
            toggleRowEdit(event.target);
        }

        console.log("Checkbox triggered:", id);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM loaded, initializing...");
    
    // Setup search functionality immediately
    setupDeviceTableUI();
    
    // Send WebSocket message if connected
    if (typeof ws !== 'undefined' && ws.readyState === 1) {
        ws.send(JSON.stringify({ menuID: "getCurrentDirectoryPath" }));
    }
});



function RegisterDevice() {
    console.log("Registering device_station...");

    // === Step 1: ดึง path จาก Storage Type ===
    const storageTypeElement = document.getElementById("storageType");
    const storageType = storageTypeElement.value;

    let basePath = "";
    if (storageType === "internal") {
        basePath = "/home/orinnx/audioRec";
    } else if (storageType === "external1") {
        basePath = "/media/SSD1/";
    } else if (storageType === "external2") {
        basePath = "/media/SSD2/";
    } else {
        alert("Invalid storage type selected.");
        return;
    }

    const fullPath="";

    // === Step 2: ดึงข้อมูลจากฟอร์ม ===
    const name = document.getElementById("nameDevice")?.value;
    const sid = document.getElementById("sid")?.value;
    const payload = document.getElementById("payload_size")?.value;
    const terminal = document.getElementById("terminal_type")?.value;
    const ip = document.getElementById("ipaddress")?.value;
    const uri = document.getElementById("uri")?.value;
    const freq = document.getElementById("freq")?.value;
    const group = document.getElementById("group")?.value;
    const visible = document.getElementById("visible")?.value;
    const ambient = document.getElementById("ambient")?.value;
    const last_access = document.getElementById("last_access")?.value;
    const chunk = document.getElementById("chunk")?.value;
    const updated_at = document.getElementById("updated_at")?.value;

    // === Step 3: ตรวจสอบค่าว่าง ===
    if (!name || !sid || !payload || !terminal || !ip || !uri || !freq || !group || !visible || !chunk) {
        alert("Please fill in all required fields.");
        return;
    }

    // === Step 4: สร้าง JSON และส่งผ่าน WebSocket ===
    const jsonMessage = JSON.stringify({
        menuID: "RegisterDevice",
        name: name,
        sid: parseInt(sid),
        payload_size: parseInt(payload),
        terminal_type: parseInt(terminal),
        ip: ip,
        uri: uri,
        freq: parseInt(freq),
        group: parseInt(group),
        visible: parseInt(visible),
        ambient: ambient && ambient !== "NULL" ? ambient : null,
        last_access: last_access && last_access !== "NULL" ? last_access : null,
        chunk: parseInt(chunk),
        updated_at: updated_at,
        storage_path: fullPath,  
        // pathDirectory:currentPathField,
        // timeInterval:parseInt(currentTimeIntroval)
    });


    console.log("JSON Message:", jsonMessage);

    if (typeof ws !== 'undefined' && ws.readyState === 1) {
        ws.send(jsonMessage);
        alert("Device registered successfully!");
    } else {
        alert("WebSocket connection is closed.");
    }
}



function toggleRowEdit(checkbox) {
    const row = checkbox.closest('tr'); // หาแถวที่ checkbox อยู่
    const inputs = row.querySelectorAll('input, select'); // เลือก input และ select ทั้งหมดในแถว
    const buttons = row.querySelectorAll('button'); // เลือกปุ่มในแถว
	console.log("Checkbox:",checkbox);
    if (checkbox.checked) {
        // ถ้า checkbox ถูกติ๊ก
        inputs.forEach(input => {
            if (input.tagName === 'INPUT') {
                input.removeAttribute('readonly'); // ทำให้แก้ไขได้สำหรับ input
            } else if (input.tagName === 'SELECT') {
                input.removeAttribute('disabled'); // ทำให้แก้ไขได้สำหรับ select
            }
            input.style.backgroundColor = 'white'; // เปลี่ยนสีพื้นหลังเป็นขาว
        });
        buttons.forEach(button => button.removeAttribute('disabled')); // เปิดใช้งานปุ่ม
    } else {
        // ถ้า checkbox ไม่ถูกติ๊ก
        inputs.forEach(input => {
            if (input.tagName === 'INPUT') {
                input.setAttribute('readonly', true); // ทำให้แก้ไขไม่ได้สำหรับ input
            } else if (input.tagName === 'SELECT') {
                input.setAttribute('disabled', true); // ทำให้แก้ไขไม่ได้สำหรับ select
            }
            input.style.backgroundColor = '#f0f0f0'; // เปลี่ยนสีพื้นหลังเป็นเทา
        });
        buttons.forEach(button => button.setAttribute('disabled', true)); // ปิดใช้งานปุ่ม
    }
}

function updateDevice(deviceId) {
    console.log("Update Device ID:", deviceId);

    // ดึงค่าจาก input fields โดยอิงจาก id ที่กำหนดใน <input id="...">
    const name = document.getElementById(`name-${deviceId}`)?.value;
    const sid = document.getElementById(`sid-${deviceId}`)?.value;
    const payload = document.getElementById(`payload-${deviceId}`)?.value;
    const terminal = document.getElementById(`terminal-${deviceId}`)?.value;
    const ip = document.getElementById(`ip-${deviceId}`)?.value;
    const uri = document.getElementById(`uri-${deviceId}`)?.value;
    const freq = document.getElementById(`freq-${deviceId}`)?.value;
    const group = document.getElementById(`group-${deviceId}`)?.value;
    const visible = document.getElementById(`visible-${deviceId}`)?.value;
    const storage_path = document.getElementById(`file_path-${deviceId}`)?.value;
    const ambient = document.getElementById(`ambient-${deviceId}`)?.value;
    const last_access = document.getElementById(`last_access-${deviceId}`)?.value;
    const chunk = document.getElementById(`chunk-${deviceId}`)?.value;
    const updated_at = document.getElementById(`updated_at-${deviceId}`)?.value;
    // ตรวจสอบว่าค่าจำเป็นมีครบ

    // สร้าง JSON message สำหรับอัปเดต
    const jsonMessage = JSON.stringify({
        menuID: "updateDeviceWeb",   // ใช้ชื่อเดิมตามที่ backend รอรับ
        id: deviceId,             // สำคัญ: ต้องมี id เพื่อ backend จะรู้ว่าแก้แถวไหน
        name: name,
        sid: parseInt(sid),
        payload_size: parseInt(payload),
        terminal_type: parseInt(terminal),
        ip: ip,
        uri: uri,
        freq: parseInt(freq),
        group: parseInt(group),
        visible: parseInt(visible),
        storage_path: storage_path,
        ambient: ambient || null,
        last_access: last_access && last_access !== "NULL" ? last_access : null,
        chunk: chunk,
        updated_at: updated_at
    });

    console.log("Sending update JSON:", jsonMessage);

    if (ws.readyState === 1) {
        ws.send(jsonMessage);
        
        // หลังจากส่ง update แล้ว ให้ lock row กลับเป็น readonly
        const row = document.querySelector(`tr[data-device-id="${deviceId}"]`);
        if (row) {
            const checkbox = row.querySelector('.select-device');
            const inputs = row.querySelectorAll('input, select');
            const buttons = row.querySelectorAll('button');
            
            // Uncheck checkbox
            if (checkbox) {
                checkbox.checked = false;
            }
            
            // Lock all inputs
            inputs.forEach(input => {
                if (input.tagName === 'INPUT' && input.type !== 'checkbox') {
                    input.setAttribute('readonly', true);
                    input.style.backgroundColor = '#f8f9fa';
                } else if (input.tagName === 'SELECT') {
                    input.setAttribute('disabled', true);
                }
            });
            
            // Disable buttons
            buttons.forEach(button => {
                button.setAttribute('disabled', true);
            });
        }
        
        alert("Device updated successfully!");
    } else {
        alert("Connection is closed...");
    }
}

function deleteDevice(deviceId) {
    console.log("Delete Device ID:", deviceId); // ตรวจสอบค่า deviceId ใน console
    const deviceIdInput = document.getElementById(`sid-${deviceId}`);
    // const sid = document.getElementById("sid")?.value;

    // ดึงค่า deviceId จาก input field ที่เกี่ยวข้อง
    // const deviceIdValue = document.getElementById(`deviceId-${deviceId}`).value;
    if (!deviceIdInput) {
        console.error(`Input with id deviceId-${deviceId} not found.`);
        alert("Unable to delete: Input field not found.");
        return;
    }
    const deviceIdValue = deviceIdInput.value;
    const confirmAction = confirm(`Are you sure you want to delete this device with ID: ${deviceIdValue}?`);
    if (confirmAction) {
        const jsonMessage = JSON.stringify({
            menuID: "deleteDeviceWeb",
            sid: deviceIdValue, // ใช้ค่า deviceId จาก input field
        });

        if (ws.readyState === 1) {
            ws.send(jsonMessage);
            alert("Device deleted successfully!");
        } else {
            alert("Connection is closed...");
        }
    }
}

function updatePathDirectoryForDevice(deviceId) {
    console.log("Update Path Directory for Device ID:", deviceId);

    // ดึงค่าจาก input fields
    const deviceIdValue = document.getElementById(`deviceId-${deviceId}`).value;
    const frequencyValue = document.getElementById(`frequency-${deviceId}`).value;
    const modeValue = document.getElementById(`mode-${deviceId}`).value;
    const ipaddressValue = document.getElementById(`ip-${deviceId}`).value;
    const timeIntervalValue = document.getElementById(`timeInterval-${deviceId}`).value;
    const pathDirectoryValue = document.getElementById(`pathDirectory-${deviceId}`).value;
    const companyNameValue = document.getElementById(`companyName-${deviceId}`).value;

    // สร้าง JSON message
    const jsonMessage = JSON.stringify({
        menuID: "updatePathDirectory",
        deviceId: deviceIdValue,
        frequency: frequencyValue,
        mode: modeValue,
        ip: ipaddressValue,
        companyName: companyNameValue,
        pathDirectory: pathDirectoryValue,
        timeInterval: parseInt(timeIntervalValue, 10), // แปลงเป็นตัวเลข
    });

    // ส่งข้อมูลผ่าน WebSocket
    if (ws.readyState === 1) {
        ws.send(jsonMessage);
        alert("Path Directory and Time Interval updated successfully!");

        // รีเฟรชหน้าเว็บอัตโนมัติ
        setTimeout(() => {
            location.reload();
        }, 1000); // รอ 1 วินาทีเพื่อให้ WebSocket ส่งข้อความสำเร็จก่อนรีเฟรช
    } else {
        alert("Connection is closed...");
    }
}

function updateCurrentPathDirectory() {
    console.log("Updating Current Path Directory based on Storage Type");

    // ดึงค่าจาก select element ของ Storage Type
    const storageTypeElement = document.getElementById("storageType");
    const currentPathDirectoryElement = document.getElementById("CurrentpathDirectory");

    if (!storageTypeElement || !currentPathDirectoryElement) {
        console.error("Storage Type or Current Path Directory element not found!");
        return;
    }

    // ดึงค่าที่เลือกจาก Storage Type
    const storageType = storageTypeElement.value;

    // กำหนด base path ตาม Storage Type
    let basePath = "";
    if (storageType === "internal") {
        basePath = "/home/orinnx/audiofiles";
    } else if (storageType === "external1") {
        basePath = "/media/SSD1/";
    } else if (storageType === "external2") {
        basePath = "/media/SSD2/";
    } else {
        console.error("Invalid storage type selected:", storageType);
        return;
    }

    // อัปเดต Current Path Directory
    currentPathDirectoryElement.value = basePath;
    console.log("Current Path Directory updated to:", basePath);
}

function toggleEditPath(checkbox) {
    const input = document.getElementById("CurrentpathDirectory");
    const input2 = document.getElementById("timeIntervalpath");

    if (!input || !input2) {
        console.error("Input elements not found");
        return;
    }

    const canEdit = checkbox.checked;
    input.readOnly = !canEdit;
    input2.readOnly = !canEdit;

    console.log("CurrentpathDirectory editable:", !input.readOnly);
    console.log("timeInterval editable:", !input2.readOnly);
}

function selectPathUI() {
    const currentPath = document.getElementById("CurrentpathDirectory").value;
    const newPath = prompt("Enter new path:", currentPath);
    if (newPath !== null) {
        document.getElementById("CurrentpathDirectory").value = newPath;
    }
}


function changeDirectoryPath() {
    const currentPathDirectoryElement = document.getElementById("CurrentpathDirectory");
    const currentPathtimeInterval = document.getElementById("timeIntervalpath");

    if (!currentPathDirectoryElement || !currentPathtimeInterval) {
        console.error("Path or Interval element not found!");
        return;
    }

    const path = currentPathDirectoryElement.value;
    const interval = parseInt(currentPathtimeInterval.value, 10);

    // หาแถวที่ checkbox ถูกเลือก
    const checkedBoxes = document.querySelectorAll("input[type='checkbox']:checked");

    if (checkedBoxes.length === 0) {
        alert("Please select at least one row to update the file path.");
        return;
    }

    checkedBoxes.forEach(checkbox => {
        const row = checkbox.closest("tr");
        if (!row) return;

        // หา input file_path ที่อยู่ใน row เดียวกัน
        // const fileInput = row.querySelector("input[id^='file_path-']");
        if (fileInput) {
            fileInput.value = path;
        }
    });

    const jsonMessage = JSON.stringify({
        menuID: "changePathDirectory",
        ChangePathDirectory: path,
        timeIntervalpath: interval
    });

    if (ws.readyState === 1) {
        ws.send(jsonMessage);
        alert("Path Directory and Time Interval updated successfully!");
        setTimeout(() => {
            location.reload();
        }, 1000);
    } else {
        alert("Connection is closed...");
    }
}

// ===== NEW: Card View Functions for Device Management =====

// Store current device for editing
let currentEditingDevice = null;
let allDevices = [];

// Load and display devices as cards
function loadDeviceCards() {
    const jsonMessage = JSON.stringify({
        menuID: "getRegisterDevicePageWeb"
    });
    
    if (ws && ws.readyState === 1) {
        ws.send(jsonMessage);
    }
}

// Generate card grid from device list
function generateDeviceCardGrid(deviceList) {
    allDevices = deviceList;
    const container = document.getElementById("deviceCardGrid");
    
    if (!container) {
        console.error("deviceCardGrid container not found");
        return;
    }
    
    if (!deviceList || deviceList.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-muted text-center">No devices registered</p></div>';
        return;
    }

    let html = '';
    deviceList.forEach(device => {
        // Map API field names to display names (ข้อมูลมาจาก backend ใช้ snake_case)
        const deviceName = device.name || '-';
        const deviceGroup = device.group || '-';
        const deviceSid = device.sid || 0;
        const deviceIp = device.ip || '-';
        const deviceUri = device.uri || '-';
        const deviceFreq = device.freq || 0;
        const deviceUpdated = device.updated_at || '-';
        
        html += `
            <div class="device-card-wrapper" data-device-id="${device.id}" data-device-name="${deviceName.toLowerCase()}" data-device-ip="${deviceIp.toLowerCase()}" data-device-uri="${deviceUri.toLowerCase()}">
                <div class="device-card">
                    <div class="device-card-header">
                        ${deviceName}
                    </div>
                    <div class="device-card-body">
                        <div class="info-row">
                            <span class="label">Group:</span>
                            <span class="value">${deviceGroup}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">IP:</span>
                            <span class="value">${deviceIp}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">SID:</span>
                            <span class="value">${deviceSid}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">URI:</span>
                            <span class="value">${deviceUri}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Frequency:</span>
                            <span class="value">${deviceFreq} MHz</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Updated At:</span>
                            <span class="value" style="font-size: 0.85rem;">${deviceUpdated}</span>
                        </div>
                    </div>
                    <div class="device-card-footer">
                        <button type="button" class="btn-edit" onclick="openEditDeviceModal('${device.id}')">
                            Edit
                        </button>
                        <button type="button" class="btn-delete" onclick="deleteDevice('${device.id}')">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Open edit device modal
function openEditDeviceModal(deviceId) {
    const device = allDevices.find(d => d.id == deviceId);
    if (!device) {
        console.error("Device not found:", deviceId);
        return;
    }

    currentEditingDevice = device;
    
    // Debug: log device object to see all available fields
    console.log("Device object:", device);

    // Populate modal form with device data (map snake_case to form fields)
    document.getElementById("edit_id").value = device.id || '';
    document.getElementById("edit_nameDevice").value = device.name || '';
    document.getElementById("edit_sid").value = device.sid !== undefined ? device.sid : '';
    document.getElementById("edit_payload_size").value = device.payload_size || '';
    document.getElementById("edit_terminal_type").value = device.terminal_type || '';
    document.getElementById("edit_ipaddress").value = device.ip || '';
    document.getElementById("edit_uri").value = device.uri || '';
    document.getElementById("edit_freq").value = device.freq || '';
    document.getElementById("edit_group").value = device.group || '';
    document.getElementById("edit_visible").value = device.visible || '';
    document.getElementById("edit_ambient").value = device.ambient || '';
    document.getElementById("edit_last_access").value = device.last_access || '';
    document.getElementById("edit_chunk").value = device.chunk || '';

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editDeviceModal'));
    modal.show();
}

// Open add device modal
function openAddDeviceModal() {
    // Reset form
    document.getElementById("addDeviceForm").reset();
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('addDeviceModal'));
    modal.show();
}

// Save changes to device
function saveDeviceChanges() {
    const deviceId = document.getElementById("edit_id").value;
    
    const jsonMessage = JSON.stringify({
        menuID: "updateDeviceWeb",
        id: deviceId,
        name: document.getElementById("edit_nameDevice").value,
        sid: document.getElementById("edit_sid").value,
        payload_size: document.getElementById("edit_payload_size").value,
        terminal_type: document.getElementById("edit_terminal_type").value,
        ip: document.getElementById("edit_ipaddress").value,
        uri: document.getElementById("edit_uri").value,
        freq: document.getElementById("edit_freq").value,
        group: document.getElementById("edit_group").value,
        visible: document.getElementById("edit_visible").value,
        ambient: document.getElementById("edit_ambient").value,
        chunk: document.getElementById("edit_chunk").value
    });

    console.log("Sending update:", jsonMessage);

    if (ws && ws.readyState === 1) {
        ws.send(jsonMessage);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editDeviceModal'));
        if (modal) modal.hide();
        
        // Reload devices
        setTimeout(() => {
            loadDeviceCards();
        }, 500);
    } else {
        alert("Connection is closed...");
    }
}

// Delete device from modal
function deleteDeviceFromModal() {
    const deviceId = document.getElementById("edit_id").value;
    const deviceName = document.getElementById("edit_nameDevice").value;
    const deviceSid = document.getElementById("edit_sid").value;
    
    if (!confirm(`Are you sure you want to delete "${deviceName}"?`)) {
        return;
    }

    const jsonMessage = JSON.stringify({
        menuID: "deleteDeviceWeb",
        id: deviceId,
        sid: deviceSid
    });

    console.log("Sending delete:", jsonMessage);

    if (ws && ws.readyState === 1) {
        ws.send(jsonMessage);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editDeviceModal'));
        if (modal) modal.hide();
        
        // Reload devices
        setTimeout(() => {
            loadDeviceCards();
        }, 500);
    } else {
        alert("Connection is closed...");
    }
}

// Quick delete from card
function deleteDevice(deviceId) {
    const device = allDevices.find(d => d.id == deviceId);
    const deviceName = device ? device.name : 'Device';
    const deviceSid = device ? device.sid : '';
    
    if (!confirm(`Are you sure you want to delete "${deviceName}"?`)) {
        return;
    }

    const jsonMessage = JSON.stringify({
        menuID: "deleteDeviceWeb",
        id: deviceId,
        sid: deviceSid
    });

    console.log("Sending delete:", jsonMessage);

    if (ws && ws.readyState === 1) {
        ws.send(jsonMessage);
        
        // Reload devices
        setTimeout(() => {
            loadDeviceCards();
        }, 500);
    } else {
        alert("Connection is closed...");
    }
}

// Save new device
function saveNewDevice() {
    const name = document.getElementById("add_nameDevice").value;
    const sid = document.getElementById("add_sid").value;
    const payload = document.getElementById("add_payload_size").value;
    const terminal = document.getElementById("add_terminal_type").value;
    const ip = document.getElementById("add_ipaddress").value;
    const uri = document.getElementById("add_uri").value;
    const freq = document.getElementById("add_freq").value;
    const group = document.getElementById("add_group").value;
    const visible = document.getElementById("add_visible").value;
    const ambient = document.getElementById("add_ambient").value;
    const chunk = document.getElementById("add_chunk").value;

    // ตรวจสอบค่าว่าง
    if (!name || !sid || !payload || !terminal || !ip || !uri || !freq || !group || !visible || !chunk) {
        alert("Please fill in all required fields.");
        return;
    }

    const jsonMessage = JSON.stringify({
        menuID: "RegisterDeviceWeb",
        name: name,
        sid: parseInt(sid),
        payload_size: parseInt(payload),
        terminal_type: parseInt(terminal),
        ip: ip,
        uri: uri,
        freq: parseInt(freq),
        group: parseInt(group),
        visible: parseInt(visible),
        ambient: ambient && ambient !== "NULL" ? ambient : null,
        chunk: parseInt(chunk)
    });

    console.log("Sending new device:", jsonMessage);

    if (ws && ws.readyState === 1) {
        ws.send(jsonMessage);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addDeviceModal'));
        if (modal) modal.hide();
        
        // Reload devices
        setTimeout(() => {
            loadDeviceCards();
        }, 500);
    } else {
        alert("Connection is closed...");
    }
}

// Search filter for device cards
function setupDeviceSearchFilter() {
    const searchInput = document.getElementById("deviceSearch");
    const clearBtn = document.getElementById("clearSearch");
    
    if (!searchInput || !clearBtn) return;

    searchInput.addEventListener("input", function() {
        const searchText = this.value.toLowerCase();
        const cards = document.querySelectorAll(".device-card-wrapper");
        
        cards.forEach(card => {
            const name = card.dataset.deviceName || '';
            const ip = card.dataset.deviceIp || '';
            const uri = card.dataset.deviceUri || '';
            
            // Search in name, ip, and uri
            if (name.includes(searchText) || ip.includes(searchText) || uri.includes(searchText)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });

    clearBtn.addEventListener("click", function() {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
    });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function() {
    setupDeviceSearchFilter();
    setTimeout(() => {
        loadDeviceCards();
    }, 500);
});
