// import WaveSurfer from 'https://unpkg.com/wavesurfer.js';
var wsUri;
var ws;
var userID = 0;
var userLevel = 0;
let selectedFiles = [];
let currentDevices = [];
const maxDevices = 4;
let deviceId = null;
let pendingDeviceRecords = null;
const autoMergeTimers = new Map();
const AUTO_MERGE_DELAY_MS = 250;
window.sendRecordSearch = sendRecordSearch;

WebSocketTest();
function WebSocketTest() {

	if ("WebSocket" in window) {
	   // Let us open a web socket
	   wsUri = "ws://" + location.host + ":1235";
	   ws = new WebSocket(wsUri);

	   ws.onopen = function() {
		  // Web Socket is connected, send data using send()
		//   ws.send("web:home");
		ws.send('{"menuID":"playRecording"}');
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


function processMsg(message) {
    var obj = JSON.parse(message);
    console.log("Received message:", obj);
    if (obj.menuID === "searchRecordFilesResult") {
        console.log("searchRecordFilesResult:", obj);
        // renderRecordTable(obj.records);
        // renderRecordTable(obj.records, obj.device);
        renderRecordTable(obj.records, obj.device, obj.startDate, obj.endDate);
    } else if (obj.menuID === "playRecordingDeviceStationResult") {
        console.log("playRecordingDeviceStationResult:", obj);
        // updateDeviceSelect(obj.records);
        pendingDeviceRecords = obj.records || [];
        updateDeviceSelect(pendingDeviceRecords);
    } 
    
}

function updateDeviceSelect(records) {
    const select = document.getElementById("searchDevice");
    if (!select) return;

    const previousValue = select.value;
    const devices = new Map();

    (records || []).forEach((rec) => {
        if (!rec || rec.id == null) return;
        const id = String(rec.id);
        if (!devices.has(id)) {
            const name = rec.name ? String(rec.name) : "";
            devices.set(id, name);
        }
    });

    currentDevices = Array.from(devices.keys());

    let optionsHtml = '<option value="">Select Device</option>';
    devices.forEach((name, id) => {
        const label = name ? `${id} - ${name}` : id;
        optionsHtml += `<option value="${id}">${label}</option>`;
    });

    select.innerHTML = optionsHtml;

    if (previousValue && devices.has(previousValue)) {
        select.value = previousValue;
    } else if (!previousValue && devices.size === 1) {
        select.value = currentDevices[0];
    }
}
document.addEventListener("DOMContentLoaded", function () {
    if (pendingDeviceRecords && pendingDeviceRecords.length) {
        updateDeviceSelect(pendingDeviceRecords);
    }
});

function sendRecordSearch() {
    // var name = $("#searchName").val().trim();
    var startDate = $("#startDate").val().trim();
    var endDate = $("#endDate").val().trim();
    var device = $("#searchDevice").val().trim();
    var interval = $("#intervalSelect").val().trim();
    var frequency = $("#searchFrequency").val().trim();

    if (startDate === "" || device === ""|| endDate === ""|| interval === "") {
        alert("กรุณากรอกข้อมูลให้ครบ: Name, Start Date/Time และ Device ID ");
        return;
    }

    var payload = {
        menuID: "searchRecordFilesWeb",
        // name: name,
        startDate: startDate,
        endDate: endDate,
        device: device,
        interval: interval,
        frequency: frequency 

    };

    console.log("Sending payload to WebSocket:", payload);
    ws.send(JSON.stringify(payload));
}

function playFileWav(fileName,file_path) {
    const audio = document.getElementById("audio-player");
    const path = "audiofiles";
    const url = `${window.location.origin}/${path}/${fileName}`;
    const jsonMessage = JSON.stringify({
        menuID: "playFileWav",
        fileName: fileName,
        filePath: file_path
    });
    console.log("Play file:", jsonMessage);

if (ws.readyState === 1) {
        ws.send(jsonMessage);
    } else {
        alert("Connection is closed...");
    }
}
function makeGroupKey(deviceId, startDate, endDate) {
  const s = String(startDate || "");
  const e = String(endDate || "");
  return `${deviceId}_${s}_${e}`.replace(/[^a-zA-Z0-9_]/g, "_");
}
function clearMergedPreview(deviceGroupId) {
  const div = document.getElementById(`mergedWaveform-${deviceGroupId}`);
  if (div) {
    div.innerHTML = "";
  }

  const overlay = document.getElementById(`waveRegionsOverlay-${deviceGroupId}`);
  if (overlay) {
    overlay.innerHTML = "";
  }

  const audioElem = document.getElementById(`mergedAudioPlayer-${deviceGroupId}`);
  if (audioElem) {
    audioElem.remove();
  }

  const durContainer = document.getElementById(`mergedDurations-${deviceGroupId}`);
  if (durContainer) {
    durContainer.innerHTML = "";
  }

  const title = document.getElementById(`previewTitle-${deviceGroupId}`);
  if (title) {
    const defaultTitle = title.getAttribute("data-default-title") || "Merged Audio Preview";
    title.innerHTML = `<em>${defaultTitle}</em>`;
  }
}
function clearSelectedRecords(deviceGroupId) {
  const container = document.querySelector(`#device-group-${deviceGroupId}`);
  if (!container) return;

  container.querySelectorAll(".record-checkbox").forEach((chk) => {
    chk.checked = false;
  });

  const selectAll = document.getElementById(`selectAll-${deviceGroupId}`);
  if (selectAll) {
    selectAll.checked = false;
  }

  clearMergedPreview(deviceGroupId);
}
function scheduleAutoMerge(groupKey) {
  if (!groupKey) return;
  const key = String(groupKey);
  if (autoMergeTimers.has(key)) {
    clearTimeout(autoMergeTimers.get(key));
  }
  autoMergeTimers.set(key, setTimeout(() => {
    autoMergeTimers.delete(key);
    applySelectedRecords(key, { silent: true });
  }, AUTO_MERGE_DELAY_MS));
}

function renderRecordTable(records, deviceId, startDate, endDate) {
  const groupKey = makeGroupKey(deviceId, startDate, endDate);
  const container = document.getElementById("resultArea");

  const old = document.getElementById(`device-group-${groupKey}`);
  if (old) old.remove();

  let html = `
    <div id="device-group-${groupKey}" class="device-group mb-4">
      <h3 class="text-info">Device ${deviceId}</h3>
      <div class="text-secondary" style="font-size:12px;">
        Range: ${startDate || "-"} → ${endDate || "-"}
      </div>

      <table class="table table-bordered table-hover table-dark mt-3">
        <thead>
          <tr>
            <th><input type="checkbox" id="selectAll-${groupKey}"></th>
            <th>Filename</th>
            <th>Duration (HH:mm:ss.ms)</th>
            <th>Size (KB)</th>
            <th>Created At</th>
            <th>Path</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
  `;

  records.forEach((rec, index) => {
    const formattedDuration = formatDuration(rec.duration_sec);
    const human_size_kb = (rec.size_bytes / 1024).toFixed(2);

    html += `
      <tr>
        <td>
          <input type="checkbox"
            class="record-checkbox"
            data-device-group="${groupKey}"
            data-index="${index}">
        </td>
        <td>${rec.filename}</td>
        <td>${formattedDuration}</td>
        <td>${human_size_kb}</td>
        <td>${new Date(rec.created_at).toLocaleString()}</td>
        <td>${rec.file_path}</td>
        <td>${rec.name}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>

      <div class="mt-5 p-3 border border-secondary rounded">
        <h5 id="previewTitle-${groupKey}" data-default-title="Merged Audio Preview (Device ${deviceId})">
          <em>Merged Audio Preview (Device ${deviceId})</em>
        </h5>

        <div style="position: relative;">
          <div id="mergedWaveform-${groupKey}"></div>
          <div id="waveRegionsOverlay-${groupKey}"
               style="position: absolute; top: 0; left: 0; height: 100%; width: 100%; pointer-events: none;">
          </div>
        </div>

        <audio id="mergedAudioPlayer-${groupKey}" controls
               style="width: 100%; margin-top: 10px;"></audio>

        <div class="mt-3">
          <button id="mergeFiles-${groupKey}"
                  class="btn btn-warning"
                  onclick="applySelectedRecords('${groupKey}')">
            Merge Data
          </button>

          <button id="clearFiles-${groupKey}"
                  class="btn btn-secondary"
                  onclick="clearSelectedRecords('${groupKey}')">
            Clear Selection
          </button>

          <button id="closeFiles-${groupKey}"
                  class="btn btn-primary"
                  onclick="closeFiles('${groupKey}')">
            Close Data
          </button>
        </div>

        <div id="mergedDurations-${groupKey}" class="mt-3 text-white"></div>
      </div>
    </div>
  `;

  container.insertAdjacentHTML("beforeend", html);

  document.getElementById(`selectAll-${groupKey}`).addEventListener("change", function () {
    const checked = this.checked;
    document.querySelectorAll(`.record-checkbox[data-device-group="${groupKey}"]`)
      .forEach(chk => chk.checked = checked);
    scheduleAutoMerge(groupKey);
  });

  const groupContainer = document.getElementById(`device-group-${groupKey}`);
  if (groupContainer) {
    groupContainer.addEventListener("change", (event) => {
      const target = event.target;
      if (target && target.classList && target.classList.contains("record-checkbox")) {
        scheduleAutoMerge(groupKey);
      }
    });
  }
}

// function renderRecordTable(records, deviceId, startDate, endDate) {
//   const uniqueId = Math.random().toString(36).substr(2, 8);
//   const deviceGroupId = `${deviceId}_${uniqueId}`;
//   console.log("deviceGroupId:", deviceGroupId);

//   const container = document.getElementById("resultArea");

//   let html = `
//     <div id="device-group-${deviceGroupId}" class="device-group mb-4">
//       <h3 class="text-info">Device ${deviceId}</h3>
//       <table class="table table-bordered table-hover table-dark mt-3">
//         <thead>
//           <tr>
//             <th><input type="checkbox" id="selectAll-${deviceGroupId}"></th>
//             <th>Filename</th>
//             <th>Duration (HH:mm:ss.ms)</th>
//             <th>Size (Byte)</th>
//             <th>Created At</th>
//             <th>Path</th>
//             <th>Name</th>
//           </tr>
//         </thead>
//         <tbody>
//   `;

// records.forEach((rec, index) => {
//   const formattedDuration = formatDuration(rec.duration_sec);
//   const human_size = rec.size_bytes / 1024;

//   html += `
//     <tr>
//       <td>
//         <input type="checkbox" 
//           class="record-checkbox" 
//           data-device-group="${deviceGroupId}" 
//           data-index="${index}">
//       </td>
//       <td>${rec.filename}</td>
//       <td>${formattedDuration}</td>
//       <td>${human_size}</td>
//       <td>${new Date(rec.created_at).toLocaleString()}</td>
//       <td>${rec.file_path}</td>
//       <td>${rec.name}</td>
//     </tr>
//   `;
// });

//   html += `
//         </tbody>
//       </table>

//       <div class="mt-5 p-3 border border-secondary rounded">
//         <h5 id="previewTitle-${deviceGroupId}">
//           <em>Merged Audio Preview (Device ${deviceGroupId})</em>
//         </h5>
//         <div style="position: relative;">
//           <div id="mergedWaveform-${deviceGroupId}"></div>
//           <div id="waveRegionsOverlay-${deviceGroupId}" 
//                style="position: absolute; top: 0; left: 0; height: 100%; width: 100%; pointer-events: none;">
//           </div>
//         </div>
//         <audio id="mergedAudioPlayer-${deviceGroupId}" controls 
//                style="width: 100%; margin-top: 10px;"></audio>
//         <div class="mt-3">

//             <button id="mergeFiles-${deviceGroupId}" 
//                     class="btn btn-warning" 
//                     onclick="applySelectedRecords('${deviceGroupId}')">
//               Merge Data
//             </button>
//                     <button id="closeFiles-${deviceGroupId}" 
//                     class="btn btn-primary" 
//                     onclick="closeFiles('${deviceGroupId}')">
//               Close Data
//             </button>
//         </div>        
//         <div id="mergedDurations-${deviceGroupId}" class="mt-3 text-white"></div>
//       </div>
//     </div>
//   `;

//   container.insertAdjacentHTML("beforeend", html);
//   document.getElementById(`selectAll-${deviceGroupId}`).addEventListener("change", function () {
//     const checked = this.checked;
//     document.querySelectorAll(`.record-checkbox[data-device-group="${deviceGroupId}"]`)
//       .forEach(chk => {
//         chk.checked = checked;
//       });
//   });
// }
            // <button id="playMerged-${deviceGroupId}" class="btn btn-success">
            //   Play / Pause
            // </button>
            // <a id="downloadMerged-${deviceGroupId}" class="btn btn-primary" 
            //    download="merged.wav">
            //    Download Merged Audio
            // </a>

// function applySelectedRecords(deviceGroupId) {
//   console.log("🟡 เริ่ม applySelectedRecords → deviceGroupId =", deviceGroupId);

//   const selected = [];

//   const container = document.querySelector(`#device-group-${deviceGroupId}`);

//   if (!container) {
//     console.log(" ไม่พบ device-group:", deviceGroupId);
//     alert("ไม่พบกล่องข้อมูลสำหรับ Device Group ID นี้");
//     return;
//   }

//   const checkboxes = container.querySelectorAll(".record-checkbox:checked");

//   if (checkboxes.length === 0) {
//     alert("Please select at least one file.");
//     return;
//   }

//   let deviceId = null;

//   checkboxes.forEach((chk, i) => {
//     const row = chk.closest("tr");
//     const filename = row.querySelector("td:nth-child(2)")?.textContent.trim();
//     const createdAt = row.querySelector("td:nth-child(3)")?.textContent.trim();

//     const freq = filename.split("_")[0];
//     const date = filename.split("_")[1];
//     const device = filename.split("_")[2];

//     if (i === 0) {
//       deviceId = `${device}_${freq}_${date}_${deviceGroupId}`;
//     }

//     const fileUrl = `/audiofiles/${freq}/${date}/${device}/${filename}`;

//     selected.push({
//       fileUrl,
//       filename,
//       createdAt,
//     });
//   });

//   console.log("✅ selected:", selected);
//   console.log("✅ deviceId:", deviceId);

//   // ✅ ส่ง deviceGroupId (ไม่ใช่ deviceId)
//   generateConcatenatedWaveform(selected, deviceGroupId);
// }
function formatDuration(secondsStr) {
  const totalSeconds = parseFloat(secondsStr);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.round((totalSeconds - Math.floor(totalSeconds)) * 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}
function applySelectedRecords(deviceGroupId, options) {
  console.log("🟡 เริ่ม applySelectedRecords → deviceGroupId =", deviceGroupId);
  const opts = options || {};

  const selected = [];
  const container = document.querySelector(`#device-group-${deviceGroupId}`);

  if (!container) {
    console.log("❌ ไม่พบ device-group:", deviceGroupId);
    alert("ไม่พบกล่องข้อมูลสำหรับ Device Group ID นี้");
    return;
  }

  const checkboxes = container.querySelectorAll(".record-checkbox:checked");

  if (checkboxes.length === 0) {
    if (!opts.silent) {
      alert("Please select at least one file.");
    }
    clearMergedPreview(deviceGroupId);
    return;
  }

  let deviceId = null;
  let totalDurationSec = 0;

  checkboxes.forEach((chk, i) => {
    const row = chk.closest("tr");
    const filename = row.querySelector("td:nth-child(2)")?.textContent.trim();
    const durationStr = row.querySelector("td:nth-child(3)")?.textContent.trim();
    const sizeStr = row.querySelector("td:nth-child(4)")?.textContent.trim();
    const createdAt = row.querySelector("td:nth-child(5)")?.textContent.trim();
    const filePath = row.querySelector("td:nth-child(6)")?.textContent.trim();
    const name = row.querySelector("td:nth-child(7)")?.textContent.trim();

    // ✅ แก้ตรงนี้
    const firstUnderscore = filename.indexOf('_');
    const secondUnderscore = filename.indexOf('_', firstUnderscore + 1);
    const deviceName = filename.substring(0, firstUnderscore);
    const date = filename.substring(firstUnderscore + 1, secondUnderscore);

    const fileUrl = `/audiofiles/${deviceName}/${date}/${filename}`;
    console.log("fileUrlcheckboxes:", fileUrl);
    selected.push({
      fileUrl,
      filename,
      duration_sec: parseDurationStr(durationStr),
      size: sizeStr,
      createdAt,
      filePath,
      name
    });

  });

  // 🔁 format duration
  function formatDurationToHHMMSSMS(seconds) {
    console.log("🔶 formatDurationToHHMMSSMS → seconds =", seconds);
    const totalSeconds = parseFloat(seconds);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);
    const millis = Math.round((totalSeconds - Math.floor(totalSeconds)) * 1000);

    const hh = String(hrs).padStart(2, '0');
    const mm = String(mins).padStart(2, '0');
    const ss = String(secs).padStart(2, '0');
    const ms = String(millis).padStart(3, '0');

    return `${hh}:${mm}:${ss}:${ms}`;
  }

  // const formattedDuration = formatDurationToHHMMSSMS(totalDurationSec);

  // ✅ รวมขนาดไฟล์
  calculateTotalSize(selected).then((totalBytes) => {
    const rawMB = Math.floor((totalBytes + 1024) / 1024); // integer MB

    const title = document.querySelector(`#previewTitle-${deviceGroupId}`);
    if (title) {
      title.innerHTML = `<em>Merged Audio Preview (Device ${deviceGroupId}) — Total: ${rawMB} MB — Duration: ${formattedDuration}</em>`;
    }

    generateConcatenatedWaveform(selected, deviceGroupId);
  });
}
function applySelectedRecords(deviceGroupId, options) {
  console.log("🟡 เริ่ม applySelectedRecords → deviceGroupId =", deviceGroupId);
  const opts = options || {};

  const selected = [];
  const container = document.querySelector(`#device-group-${deviceGroupId}`);

  if (!container) {
    console.log("❌ ไม่พบ device-group:", deviceGroupId);
    alert("ไม่พบกล่องข้อมูลสำหรับ Device Group ID นี้");
    return;
  }

  const checkboxes = container.querySelectorAll(".record-checkbox:checked");

  if (checkboxes.length === 0) {
    if (!opts.silent) {
      alert("Please select at least one file.");
    }
    clearMergedPreview(deviceGroupId);
    return;
  }

  let deviceId = null;

checkboxes.forEach((chk, i) => {
  const row = chk.closest("tr");
  const filename = row.querySelector("td:nth-child(2)")?.textContent.trim();
  const durationStr = row.querySelector("td:nth-child(3)")?.textContent.trim();
  const sizeStr = row.querySelector("td:nth-child(4)")?.textContent.trim();
  const createdAt = row.querySelector("td:nth-child(5)")?.textContent.trim();
  const filePath = row.querySelector("td:nth-child(6)")?.textContent.trim();
  const name = row.querySelector("td:nth-child(7)")?.textContent.trim();
  console.log("filename:", filename, "durationStr:", durationStr, "sizeStr:", sizeStr, "createdAt:", createdAt, "filePath:", filePath, "name:", name);
  // const freq = filename.split("_")[0];
  const date = filename.split("_")[1];
  const device = filename.split("_")[2];
  const deviceName = filename.split("_")[0];
  if (i === 0) {
    // deviceId = `${device}_${freq}_${date}_${deviceGroupId}`;
        deviceId = `${deviceName}_${date}_${deviceGroupId}`;

  }

  const fileUrl = `/audiofiles/${deviceName}/${date}/${filename}`;

  selected.push({
    fileUrl,
    filename,
    duration_sec: parseDurationStr(durationStr),
    size: sizeStr,
    createdAt,
    filePath,
    name
  });
});

  console.log("✅ selected:", selected);
  console.log("✅ deviceId:", deviceId);

  // 🔽 เรียกพร้อมกันทั้งขนาดและระยะเวลา
  Promise.all([
    calculateTotalSize(selected),
    calculateTotalDuration(selected)
  ]).then(([totalBytes, totalDuration]) => {
    const rawMB = Math.floor((totalBytes + 1024) / 1024);

    const formatDuration = (seconds) => {
      const total = parseFloat(seconds);
      const hrs = Math.floor(total / 3600);
      const mins = Math.floor((total % 3600) / 60);
      const secs = Math.floor(total % 60);
      const millis = Math.round((total - Math.floor(total)) * 1000);
      console.log("formatDuration:", total,hrs, mins, secs, millis );

      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(millis).padStart(3, '0')}`;
    };

    const formattedDuration = formatDuration(totalDuration);
    console.log("Total Duration:", formattedDuration);
    const title = document.querySelector(`#previewTitle-${deviceGroupId}`);
    if (title) {
      title.innerHTML = `<em>Merged Audio Preview (Device ${deviceGroupId}) — Total: ${rawMB} MB — Duration: ${formattedDuration} HH:mm:ss.ms</em>`;
    }

    // 🔄 เรียกใช้การ merge waveform
    generateConcatenatedWaveform(selected, deviceGroupId);
  });
}

// function applySelectedRecords(deviceGroupId) {
//   console.log("🟡 เริ่ม applySelectedRecords → deviceGroupId =", deviceGroupId);

//   const selected = [];
//   const container = document.querySelector(`#device-group-${deviceGroupId}`);

//   if (!container) {
//     console.log("❌ ไม่พบ device-group:", deviceGroupId);
//     alert("ไม่พบกล่องข้อมูลสำหรับ Device Group ID นี้");
//     return;
//   }

//   const checkboxes = container.querySelectorAll(".record-checkbox:checked");

//   if (checkboxes.length === 0) {
//     alert("Please select at least one file.");
//     return;
//   }

//   let deviceId = null;

//   checkboxes.forEach((chk, i) => {
//     const row = chk.closest("tr");
//     const filename = row.querySelector("td:nth-child(2)")?.textContent.trim();
//     const createdAt = row.querySelector("td:nth-child(3)")?.textContent.trim();

//     const freq = filename.split("_")[0];
//     const date = filename.split("_")[1];
//     const device = filename.split("_")[2];

//     if (i === 0) {
//       deviceId = `${device}_${freq}_${date}_${deviceGroupId}`;
//     }

//     const fileUrl = `/audiofiles/${freq}/${date}/${device}/${filename}`;

//     selected.push({
//       fileUrl,
//       filename,
//       createdAt,
//     });
//   });

//   console.log("✅ selected:", selected);
//   console.log("✅ deviceId:", deviceId);

//   // 🔽 เรียกฟังก์ชันเพื่อรวมขนาดไฟล์
//   calculateTotalSize(selected)
//     .then((totalBytes) => {
//      console.log("Total size of selected files:", totalBytes, "bytes");
//      const rawMB = Math.floor((totalBytes + 1024) / 1024);
//      console.log(`Total size: ${rawMB} MB`);

//       // const mb = (totalBytes / (1024 * 1024)).toFixed(2); // แปลงเป็น MB
//       const title = document.querySelector(`#previewTitle-${deviceGroupId}`);
//       if (title) {
//         title.innerHTML = `<em>Merged Audio Preview (Device ${deviceGroupId}) — Total: ${rawMB} MB</em>`;
//       }

//       // เรียก merge waveform
//       generateConcatenatedWaveform(selected, deviceGroupId);
//     })
// }

// 🔧 ดึง Content-Length แบบ async

function parseDurationStr(str) {
  // รองรับ "HH:MM:SS.mmm" หรือ "MM:SS.mmm"
  if (!str) return 0;
  const parts = str.split(':');
  if (parts.length === 3) {
    const [hh, mm, ssms] = parts;
    const [ss, ms = "0"] = ssms.split('.');
    return (
      parseInt(hh, 10) * 3600 +
      parseInt(mm, 10) * 60 +
      parseInt(ss, 10) +
      (parseInt(ms, 10) || 0) / 1000
    );
  } else if (parts.length === 2) {
    const [mm, ssms] = parts;
    const [ss, ms = "0"] = ssms.split('.');
    return (
      parseInt(mm, 10) * 60 +
      parseInt(ss, 10) +
      (parseInt(ms, 10) || 0) / 1000
    );
  }
  return parseFloat(str) || 0;
}
async function calculateTotalSize(selectedFiles) {
  let total = 0;

  for (const file of selectedFiles) {
    try {
      const response = await fetch(file.fileUrl, { method: "HEAD" });
      const size = parseInt(response.headers.get("Content-Length") || "0", 10);
      total += isNaN(size) ? 0 : size;
    } catch (e) {
      console.warn("⚠️ Failed to fetch size for", file.fileUrl, e);
    }
  }

  return total;
}
function calculateTotalDuration(selected) {
  return new Promise((resolve) => {
    const total = selected.reduce((sum, item) => {
      const duration = parseFloat(item.duration_sec || 0);
      return sum + duration;
    }, 0);
    resolve(total);
  });
}

async function generateConcatenatedWaveform(selected, deviceGroupId) {
  console.log("🔶 generateConcatenatedWaveform เริ่มทำงาน...");
  console.log("✅ deviceId:", deviceId);
  console.log("✅ selected files:", selected);

  if (!selected || selected.length === 0) {
    console.warn("❌ ไม่มีไฟล์ใน selected");
    alert("ไม่พบไฟล์ที่จะ merge");
    return;
  }

  // ตรวจสอบจำนวนไฟล์
  const expectedLength = selected.length;
  console.log(`✅ จำนวนไฟล์ selected = ${expectedLength} ไฟล์`);

  // รวมไฟล์ WAV เป็น blob
  const mergedBlob = await bufferToWavBlob(selected);
  const url = URL.createObjectURL(mergedBlob);
  console.log("✅ mergedBlob สร้าง URL:", url);

  // ทำ playlist สำหรับแสดงเวลา
  const playlist = [];
  let totalDuration = 0;

  for (let file of selected) {
    console.log(`🎧 กำลังโหลดไฟล์ → ${file.filename}`);
    const res = await fetch(file.fileUrl);
    const arrayBuffer = await res.arrayBuffer();
    const ctx = new AudioContext();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    playlist.push({
      filename: file.filename,
      duration: audioBuffer.duration,
      offset: totalDuration,
      createdAt: file.createdAt,
    });

    totalDuration += audioBuffer.duration;
  }

  console.log("✅ playlist:", playlist);
  console.log("✅ totalDuration (sec):", totalDuration);

  // แสดง waveform
showMergedWaveform(url, playlist, totalDuration, deviceGroupId);
showDurations(playlist, totalDuration, deviceGroupId);

  // ผูกปุ่ม Play/Pause
  const audioElem = document.querySelector(`#mergedAudioPlayer-${deviceId}`);
  if (audioElem) {
    audioElem.src = url;

    const downloadLink = document.querySelector(`#downloadMerged-${deviceId}`);
    if (downloadLink) {
      downloadLink.href = url;
    }

    const playBtn = document.querySelector(`#playMerged-${deviceId}`);
    if (playBtn) {
      playBtn.onclick = () => {
        if (audioElem.paused) {
          audioElem.play();
        } else {
          audioElem.pause();
        }
      };
    }
  }
}




async function bufferToWavBlob(selected) {
  let wavChunks = [];

  let sampleRate = 8000;
  let numChannels = 1;
  let bitsPerSample = 16;
  let totalDataSize = 0;

  for (let file of selected) {
    const response = await fetch(file.fileUrl);
    const arrayBuffer = await response.arrayBuffer();

    const body = arrayBuffer.slice(44);
    wavChunks.push(new Uint8Array(body));
    totalDataSize += body.byteLength;
  }

  const blockAlign = numChannels * bitsPerSample / 8;
  const byteRate = sampleRate * blockAlign;
  const buffer = new ArrayBuffer(44 + totalDataSize);
  const view = new DataView(buffer);
  let offset = 0;

  function writeString(str) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset++, str.charCodeAt(i));
    }
  }

  writeString("RIFF");
  view.setUint32(offset, 36 + totalDataSize, true); offset += 4;
  writeString("WAVE");
  writeString("fmt ");
  view.setUint32(offset, 16, true); offset += 4;
  view.setUint16(offset, 1, true); offset += 2;
  view.setUint16(offset, numChannels, true); offset += 2;
  view.setUint32(offset, sampleRate, true); offset += 4;
  view.setUint32(offset, byteRate, true); offset += 4;
  view.setUint16(offset, blockAlign, true); offset += 2;
  view.setUint16(offset, bitsPerSample, true); offset += 2;
  writeString("data");
  view.setUint32(offset, totalDataSize, true); offset += 4;

  let dataOffset = offset;
  for (let chunk of wavChunks) {
    new Uint8Array(buffer, dataOffset, chunk.byteLength).set(chunk);
    dataOffset += chunk.byteLength;
  }

  return new Blob([buffer], { type: "audio/wav" });
}


function showMergedWaveform(url, playlist, totalSec, deviceGroupId) {
  console.log(`➡️ showMergedWaveform deviceGroupId = ${deviceGroupId}`);

  const div = document.getElementById(`mergedWaveform-${deviceGroupId}`);
  if (!div) {
    console.error(`ไม่พบ mergedWaveform div: mergedWaveform-${deviceGroupId}`);
    return;
  }

  // ล้าง waveform เดิม
  div.innerHTML = "";

  // ลบ audio element เก่าออกถ้ามี
  const oldAudio = document.getElementById(`mergedAudioPlayer-${deviceGroupId}`);
  if (oldAudio) {
    oldAudio.remove();
  }

  // ลบ download link เดิมออกด้วยถ้ามี
  const downloadBtn = document.getElementById(`downloadMerged-${deviceGroupId}`);
  if (downloadBtn) {
    downloadBtn.removeAttribute("href");
  }

  // สร้าง WaveSurfer ใหม่
  const wavesurfer = WaveSurfer.create({
    container: div,
    backend: "MediaElement",
    waveColor: '#ff00ff',
    progressColor: '#00ffff',
    height: 100,
    responsive: true,
  });


  wavesurfer.load(url);

  wavesurfer.once("ready", () => {
    console.log("✅ wavesurfer ready");

    const internalAudio = wavesurfer.media;

    const newAudio = internalAudio.cloneNode(true);
    newAudio.id = `mergedAudioPlayer-${deviceGroupId}`;
    newAudio.controls = true;
    newAudio.style.width = "100%";
    newAudio.style.marginTop = "10px";

    div.parentElement.appendChild(newAudio);

    const playBtn = document.getElementById(`playMerged-${deviceGroupId}`);
    if (playBtn) {
      playBtn.onclick = () => {
        if (newAudio.paused) {
          newAudio.play();
        } else {
          newAudio.pause();
        }
      };
    }

    newAudio.addEventListener("timeupdate", () => {
      const progress = newAudio.currentTime / newAudio.duration;
      wavesurfer.seekTo(progress);
    });

    wavesurfer.on("seek", (progress) => {
      if (newAudio.duration) {
        newAudio.currentTime = progress * newAudio.duration;
      }
    });

    drawOverlayRegions(playlist, totalSec, deviceGroupId);
  });
}





function showDurations(playlist, totalDuration, deviceId) {
  console.log("🔶 showDurations →", { playlist, totalDuration, deviceId });

  const durContainer = document.getElementById(`mergedDurations-${deviceId}`);
  if (!durContainer) {
    console.error(`ไม่พบ mergedDurations div: mergedDurations-${deviceId}`);
    return;
  }

  let html = "";

  playlist.forEach((item, i) => {
    const mins = Math.floor(item.duration / 60);
    const secs = Math.round(item.duration % 60).toString().padStart(2, "0");
    html += `
      <div>
        <span class="badge bg-primary me-1">${i + 1}</span>
        ${item.filename}
        <span class="text-info">→ ${mins}.${secs} นาที</span>
      </div>
    `;
  });

  const totalMins = Math.floor(totalDuration / 60);
  const totalSecs = Math.round(totalDuration % 60).toString().padStart(2, "0");
  html += `
    <hr class="border-light">
    <strong class="text-warning">รวมทั้งหมด: ${totalMins}.${totalSecs} นาที</strong>
  `;

  div.innerHTML = html;
}

function drawOverlayRegions(playlist, totalSec, deviceId) {
  console.log("🔶 drawOverlayRegions →", { playlist, totalSec, deviceId });

  const overlayContainer = document.getElementById(`waveRegionsOverlay-${deviceId}`);
  if (!overlayContainer) {
    console.error(`❌ ไม่พบ overlay container: waveRegionsOverlay-${deviceId}`);
    return;
  }

  overlayContainer.innerHTML = ""; // ล้างก่อนทุกครั้ง

  if (totalSec === 0) {
    console.warn("⚠️ totalSec = 0 → ไม่สามารถวาด regions ได้");
    return;
  }

  playlist.forEach(region => {
    const leftPct = (region.offset / totalSec) * 100;
    const widthPct = (region.duration / totalSec) * 100;

    console.log(`🔹 region = ${region.filename}, offset = ${region.offset}s, width = ${region.duration}s`);

    const regionDiv = document.createElement("div");
    regionDiv.className = "region-overlay";
    regionDiv.style.position = "absolute";
    regionDiv.style.top = "0";
    regionDiv.style.bottom = "0";
    regionDiv.style.left = `${leftPct}%`;
    regionDiv.style.width = `${widthPct}%`;
    regionDiv.style.background = "rgba(255, 0, 0, 0.2)";
    regionDiv.style.pointerEvents = "none";
    regionDiv.title = `${region.filename}\nDuration: ${region.duration.toFixed(2)}s`;

    overlayContainer.appendChild(regionDiv);
  });
}


function closeFiles(deviceGroupId) {  
  console.log("🔶 closeFiles เริ่มทำงาน → deviceGroupId =", deviceGroupId);

  const container = document.querySelector(`#device-group-${deviceGroupId}`);
  if (!container) {
    console.error(`❌ ไม่พบกล่องข้อมูลสำหรับ Device Group ID: ${deviceGroupId}`);
    return;
  }

  // ลบกล่องข้อมูลทั้งหมดที่เกี่ยวข้องกับ deviceGroupId
  container.remove();

  // ลบ audio element และ download link ที่เกี่ยวข้อง
  const audioElem = document.getElementById(`mergedAudioPlayer-${deviceGroupId}`);
  if (audioElem) {
    audioElem.remove();
  }

  const downloadLink = document.getElementById(`downloadMerged-${deviceGroupId}`);
  if (downloadLink) {
    downloadLink.removeAttribute("href");
  }

  console.log("✅ ปิดไฟล์และล้างข้อมูลสำเร็จ");  
}


function clearSearchForm() {
  console.log("🔄 Clear form...");

  // ล้างค่าฟิลด์
  document.getElementById("searchDevice").selectedIndex = 0;
  document.getElementById("searchFrequency").value = "";
  document.getElementById("startDate").value = "";
  document.getElementById("intervalSelect").selectedIndex = 0;
  document.getElementById("endDate").value = "";

}











// function renderRecordTable(records, deviceId) {
//   const container = document.getElementById("resultArea");

//   let html = `
//     <div id="device-group-${deviceId}" class="device-group mb-4">
//       <h3 class="text-info">Device ${deviceId}</h3>
//       <table class="table table-bordered table-hover table-dark mt-3">
//         <thead>
//           <tr>
//             <th><input type="checkbox" id="selectAll-${deviceId}"></th>
//             <th>Filename</th>
//             <th>Created At</th>
//             <th>Path</th>
//             <th>Name</th>
//           </tr>
//         </thead>
//         <tbody>
//   `;

//   records.forEach((rec, index) => {
//     html += `
//       <tr>
//         <td><input type="checkbox" class="record-checkbox" data-device="${deviceId}" data-index="${index}"></td>
//         <td>${rec.filename}</td>
//         <td>${new Date(rec.created_at).toLocaleString()}</td>
//         <td>${rec.file_path}</td>
//         <td>${rec.name}</td>

//       </tr>
//     `;
//   });

//   html += `
//         </tbody>
//       </table>

//       <div class="mt-5 p-3 border border-secondary rounded">
//         <h5><em>Merged Audio Preview</em></h5>

//         <div style="position: relative;">
//           <div id="mergedWaveform-${deviceId}"></div>
//           <div id="waveRegionsOverlay-${deviceId}" style="position: absolute; top: 0; left: 0; height: 100%; width: 100%; pointer-events: none;"></div>
//         </div>

//         <audio id="mergedAudioPlayer-${deviceId}" controls style="width: 100%; margin-top: 10px;"></audio>

//         <div class="mt-3">
//           <button id="playMerged-${deviceId}" class="btn btn-success">Play / Pause</button>
//           <a id="downloadMerged-${deviceId}" class="btn btn-primary" download="merged.wav">Download Merged Audio</a>
//         </div>

//         <div id="mergedDurations-${deviceId}" class="mt-3 text-white"></div>
//       </div>
//     </div>
//   `;

//   container.insertAdjacentHTML("beforeend", html);


//   document.getElementById(`selectAll-${deviceId}`).addEventListener("change", function () {
//     const checked = this.checked;
//     document.querySelectorAll(`.record-checkbox[data-device="${deviceId}"]`).forEach(chk => {
//       chk.checked = checked;
//     });
//   });

//   document.querySelectorAll(`.play-btn[data-device="${deviceId}"]`).forEach(btn => {
//     btn.addEventListener("click", function () {
//       const idx = this.dataset.index;
//       playFileWav(records[idx].filename, records[idx].file_path);
//     });
//   });

//   document.querySelectorAll(`.stop-btn[data-device="${deviceId}"]`).forEach(btn => {
//     btn.addEventListener("click", function () {
//       const idx = this.dataset.index;
//       alert("Stop clicked for " + records[idx].filename);
//     });
//   });

//   document.querySelectorAll(`.delete-btn[data-device="${deviceId}"]`).forEach(btn => {
//     btn.addEventListener("click", function () {
//       const idx = this.dataset.index;
//       if (confirm(`Delete file: ${records[idx].filename}?`)) {
//         alert("Deleted " + records[idx].filename);
//       }
//     });
//   });

// }


// function renderRecordTable(records, deviceId, startDate, endDate) {
//   // สร้าง deviceGroupId ไม่ซ้ำกันทุกครั้ง
//   const uniqueId = Math.random().toString(36).substr(2, 8);
//   const deviceGroupId = `${deviceId}`;

//   console.log("deviceGroupId:", deviceGroupId);

//   const container = document.getElementById("resultArea");

//   let html = `
//     <div id="device-group-${deviceGroupId}" class="device-group mb-4">
//       <h3 class="text-info">Device ${deviceId}</h3>
//       <table class="table table-bordered table-hover table-dark mt-3">
//         <thead>
//           <tr>
//             <th><input type="checkbox" id="selectAll-${deviceGroupId}"></th>
//             <th>Filename</th>
//             <th>Created At</th>
//             <th>Path</th>
//             <th>Name</th>
//           </tr>
//         </thead>
//         <tbody>
//   `;

//   records.forEach((rec, index) => {
//     html += `
//       <tr>
//         <td><input type="checkbox" class="record-checkbox" data-device="${deviceGroupId}" data-index="${index}"></td>
//         <td>${rec.filename}</td>
//         <td>${new Date(rec.created_at).toLocaleString()}</td>
//         <td>${rec.file_path}</td>
//         <td>${rec.name}</td>
//       </tr>
//     `;
//   });

//   html += `
//         </tbody>
//       </table>

//       <div class="mt-5 p-3 border border-secondary rounded">
//         <h5><em>Merged Audio Preview (Device ${deviceGroupId})</em></h5>
//         <div style="position: relative;">
//           <div id="mergedWaveform-${deviceGroupId}"></div>
//           <div id="waveRegionsOverlay-${deviceGroupId}" style="position: absolute; top: 0; left: 0; height: 100%; width: 100%; pointer-events: none;"></div>
//         </div>
//         <audio id="mergedAudioPlayer-${deviceGroupId}" controls style="width: 100%; margin-top: 10px;"></audio>
//         <div class="mt-3">
//             <button id="playMerged-${deviceGroupId}" class="btn btn-success">Play / Pause
//             </button><a id="downloadMerged-${deviceGroupId}" class="btn btn-primary" download="merged.wav">Download Merged Audio
//             </a><button id="mergeFiles-${deviceGroupId}" class="btn btn-warning"onclick="applySelectedRecords('${deviceGroupId}')">Merge Data</button>
//         </div>        
//         <div id="mergedDurations-${deviceGroupId}" class="mt-3 text-white"></div>
//       </div>
//     </div>
//   `;

//   container.insertAdjacentHTML("beforeend", html);

//   // Select all           <button type="button" class="btn btn-apply btn-primary" onclick="applySelectedRecords()">Apply</button>

//   document.getElementById(`selectAll-${deviceGroupId}`).addEventListener("change", function () {
//     const checked = this.checked;
//     document.querySelectorAll(`.record-checkbox[data-device="${deviceGroupId}"]`).forEach(chk => {
//       chk.checked = checked;
//     });
//   });
// }










// function applySelectedRecords() {
//   const selected = [];

//   document.querySelectorAll(".record-checkbox:checked").forEach(chk => {
//     const row = chk.closest("tr");
//     const filename = row.querySelector("td:nth-child(2)").textContent.trim();
//     const freq = filename.split("_")[0];
//     const date = filename.split("_")[1];
//     deviceId = chk.dataset.device;
//     const device = filename.split("_")[2];
//     const fileUrl = `/audiofiles/${freq}/${date}/${device}/${filename}`;
//     selected.push({ fileUrl, filename });
//   });

//   if (selected.length === 0) {
//     alert("Please select at least one file.");
//     return;
//   }

//   generateConcatenatedWaveform(selected, deviceId);
//   console.log("Device ID:", deviceId);

// }


// function applySelectedRecords() {
//   const selected = [];

//   let deviceGroupId = null;

//   document.querySelectorAll(".record-checkbox:checked").forEach((chk, i) => {
//     const row = chk.closest("tr");
//     const filename = row.querySelector("td:nth-child(2)").textContent.trim();
//     const freq = filename.split("_")[0];
//     const date = filename.split("_")[1];

//     if (i === 0) {
//       deviceGroupId = chk.dataset.device;
//     }

//     const device = filename.split("_")[2];
//     const fileUrl = `/audiofiles/${freq}/${date}/${device}/${filename}`;
//     selected.push({ fileUrl, filename });
//   });

//   if (!deviceGroupId) {
//     alert("Device Group ID not found.");
//     return;
//   }

//   generateConcatenatedWaveform(selected, deviceGroupId);

// }





// async function generateConcatenatedWaveform(selected, deviceId) {
//   const mergedBlob = await bufferToWavBlob(selected);
//   const url = URL.createObjectURL(mergedBlob);
//   console.log("selected files:", selected);
//   console.log("deviceId:", deviceId);
//   const playlist = [];
//   let totalDuration = 0;

//   for (let file of selected) {
//     const res = await fetch(file.fileUrl);
//     const arrayBuffer = await res.arrayBuffer();
//     const ctx = new AudioContext();
//     const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

//     playlist.push({
//       filename: file.filename,
//       duration: audioBuffer.duration,
//       offset: totalDuration
//     });

//     totalDuration += audioBuffer.duration;
//   }

//   showMergedWaveform(url, playlist, totalDuration, deviceId);
//   showDurations(playlist, totalDuration, deviceId);

//   const audioElem = document.querySelector(`#mergedAudioPlayer-${deviceId}`);
//   if (audioElem) {
//     audioElem.src = url;
//     document.querySelector(`#downloadMerged-${deviceId}`).href = url;
//     document.querySelector(`#playMerged-${deviceId}`).onclick = () => {
//       if (audioElem.paused) {
//         audioElem.play();
//       } else {
//         audioElem.pause();
//       }
//     };
//   }
// }

// async function bufferToWavBlob(selected) {
//   let wavChunks = [];

//   let sampleRate = 8000;
//   let numChannels = 1;
//   let bitsPerSample = 16;
//   let totalDataSize = 0;

//   for (let file of selected) {
//     const response = await fetch(file.fileUrl);
//     const arrayBuffer = await response.arrayBuffer();

//     const body = arrayBuffer.slice(44);
//     wavChunks.push(new Uint8Array(body));
//     totalDataSize += body.byteLength;
//   }

//   const blockAlign = numChannels * bitsPerSample / 8;
//   const byteRate = sampleRate * blockAlign;
//   const buffer = new ArrayBuffer(44 + totalDataSize);
//   const view = new DataView(buffer);
//   let offset = 0;

//   function writeString(str) {
//     for (let i = 0; i < str.length; i++) {
//       view.setUint8(offset++, str.charCodeAt(i));
//     }
//   }

//   writeString("RIFF");
//   view.setUint32(offset, 36 + totalDataSize, true); offset += 4;
//   writeString("WAVE");
//   writeString("fmt ");
//   view.setUint32(offset, 16, true); offset += 4;
//   view.setUint16(offset, 1, true); offset += 2;
//   view.setUint16(offset, numChannels, true); offset += 2;
//   view.setUint32(offset, sampleRate, true); offset += 4;
//   view.setUint32(offset, byteRate, true); offset += 4;
//   view.setUint16(offset, blockAlign, true); offset += 2;
//   view.setUint16(offset, bitsPerSample, true); offset += 2;
//   writeString("data");
//   view.setUint32(offset, totalDataSize, true); offset += 4;

//   let dataOffset = offset;
//   for (let chunk of wavChunks) {
//     new Uint8Array(buffer, dataOffset, chunk.byteLength).set(chunk);
//     dataOffset += chunk.byteLength;
//   }

//   return new Blob([buffer], { type: "audio/wav" });
// }



// function showMergedWaveform(url, playlist, totalSec, deviceId) {
//   const div = document.getElementById(`mergedWaveform-${deviceId}`);
//   div.innerHTML = "";

//   const wavesurfer = WaveSurfer.create({
//     container: div,
//     backend: "MediaElement",
//     waveColor: '#ff00ff',
//     progressColor: '#00ffff',
//     height: 100,
//     responsive: true,
//   });

//   wavesurfer.load(url);

//   wavesurfer.once("ready", () => {
//     const internalAudio = wavesurfer.media;

//     const newAudio = internalAudio.cloneNode(true);
//     newAudio.id = `mergedAudioPlayer-${deviceId}`;
//     newAudio.controls = true;
//     newAudio.style.width = "100%";
//     newAudio.style.marginTop = "10px";

//     const oldAudio = document.getElementById(`mergedAudioPlayer-${deviceId}`);
//     oldAudio.replaceWith(newAudio);

//     document.getElementById(`playMerged-${deviceId}`).onclick = () => {
//       if (newAudio.paused) {
//         newAudio.play();
//       } else {
//         newAudio.pause();
//       }
//     };

//     newAudio.addEventListener("timeupdate", () => {
//       const progress = newAudio.currentTime / newAudio.duration;
//       wavesurfer.seekTo(progress);
//     });

//     wavesurfer.on("seek", (progress) => {
//       if (newAudio.duration) {
//         newAudio.currentTime = progress * newAudio.duration;
//       }
//     });

//     drawOverlayRegions(playlist, totalSec, deviceId);
//   });
// }



// function drawOverlayRegions(playlist, totalSec, deviceId) {
//   const overlayContainer = document.getElementById(`waveRegionsOverlay-${deviceId}`);
//   if (!overlayContainer) {
//     console.error("waveRegionsOverlay div not found!");
//     return;
//   }

//   overlayContainer.innerHTML = "";

//   for (const region of playlist) {
//     const leftPct = (region.offset / totalSec) * 100;
//     const widthPct = (region.duration / totalSec) * 100;

//     const regionDiv = document.createElement("div");
//     regionDiv.className = "region-overlay";
//     regionDiv.style.position = "absolute";
//     regionDiv.style.top = "0";
//     regionDiv.style.bottom = "0";
//     regionDiv.style.left = `${leftPct}%`;
//     regionDiv.style.width = `${widthPct}%`;
//     regionDiv.style.background = "rgba(255, 0, 0, 0.2)";
//     regionDiv.style.pointerEvents = "none";
//     regionDiv.title = `${region.filename}`;

//     overlayContainer.appendChild(regionDiv);
//   }
// }

// function showDurations(playlist, totalSeconds, deviceId) {
//   let html = "";
//   playlist.forEach((track, i) => {
//     const minutes = (track.duration / 60).toFixed(2);
//     html += `<div>
//       <span class="badge bg-primary me-2">${i + 1}</span>
//       <strong>${track.filename}</strong> → ${minutes} นาที
//     </div>`;
//   });

//   html += `<hr>`;
//   html += `<div><strong>รวมทั้งหมด:</strong> ${(totalSeconds / 60).toFixed(2)} นาที</div>`;

//   document.getElementById(`mergedDurations-${deviceId}`).innerHTML = html;
// }

// function clearMergedData(deviceId) {
//   const waveform = document.querySelector(`#mergedWaveform-${deviceId}`);
//   const durations = document.querySelector(`#mergedDurations-${deviceId}`);
//   if (waveform) waveform.innerHTML = "";
//   if (durations) durations.innerHTML = "";
// }
