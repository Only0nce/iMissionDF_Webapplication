

const modeList = [
  { name: "FM", text: "nfm", mode: "Analog", bw: "fmIFBW" },
  { name: "WFM", text: "wfm", mode: "Analog", bw: "wfmIFBW" },
  { name: "AM", text: "am", mode: "Analog", bw: "amIFBW" },
  { name: "LSB", text: "lsb", mode: "Analog", bw: "lsbIFBW" },
  { name: "USB", text: "usb", mode: "Analog", bw: "usbIFBW" },
  { name: "CW", text: "cw", mode: "Analog", bw: "cwIFBW" },
  { name: "SAM", text: "sam", mode: "Analog", bw: "amIFBW" },
  { name: "DATA", text: "usbd", mode: "Digital", bw: "usbdIFBW" },
  { name: "DMR", text: "dmr", mode: "Digital", bw: "dmrIFBW" },
  { name: "D-Star", text: "dstar", mode: "Digital", bw: "dstarIFBW" },
  { name: "NXDN", text: "nxdn", mode: "Digital", bw: "nxdnIFBW" }
];

const bwData = {
  fmIFBW: [ { name: "30kHz", low: -15000, high: 15000 }, { name: "15kHz", low: -7500, high: 7500 }, { name: "6kHz", low: -3000, high: 3000 }, { name: "4kHz", low: -2000, high: 2000 } ],
  wfmIFBW: [ { name: "250kHz", low: -125000, high: 125000 }, { name: "200kHz", low: -100000, high: 100000 }, { name: "150kHz", low: -75000, high: 75000 }, { name: "100kHz", low: -50000, high: 50000 } ],
  amIFBW: [ { name: "15kHz", low: -7500, high: 7500 }, { name: "8kHz", low: -4000, high: 4000 }, { name: "5.5kHz", low: -2750, high: 2750 }, { name: "3.8kHz", low: -1900, high: 1900 } ],
  lsbIFBW: [ { name: "5.5kHz", low: -300, high: -5800 }, { name: "2.7kHz", low: -300, high: -3000 } ],
  usbIFBW: [ { name: "5.5kHz", low: 300, high: 5800 }, { name: "2.7kHz", low: 300, high: 3000 } ],
  cwIFBW: [ { name: "500Hz", low: 500, high: 1000 }, { name: "200Hz", low: 700, high: 900 } ],
  usbdIFBW: [ { name: "2.6kHz", low: 300, high: 2900 }, { name: "2.4kHz", low: 300, high: 2700 }, { name: "0.7kHz", low: 300, high: 1000 } ],
  dmrIFBW: [ { name: "12.5kHz", low: -6250, high: 6250 } ],
  dstarIFBW: [ { name: "6.5kHz", low: -3250, high: 3250 } ],
  nxdnIFBW: [ { name: "6.5kHz", low: -3250, high: 3250 } ]
};

let selectedMode = null;
let selectedBW = null;

function setModeGroup(modeType) {
  const modeRow = document.getElementById("modeOptions");
  modeRow.innerHTML = '';
  selectedMode = null;
  selectedBW = null;
  document.getElementById("bwOptions").innerHTML = '';

  modeList.filter(m => m.mode === modeType).forEach(mod => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-secondary w-100";
    btn.textContent = mod.name;
    btn.onclick = () => selectMode(mod);
    const col = document.createElement("div");
    col.className = "col";
    col.appendChild(btn);
    modeRow.appendChild(col);
  });
}

function selectMode(mod) {
  selectedMode = mod;

  const bwInputDiv = document.getElementById("bandwidthInputs");
  if (mod.mode === "Analog") {
    bwInputDiv.style.display = "block";
  } else {
    bwInputDiv.style.display = "none";
  }
  // Clear previous selection style
  document.querySelectorAll("#modeOptions .btn").forEach(btn => btn.classList.remove("active", "btn-primary"));
  
  // Add new buttons for BW
  const bwRow = document.getElementById("bwOptions");
  bwRow.innerHTML = '';
  (bwData[mod.bw] || []).forEach(bw => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-info w-100";
    btn.textContent = bw.name;
    btn.onclick = () => selectBW(btn, bw);
    const col = document.createElement("div");
    col.className = "col";
    col.appendChild(btn);
    bwRow.appendChild(col);
  });

  // Highlight selected button
  const modeButtons = document.querySelectorAll("#modeOptions .btn");
  modeButtons.forEach(btn => {
    if (btn.textContent === mod.name) {
      btn.classList.add("active", "btn-primary");
    }
  });
}

function applyModSelection() {
  if (!selectedMode || !selectedBW) return;
  
  // 1) อัปเดตค่าตัวแปร BW ทั้งใน local และบน window (ที่ drawOverlayLine ใช้)
  currentLowCut  = selectedBW.low;
  currentHighCut = selectedBW.high;
  window.currentLowCut  = selectedBW.low;
  window.currentHighCut = selectedBW.high;

  // 2) sync ลง Low / High Cut input ใน UI
  const lowInput  = document.getElementById("lowCutInput");
  const highInput = document.getElementById("highCutInput");

  if (lowInput)  lowInput.value  = window.currentLowCut;
  if (highInput) highInput.value = window.currentHighCut;

  // บอกว่า BW มาจาก panel/preset ไม่ใช่ user กำลังลาก/พิมพ์อยู่
  window.changeBandwidth = false;

  // 3) ส่ง dspcontrol ไป server
  const message = {
    type: "dspcontrol",
    params: {
      mod: selectedMode.text,                      // e.g. "wfm"
      low_cut: selectedBW.low,                     // e.g. -75000
      high_cut: selectedBW.high,                   // e.g. 75000
      offset_freq: Math.round(offsetFrequency),    // current offset
      squelch_level: squelchLevel || -150,         // current SQL
      dmr_filter: 3,                               // optional static/default
      audio_service_id: 0,                         // optional static/default
      secondary_mod: false                         // optional static/default
    }
  };

  // ใช้ helper เดิม
  if (typeof sendMessageToServer === "function") {
    sendMessageToServer(message);
  } else if (typeof ws !== "undefined" && ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else if (typeof ws_ !== "undefined" && ws_ && ws_.readyState === WebSocket.OPEN) {
    ws_.send(JSON.stringify(message));
  }

  console.log("Sent modulation config:", message);

  // 4) start dspcontrol เหมือนเดิม
  if (typeof ws !== "undefined" && ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "dspcontrol", action: "start" }));
  } else if (typeof ws_ !== "undefined" && ws_ && ws_.readyState === WebSocket.OPEN) {
    ws_.send(JSON.stringify({ type: "dspcontrol", action: "start" }));
  }

  // 5) บังคับให้วาด scale ใหม่ → drawOverlayLine() จะอ่าน currentLowCut/HighCut แล้ว highlight BW ใหม่
  if (typeof drawScale === "function") {
    drawScale();
  }

  changeBandwidth = false;
}


function cancelModSelection() {
  selectedMode = null;
  selectedBW = null;
  document.getElementById("modeOptions").innerHTML = '';
  document.getElementById("bwOptions").innerHTML = '';
}
function selectBW(button, bw) {
  selectedBW = bw;
  document.querySelectorAll("#bwOptions .btn").forEach(btn => btn.classList.remove("active", "btn-primary"));
  button.classList.add("active", "btn-primary");
}
function setModeGroupUI(type) {
  // Visual update
  document.getElementById("btnAnalog").classList.remove("active", "btn-primary");
  document.getElementById("btnDigital").classList.remove("active", "btn-primary");
  if (type === "Analog") {
    document.getElementById("btnAnalog").classList.add("active", "btn-primary");
  } else {
    document.getElementById("btnDigital").classList.add("active", "btn-primary");
  }

  // Load mode options
  setModeGroup(type);
}
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleModBtn");
  const panel = document.getElementById("modulationPanel");

  toggleBtn.addEventListener("click", () => {
    const isVisible = panel.style.display !== "none";
    panel.style.display = isVisible ? "none" : "block";
    toggleBtn.textContent = isVisible ? "Show Modulation Settings" : "Hide Modulation Settings";
  });
});


function toggleModulationPanel() {
  const panel = document.getElementById("modulationPanel");
  const label = document.getElementById("toggleModLabel") || document.getElementById("toggleModBtn");

  if (panel.classList.contains("show")) {
    panel.classList.remove("show");
  } else {
    panel.classList.add("show");
  }
}
