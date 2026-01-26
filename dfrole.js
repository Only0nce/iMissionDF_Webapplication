// ================== dfrole.js (เวอร์ชันใหม่) ==================

var currentID = -1;
var wsUri;
var ws;
var currentRoleID = 0;
var currentRoleName = "";
var roleIndexForApplyChange = -1;
var currentRoleIDForApplyChange = -1;

// ---------------- WebSocket ----------------

WebSocketTest();

function WebSocketTest() {

  if ("WebSocket" in window) {
    wsUri = "ws://" + location.host + ":8000";
    ws = new WebSocket(wsUri);

    ws.onopen = function () {
      setTimeout(() => { ws.send('{"menuID":"getRolesPage"}'); }, 100);
    };

    ws.onmessage = function (evt) {
      var received_msg = evt.data;
      processMsg(received_msg);
    };

    ws.onclose = function () {
      alertConnection();
    };
  } else {
    alert("WebSocket NOT supported by your Browser!");
  }
}

function processMsg(message) {
  // console.log(message);
  var obj = {};
  try {
    obj = JSON.parse(message);
  } catch (e) {
    console.error("processMsg JSON error:", e, message);
    return;
  }

  if (obj.menuID == "currentRoleIdActive") {
    // handle active role if needed
  }
}

// ---------------- helper จาก PHP ----------------
// PHP ต้องกำหนด
//   window.deviceListData = [...];
//   window.rolesListData  = [...];

// หา deviceUniqueId จาก id (DeviceList.id)
function getDeviceUidById(deviceId) {
  if (!window.deviceListData)
    return "";

  deviceId = parseInt(deviceId, 10);
  for (const dev of window.deviceListData) {
    if (parseInt(dev.id, 10) === deviceId) {
      return (dev.deviceUniqueId || "").trim();
    }
  }
  return "";
}

// หา uniqueIdInGroup จาก roleID
function getGroupUidByRoleId(roleId) {
  if (!window.rolesListData)
    return "";

  roleId = parseInt(roleId, 10);
  for (const r of window.rolesListData) {
    if (parseInt(r.roleID, 10) === roleId) {
      return (r.uniqueIdInGroup || "").trim();
    }
  }
  return "";
}

// ---------------- เปลี่ยน Role จาก dropdown ด้านบน ----------------

function changeRoleFromDropdown(roleID, roleName) {
  console.log("changeRoleFromDropdown", roleID, roleName);

  currentRoleID   = roleID;
  currentRoleName = roleName;

  var label = document.getElementById("roleIdSelectLabel");
  if (label) {
    label.textContent = roleName;
  }

  let text = '{ "menuID":"ChangeActiveRoleID", "roleID":' + roleID + ' }';
  console.log("WS ChangeActiveRoleID", text);

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(text);
    setTimeout(() => {
      location.href = "dfrole.php?roleID=" + roleID;
    }, 300);
  } else {
    location.href = "dfrole.php?roleID=" + roleID;
  }
}

// ---------------- navigation helpers (ของเดิม) ----------------

function locationreloadDevice(roleID, deviceDescription, method = 'post') {
  const form = document.createElement('form');
  form.method = method;

  const hiddenField = document.createElement('input');
  hiddenField.type = 'hidden';
  hiddenField.name = "roleID";
  hiddenField.value = roleID;
  form.appendChild(hiddenField);

  if (deviceDescription != "") {
    const deviceName = document.createElement('input');
    deviceName.type = 'hidden';
    deviceName.name = "deviceName";
    deviceName.value = deviceDescription;
    form.appendChild(deviceName);
  }

  console.log(roleID, deviceDescription);
  document.body.appendChild(form);
  form.action = "index.php";
  form.submit();
}

function locationreload(roleID, method = 'post') {
  const form = document.createElement('form');
  form.method = method;

  const hiddenField = document.createElement('input');
  hiddenField.type = 'hidden';
  hiddenField.name = "roleID";
  hiddenField.value = roleID;
  form.appendChild(hiddenField);

  document.body.appendChild(form);
  form.submit();
}

// ---------------- Change Active Role (ปุ่ม Select Role - modal เก่า) ----------------

function ChangeActiveRoleID() {
  var roleID = document.getElementById('buttonChangeID').value;
  if (roleID <= 0) return;

  let text = '{ "menuID"   : "ChangeActiveRoleID", "roleID":' + roleID + '}';
  console.log("ChangeActiveRoleID", text);
  currentID = -1;

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(text);
    setTimeout(() => { locationreload(currentRoleID); }, 1000);
  } else {
    alertConnection();
    location.reload();
  }
}

function selectActiveRoleID(id, roleName) {
  document.getElementById("roleIdSelectLabel").innerHTML = roleName;
}

// ---------------- setCurrentRoleId: เรียกจาก PHP ตอนโหลดหน้า ----------------

function setCurrentRoleId(roleID, roleName) {
  console.log("setCurrentRoleId", roleID, roleName);
  currentRoleID = roleID;
  currentRoleName = roleName;

  const roleIdSelected = document.getElementById('roleIdSelected');
  const roleNameToNewDevice = document.getElementById('roleNameToNewDevice');

  if (roleIdSelected) roleIdSelected.value = currentRoleID;
  if (roleNameToNewDevice) roleNameToNewDevice.value = currentRoleName;

  if (currentRoleID > 0) {
    const btn = document.getElementById('roleIdSelect' + roleID);
    const link = document.getElementById('roleIdSelectLink' + roleID);
    if (btn) btn.className += " active";
    if (link) link.className += " active";

    const mainSelect = document.getElementById('roleIdSelect');
    if (mainSelect) mainSelect.value = roleID;
  }
}

function selectRoleID(id, roleName, array) {
  locationreload(id);
}

// ---------------- Modal Helpers ----------------

function alertDeleteRoleID() {
  let name = "confirmToDeleteRoleID";
  let modal = null;

  var modalElement = document.getElementById(name);
  if (modalElement) {
    modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}

function alertConnection() {
  let name = "ModalAlert";
  let modal = null;

  var modalElement = document.getElementById(name);
  if (modalElement) {
    modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}

// ---------------- เปลี่ยน Device ใน Role (ตอนเลือกจาก dropdown บนการ์ด) ----------------

function changeDevice(roleIndex, currentIDVal, changed2Id, changed2Name, newiconName, ipaddress) {
  const ApplyButton = "ApplyButton" + roleIndex;

  if (currentIDVal == changed2Id) {
    if (document.getElementById(ApplyButton))
      document.getElementById(ApplyButton).style.display = "none";
  } else {
    if (document.getElementById(ApplyButton))
      document.getElementById(ApplyButton).style.display = "block";
  }

  if (document.getElementById("DeviceName" + roleIndex))
    document.getElementById("DeviceName" + roleIndex).innerHTML = changed2Name;

  if (document.getElementById("ipaddress" + roleIndex))
    document.getElementById("ipaddress" + roleIndex).value = ipaddress;

  if (document.getElementById("deviceIdSelect" + roleIndex))
    document.getElementById("deviceIdSelect" + roleIndex).value = changed2Id;

  if (document.getElementById("deviceIdSelectLabel" + roleIndex))
    document.getElementById("deviceIdSelectLabel" + roleIndex).innerHTML = changed2Name;

  if (document.getElementById("deviceIdSelectSVG" + roleIndex))
    document.getElementById("deviceIdSelectSVG" + roleIndex)
      .setAttribute('xlink:href', "dashboard.svg#" + newiconName);

  if (document.getElementById("icon" + roleIndex))
    document.getElementById("icon" + roleIndex)
      .setAttribute('xlink:href', "dashboard.svg#" + newiconName);
}

function resetCurrentId() {
  roleIndexForApplyChange = -1;
  currentRoleIDForApplyChange = -1;
  setTimeout(() => { location.reload(); }, 1000);
}

function setCurrentRoleIdForApplyChange(roleIndex, currentRoleID) {
  roleIndexForApplyChange = roleIndex;
  currentRoleIDForApplyChange = currentRoleID;

  let name = "confirmToEditClientInRole";
  let modal = null;

  var modalElement = document.getElementById(name);
  if (modalElement) {
    modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}

function setRoleIdForDelete(roleIndex, currentRoleID) {
  roleIndexForApplyChange = roleIndex;
  currentRoleIDForApplyChange = currentRoleID;

  let name = "confirmToDeleteClient";
  let modal = null;

  var modalElement = document.getElementById(name);
  if (modalElement) {
    modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}

// ---------------- Delete Device จาก Role (Remove ปุ่มบนการ์ด) ----------------

function deleteDevice() {
  const currentIDLocal      = roleIndexForApplyChange;      // dg.id
  const currentRoleIdLocal  = currentRoleIDForApplyChange;  // GroupID

  if (currentIDLocal === -1) return;

  const groupUidInput  = document.getElementById("groupUID"  + currentIDLocal);
  const deviceUidInput = document.getElementById("deviceUID" + currentIDLocal);

  const groupUID  = groupUidInput  ? groupUidInput.value.trim()  : "";
  const deviceUID = deviceUidInput ? deviceUidInput.value.trim() : "";

  if (!groupUID || !deviceUID) {
    console.warn("[dfrole] deleteDevice: groupUID/deviceUID empty");
    alert("Cannot delete device: group UID or device UID is empty.");
    return;
  }

  const payload = {
    objectName:           "EditGroupDevices",
    action:          "remove",
    groupID:         currentRoleIdLocal,
    groupName:       currentRoleName || "",
    uniqueIdInGroup: groupUID,
    deviceUniqueId:  deviceUID,
    deviceUniqueIds: []
  };

  console.log("[dfrole] EditGroupDevices remove:", payload);

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
    setTimeout(() => {
      location.href = "dfrole.php?roleID=" + currentRoleIdLocal;
    }, 1000);
  } else {
    alertConnection();
    location.reload();
  }
}

// ---------------- Apply Change (เปลี่ยน Device ในการ์ดแล้วกด Save Change) ----------------

function applyChange() {
  const roleIndex          = roleIndexForApplyChange;        // dg.id (DeviceGroups.id)
  const currentRoleIdLocal = currentRoleIDForApplyChange;    // GroupID

  if (roleIndex === -1 || currentRoleIdLocal === -1) return;

  // uniqueIdInGroup ของ group แถวนี้ (ถ้ามี)
  const groupUidInput = document.getElementById("groupUID" + roleIndex);
  const groupUID      = groupUidInput ? groupUidInput.value.trim() : "";

  // id ของ DeviceList ที่เลือกใหม่
  const changed2Id   = document.getElementById("deviceIdSelect" + roleIndex).value;
  const newDeviceUid = getDeviceUidById(changed2Id);   // หา deviceUniqueId จาก id

  if (!groupUID || !newDeviceUid) {
    console.warn("[dfrole] applyChange: groupUID or newDeviceUid empty", groupUID, newDeviceUid);
    alert("Cannot change device: group UID or device UID is empty.");
    return;
  }

  const payload = {
    objectName:      "EditGroupDevices",
    action:          "changedeviceInGroup",   // ⭐ action ใหม่
    groupID:         currentRoleIdLocal,
    groupName:       currentRoleName || "",
    uniqueIdInGroup: groupUID,
    roleIndex:       roleIndex,               // ⭐ ส่ง DeviceGroups.id ไปให้ Qt
    deviceUniqueId:  newDeviceUid,
    deviceUniqueIds: []                      // ยังไม่ได้ใช้ แต่เผื่ออนาคต
  };

  console.log("[dfrole] EditGroupDevices changedeviceInGroup:", payload);

  const ApplyButton = "ApplyButton" + roleIndex;

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));        // ⭐ ส่งไป Qt

    const btn = document.getElementById(ApplyButton);
    if (btn) btn.style.display = "none";

    // หน่วงเวลา 1–2 วิ แล้วค่อย reload หน้า
    setTimeout(() => {
      location.href = "dfrole.php?roleID=" + currentRoleIdLocal;
    }, 2000);  // ตามที่บอกว่าอยากหน่วง 2 วิ
  } else {
    alertConnection();
    // fallback reload
    setTimeout(() => {
      location.href = "dfrole.php?roleID=" + currentRoleIdLocal;
    }, 2000);
  }
}


// ---------------- Modal Role Setup: เลือก Role (Existing / New) ----------------

function setRoleIdToNewDevice(roleIndex, roleName, array) {
  const roleIdSelected      = document.getElementById('roleIdSelected');
  const roleIdSelectedLabel = document.getElementById('roleIdSelectedLabel');
  const roleNameToNewDevice = document.getElementById('roleNameToNewDevice');
  const svg                 = document.getElementById("roleIdSelectedSVG");

  if (roleIdSelected)      roleIdSelected.value = roleIndex;
  if (roleIdSelectedLabel) roleIdSelectedLabel.innerHTML = roleName;
  if (roleNameToNewDevice) roleNameToNewDevice.value = roleName;

  if (roleIndex == 0) {
    if (svg) svg.setAttribute('xlink:href',
      "fontawesome-free-5.15.4-web/sprites/solid.svg#plus-circle");
    if (roleNameToNewDevice) {
      roleNameToNewDevice.value = "";
      roleNameToNewDevice.focus();
    }
  } else if (svg) {
    svg.setAttribute('xlink:href',
      "fontawesome-free-5.15.4-web/sprites/solid.svg#layer-group");
  }
}

function setNewDeviceToRole(deviceIndex, deviceName, iconName, array) {
  const newDeviceIdSelect      = document.getElementById('newDeviceIdSelect');
  const newDeviceIdSelectLabel = document.getElementById('newDeviceIdSelectLabel');
  const newDeviceIdSelectSVG   = document.getElementById("newDeviceIdSelectSVG");
  const iconNewDevice          = document.getElementById("iconNewDevice");

  if (newDeviceIdSelect)      newDeviceIdSelect.value = deviceIndex;
  if (newDeviceIdSelectLabel) newDeviceIdSelectLabel.innerHTML = deviceName;
  if (newDeviceIdSelectSVG)   newDeviceIdSelectSVG.setAttribute('xlink:href', "dashboard.svg#" + iconName);
  if (iconNewDevice)          iconNewDevice.setAttribute('xlink:href', "dashboard.svg#" + iconName);
}

// ---------------- Delete Role (ใช้ EditGroup / action=delete) ----------------

function deleteRoleID() {
  const roleIdSelected   = document.getElementById('roleIdSelected');
  const roleNameInput    = document.getElementById('roleNameToNewDevice');

  const roleID   = roleIdSelected ? parseInt(roleIdSelected.value, 10) : -1;
  const roleName = roleNameInput  ? roleNameInput.value.trim()        : "";

  if (roleID <= 0) {
    alert("Please select an existing Role to delete.");
    return;
  }

  const groupUID = getGroupUidByRoleId(roleID);
  if (!groupUID) {
    alert("Cannot delete role: uniqueIdInGroup not found.");
    return;
  }

  const payload = {
    objectName:           "EditGroup",
    action:          "delete",
    groupID:         roleID,
    groupName:       roleName,
    uniqueIdInGroup: groupUID,
    deviceUniqueIds: []
  };

  console.log("[dfrole] EditGroup delete:", payload);

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
    resetInsertNewDeviceInRole();
    setTimeout(() => { location.reload(); }, 1000);
  } else {
    alertConnection();
    location.reload();
  }
}

// ---------------- Apply ใน Role Setup Modal ----------------

function applyInsertNewDeviceInRole(userID) {
  const roleIdSelected = document.getElementById('roleIdSelected');
  const roleNameInput  = document.getElementById('roleNameToNewDevice');
  const newDeviceSel   = document.getElementById('newDeviceIdSelect');

  const roleID   = roleIdSelected ? parseInt(roleIdSelected.value, 10) : 0;  // 0 = New Role
  const roleName = roleNameInput  ? roleNameInput.value.trim()         : "";
  const deviceID = newDeviceSel   ? parseInt(newDeviceSel.value, 10)   : 0;

  const groupUID = getGroupUidByRoleId(roleID);

  // 1) Delete Role (deviceID == -1)
  if (deviceID === -1) {
    deleteRoleID();
    return;
  }

  // 2) Change Role Name only (deviceID == 0 & roleID > 0) → "editName"
  if (deviceID === 0 && roleID > 0) {
    if (!roleName) {
      alert("Please enter Role Name.");
      return;
    }

    const payload = {
      objectName:           "editName",
      id:              roleID,
      GroupsName:      roleName,
      uniqueIdInGroup: groupUID
    };

    console.log("[dfrole] editName:", payload);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
      resetInsertNewDeviceInRole();
      setTimeout(() => { location.reload(); }, 1000);
    } else {
      alertConnection();
      location.reload();
    }
    return;
  }

  // 3) Insert Device (ต้องมี roleName, deviceID > 0)
  if (!roleName) {
    roleNameInput && roleNameInput.focus();
    return;
  }
  if (deviceID <= 0) {
    alert("Please select a device.");
    return;
  }

  const devUid = getDeviceUidById(deviceID);
  if (!devUid) {
    alert("Cannot find deviceUniqueId for deviceID=" + deviceID);
    return;
  }

  // 3.1 New Role (roleID == 0) -> EditGroup / action:"add"
  if (roleID === 0) {
    const payload = {
      objectName:           "EditGroup",
      action:          "add",
      groupID:         0,
      groupName:       roleName,
      uniqueIdInGroup: "",
      deviceUniqueIds: [devUid]
    };

    console.log("[dfrole] EditGroup add (new group):", payload);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
      resetInsertNewDeviceInRole();
      setTimeout(() => { location.reload(); }, 1000);
    } else {
      alertConnection();
      location.reload();
    }
  }
  // 3.2 Existing Role (roleID > 0) -> EditGroupDevices / action:"add"
  else {
    const payload = {
      objectName:           "EditGroupDevices",
      action:          "add",
      groupID:         roleID,
      groupName:       roleName,
      uniqueIdInGroup: groupUID,
      deviceUniqueId:  devUid,
      deviceUniqueIds: []
    };

    console.log("[dfrole] EditGroupDevices add (existing group):", payload);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
      resetInsertNewDeviceInRole();
      setTimeout(() => { location.reload(); }, 1000);
    } else {
      alertConnection();
      location.reload();
    }
  }
}

// ---------------- reset ฟอร์มใน Role Setup Modal ----------------

function resetInsertNewDeviceInRole() {
  if (document.getElementById('roleIdSelected'))
    document.getElementById('roleIdSelected').value = currentRoleID;

  if (document.getElementById('roleNameToNewDevice'))
    document.getElementById('roleNameToNewDevice').value = currentRoleName;

  if (document.getElementById('newDeviceIdSelect'))
    document.getElementById('newDeviceIdSelect').value = 0;

  if (document.getElementById("newDeviceIdSelectSVG"))
    document.getElementById("newDeviceIdSelectSVG").setAttribute('xlink:href', "dashboard.svg#puzzle");

  if (document.getElementById("iconNewDevice"))
    document.getElementById("iconNewDevice").setAttribute('xlink:href', "dashboard.svg#puzzle");

  if (document.getElementById('newDeviceIdSelectLabel'))
    document.getElementById('newDeviceIdSelectLabel').innerHTML = "Please Select Device";
}

// ---------------- Filter Device List (ค้นหาใน card) ----------------

function filterDeviceList() {
  let input = document.getElementById("deviceSearchBox").value.toLowerCase();
  let cards = document.querySelectorAll("[id^='container']");

  cards.forEach(card => {
    const name = card.querySelector("h5")?.textContent.toLowerCase() || "";

    const ipInput = card.querySelector("input[id^='ipaddress']");
    const ip      = ipInput ? ipInput.value.toLowerCase() : "";

    const uidInput = card.querySelector("input[id^='deviceuniqueid']");
    const uid      = uidInput ? uidInput.value.toLowerCase() : "";

    if (
      name.includes(input) ||
      ip.includes(input)   ||
      uid.includes(input)
    ) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// ================== END dfrole.js ==================
