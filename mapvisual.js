// ================== dfrole.js (FULL) ==================

var currentID = -1;
var wsUri;
var ws;
var currentRoleID = 0;
var currentRoleName = "";
var roleIndexForApplyChange = -1;
var currentRoleIDForApplyChange = -1;
var currentRoleUniqueId = "";

// ---------- globals for map ----------
window.gpsMarkers = window.gpsMarkers || {};
window.lastGpsPos = window.lastGpsPos || {};
window.lastCompassHeading = (window.lastCompassHeading ?? null);

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
  else if (obj.menuID === "UpdateGPSMarker") {
    handleUpdateGPSMarker(obj);
  }
  else if (obj.menuID === "Compass") {
    handleCompassData(obj);
    // console.log("[Compass] heading:", obj.heading);
  }
  if (obj.menuID === "updateParameterMode") {
      setConnectionModeFromQt(obj.mode);
  }
  else if (obj.menuID === "RolesList") {
    window.rolesListData = obj.rolesList || [];
  }
  else if (obj.menuID === "updateCurrentRole") {
    // updateCurrentRole
  }
}
function changeRoleFromDropdown(uniqueIdInGroup, roleName) {
  console.log("changeRoleFromDropdown UID =", uniqueIdInGroup);

  currentRoleUniqueId = (uniqueIdInGroup || "").trim();
  currentRoleName = roleName || "";

  // update label
  const label = document.getElementById("roleIdSelectLabel");
  if (label) label.textContent = currentRoleName;

  const btn = document.getElementById("roleIdSelect");
  if (btn) btn.setAttribute("data-uid", currentRoleUniqueId);

  // ✅ ส่งไป Qt : UID เท่านั้น
  const payload = {
    menuID: "ChangeActiveRoleID",
    uniqueIdInGroup: currentRoleUniqueId
  };

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
    // แนะนำให้รอ Qt broadcast updateCurrentRole ก่อน reload
  } else {
    // fallback
    location.href = "mapvisual.php?uid=" + encodeURIComponent(currentRoleUniqueId);
  }
}


  const connSwitch = {
    isLocal: true
  };
  function setConnectionModeFromQt(mode) {
    const btn = document.getElementById("connSwitch");
    const lbl = document.getElementById("connSwitchLabel");

    const isLocal = (mode === "LOCAL");

    // sync state
    connSwitch.isLocal = isLocal;

    // label
    lbl.textContent = mode;

    // reset class
    btn.classList.remove("local", "remote");

    // apply class
    if (isLocal) {
      btn.classList.add("local");
    } else {
      btn.classList.add("remote");
    }

    console.log("Connection Mode updated from Qt:", mode);
  }
  
function toggleConnectionMode() {
  connSwitch.isLocal = !connSwitch.isLocal;
  console.log("Toggling connection mode, new isLocal:", connSwitch.isLocal);
  const mode = connSwitch.isLocal ? "LOCAL" : "REMOTES";

  // update UI ทันที
  setConnectionModeFromQt(mode);

  // ส่งกลับไป Qt
  try {
    if (window.ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        menuID: "SetConnectionMode",
        mode: mode
      }));
    }
  } catch (e) {
    console.warn("toggleConnectionMode ws error", e);
  }
}


// ======================================================
// ================== Compass Line (CANVAS) ==============
// ======================================================

// globals
window.lastCompassHeading = window.lastCompassHeading ?? null;

function compassLengthByZoom(z) {
  const minPx = 50;
  const maxPx = 280;

  let px = 20 * Math.pow(1.35, (z - 8));
  px = Math.max(minPx, Math.min(maxPx, px));
  return px;
}

function initCompassLineCanvas() {
  if (!window.map) return;

  if (document.getElementById("headingLineCanvas")) return;

  window.compassLine = {
    headingDeg: 0,
    visible: true,
    color: "#00FFFF",
    lineWidth: 2.5,
    dash: [4, 2],
    src: "GPS1"
  };

  const container = map.getContainer();

  const canvas = document.createElement("canvas");
  canvas.id = "headingLineCanvas";
  canvas.style.position = "absolute";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "10";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();

    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    // วาดด้วยหน่วย CSS px
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw() {
    resize();

    const opt = window.compassLine;
    const rect = container.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    if (!opt.visible) return;

    const pos = window.lastGpsPos && window.lastGpsPos[opt.src];
    if (!pos) return;

    const p = map.project([pos.lon, pos.lat]);
    const cx = p.x;
    const cy = p.y;

    // เหมือน QML เป๊ะ
    const headingRad = (opt.headingDeg - map.getBearing() - 90) * Math.PI / 180;

    // ✅ length ย่อ/ขยายตาม zoom
    const lengthPx = compassLengthByZoom(map.getZoom());

    const hx = cx + lengthPx * Math.cos(headingRad);
    const hy = cy + lengthPx * Math.sin(headingRad);

    ctx.setLineDash(opt.dash);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(hx, hy);
    ctx.strokeStyle = opt.color;
    ctx.lineWidth = opt.lineWidth;
    ctx.stroke();
    ctx.setLineDash([]);
  }

  window.drawCompassLine = draw;

  // redraw ตอน map ขยับ/ซูม/หมุน/เปลี่ยน style
  map.on("move", draw);
  map.on("zoom", draw);
  map.on("rotate", draw);
  map.on("pitch", draw);
  map.on("resize", draw);
  map.on("style.load", draw);

  draw();
}

function handleCompassData(obj) {
  initCompassLineCanvas();

  let heading = (typeof obj.heading === "number") ? obj.heading : parseFloat(obj.heading);
  if (isNaN(heading)) return;

  heading = ((heading % 360) + 360) % 360;
  window.lastCompassHeading = heading;

  if (window.compassLine) window.compassLine.headingDeg = heading;
  if (typeof window.drawCompassLine === "function") window.drawCompassLine();
}


// ======================================================
// ================== Update GPS Marker =================
// ======================================================

function handleUpdateGPSMarker(data) {
  if (!window.map) {
    console.warn("[mapvisual] map not ready, skip GPS marker");
    return;
  }

  var src = data.source || "GPS1";

  var lat = (typeof data.lat === "number") ? data.lat : parseFloat(data.lat);
  var lon = (typeof data.lon === "number") ? data.lon : parseFloat(data.lon);

  if (isNaN(lat) || isNaN(lon)) {
    console.warn("[UpdateGPSMarker] invalid lat/lon:", data.lat, data.lon);
    return;
  }

  // ✅ เก็บ GPS ล่าสุด (สำคัญ!)
  window.lastGpsPos = window.lastGpsPos || {};
  window.lastGpsPos[src] = { lon: lon, lat: lat };

  var timeStr = data.time || "";
  var dateStr = data.date || "";

  var color = "#007bff";
  if (src === "GPS2") color = "#ff9800";
  else if (src === "GPS3") color = "#4caf50";

  var markers = window.gpsMarkers;
  if (!markers) {
    window.gpsMarkers = {};
    markers = window.gpsMarkers;
  }

  function createCircleElement(color) {
    var el = document.createElement("div");
    el.style.width = "14px";
    el.style.height = "14px";
    el.style.borderRadius = "50%";
    el.style.backgroundColor = color;
    el.style.border = "2px solid #ffffff";
    el.style.boxShadow = "0 0 6px rgba(0,0,0,0.45)";
    return el;
  }

  var popupHtml =
    '<div style="min-width:180px">' +
      "<b>" + src + "</b><br>" +
      "Lat: " + lat.toFixed(6) + "<br>" +
      "Lon: " + lon.toFixed(6) + "<br>" +
      "Date: " + dateStr + "<br>" +
      "Time: " + timeStr +
    "</div>";

  if (!markers[src]) {
    var el = createCircleElement(color);

    markers[src] = new maplibregl.Marker({
      element: el,
      anchor: "center"
    })
      .setLngLat([lon, lat])
      .setPopup(new maplibregl.Popup({ offset: 18 }).setHTML(popupHtml))
      .addTo(map);

  } else {
    markers[src].setLngLat([lon, lat]);

    var popup = markers[src].getPopup();
    if (popup) popup.setHTML(popupHtml);
  }

  // ✅ ถ้า GPS1 มาแล้ว และมี heading ล่าสุด -> วาด compass ทันที
  // if (src === "GPS1" && window.lastCompassHeading != null) {
  //   updateCompassLineSafe(window.lastCompassHeading);
  // }

  // ไม่ขยับ map (ห้าม panTo)
  // if (src === "GPS1") map.panTo([lon, lat]);
}

// ======================================================
// ================== เปลี่ยน Style Map =================
// ======================================================

// ฟังก์ชัน global เอาไว้เรียกจาก onclick เดิม
function changeMapStyle(styleKey) {
  console.log("changeMapStyle:", styleKey);

  const styleUrl = STYLE_URLS[styleKey];
  if (!styleUrl) {
    console.error("Style not found:", styleKey);
    return;
  }

  if (!window.map) {
    console.warn("Map is not ready yet");
    return;
  }

  if (styleKey === currentStyleKey) {
    return;
  }

  currentStyleKey = styleKey;
  map.setStyle(styleUrl);

  // ✅ หลังเปลี่ยน style ต้อง re-add layers (compass) ใหม่
  map.once("style.load", () => {
    try { ensureCompassLayer(); } catch (e) {}
    if (window.lastCompassHeading != null) {
      updateCompassLineSafe(window.lastCompassHeading);
    }
  });

  const buttons = document.querySelectorAll("#styleButtons .map-style-btn");
  buttons.forEach(b => b.classList.remove("active"));

  const activeBtn = document.querySelector(
    "#styleButtons .map-style-btn[data-style='" + styleKey + "']"
  );
  if (activeBtn) activeBtn.classList.add("active");
}

function selectMapStyle(styleKey) {
  changeMapStyle(styleKey);

  const label = document.getElementById("mapStyleSelectLabel");
  if (label) {
    const names = {
      satellite: "Satellite",
      bright: "Bright",
      dark: "Dark",
      fiord: "Fiord"
    };
    label.textContent = "Map Style : " + (names[styleKey] || styleKey);
  }
}

// ======================================================
// ================= helper จาก PHP =====================
// ======================================================

function getDeviceUidById(deviceId) {
  if (!window.deviceListData) return "";
  deviceId = parseInt(deviceId, 10);
  for (const dev of window.deviceListData) {
    if (parseInt(dev.id, 10) === deviceId) {
      return (dev.deviceUniqueId || "").trim();
    }
  }
  return "";
}

function getGroupUidByRoleId(roleId) {
  if (!window.rolesListData) return "";
  roleId = parseInt(roleId, 10);
  for (const r of window.rolesListData) {
    if (parseInt(r.roleID, 10) === roleId) {
      return (r.uniqueIdInGroup || "").trim();
    }
  }
  return "";
}

// ---------------- เปลี่ยน Role จาก dropdown ด้านบน ----------------

function changeRoleFromDropdown(roleID, roleName, uniqueIdInGroup) {
  console.log("changeRoleFromDropdown", roleID, roleName, uniqueIdInGroup);

  currentRoleID        = roleID;              // เก็บไว้เผื่อใช้กับ UI/หน้าเว็บ
  currentRoleName      = roleName;
  currentRoleUniqueId  = (uniqueIdInGroup || "").trim();

  var label = document.getElementById("roleIdSelectLabel");
  if (label) label.textContent = roleName;

  // ✅ ส่ง uniqueIdInGroup แทน roleID
  const payload = {
    menuID: "ChangeActiveRoleID",
    uniqueIdInGroup: currentRoleUniqueId,
    roleID: currentRoleID,        // (optional) ส่งไปด้วยได้ เผื่อ backend ยังใช้
    roleName: currentRoleName     // (optional)
  };

  console.log("WS ChangeActiveRoleID (by UID)", payload);

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
    setTimeout(() => {
      // จะ reload หน้าแบบเดิมก็ได้
      location.href = "mapvisual.php?roleID=" + roleID;
      // หรือถ้าจะเปลี่ยนเป็น query ด้วย UID จริง ๆ ค่อยเปลี่ยน PHP เพิ่ม:
      // location.href = "mapvisual.php?uid=" + encodeURIComponent(currentRoleUniqueId);
    }, 300);
  } else {
    location.href = "mapvisual.php?roleID=" + roleID;
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
  var roleID = parseInt(document.getElementById('buttonChangeID').value, 10);
  if (roleID <= 0) return;

  // ✅ หา UID จาก rolesListData หรือถ้าคุณมี map จาก PHP ก็ใช้ได้
  const uid = getGroupUidByRoleId(roleID);

  const payload = {
    menuID: "ChangeActiveRoleID",
    uniqueIdInGroup: (uid || "").trim(),
    roleID: roleID
  };

  console.log("ChangeActiveRoleID (by UID)", payload);
  currentID = -1;

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
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

function setCurrentRoleId(roleID, roleName, uniqueIdInGroup) {
  console.log("setCurrentRoleId", roleID, roleName, uniqueIdInGroup);

  currentRoleID       = roleID;
  currentRoleName     = roleName;
  currentRoleUniqueId = (uniqueIdInGroup || "").trim();

  const roleIdSelected = document.getElementById('roleIdSelected');
  const roleNameToNewDevice = document.getElementById('roleNameToNewDevice');

  if (roleIdSelected) roleIdSelected.value = currentRoleID;
  if (roleNameToNewDevice) roleNameToNewDevice.value = currentRoleName;

  // (ถ้าคุณมี hidden ไว้เก็บ uid ก็ใส่เพิ่มได้)
  const roleUidSelected = document.getElementById('roleUidSelected');
  if (roleUidSelected) roleUidSelected.value = currentRoleUniqueId;

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

// ---------------- Apply ใน Role Setup Modal ----------------

function applyInsertNewDeviceInRole(userID) {
  const roleIdSelected = document.getElementById('roleIdSelected');
  const roleNameInput  = document.getElementById('roleNameToNewDevice');
  const newDeviceSel   = document.getElementById('newDeviceIdSelect');

  const roleID   = roleIdSelected ? parseInt(roleIdSelected.value, 10) : 0;
  const roleName = roleNameInput  ? roleNameInput.value.trim()         : "";
  const deviceID = newDeviceSel   ? parseInt(newDeviceSel.value, 10)   : 0;

  const groupUID = getGroupUidByRoleId(roleID);

  if (deviceID === -1) {
    deleteRoleID();
    return;
  }

  if (deviceID === 0 && roleID > 0) {
    if (!roleName) {
      alert("Please enter Role Name.");
      return;
    }

    const payload = {
      objectName: "editName",
      id: roleID,
      GroupsName: roleName,
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

  if (roleID === 0) {
    const payload = {
      objectName: "EditGroup",
      action: "add",
      groupID: 0,
      groupName: roleName,
      uniqueIdInGroup: "",
      deviceUniqueIds: [devUid]
    };

    console.log("[dfrole] EditGroup add:", payload);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
      resetInsertNewDeviceInRole();
      setTimeout(() => { location.reload(); }, 1000);
    } else {
      alertConnection();
      location.reload();
    }
  } else {
    const payload = {
      objectName: "EditGroupDevices",
      action: "add",
      groupID: roleID,
      groupName: roleName,
      uniqueIdInGroup: groupUID,
      deviceUniqueId: devUid,
      deviceUniqueIds: []
    };

    console.log("[dfrole] EditGroupDevices add:", payload);

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

    if (name.includes(input) || ip.includes(input) || uid.includes(input)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

