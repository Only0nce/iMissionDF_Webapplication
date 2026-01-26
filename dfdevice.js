// ---------- WebSocket ----------
var currentID = -1;
var wsUri;
var ws;
var currentRoleID = 0;
var currentRoleName = "";
var roleIndexForApplyChange = -1;
var currentRoleIDForApplyChange = -1;

// ---------- Helper: ใช้ ModalAlert แทน alert() ----------
function showModalAlert(message) {
  try {
    var bodySpan = document.getElementById("ModalAlertBody");
    if (bodySpan) {
      bodySpan.textContent = message;
    }

    var modalElement = document.getElementById("ModalAlert");
    if (modalElement && typeof bootstrap !== "undefined") {
      var modal = bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.show();
    } else {
      alert(message);
    }
  } catch (e) {
    console.error("showModalAlert error:", e);
    alert(message);
  }
}

WebSocketTest();

function WebSocketTest() {
  if ("WebSocket" in window) {
    wsUri = "ws://" + location.host + ":8000";
    ws = new WebSocket(wsUri);

    ws.onopen = function () {
      setTimeout(() => { ws.send('{"menuID":"Device"}'); }, 100);
    };

    ws.onmessage = function (evt) {
      var received_msg = evt.data;
      processMsg(received_msg);
    };

    ws.onclose = function () {
      // ใช้ ModalAlert แทน alert()
      showModalAlert("Unable to connect to the iScan Receiver Module.");
    };
  } else {
    showModalAlert("WebSocket NOT supported by your Browser!");
  }
}

// ---------- processMsg: รับ message จาก backend ----------
function processMsg(message) {
  try {
    var obj = JSON.parse(message);

    if (!obj || !obj.menuID)
      return;

    if (obj.menuID === "currentRoleIdActive") {
      // handle active role if needed
      return;
    }

    // --- เพิ่มส่วนของ Scan Devices ---
    if (obj.menuID === "scanDevicesFound") {
      dfScan_handleDeviceFound(obj);
      return;
    }

    if (obj.menuID === "scanDevicesFinished") {
      dfScan_handleScanFinished();
      return;
    }

  } catch (e) {
    console.error("processMsg parse error:", e, message);
  }
}

// ---------- เก็บ userID จาก PHP ----------
function setUserID(id) {
  window.currentUserID = id;
}
window.setUserID = setUserID;

// ---------- ตัวแปร state ของ filter ----------
window.selectedDeviceId = 0;   // 0 = All Device
window.deviceSearchText = "";  // keyword search

// ---------- ฟังก์ชันรวม: ใช้ทั้งจาก dropdown และ search box ----------
function applyDeviceFilter() {
  const cards = document.querySelectorAll('[id^="container"]');

  cards.forEach(function (card) {
    const idStr = card.id.replace("container", "");
    const devId = parseInt(idStr, 10);

    // filter ตาม ID (dropdown)
    if (window.selectedDeviceId !== 0 && devId !== window.selectedDeviceId) {
      card.style.display = "none";
      return;
    }

    const keyword = (window.deviceSearchText || "").toLowerCase();

    if (keyword.length === 0) {
      card.style.display = "";
      return;
    }

    const nameInput = document.getElementById("devicename" + devId);
    const ipInput   = document.getElementById("ipaddress" + devId);
    const snInput   = document.getElementById("deviceuniqueid" + devId);

    const nameVal = nameInput ? nameInput.value.toLowerCase() : "";
    const ipVal   = ipInput   ? ipInput.value.toLowerCase()   : "";
    const snVal   = snInput   ? snInput.value.toLowerCase()   : "";

    if (
      nameVal.indexOf(keyword) !== -1 ||
      ipVal.indexOf(keyword)   !== -1 ||
      snVal.indexOf(keyword)   !== -1
    ) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

// ใช้กับ onkeyup ของ deviceSearchBox
function filterDeviceList() {
  const box = document.getElementById("deviceSearchBox");
  window.deviceSearchText = box ? box.value.trim() : "";
  applyDeviceFilter();
}
window.filterDeviceList = filterDeviceList;

// ---------- filter แสดงเฉพาะการ์ดของ device ที่เลือกจาก dropdown ----------
function showOnly1ID(deviceId, label, iconName, devices) {
  try {
    window.selectedDeviceId = deviceId;

    const labelSpan = document.getElementById("deviceIdSelectLabel");
    if (labelSpan) {
      labelSpan.textContent = label;
    }

    const iconUse = document.getElementById("deviceIdSelectSVG");
    if (iconUse && iconName) {
      iconUse.setAttribute("xlink:href", "dashboard.svg#" + iconName);
      iconUse.setAttribute("href", "dashboard.svg#" + iconName);
    }

    applyDeviceFilter();
  } catch (e) {
    console.error("showOnly1ID error:", e);
  }
}
window.showOnly1ID = showOnly1ID;

// ---------- Insert New Device ----------
function insertClient() {
  try {
    const deviceNameInput = document.getElementById("devicename0");
    const ipAddressInput  = document.getElementById("ipaddress0");
    const deviceSNInput   = document.getElementById("deviceuniqueid0");

    const deviceName = deviceNameInput ? deviceNameInput.value.trim() : "";
    const ipAddress  = ipAddressInput  ? ipAddressInput.value.trim()  : "";
    const deviceSN   = deviceSNInput   ? deviceSNInput.value.trim().toUpperCase() : "";

    if (!deviceName) {
      showModalAlert("Please enter Device Name.");
      return;
    }
    if (!ipAddress) {
      showModalAlert("Please enter IP Address.");
      return;
    }
    if (!deviceSN) {
      showModalAlert("Please enter Device Serial Number.");
      return;
    }

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      showModalAlert("WebSocket is not connected.");
      return;
    }

    const msgObj = {
      objectName:     "AddDevice",
      Name:           deviceName,
      ip:             ipAddress,
      deviceUniqueId: deviceSN,
      userID:         window.currentUserID || 0
    };

    console.log("[dfdevice] send AddDevice:", msgObj);
    ws.send(JSON.stringify(msgObj));

    setTimeout(() => {
      location.reload();
    }, 2000);

  } catch (e) {
    console.error("insertClient error:", e);
    showModalAlert("Error: " + e);
  }
}
window.insertClient = insertClient;

// ---------- Update Device (ปุ่ม Apply บนการ์ด) ----------
function setCurrentId(devId) {
  try {
    const nameInput = document.getElementById("devicename" + devId);
    const ipInput   = document.getElementById("ipaddress" + devId);
    const snInput   = document.getElementById("deviceuniqueid" + devId);

    const nameVal  = nameInput ? nameInput.value.trim() : "";
    const ipVal    = ipInput   ? ipInput.value.trim()   : "";
    const newSnVal = snInput   ? snInput.value.trim().toUpperCase() : "";

    let oldSnVal = "";
    if (snInput) {
      const attr = snInput.getAttribute("data-original-sn");
      oldSnVal = attr ? attr.trim().toUpperCase() : "";
    }

    if (!nameVal) { showModalAlert("Please enter Device Name.");   return; }
    if (!ipVal)   { showModalAlert("Please enter IP Address.");    return; }
    if (!newSnVal){ showModalAlert("Please enter Serial Number."); return; }

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      showModalAlert("WebSocket is not connected.");
      return;
    }

    const msgObj = {
      objectName:         "UpdateDevice",
      id:                 devId,
      Name:               nameVal,
      ip:                 ipVal,
      oldDeviceUniqueId:  oldSnVal,
      deviceUniqueId:     newSnVal,
      userID:             window.currentUserID || 0
    };

    console.log("[dfdevice] send UpdateDevice:", msgObj);
    ws.send(JSON.stringify(msgObj));

    setTimeout(() => {
      location.reload();
    }, 2000);

  } catch (e) {
    console.error("setCurrentId (UpdateDevice) error:", e);
    showModalAlert("Error: " + e);
  }
}
window.setCurrentId = setCurrentId;

// ---------- Delete Device (ปุ่ม Remove บนการ์ด) ----------
function setCurrentIdForDelete(devId) {
  try {
    const nameInput = document.getElementById("devicename" + devId);
    const ipInput   = document.getElementById("ipaddress" + devId);
    const snInput   = document.getElementById("deviceuniqueid" + devId);

    const nameVal = nameInput ? nameInput.value.trim() : "";
    const ipVal   = ipInput   ? ipInput.value.trim()   : "";
    const snVal   = snInput   ? snInput.value.trim().toUpperCase() : "";

    if (!snVal) {
      showModalAlert("Serial Number not found, cannot delete.");
      return;
    }
    if (!confirm("Do you want to remove this device?\n" +
                 (nameVal ? ("Name: " + nameVal + "\n") : "") +
                 "SN: " + snVal)) {
      return;
    }

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      showModalAlert("WebSocket is not connected.");
      return;
    }

    const msgObj = {
      objectName:    "DeleteDevice",
      id:            devId,
      Name:          nameVal,
      ip:            ipVal,
      deviceUniqueId: snVal,
      userID:        window.currentUserID || 0
    };

    console.log("[dfdevice] send DeleteDevice:", msgObj);
    ws.send(JSON.stringify(msgObj));

    setTimeout(() => {
      location.reload();
    }, 2000);

  } catch (e) {
    console.error("setCurrentIdForDelete error:", e);
    showModalAlert("Error: " + e);
  }
}
window.setCurrentIdForDelete = setCurrentIdForDelete;


// =====================================================================
// ====================  SCAN DEVICES (MODAL)  =========================
// =====================================================================

// ต้องมี existingDevices จาก PHP:
//   var existingDevices = <?php echo json_encode($rowDeviceListQuery); ?>;
// ใช้เช็คว่า IP/Name ซ้ำกับ DeviceList เดิมหรือไม่
if (typeof existingDevices === 'undefined') {
  window.existingDevices = [];
}

// Model เก็บผล Scan
var dfScanList = [];   // {name, ip, serial, ping, selected, dupReason}

function dfScan_isDupIp(ip) {
  if (!Array.isArray(existingDevices))
    return false;
  for (var i = 0; i < existingDevices.length; i++) {
    if (existingDevices[i].ipaddress === ip)
      return true;
  }
  return false;
}

function dfScan_isDupName(name) {
  if (!Array.isArray(existingDevices))
    return false;
  for (var i = 0; i < existingDevices.length; i++) {
    if (existingDevices[i].Name === name)
      return true;
  }
  return false;
}

// ----- Render ตารางใน modal -----
function dfScan_renderTable() {
  var tbody = document.getElementById("scanTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  dfScanList.forEach(function (it, i) {
    var tr = document.createElement("tr");

    // class สำหรับ hover + selected
    tr.className = "scan-row";
    if (it.selected) {
      tr.classList.add("scan-row-selected");
    }

    // เก็บ index ไว้บน tr
    tr.dataset.index = i.toString();

    // คลิกทั้งแถว -> toggle เลือก
    tr.addEventListener("click", function (e) {
      // ถ้าคลิกที่ checkbox เอง ปล่อยให้ event ของ checkbox จัดการ
      if (e.target && e.target.type === "checkbox") {
        return;
      }
      var idx = parseInt(this.dataset.index);
      if (!isNaN(idx)) {
        dfScanList[idx].selected = !dfScanList[idx].selected;
        dfScan_renderTable();
      }
    });

    // ===== checkbox =====
    var tdCheck = document.createElement("td");
    var chk = document.createElement("input");
    chk.type = "checkbox";
    chk.className = "form-check-input scan-select";
    chk.dataset.index = i.toString();
    chk.checked = !!it.selected;
    chk.onclick = function (ev) {
      ev.stopPropagation();
      var idx = parseInt(this.dataset.index);
      if (!isNaN(idx)) {
        dfScanList[idx].selected = this.checked;
        dfScan_renderTable();
      }
    };
    tdCheck.appendChild(chk);
    tr.appendChild(tdCheck);

    // ===== name =====
    var tdName = document.createElement("td");
    tdName.textContent = it.name || "";
    tr.appendChild(tdName);

    // ===== ip =====
    var tdIp = document.createElement("td");
    tdIp.textContent = it.ip || "";
    tr.appendChild(tdIp);

    // ===== serial =====
    var tdSerial = document.createElement("td");
    tdSerial.textContent = it.serial || "";
    tr.appendChild(tdSerial);

    // ===== ping =====
    var tdPing = document.createElement("td");
    tdPing.textContent = (typeof it.ping === "number") ? (it.ping + " ms") : "";
    tr.appendChild(tdPing);

    // ===== status =====
    var tdStatus = document.createElement("td");
    if (it.dupReason) {
      tdStatus.textContent = it.dupReason;
      tdStatus.className = "text-danger small";
    } else {
      tdStatus.textContent = "OK";
      tdStatus.className = "text-success small";
    }
    tr.appendChild(tdStatus);

    tbody.appendChild(tr);
  });

  dfScan_updateAddSelectedEnabled();
}


function dfScan_updateAddSelectedEnabled() {
  var btn = document.getElementById("btnAddSelectedScan");
  if (!btn) return;

  var canAdd = dfScanList.some(function (it) {
    return it.selected && !it.dupReason;
  });
  btn.disabled = !canAdd;
}

// ----- ปุ่มใน modal -----
// เรียกจากปุ่ม "Scan" ใน modal
function scanDevicesButtonClicked() {
  var btnScan = document.getElementById("btnScanDevices");
  var lblScan = document.getElementById("btnScanDevicesLabel");

  if (btnScan && btnScan.disabled)
    return;

  dfScanList = [];
  dfScan_renderTable();

  if (lblScan) lblScan.textContent = "Scanning...";
  if (btnScan) {
    btnScan.disabled = true;
    btnScan.classList.add("disabled");
  }

  dfScan_sendScanRequest();
}
window.scanDevicesButtonClicked = scanDevicesButtonClicked;

// select all (เฉพาะที่ไม่ซ้ำ)
function dfScan_selectAllValid() {
  dfScanList.forEach(function (it) {
    if (!it.dupReason) it.selected = true;
  });
  var chkAll = document.getElementById("chkScanAll");
  if (chkAll) chkAll.checked = true;
  dfScan_renderTable();
}
window.dfScan_selectAllValid = dfScan_selectAllValid;

// clear selection
function dfScan_clearSelection() {
  dfScanList.forEach(function (it) {
    it.selected = false;
  });
  var chkAll = document.getElementById("chkScanAll");
  if (chkAll) chkAll.checked = false;
  dfScan_renderTable();
}
window.dfScan_clearSelection = dfScan_clearSelection;

function dfScan_toggleAllFromHeader() {
  var master = document.getElementById("chkScanAll");
  if (!master) return;

  // toggle check/uncheck
  master.checked = !master.checked;

  // ใช้ฟังก์ชันที่มีอยู่แล้ว
  dfScan_toggleAllCheckbox(master);
}

// toggle master checkbox
function dfScan_toggleAllCheckbox(masterCheckbox) {
  var checked = masterCheckbox.checked;
  dfScanList.forEach(function (it) {
    it.selected = checked && !it.dupReason;
  });
  dfScan_renderTable();
}
window.dfScan_toggleAllCheckbox = dfScan_toggleAllCheckbox;

// Add Selected → ส่ง AddDevice ผ่าน WebSocket (ใช้ logic เดียวกับ insertClient)
function dfScan_addSelected() {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    showModalAlert("WebSocket is not connected.");
    return;
  }

  var added = 0;

  dfScanList.forEach(function (it) {
    if (it.selected && !it.dupReason) {
      var msgObj = {
        objectName:     "AddDevice",
        Name:           it.name,
        ip:             it.ip,
        deviceUniqueId: (it.serial || "").toUpperCase(),
        userID:         window.currentUserID || 0
      };
      console.log("[dfdevice] ScanAddDevice:", msgObj);
      ws.send(JSON.stringify(msgObj));
      added++;
    }
  });

  if (added === 0) {
    showModalAlert("No valid device selected to add.");
    return;
  }

  showModalAlert("Added " + added + " device(s).");
  setTimeout(function () {
    location.reload();
  }, 2000);
}
window.dfScan_addSelected = dfScan_addSelected;

// ----- ส่งคำขอสแกนไป backend -----
function dfScan_sendScanRequest() {
  var btnScan = document.getElementById("btnScanDevices");
  var lblScan = document.getElementById("btnScanDevicesLabel");

  if (!ws || ws.readyState !== WebSocket.OPEN) {
    showModalAlert("WebSocket is not connected.");
    if (btnScan) {
      btnScan.disabled = false;
      btnScan.classList.remove("disabled");
    }
    if (lblScan) lblScan.textContent = "Scan";
    return;
  }

  var payload = { objectName: "scanDevices" };
  console.log("[dfdevice] send scanDevices:", payload);
  ws.send(JSON.stringify(payload));
}

// ----- handler จาก backend: เจอ device 1 ตัว -----
function dfScan_handleDeviceFound(msg) {
  var name   = msg.name   || "";
  var serial = msg.serial || "";
  var ip     = msg.ip     || "";
  var ping   = (typeof msg.ping === "number") ? msg.ping : null;

  var dupReason = null;
  if (dfScan_isDupIp(ip)) {
    dupReason = "Duplicate IP";
  } else if (dfScan_isDupName(name)) {
    dupReason = "Duplicate Name";
  }

  dfScanList.push({
    name:     name,
    serial:   serial,
    ip:       ip,
    ping:     ping,
    selected: false,
    dupReason: dupReason
  });

  dfScan_renderTable();
}

// ----- handler จาก backend: scanFinished -----
function dfScan_handleScanFinished() {
  var btnScan = document.getElementById("btnScanDevices");
  var lblScan = document.getElementById("btnScanDevicesLabel");

  if (btnScan) {
    btnScan.disabled = false;
    btnScan.classList.remove("disabled");
  }
  if (lblScan) lblScan.textContent = "Scan";

  showModalAlert("Scan complete.");
}
