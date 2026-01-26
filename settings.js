var currentID = -1;
var wsUri;
var ws;
var currentSoftPhoneID = 1;
var userID = 0;

// Store frequency values from AlsaRecConfigManager
var recFrequency = {}; // { iGateID: freq }
// WebSocketTest();
function WebSocketTest() {
  if ("WebSocket" in window) {
    // Single WebSocket on port 1234
    wsUri = "ws://" + location.host + ":8049";
    ws = new WebSocket(wsUri);

    ws.onopen = function () {
      console.log("WebSocket (port 8049) connected");
      // Send initial requests previously split across sockets
      ws.send('{"menuID":"getSystemPage"}');
      ws.send('{"menuID":"getSystemPageWeb"}');
      ws.send('{"menuID":"getVuMeter"}');
      ws.send('{"menuID":"getServerHomePage", "iGateNum":1}');
      ws.send('{"menuID":"getServerHomePage", "iGateNum":2}');
      // ws.send('{"menuID":"getServerHomePage", "iGateNum":3}');
      // ws.send('{"menuID":"getServerHomePage", "iGateNum":4}');
    };

    ws.onmessage = function (evt) {
      var received_msg = evt.data;
      console.log("WS (8049) received:", received_msg);
      processMsg(received_msg);
    };

    ws.onclose = function () {
      console.log("WebSocket (port 8049) closed");
      alertConnection();
    };

    ws.onerror = function (error) {
      console.error("WebSocket error:", error);
    };
  } else {
    // The browser doesn't support WebSocket
    alert("WebSocket NOT supported by your Browser!");
  }
}

// Single WebSocket helper (optional)
function sendWS(message) {
  if (ws && ws.readyState === 1) {
    ws.send(message);
    return true;
  }
  console.error("WebSocket (port 8049) is not connected");
  return false;
}

function processMsg(message)
{  
  console.log("Processing message:", message);
  var obj = JSON.parse(message);
  if(obj.menuID == "broadcastLocalTime")
  {
    document.getElementById("currentTime").innerHTML = obj.currentTime;
    document.getElementById("currentDate").innerHTML = obj.currentDate;
  }
  else if(obj.menuID == "system")
  {
    if (document.getElementById("swversion"))
      document.getElementById("swversion").value = obj.SwVersion;
  }
  else if (obj.menuID === "getNtpConfig") {
    var payload = (obj && typeof obj.payload === "object" && obj.payload !== null) ? obj.payload : {};
    if (payload.ntp && typeof payload.ntp === "object") {
      payload = payload.ntp;
    }
    const ntpStr = payload.NTP || "";
    const ntpList = ntpStr.split(/\s+/).slice(0, 4);

    for (let i = 0; i < 4; i++) {
      const el = document.getElementById(`ntpserver0_${i + 1}`);
      if (el) el.value = ntpList[i] || "";
    }
    // console.log("NTP Config payload:", payload.NTP);
  }
  else if (obj.menuID === "getTimezone") {
    var timezone = (obj && obj.timezone !== undefined && obj.timezone !== null) ? String(obj.timezone) : "";
    var tzInputEl = document.getElementById("ntptimezone0");
    if (tzInputEl) {
      tzInputEl.value = timezone;
      if (tzInputEl.tagName && tzInputEl.tagName.toLowerCase() === "select" && tzInputEl.value !== timezone) {
        tzInputEl.dataset.pendingValue = timezone;
      }
    }
  }
  else if (obj.menuID === "network") {
    function safeStr(v) { return (v === undefined || v === null) ? "" : String(v); }

    function parseIpCidr(ipCidr) {
      const s = safeStr(ipCidr).trim();
      if (!s) return { ip: "", netmask: "" };
      const parts = s.split("/");
      const ip = parts[0] || "";
      const cidr = parts[1];
      const netmask = (cidr !== undefined && cidr !== "") ? cidrToNetmask(cidr) : "";
      return { ip, netmask };
    }

    function setLanUI(idx, lanObj) {
      if (!lanObj) return;

      const { ip, netmask } = parseIpCidr(lanObj.ip || lanObj.ipaddress);
      const ipEl = document.getElementById("ipaddress" + idx);
      const nmEl = document.getElementById("netmask" + idx);
      const gwEl = document.getElementById("gateway" + idx);
      const d1El = document.getElementById("dns1" + idx);
      const d2El = document.getElementById("dns2" + idx);
      const dhcpLabel = document.getElementById("dhcpmethodLabel" + idx);

      if (ipEl) ipEl.value = ip;
      if (nmEl) nmEl.value = netmask;
      if (gwEl) gwEl.value = safeStr(lanObj.gateway);

      let dns1 = "", dns2 = "";
      if (Array.isArray(lanObj.dns)) {
        dns1 = safeStr(lanObj.dns[0]);
        dns2 = safeStr(lanObj.dns[1]);
      } else {
        const dnsVal = safeStr(lanObj.dns);
        if (dnsVal && dnsVal.indexOf(",") !== -1) {
          const dnsParts = dnsVal.split(",");
          dns1 = safeStr(dnsParts[0]);
          dns2 = safeStr(dnsParts[1]);
        } else {
          dns1 = dnsVal;
          dns2 = safeStr(lanObj.dns2);
        }
      }
      if (d1El) d1El.value = dns1;
      if (d2El) d2El.value = dns2;

      const mode = safeStr(lanObj.mode).toLowerCase();
      if (dhcpLabel && mode) {
        dhcpLabel.textContent = (mode === "static") ? "Static" : "Automatic";
      }
    }

    if (obj.lan && typeof obj.lan === "object") {
      setLanUI(0, obj.lan.lan1 || obj.lan.LAN1 || obj.lan.eth0);
      setLanUI(1, obj.lan.lan2 || obj.lan.LAN2 || obj.lan.eth1);
      setLanUI(2, obj.lan.rfsoc1 || obj.lan.RFSoC1);
      setLanUI(3, obj.lan.rfsoc2 || obj.lan.RFSoC2);
    } else {
      setLanUI(0, obj);
    }
  } 
  else if (obj.object === "receiverStatus" || obj.menuID === "receiverStatus") {
    // Handle receiver status messages
    // {"device":"recin1","frequency":0,"object":"receiverStatus","recorder":"enable","squelch":"off"}
    console.log("Receiver Status:", obj);
    
    // Map device to status element
    const deviceMap = {
      "recin1": "status1_1",  // Recorder 1
      "recin2": "status2_1"   // Recorder 2
    };
    
    const statusId = deviceMap[obj.device];
    if (statusId) {
      const statusEl = document.getElementById(statusId);
      if (statusEl) {
        // ถ้า frequency = 0 แสดงว่ายังไม่มีการ config จริง ให้แสดง READY แทน
        let status = "IDLE";
        if (obj.recorder === "enable" && obj.frequency > 0) {
          status = (obj.squelch === "on") ? "SQUELCH" : "RECORDING";
        } else if (obj.recorder === "enable" && obj.frequency === 0) {
          status = "READY";
        }
        statusEl.textContent = status;
        
        // Optional: Add color coding
        statusEl.className = "fw-semibold";
        if (status === "RECORDING") {
          statusEl.style.color = "#d83434ff"; // Green
        } else if (status === "SQUELCH") {
          statusEl.style.color = "#ffc107"; // Yellow
        } else if (status === "READY") {
          statusEl.style.color = "#17a2b8"; // Cyan
        } else {
          statusEl.style.color = "#6c757d"; // Gray
        }
      }
    }
  }
  else if (obj.menuID == "AlsaRecConfigManager"){
      const recID = parseInt(obj.RecID, 10);
    console.log("AlsaRecConfigManager RecID:", recID, obj);
  // ✅ สนใจเฉพาะ REC_1 และ REC_2 เท่านั้น
  if (recID !== 1 && recID !== 2) {
    console.log("[Skip] RecID not in (1,2):", recID, obj);
    return;
  }

  // --- จากนี้ค่อยอัปเดต UI ---
  const domIndex = 1;

  if (recID === 1) {
    // Recorder 1 (REC_1) -> recin1
    const recoreder1UriEl = document.getElementById("recoreder1_uri_" + domIndex);
    const iGate1UriEl     = document.getElementById("iGate1_uri_" + domIndex);
    const recorder1El     = document.getElementById("recorder1_" + domIndex);

    if (recoreder1UriEl) recoreder1UriEl.value = obj.recURI || "";
    if (iGate1UriEl)     iGate1UriEl.value     = obj.iGateURI || "";
    if (recorder1El && typeof obj.enable === "boolean") recorder1El.checked = obj.enable;

    // เก็บ freq ของ REC_1
    if (obj.iGateFreq !== undefined) recFrequency[0] = obj.iGateFreq;

  } else if (recID === 2) {
    // Recorder 2 (REC_2) -> recin2
    const recoreder2UriEl = document.getElementById("recoreder2_uri_" + domIndex);
    const iGate2UriEl     = document.getElementById("iGate2_uri_" + domIndex);
    const recorder2El     = document.getElementById("recorder2_" + domIndex);

    if (recoreder2UriEl) recoreder2UriEl.value = obj.recURI || "";
    if (iGate2UriEl)     iGate2UriEl.value     = obj.iGateURI || "";
    if (recorder2El && typeof obj.enable === "boolean") recorder2El.checked = obj.enable;

    // เก็บ freq ของ REC_2
    if (obj.iGateFreq !== undefined) recFrequency[1] = obj.iGateFreq;
  }
		// {"RecID":0,"alsa_dev":"recin1","enable":true,"iGateFreq":885.5,
		//  "iGateURI":"igate2@192.168.10.44","menuID":"AlsaRecConfigManager",
		//  "recURI":"192.168.10.34:554"}
		// const rawRecID = obj.RecID;
    // console.log("Processing AlsaRecConfigManager:", obj);

    // // Map frequency storage by logical recorder index: recin1 -> 0, recin2 -> 1
    // const alsa = (obj.alsa_dev || "").toLowerCase();
    // const recIndexNorm = (alsa === "recin2") ? 1 : 0;
    // if (obj.iGateFreq !== undefined) {
    //   recFrequency[recIndexNorm] = obj.iGateFreq;
    //   console.log("Stored frequency for", alsa, "(index", recIndexNorm, "):", obj.iGateFreq);
    // }

    // // UI only has DOM index 1 for each recorder group
    // const domIndex = 1;

    // if (alsa === "recin2") {
    //   const recoreder2UriEl = document.getElementById("recoreder2_uri_"+domIndex);
    //   const iGate2UriEl = document.getElementById("iGate2_uri_"+domIndex);
    //   const recorder2El = document.getElementById("recorder2_"+domIndex);
    //   if (recoreder2UriEl) recoreder2UriEl.value = obj.recURI || "";
    //   if (iGate2UriEl) iGate2UriEl.value = obj.iGateURI || "";
    //   if (recorder2El && typeof obj.enable === 'boolean') recorder2El.checked = obj.enable;
    // } else {
    //   const recoreder1UriEl = document.getElementById("recoreder1_uri_"+domIndex);
    //   const iGate1UriEl = document.getElementById("iGate1_uri_"+domIndex);
    //   const recorder1El = document.getElementById("recorder1_"+domIndex);
    //   if (recoreder1UriEl) recoreder1UriEl.value = obj.recURI || "";
    //   if (iGate1UriEl) iGate1UriEl.value = obj.iGateURI || "";
    //   if (recorder1El && typeof obj.enable === 'boolean') recorder1El.checked = obj.enable;
    // }
		

  } else if (obj.menuID === "recLogging") {
    console.log("recLogging:", obj);

    // obj = {"menuID":"recLogging","iGateID":1,"alsa":"recin1","conn":-1,"state":"READY"}
    const iGateID = parseInt(obj.iGateID, 10);
    if (!iGateID || iGateID < 1) return;

    // เลือก Recorder จาก alsa: recin1 -> 1, recin2 -> 2
    const alsa = (obj.alsa || "").toLowerCase();
    const recIndex = (alsa === "recin2") ? 2 : 1;

    // UI มีเพียง status1_1 และ status2_1 เท่านั้น (single block per recorder)
    const streamIndex = 1;

    const elId = `status${recIndex}_${streamIndex}`;
    const el = document.getElementById(elId);
    if (!el) {
      console.warn("status element not found:", elId);
      return;
    }

    // ตรวจสอบว่าสถานะเปลี่ยนแปลงหรือไม่
    if (obj.state !== el.textContent) {
      el.textContent = obj.state;

      // หา parent card
      let parentDiv = el.closest(".cardRecStatus1, .cardRecStatus2");
      if (!parentDiv) return;

      if (obj.state === "RECORD" || obj.state === "RECORDING") {
        parentDiv.classList.add("recording");
        el.innerHTML = '<span class="rec-dot"></span> ' + obj.state;
      } else {
        parentDiv.classList.remove("recording");
        el.innerHTML = obj.state;
      }
    }

    // ทำสี
    el.className = "fw-semibold";
    const st = (obj.state || "").toUpperCase();
    if (st === "RECORD" || st === "RECORDING") el.style.color = "#d83434ff";
    else if (st === "READY" || st === "SETUP" || st === "ANNOUNCE") el.style.color = "#17a2b8";
    else if (st === "PAUSE" || st === "SQUELCH") el.style.color = "#ffc107";
    else if (st === "TEARDOWN" || st === "ERROR") el.style.color = "#e95921ff";
    else el.style.color = "#6c757d";
  }


}
function setRecorderStatus(el, state) {
  if (!el) return;

  el.textContent = state || "UNKNOWN";
  el.className = "fw-semibold";

  // สีตามสถานะ (ปรับได้ตามใจ)
  if (state === "RECORD" || state === "RECORDING") {
    el.style.color = "#28a745"; // เขียว
  } else if (state === "READY" || state === "ANNOUNCE" || state === "SETUP") {
    el.style.color = "#17a2b8"; // ฟ้า (พร้อม)
  } else if (state === "PAUSE" || state === "SQUELCH") {
    el.style.color = "#ffc107"; // เหลือง
  } else if (state === "TEARDOWN" || state === "ERROR") {
    el.style.color = "#dc3545"; // แดง
  } else {
    el.style.color = "#6c757d"; // เทา (IDLE/อื่นๆ)
  }
}

function getStatusElementByIGateID(iGateID) {
  // iGateID 1-4 = Recorder 1, iGateID 5-8 = Recorder 2
  let recIndex = 1;
  let streamIndex = iGateID;

  if (iGateID >= 5) {
    recIndex = 2;
    streamIndex = iGateID - 4;
  }

  // id ที่คุณใช้ใน receiverStatus branch
  const elId = `status${recIndex}_${streamIndex}`;
  return document.getElementById(elId);
}



// Utility: convert CIDR to netmask
function cidrToNetmask(cidr) {
    const mask = [];
    let bits = parseInt(cidr, 10);
    for (let i = 0; i < 4; i++) {
        if (bits >= 8) {
            mask.push(255);
            bits -= 8;
        } else {
            mask.push(256 - Math.pow(2, 8 - bits));
            bits = 0;
        }
    }
    return mask.join('.');
}
function applyNetwork(index) {
    var iface;
    if(index === 0){
        iface = "enP8p1s0";
    }else if(index === 1){
        iface = "enP1p1s0";
    }
    else if(index === 2){
        iface = "end0";
    }
    else if(index === 3){
        iface = "end1";
    }

    const ip = document.getElementById("ipaddress" + index).value.trim();
    const netmask = document.getElementById("netmask" + index).value.trim();
    const gateway = document.getElementById("gateway" + index).value.trim();
    const dns1 = document.getElementById("dns1" + index).value.trim();
    const dns2 = document.getElementById("dns2" + index).value.trim();

    // DHCP method
    const modeLabel = document.getElementById("dhcpmethodLabel" + index).textContent.trim();
    const mode = (modeLabel.toLowerCase() === "automatic") ? "dhcp" : "static";

    // Convert netmask to CIDR
    const cidr = netmaskToCIDR(netmask);
    const ipWithCidr = cidr ? ip + "/" + cidr : ip;

    const data = {
        menuID: "applyNetwork",
        iface: iface,
        mode: mode,
        ip: ipWithCidr,
        gateway: gateway,
        dns: dns1 + (dns2 ? "," + dns2 : "")
    };

    // Send JSON message via WebSocket
    if (ws.readyState == 1){
        ws.send(JSON.stringify(data));
        ModalCustomAlert("Setting up Network..."); 
    }else{
        alertConnection(); 
    }
}

// Helper: Convert netmask to CIDR bits
function netmaskToCIDR(mask) {
    const parts = mask.split('.').map(Number);
    let bits = 0;
    for (let part of parts) {
        bits += ((part >>> 0).toString(2).match(/1/g) || []).length;
    }
    return bits;
}

function setDHCP(ethIndex,value)
{
  phyNetworkNameEl = document.getElementById("DeviceName"+ethIndex);
  dhcpmethodEl = document.getElementById("dhcpmethod"+ethIndex);
  dhcpmethodLabel = document.getElementById("dhcpmethodLabel"+ethIndex);
  ipaddressEl = document.getElementById("ipaddress"+ethIndex)
  ipaddressE1El = document.getElementById("ipaddressE1"+ethIndex)
  netmaskEl = document.getElementById("netmask"+ethIndex)
  gatewayEl = document.getElementById("gateway"+ethIndex)
  dns1El = document.getElementById("dns1"+ethIndex)
  dns2El = document.getElementById("dns2"+ethIndex)

  phyNetworkName = phyNetworkNameEl.innerHTML;
  if ((value == "on") || (value == "Automatic"))
  {
    dhcpmethodLabel.innerHTML = "Automatic" ;
    dhcpmethodEl.value = "on";
    dhcpmethod = "on";
  }
  else
  {
    dhcpmethodLabel.innerHTML = "Static" ;
    dhcpmethodEl.value = "off";
    dhcpmethod = "off";
  }

  if (dhcpmethod == 'on')
  {
    ipaddressEl.disabled = true;
    ipaddressE1El.disabled = false;
    netmaskEl.disabled = true;
    gatewayEl.disabled = true;
    dns1El.disabled = true;
    dns2El.disabled = true;
  }
  else
  {
    ipaddressEl.disabled = false;
    ipaddressE1El.disabled = false;
    netmaskEl.disabled = false;
    gatewayEl.disabled = false;
    dns1El.disabled = false;
    dns2El.disabled = false;    
  }
}

function ModalCustomAlertReload(text)
{
    document.getElementById("ModalCustomTextAlert").innerHTML = text;
    let name = "ModalCustomAlertReload";
    let modal = null;

    if (!modal) {
      var modalElement = document.getElementById(name);
      modal = new bootstrap.Modal(modalElement);
    }
    modal.show();
}

function ModalCustomAlert(text)
{
    document.getElementById("textAlert").innerHTML = text;
    let name = "ModalCustomAlert";
    let modal = null;

    if (!modal) {
      var modalElement = document.getElementById(name);
      modal = new bootstrap.Modal(modalElement);
    }
    modal.show();
}
function alertConnection()
{
    let name = "ModalAlert";
    let modal = null;

    if (!modal) {
      var modalElement = document.getElementById(name);
      modal = new bootstrap.Modal(modalElement);
    }
    modal.show();
}
function confirmToRebootSystem(){
  var jsonMessage = '{"menuID":"rebootSystem"}';
  if (ws.readyState == 1)
  {
      ws.send(jsonMessage);
      ModalCustomAlert("Restarting..."); 
  }
  else
  {
    alertConnection(); 
  }
}

function updateNTPServer(){
  var ntpServer1 = document.getElementById("ntpserver1").value;
  var ntpServer2 = document.getElementById("ntpserver2").value;
  var ntpServer3 = document.getElementById("ntpserver3").value;
  var ntpServer4 = document.getElementById("ntpserver4").value;
  let ntpserver = "";
  if (ntpServer1 != "") ntpserver = ntpServer1;
  if (ntpServer2 != ""){
    if (ntpserver != "")
      ntpserver += " " + ntpServer2;
    else
      ntpserver += ntpServer2;
  }
  if (ntpServer3 != ""){
    if (ntpserver != "")
      ntpserver += " " + ntpServer3;
    else
      ntpserver += ntpServer3;
  }
  if (ntpServer4 != ""){
    if (ntpserver != "")
      ntpserver += " " + ntpServer4;
    else
      ntpserver += ntpServer4;
  }
  var jsonMessage = '{"menuID":"updateNTPServer", "ntpServer":"' + ntpserver +'"}';
  if (ws.readyState == 1){
    ws.send(jsonMessage);
    ModalCustomAlert("Setting up NTP..."); 
  }else{
    alertConnection(); 
  }
}

function setNtpMode(index, mode) {
  var labelEl = document.getElementById("ntpmodeLabel" + index);
  var buttonEl = document.getElementById("ntpmode" + index);
  var autoEl = document.getElementById("ntpAutoFields" + index);
  var manualEl = document.getElementById("ntpManualFields" + index);
  var normalized = String(mode || "").toLowerCase();
  var isManual = normalized === "manual";

  if (labelEl) {
    labelEl.textContent = isManual ? "Manual" : "Automatic";
  }
  if (buttonEl) {
    buttonEl.value = isManual ? "Manual" : "Automatic";
  }
  if (autoEl) {
    autoEl.style.display = isManual ? "none" : "block";
  }
  if (manualEl) {
    manualEl.style.display = isManual ? "block" : "none";
  }
}

function applyNtpServer(index) {
  function readValue(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function sendTimezoneIfAvailable() {
    var timezone = readValue("ntptimezone" + index) || readValue("LocationList");
    if (!timezone) {
      return;
    }
    var tzMessage = '{"menuID":"setLocation", "location":"' + timezone + '"}';
    ws.send(tzMessage);
  }

  var modeLabel = document.getElementById("ntpmodeLabel" + index);
  var modeText = modeLabel ? modeLabel.textContent.trim().toLowerCase() : "automatic";
  if (modeText === "manual") {
    var manualTime = readValue("ntpmanual" + index) || readValue("startdate");
    if (!manualTime) {
      ModalCustomAlert("Please enter date/time.");
      return;
    }
    var manualMessage = '{"menuID":"updateTime", "dateTime":"' + manualTime + '"}';
    if (ws.readyState == 1){
      ws.send(manualMessage);
      sendTimezoneIfAvailable();
      ModalCustomAlert("Setting up time..."); 
    }else{
      alertConnection(); 
    }
    return;
  }

  var ntpServer1 = readValue("ntpserver" + index + "_1") || readValue("ntpserver" + index + "_primary") || readValue("ntpserver1");
  var ntpServer2 = readValue("ntpserver" + index + "_2") || readValue("ntpserver" + index + "_secondary") || readValue("ntpserver2");
  var ntpServer3 = readValue("ntpserver" + index + "_3") || readValue("ntpserver3");
  var ntpServer4 = readValue("ntpserver" + index + "_4") || readValue("ntpserver4");

  var ntpList = [ntpServer1, ntpServer2, ntpServer3, ntpServer4].filter(Boolean);
  var jsonMessage = '{"menuID":"updateNTPServer", "ntpServer":"' + ntpList.join(" ") + '"}';
  if (ws.readyState == 1){
    console.log("jsonMessage",jsonMessage)
    ws.send(jsonMessage);
    sendTimezoneIfAvailable();
    ModalCustomAlert("Setting up NTP..."); 
  }else{
    alertConnection(); 
  }
}

function setLocation(){
  var location = document.getElementById("LocationList").value;
  var jsonMessage = '{"menuID":"setLocation", "location":"' + location +'"}';
  if (ws.readyState == 1){
    ws.send(jsonMessage);
    ModalCustomAlert("Setting up Time Location..."); 
  }else{
    alertConnection(); 
  }
}

function loadTimezoneLocations() {
  var selectEl = document.getElementById("LocationList");
  var tzInputEl = document.getElementById("ntptimezone0");
  var tzIsSelect = tzInputEl && tzInputEl.tagName && tzInputEl.tagName.toLowerCase() === "select";
  if (!selectEl && !tzInputEl) {
    return;
  }
  if (typeof fetch !== "function") {
    return;
  }

  fetch("timezone.php?format=json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      return response.json();
    })
    .then(function (locations) {
      if (!Array.isArray(locations)) {
        return;
      }

      if (selectEl) {
        var currentValue = selectEl.value;
        selectEl.innerHTML = "";
        locations.forEach(function (loc) {
          var option = document.createElement("option");
          option.value = loc;
          option.textContent = loc;
          selectEl.appendChild(option);
        });
        if (currentValue) {
          selectEl.value = currentValue;
        }
      }

      if (tzInputEl) {
        if (tzIsSelect) {
          var tzCurrentValue = tzInputEl.dataset.pendingValue || tzInputEl.value;
          tzInputEl.innerHTML = "";
          locations.forEach(function (loc) {
            var option = document.createElement("option");
            option.value = loc;
            option.textContent = loc;
            tzInputEl.appendChild(option);
          });
          if (tzCurrentValue) {
            tzInputEl.value = tzCurrentValue;
          }
          if (tzInputEl.dataset.pendingValue) {
            delete tzInputEl.dataset.pendingValue;
          }
          return;
        }

        var listId = tzInputEl.getAttribute("list") || "timezoneList0";
        var dataListEl = document.getElementById(listId);
        if (!dataListEl) {
          dataListEl = document.createElement("datalist");
          dataListEl.id = listId;
          tzInputEl.setAttribute("list", listId);
          if (tzInputEl.parentNode) {
            tzInputEl.parentNode.appendChild(dataListEl);
          } else {
            document.body.appendChild(dataListEl);
          }
        }
        dataListEl.innerHTML = "";
        locations.forEach(function (loc) {
          var option = document.createElement("option");
          option.value = loc;
          dataListEl.appendChild(option);
        });
      }
    })
    .catch(function (err) {
      console.warn("Failed to load timezone list:", err);
    });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadTimezoneLocations);
} else {
  loadTimezoneLocations();
}

function updateTime(){
  var startdate = document.getElementById("startdate").value;
  var jsonMessage = '{"menuID":"updateTime", "dateTime":"' + startdate +'"}';
  if (ws.readyState == 1){
    ws.send(jsonMessage);
    ModalCustomAlert("Setting up..."); 
  }else{
    alertConnection(); 
  }
}

function updateSigSense(){
  var adcRemoteAddress = document.getElementById("adcRemoteAddress").value;
  var jsonMessage = '{"objectName":"adcRemoteAddress", "value":"' + adcRemoteAddress +'"}';
  if (ws.readyState == 1){
    ws.send(jsonMessage);
    ModalCustomAlert("Setting up..."); 
  }else{
    alertConnection(); 
  }
}

function updateController(){
  var plcServerAddress = document.getElementById("plcServerAddress").value;
  var jsonMessage = '{"objectName":"plcServerAddress", "value":"' + plcServerAddress +'"}';
  if (ws.readyState == 1){
    ws.send(jsonMessage);
    ModalCustomAlert("Setting up..."); 
  }else{
    alertConnection(); 
  }
}

function datetimeMethod(){
  if (document.getElementById("dateTimeMethod")){
    var dateTimeMethod = document.getElementById("dateTimeMethod").value;
  //  console.debug(node1Type);
    if (dateTimeMethod == 0){
      document.getElementById("divManual").style.display = "none";
      document.getElementById("divNTP").style.display = "none";
    }else if (dateTimeMethod == 2){
      document.getElementById("divManual").style.display = "contents";
      document.getElementById("divNTP").style.display = "none";
    }else if (dateTimeMethod == 1){
      document.getElementById("divManual").style.display = "none";
      document.getElementById("divNTP").style.display = "contents";
    }
  }
}


function systemupdate(){
  var jsonMessage = '{"menuID":"updateFirmware"}';
  if (ws.readyState == 1){
    ws.send(jsonMessage);
    ModalCustomAlert("System update don't turn off your device"); 
  }
  else
  {
    alertConnection(); 
  }
}
function showFileUpdate()
{
  document.getElementById("updateButton").style.display = "block";
}
function showRestoreDiv()
{
  document.getElementById("restoreDiv").style.display = "block";
}

function systembackup(){
  var jsonMessage = '{"menuID":"systembackup"}';
  if (ws.readyState == 1){
    ws.send(jsonMessage);
    setTimeout(() => {location.reload();}, 500);
  }
  else
  {
    alertConnection(); 
  }
}

function systemrestore(){
  var jsonMessage = '{"menuID":"systemrestore"}';
  if (ws.readyState == 1){
    var r = confirm("please confirm to restore!");
    if (r == true) {
      ws.send(jsonMessage);
    }else{
      
    }
  }
  else
  {
    alertConnection(); 
  }
}

function datetimeMethod(){
  var dateTimeMethod = document.getElementById("dateTimeMethod").value;
  if (dateTimeMethod == 0){
    document.getElementById("divManual").style.display = "none";
    document.getElementById("divNTP").style.display = "none";
  }else if (dateTimeMethod == 2){
    document.getElementById("divManual").style.display = "contents";
    document.getElementById("divNTP").style.display = "none";
  }else if (dateTimeMethod == 1){
    document.getElementById("divManual").style.display = "none";
    document.getElementById("divNTP").style.display = "contents";
  }
}

function systembackup(){
  var jsonMessage = '{"menuID":"systembackup"}';
  if (ws.readyState == 1){
    ws.send(jsonMessage);
    setTimeout(() => {location.reload();}, 500);
  }
  else
  {
    alert("Connection is closed...");
  }
}

function systemrestore(){
  var jsonMessage = '{"menuID":"systemrestore"}';
  if (ws.readyState == 1){
    var r = confirm("please confirm to restore!");
    if (r == true) {
      ws.send(jsonMessage);
    }else{
      
    }
  }
  else
  {
    alert("Connection is closed...");
  }
}

function locationreloadDevice(roleID, deviceDescription, method='post') {
  const form = document.createElement('form');
  form.method = method;

  const hiddenField = document.createElement('input');
  hiddenField.type = 'hidden';
  hiddenField.name = "roleID";
  hiddenField.value = roleID;

  form.appendChild(hiddenField);

  if(deviceDescription != ""){
    const deviceName = document.createElement('input');
    deviceName.type = 'hidden';
    deviceName.name = "deviceName";
    deviceName.value = deviceDescription;
    form.appendChild(deviceName);
  }

  console.log(roleID,deviceDescription)

  document.body.appendChild(form);
  form.action = "index.php";
  form.submit();
}

function applyRecSettings(iGateID,recID) {
  // The UI renders only one set of inputs with suffix `_1`.
  // Always read DOM elements using that index, while using `recID`
  // to address the target REC in the payload.
  const domIndex = 1;
  // Get elements
  const iGate1UriEl = document.getElementById(`iGate1_uri_${domIndex}`);
  const iGate2UriEl = document.getElementById(`iGate2_uri_${domIndex}`);
  const recoreder1UriEl = document.getElementById(`recoreder1_uri_${domIndex}`);
  const recoreder2UriEl = document.getElementById(`recoreder2_uri_${domIndex}`);
  const recorder1El = document.getElementById(`recorder1_${domIndex}`);
  const recorder2El = document.getElementById(`recorder2_${domIndex}`);
  console.log("Applying recorder settings for iGateID:", iGateID, "recID:", recID);
  // Check required elements
  if (!iGate1UriEl || !iGate2UriEl || !recoreder1UriEl || !recoreder2UriEl || !recorder1El || !recorder2El) {
    alert("Error: Some form elements are missing. Please check the page.");
    console.error("Missing elements:", {
        iGate1_uri: !iGate1UriEl,
        iGate2_uri: !iGate2UriEl,
        recoreder1_uri: !recoreder1UriEl,
        recoreder2_uri: !recoreder2UriEl,
        recorder1: !recorder1El,
        recorder2: !recorder2El
    });
    return;
  }

  // Get frequency from global variable (stored from WebSocket)
  // recID=1 -> REC_1 (recin1) uses recFrequency[0]
  // recID=2 -> REC_2 (recin2) uses recFrequency[1]
  let freq = recFrequency[(recID == 1) ? 0 : 1] || 0;
  console.log("Using frequency for recID", recID, ":", freq);

    // Parse iGate1_uri_X
let iGate1Uri = iGate1UriEl.value;
let iGate2Uri = iGate2UriEl.value;
    let rtsp_server_uri1 = "";
    let client_as_ip1 = "";
	let rtsp_server_uri2 = "";
    let client_as_ip2 = "";
    if (iGate1Uri.includes("@")) {
        let parts = iGate1Uri.split("@");
        rtsp_server_uri1 = parts[0] || "";
        client_as_ip1 = parts[1] || "";
    }
    if (iGate2Uri.includes("@")) {
        let parts = iGate2Uri.split("@");
        rtsp_server_uri2 = parts[0] || "";
        client_as_ip2 = parts[1] || "";
    }
    // Parse recoreder1_uri_X → ip:port
    let recoreder1_uri = recoreder1UriEl.value;
	let recoreder2_uri = recoreder2UriEl.value;
    let rtsp_server_ip1 = "";
    let rtsp_server_port1 = 0;
	let rtsp_server_ip2 = "";
    let rtsp_server_port2 = 0;

    if (recoreder1_uri.includes(":")) {
        let parts = recoreder1_uri.split(":");
        rtsp_server_ip1 = parts[0] || "";
        rtsp_server_port1 = parseInt(parts[1]) || 0;
    }
	if (recoreder2_uri.includes(":")) {
        let parts = recoreder2_uri.split(":");
        rtsp_server_ip2 = parts[0] || "";
        rtsp_server_port2 = parseInt(parts[1]) || 0;
    }

    // Match desired format: REC_1 (recin1), REC_2 (recin2)
  // applyRecSettings(0,1) -> iGateID=0, recID=1 -> send REC_1
  // applyRecSettings(1,2) -> iGateID=1, recID=2 -> send REC_2
  let recKey, recObj;
  
  if (recID == 1) {
    // Recorder 1 (REC_1, recin1)
    recKey = "REC_1";
    recObj = {
      alsa_dev: "recin1",
      client_as_ip: client_as_ip1,
      client_as_freq: freq,
      rtsp_server_ip: rtsp_server_ip1,
      rtsp_server_port: rtsp_server_port1,
      rtsp_server_uri: rtsp_server_uri1,
      service: "iGateRec@1.service",
      enable: recorder1El.checked
    };
  } else if (recID == 2) {
    // Recorder 2 (REC_2, recin2)
    recKey = "REC_2";
    recObj = {
      alsa_dev: "recin2",
      client_as_ip: client_as_ip2,
      client_as_freq: freq,
      rtsp_server_ip: rtsp_server_ip2,
      rtsp_server_port: rtsp_server_port2,
      rtsp_server_uri: rtsp_server_uri2,
      service: "iGateRec@2.service",
      enable: recorder2El.checked
    };
  }

  let payload = {
    menuID: "applyRecSettings"
  };
  if (recKey && recObj) {
    payload[recKey] = recObj;
  }

  console.log("Payload to backend:", payload);

  if (ws && ws.readyState == 1){
    var r = confirm("please confirm to apply setting.");
    if (r == true) {
      ws.send(JSON.stringify(payload));
    }else{
      
    }
  }else{
    alert("Connection is closed...");
  }
}




// var currentID = -1;
// var wsUri1, wsUri2;
// var ws1, ws2; // Two WebSocket connections
// var ws; // Keep for backward compatibility
// var currentSoftPhoneID = 1;
// var userID = 0;

// // Store frequency values from AlsaRecConfigManager
// var recFrequency = {}; // { iGateID: freq }
// // WebSocketTest();
// function WebSocketTest() {

//   if ("WebSocket" in window) {
//      // WebSocket 1: Port 8072 (เดิม)
//      wsUri1 = "ws://" + location.host + ":8072";
//      ws1 = new WebSocket(wsUri1);
//      ws = ws1; // Default to ws1 for backward compatibility

//      ws1.onopen = function() {
//       console.log("WebSocket 1 (port 8072) connected");
//       ws1.send('{"menuID":"getSystemPage"}');
//      };

//      ws1.onmessage = function (evt) { 
//       var received_msg = evt.data;
//       console.log("WS1 (8072) received:", received_msg);
//       processMsg(received_msg);
//      };

//      ws1.onclose = function() { 
//       console.log("WebSocket 1 (port 8072) closed");
//       alertConnection(); 
//      };

//      ws1.onerror = function(error) {
//       console.error("WebSocket 1 error:", error);
//      };

//      // WebSocket 2: Port 1235 (ใหม่)
//      wsUri2 = "ws://" + location.host + ":8049";
//      ws2 = new WebSocket(wsUri2);

//      ws2.onopen = function() {
//       console.log("WebSocket 2 (port 8049) connected");
//       // ws2.send('{"menuID":"getSystemPageWeb"}');
//       ws2.send('{"menuID":"getVuMeter"}');
//       ws2.send('{"menuID":"getServerHomePage", "iGateNum":1}');
//       ws2.send('{"menuID":"getServerHomePage", "iGateNum":2}');
//       ws2.send('{"menuID":"getServerHomePage", "iGateNum":3}');
//       ws2.send('{"menuID":"getServerHomePage", "iGateNum":4}');
//      };

//      ws2.onmessage = function (evt) { 
//       var received_msg = evt.data;
//       console.log("WS2 (8049) received:", received_msg);
//       processMsg(received_msg);
//      };

//      ws2.onclose = function() { 
//       console.log("WebSocket 2 (port 8049) closed");
//      };

//      ws2.onerror = function(error) {
//       console.error("WebSocket 2 error:", error);
//      };

//   } else {
//      // The browser doesn't support WebSocket
//      alert("WebSocket NOT supported by your Browser!");
//   }
// }

// // Helper functions to send to specific WebSocket
// function sendToWS1(message) {
//   if (ws1 && ws1.readyState === 1) {
//     ws1.send(message);
//     return true;
//   } else {
//     console.error("WebSocket 1 (port 8072) is not connected");
//     return false;
//   }
// }

// function sendToWS2(message) {
//   if (ws2 && ws2.readyState === 1) {
//     ws2.send(message);
//     return true;
//   } else {
//     console.error("WebSocket 2 (port 8049) is not connected");
//     return false;
//   }
// }

// // Helper function to send to both WebSockets
// function sendToBothWS(message) {
//   const sent1 = sendToWS1(message);
//   const sent2 = sendToWS2(message);
//   return sent1 || sent2;
// }

// function processMsg(message)
// {  
  
//   var obj = JSON.parse(message);
//   if(obj.menuID == "broadcastLocalTime")
//   {
//     document.getElementById("currentTime").innerHTML = obj.currentTime;
//     document.getElementById("currentDate").innerHTML = obj.currentDate;
//   }
//   else if(obj.menuID == "system")
//   {
//     if (document.getElementById("swversion"))
//       document.getElementById("swversion").value = obj.SwVersion;
//   }
//   else if (obj.menuID === "network") {
//     // Assume this is for eth0 (index 0)

//     // Split IP and netmask
//     const ipParts = obj.ip.split('/');
//     const ipAddr = ipParts[0];
//     const netmask = (ipParts.length > 1) ? cidrToNetmask(ipParts[1]) : '';

//     document.getElementById("ipaddress0").value = ipAddr;
//     document.getElementById("netmask0").value = netmask;
//     document.getElementById("gateway0").value = obj.gateway || '';
//     document.getElementById("dns10").value = obj.dns || '';
//     document.getElementById("dns20").value = obj.dns2 || '';

//     // Set DHCP mode label
//     const dhcpLabel = document.getElementById("dhcpmethodLabel0");
//     if (dhcpLabel && obj.mode) {
//         dhcpLabel.textContent = (obj.mode === "static") ? "Static" : "Automatic";
//     }
//   } 
//   else if (obj.object === "receiverStatus") {
//     // Handle receiver status messages
//     // {"device":"recin1","frequency":0,"object":"receiverStatus","recorder":"enable","squelch":"off"}
//     console.log("Receiver Status:", obj);
    
//     // Map device to status element
//     const deviceMap = {
//       "recin1": "status1_1",  // Recorder 1
//       "recin2": "status2_1"   // Recorder 2
//     };
    
//     const statusId = deviceMap[obj.device];
//     if (statusId) {
//       const statusEl = document.getElementById(statusId);
//       if (statusEl) {
//         // Determine status based on recorder and squelch
//         let status = "IDLE";
//         if (obj.recorder === "enable") {
//           status = (obj.squelch === "on") ? "SQUELCH" : "RECORDING";
//         }
//         statusEl.textContent = status;
        
//         // Optional: Add color coding
//         statusEl.className = "fw-semibold";
//         if (status === "RECORDING") {
//           statusEl.style.color = "#28a745"; // Green
//         } else if (status === "SQUELCH") {
//           statusEl.style.color = "#ffc107"; // Yellow
//         } else {
//           statusEl.style.color = "#6c757d"; // Gray
//         }
//       }
//     }
//   }
//   else if (obj.menuID == "AlsaRecConfigManager"){
// 		//{"RecID":0,"alsa_dev":"recin1","enable":false,"iGateFreq":885.5,"iGateURI":"10.0.23.1@10.0.23.1","menuID":"AlsaRecConfigManager","recURI":"igate@192.168.10.30:554"}
// 		var RecID = obj.RecID;
//     console.log("Processing AlsaRecConfigManager for RecID:", RecID, obj);

//     // Handle RecID = 0 as RecID = 1 (first iGate)
//     if (RecID === 0) {
//         RecID = 1;
//     }
    
//     // Store frequency in global variable
//     if (obj.iGateFreq !== undefined) {
//         recFrequency[RecID] = obj.iGateFreq;
//     }
    
// 		if ((RecID >= 1) && (RecID <=4)){
// 			const recoreder1UriEl = document.getElementById("recoreder1_uri_"+RecID);
// 			const iGate1UriEl = document.getElementById("iGate1_uri_"+RecID);
// 			const recorder1El = document.getElementById("recorder1_"+RecID);
// 			const freqEl = document.getElementById("frequency_"+RecID);
			
// 			if (recoreder1UriEl) recoreder1UriEl.value = obj.recURI;
// 			if (iGate1UriEl) iGate1UriEl.value = obj.iGateURI;
// 			if (recorder1El) recorder1El.checked = obj.enable;
// 			if (freqEl && obj.iGateFreq !== undefined) {
// 				freqEl.value = obj.iGateFreq;
// 			}
// 		}
//  		else if ((RecID >= 5) && (RecID <=8)){
// 			RecID = RecID-4;
// 			const recoreder2UriEl = document.getElementById("recoreder2_uri_"+RecID);
// 			const iGate2UriEl = document.getElementById("iGate2_uri_"+RecID);
// 			const recorder2El = document.getElementById("recorder2_"+RecID);
// 			const freqEl = document.getElementById("frequency_"+RecID);
			
// 			if (recoreder2UriEl) recoreder2UriEl.value = obj.recURI;
// 			if (iGate2UriEl) iGate2UriEl.value = obj.iGateURI;
// 			if (recorder2El) recorder2El.checked = obj.enable;
// 			if (freqEl && obj.iGateFreq !== undefined) {
// 				freqEl.value = obj.iGateFreq;
// 			}
// 		}
		

// 	}

// }
// // Utility: convert CIDR to netmask
// function cidrToNetmask(cidr) {
//     const mask = [];
//     let bits = parseInt(cidr, 10);
//     for (let i = 0; i < 4; i++) {
//         if (bits >= 8) {
//             mask.push(255);
//             bits -= 8;
//         } else {
//             mask.push(256 - Math.pow(2, 8 - bits));
//             bits = 0;
//         }
//     }
//     return mask.join('.');
// }
// function applyNetwork(index) {
//     const iface = (index === 0) ? "bond0" : "eth" + index;

//     const ip = document.getElementById("ipaddress" + index).value.trim();
//     const netmask = document.getElementById("netmask" + index).value.trim();
//     const gateway = document.getElementById("gateway" + index).value.trim();
//     const dns1 = document.getElementById("dns1" + index).value.trim();
//     const dns2 = document.getElementById("dns2" + index).value.trim();

//     // DHCP method
//     const modeLabel = document.getElementById("dhcpmethodLabel" + index).textContent.trim();
//     const mode = (modeLabel.toLowerCase() === "automatic") ? "dhcp" : "static";

//     // Convert netmask to CIDR
//     const cidr = netmaskToCIDR(netmask);
//     const ipWithCidr = cidr ? ip + "/" + cidr : ip;

//     const data = {
//         menuID: "applyNetwork",
//         iface: iface,
//         mode: mode,
//         ip: ipWithCidr,
//         gateway: gateway,
//         dns: dns1 + (dns2 ? "," + dns2 : "")
//     };

//     // Send JSON message via WebSocket
//     if (ws.readyState == 1){
//         ws.send(JSON.stringify(data));
//         ModalCustomAlert("Setting up Network..."); 
//     }else{
//         alertConnection(); 
//     }
// }

// // Helper: Convert netmask to CIDR bits
// function netmaskToCIDR(mask) {
//     const parts = mask.split('.').map(Number);
//     let bits = 0;
//     for (let part of parts) {
//         bits += ((part >>> 0).toString(2).match(/1/g) || []).length;
//     }
//     return bits;
// }

// function setDHCP(ethIndex,value)
// {
//   phyNetworkNameEl = document.getElementById("DeviceName"+ethIndex);
//   dhcpmethodEl = document.getElementById("dhcpmethod"+ethIndex);
//   dhcpmethodLabel = document.getElementById("dhcpmethodLabel"+ethIndex);
//   ipaddressEl = document.getElementById("ipaddress"+ethIndex)
//   ipaddressE1El = document.getElementById("ipaddressE1"+ethIndex)
//   netmaskEl = document.getElementById("netmask"+ethIndex)
//   gatewayEl = document.getElementById("gateway"+ethIndex)
//   dns1El = document.getElementById("dns1"+ethIndex)
//   dns2El = document.getElementById("dns2"+ethIndex)

//   phyNetworkName = phyNetworkNameEl.innerHTML;
//   if ((value == "on") || (value == "Automatic"))
//   {
//     dhcpmethodLabel.innerHTML = "Automatic" ;
//     dhcpmethodEl.value = "on";
//     dhcpmethod = "on";
//   }
//   else
//   {
//     dhcpmethodLabel.innerHTML = "Static" ;
//     dhcpmethodEl.value = "off";
//     dhcpmethod = "off";
//   }

//   if (dhcpmethod == 'on')
//   {
//     ipaddressEl.disabled = true;
//     ipaddressE1El.disabled = false;
//     netmaskEl.disabled = true;
//     gatewayEl.disabled = true;
//     dns1El.disabled = true;
//     dns2El.disabled = true;
//   }
//   else
//   {
//     ipaddressEl.disabled = false;
//     ipaddressE1El.disabled = false;
//     netmaskEl.disabled = false;
//     gatewayEl.disabled = false;
//     dns1El.disabled = false;
//     dns2El.disabled = false;    
//   }
// }

// function ModalCustomAlertReload(text)
// {
//     document.getElementById("ModalCustomTextAlert").innerHTML = text;
//     let name = "ModalCustomAlertReload";
//     let modal = null;

//     if (!modal) {
//       var modalElement = document.getElementById(name);
//       modal = new bootstrap.Modal(modalElement);
//     }
//     modal.show();
// }

// function ModalCustomAlert(text)
// {
//     document.getElementById("textAlert").innerHTML = text;
//     let name = "ModalCustomAlert";
//     let modal = null;

//     if (!modal) {
//       var modalElement = document.getElementById(name);
//       modal = new bootstrap.Modal(modalElement);
//     }
//     modal.show();
// }
// function alertConnection()
// {
//     let name = "ModalAlert";
//     let modal = null;

//     if (!modal) {
//       var modalElement = document.getElementById(name);
//       modal = new bootstrap.Modal(modalElement);
//     }
//     modal.show();
// }
// function confirmToRebootSystem(){
//   var jsonMessage = '{"menuID":"rebootSystem"}';
//   if (ws.readyState == 1)
//   {
//       ws.send(jsonMessage);
//       ModalCustomAlert("Restarting..."); 
//   }
//   else
//   {
//     alertConnection(); 
//   }
// }

// function updateNTPServer(){
//   var ntpServer1 = document.getElementById("ntpserver1").value;
//   var ntpServer2 = document.getElementById("ntpserver2").value;
//   var ntpServer3 = document.getElementById("ntpserver3").value;
//   var ntpServer4 = document.getElementById("ntpserver4").value;
//   let ntpserver = "";
//   if (ntpServer1 != "") ntpserver = ntpServer1;
//   if (ntpServer2 != ""){
//     if (ntpserver != "")
//       ntpserver += " " + ntpServer2;
//     else
//       ntpserver += ntpServer2;
//   }
//   if (ntpServer3 != ""){
//     if (ntpserver != "")
//       ntpserver += " " + ntpServer3;
//     else
//       ntpserver += ntpServer3;
//   }
//   if (ntpServer4 != ""){
//     if (ntpserver != "")
//       ntpserver += " " + ntpServer4;
//     else
//       ntpserver += ntpServer4;
//   }
//   var jsonMessage = '{"menuID":"updateNTPServer", "ntpServer":"' + ntpserver +'"}';
//   if (ws.readyState == 1){
//     ws.send(jsonMessage);
//     ModalCustomAlert("Setting up NTP..."); 
//   }else{
//     alertConnection(); 
//   }
// }

// function setLocation(){
//   var location = document.getElementById("LocationList").value;
//   var jsonMessage = '{"menuID":"setLocation", "location":"' + location +'"}';
//   if (ws.readyState == 1){
//     ws.send(jsonMessage);
//     ModalCustomAlert("Setting up Time Location..."); 
//   }else{
//     alertConnection(); 
//   }
// }

// function updateTime(){
//   var startdate = document.getElementById("startdate").value;
//   var jsonMessage = '{"menuID":"updateTime", "dateTime":"' + startdate +'"}';
//   if (ws.readyState == 1){
//     ws.send(jsonMessage);
//     ModalCustomAlert("Setting up..."); 
//   }else{
//     alertConnection(); 
//   }
// }

// function updateSigSense(){
//   var adcRemoteAddress = document.getElementById("adcRemoteAddress").value;
//   var jsonMessage = '{"objectName":"adcRemoteAddress", "value":"' + adcRemoteAddress +'"}';
//   if (ws.readyState == 1){
//     ws.send(jsonMessage);
//     ModalCustomAlert("Setting up..."); 
//   }else{
//     alertConnection(); 
//   }
// }

// function updateController(){
//   var plcServerAddress = document.getElementById("plcServerAddress").value;
//   var jsonMessage = '{"objectName":"plcServerAddress", "value":"' + plcServerAddress +'"}';
//   if (ws.readyState == 1){
//     ws.send(jsonMessage);
//     ModalCustomAlert("Setting up..."); 
//   }else{
//     alertConnection(); 
//   }
// }

// function datetimeMethod(){
//   if (document.getElementById("dateTimeMethod")){
//     var dateTimeMethod = document.getElementById("dateTimeMethod").value;
//   //  console.debug(node1Type);
//     if (dateTimeMethod == 0){
//       document.getElementById("divManual").style.display = "none";
//       document.getElementById("divNTP").style.display = "none";
//     }else if (dateTimeMethod == 2){
//       document.getElementById("divManual").style.display = "contents";
//       document.getElementById("divNTP").style.display = "none";
//     }else if (dateTimeMethod == 1){
//       document.getElementById("divManual").style.display = "none";
//       document.getElementById("divNTP").style.display = "contents";
//     }
//   }
// }


// function systemupdate(){
//   var jsonMessage = '{"menuID":"updateFirmware"}';
//   if (ws.readyState == 1){
//     ws.send(jsonMessage);
//     ModalCustomAlert("System update don't turn off your device"); 
//   }
//   else
//   {
//     alertConnection(); 
//   }
// }
// function showFileUpdate()
// {
//   document.getElementById("updateButton").style.display = "block";
// }
// function showRestoreDiv()
// {
//   document.getElementById("restoreDiv").style.display = "block";
// }

// function systembackup(){
//   var jsonMessage = '{"menuID":"systembackup"}';
//   if (ws.readyState == 1){
//     ws.send(jsonMessage);
//     setTimeout(() => {location.reload();}, 500);
//   }
//   else
//   {
//     alertConnection(); 
//   }
// }

// function systemrestore(){
//   var jsonMessage = '{"menuID":"systemrestore"}';
//   if (ws.readyState == 1){
//     var r = confirm("please confirm to restore!");
//     if (r == true) {
//       ws.send(jsonMessage);
//     }else{
      
//     }
//   }
//   else
//   {
//     alertConnection(); 
//   }
// }

// function datetimeMethod(){
//   var dateTimeMethod = document.getElementById("dateTimeMethod").value;
//   if (dateTimeMethod == 0){
//     document.getElementById("divManual").style.display = "none";
//     document.getElementById("divNTP").style.display = "none";
//   }else if (dateTimeMethod == 2){
//     document.getElementById("divManual").style.display = "contents";
//     document.getElementById("divNTP").style.display = "none";
//   }else if (dateTimeMethod == 1){
//     document.getElementById("divManual").style.display = "none";
//     document.getElementById("divNTP").style.display = "contents";
//   }
// }

// function systembackup(){
//   var jsonMessage = '{"menuID":"systembackup"}';
//   if (ws.readyState == 1){
//     ws.send(jsonMessage);
//     setTimeout(() => {location.reload();}, 500);
//   }
//   else
//   {
//     alert("Connection is closed...");
//   }
// }

// function systemrestore(){
//   var jsonMessage = '{"menuID":"systemrestore"}';
//   if (ws.readyState == 1){
//     var r = confirm("please confirm to restore!");
//     if (r == true) {
//       ws.send(jsonMessage);
//     }else{
      
//     }
//   }
//   else
//   {
//     alert("Connection is closed...");
//   }
// }

// function locationreloadDevice(roleID, deviceDescription, method='post') {
//   const form = document.createElement('form');
//   form.method = method;

//   const hiddenField = document.createElement('input');
//   hiddenField.type = 'hidden';
//   hiddenField.name = "roleID";
//   hiddenField.value = roleID;

//   form.appendChild(hiddenField);

//   if(deviceDescription != ""){
//     const deviceName = document.createElement('input');
//     deviceName.type = 'hidden';
//     deviceName.name = "deviceName";
//     deviceName.value = deviceDescription;
//     form.appendChild(deviceName);
//   }

//   console.log(roleID,deviceDescription)

//   document.body.appendChild(form);
//   form.action = "index.php";
//   form.submit();
// }

// function applyRecSettings(iGateID,recID) {
//     // Get elements
//     const iGate1UriEl = document.getElementById(`iGate1_uri_${iGateID}`);
//     const iGate2UriEl = document.getElementById(`iGate2_uri_${iGateID}`);
//     const recoreder1UriEl = document.getElementById(`recoreder1_uri_${iGateID}`);
//     const recoreder2UriEl = document.getElementById(`recoreder2_uri_${iGateID}`);
//     const recorder1El = document.getElementById(`recorder1_${iGateID}`);
//     const recorder2El = document.getElementById(`recorder2_${iGateID}`);

//     // Check required elements
//     if (!iGate1UriEl || !iGate2UriEl || !recoreder1UriEl || !recoreder2UriEl || !recorder1El || !recorder2El) {
//         alert("Error: Some form elements are missing. Please check the page.");
//         console.error("Missing elements:", {
//             iGate1_uri: !iGate1UriEl,
//             iGate2_uri: !iGate2UriEl,
//             recoreder1_uri: !recoreder1UriEl,
//             recoreder2_uri: !recoreder2UriEl,
//             recorder1: !recorder1El,
//             recorder2: !recorder2El
//         });
//         return;
//     }

//     // Get frequency from global variable (stored from WebSocket)
//     let freq = recFrequency[iGateID] || 0;
//     console.log("Using frequency from recFrequency["+iGateID+"]:", freq);

//     // Parse iGate1_uri_X
//     let iGate1Uri = iGate1UriEl.value;
// 	let iGate2Uri = iGate2UriEl.value;
//     let rtsp_server_uri1 = "";
//     let client_as_ip1 = "";
// 	let rtsp_server_uri2 = "";
//     let client_as_ip2 = "";
//     if (iGate1Uri.includes("@")) {
//         let parts = iGate1Uri.split("@");
//         rtsp_server_uri1 = parts[0] || "";
//         client_as_ip1 = parts[1] || "";
//     }
//     if (iGate2Uri.includes("@")) {
//         let parts = iGate2Uri.split("@");
//         rtsp_server_uri2 = parts[0] || "";
//         client_as_ip2 = parts[1] || "";
//     }
//     // Parse recoreder1_uri_X → ip:port
//     let recoreder1_uri = recoreder1UriEl.value;
// 	let recoreder2_uri = recoreder2UriEl.value;
//     let rtsp_server_ip1 = "";
//     let rtsp_server_port1 = 0;
// 	let rtsp_server_ip2 = "";
//     let rtsp_server_port2 = 0;

//     if (recoreder1_uri.includes(":")) {
//         let parts = recoreder1_uri.split(":");
//         rtsp_server_ip1 = parts[0] || "";
//         rtsp_server_port1 = parseInt(parts[1]) || 0;
//     }
// 	if (recoreder2_uri.includes(":")) {
//         let parts = recoreder2_uri.split(":");
//         rtsp_server_ip2 = parts[0] || "";
//         rtsp_server_port2 = parseInt(parts[1]) || 0;
//     }

//     // REC_iGateID
//     let recKey1 = `REC_${iGateID}`;
//     let recObj1 = {
//         alsa_dev: `recin2`,
//         client_as_ip: client_as_ip1,
//         client_as_freq: freq,
//         rtsp_server_ip: rtsp_server_ip1,
//         rtsp_server_port: rtsp_server_port1,
//         rtsp_server_uri: rtsp_server_uri1,
//         service: `iGateRec@${iGateID}.service`,
//         enable: recorder1El.checked
//     };

//     // REC_2 for second recorder (not iGateID+4)
//     let recKey2 = `REC_2`;
//     let recObj2 = {
//         alsa_dev: `recin3`,
//         client_as_ip: client_as_ip2,
//         client_as_freq: freq,
//         rtsp_server_ip: rtsp_server_ip2,
//         rtsp_server_port: rtsp_server_port2,
//         rtsp_server_uri: rtsp_server_uri2,
//         service: `iGateRec@2.service`,
//         enable: recorder2El.checked
//     };

//     let payload = {
//         menuID: "applyRecSettings"
//     };
// 	if (recID == 1)
//     	payload[recKey1] = recObj1;
// 	else if (recID == 2)
//     	payload[recKey2] = recObj2;

//     console.log("Payload to backend:", payload);


// 	if (ws2 && ws2.readyState == 1){
// 		var r = confirm("please confirm to apply setting.");
// 		if (r == true) {
// 		  ws2.send(JSON.stringify(payload));
// 		}else{
			
// 		}
// 	}else{
// 		alert("Connection is closed...");
// 	}
// }
