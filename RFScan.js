// ===== RF Scan Logic =====
(function(){
  const el = (id)=> document.getElementById(id);

  let running = false;
  let stepsTotal = 0;
  let hzStart = 0, hzStop = 0, stepHz = 0, dwellMs = 0;
  let modes = [];

  function mhzToHz(m){ return Math.round(Number(m) * 1e6); }
  function khzToHz(k){ return Math.round(Number(k) * 1e3); }
  function hzToMHz(h){ return (Number(h)/1e6).toFixed(6); }

  function calcSteps(hzStart, hzStop, stepHz){
    if (stepHz <= 0) return 1;
    const span = Math.max(0, hzStop - hzStart);
    return Math.floor(span / stepHz) + 1;
  }

  function setUiStateBusy(busy){
    running = busy;
    el('btnStartScan').disabled = busy;
    el('btnStopScan').disabled = !busy;
    setStatus(busy ? 'Running' : 'Idle', busy ? 'success' : 'secondary');
    if (!busy) {
      el('rfScanProgress').style.width = '0%';
      el('rfScanCurrent').textContent = '—';
      el('rfScanSteps').textContent = '—';
    }
  }

  function setStatus(text, variant){
    const b = el('rfScanStatus');
    b.textContent = text;
    b.className = 'badge text-bg-' + (variant || 'secondary');
  }

  // ---- Safe WebSocket sender (ใช้ ws ที่มีอยู่ ถ้าไม่มีจะ fallback) ----
  function sendScanPayload(jsonObj){
    const payload = JSON.stringify(jsonObj);
    // QML-compat: ในโปรเจกต์คุณมีสัญญาณ sCan(JSONstring)
    if (typeof window.sCan === 'function') {
      try { window.sCan(payload); return; } catch(e){ console.warn(e); }
    }
    // ใช้ ws global ถ้ามี
    if (window.ws && ws.readyState === 1) {
      ws.send(payload); return;
    }
    // เผื่อมีฟังก์ชันกลางอื่น ๆ
    if (typeof window.sendToWebSocket === 'function') {
      window.sendToWebSocket(payload); return;
    }
    console.warn('[RFScan] No WebSocket. Payload:', payload);
  }

  // ---- เริ่มสแกน: ส่ง JSON "เหมือน QML" + option เสริม ----
  function startScan(){
    // อ่านค่าและ validate
    const startMHz = Number(el('rfStartMHz').value);
    const stopMHz  = Number(el('rfStopMHz').value);
    const stepKHz  = Number(el('rfStepKHz').value);
    dwellMs = Math.max(0, Number(el('rfDwellMs').value) || 0);

    if (!isFinite(startMHz) || !isFinite(stopMHz) || startMHz <= 0 || stopMHz <= 0) {
      return toastAlert('Start/Stop must be positive numbers.');
    }
    if (stopMHz <= startMHz) {
      return toastAlert('Stop must be greater than Start.');
    }
    hzStart = mhzToHz(startMHz);
    hzStop  = mhzToHz(stopMHz);
    stepHz  = Math.max(1, khzToHz(stepKHz || 0)); // ขั้นต่ำ 1 Hz (กัน 0)
    stepsTotal = calcSteps(hzStart, hzStop, stepHz);
    if (stepsTotal > 100000) {
      return toastAlert('Too many steps (' + stepsTotal + '). Increase step size.');
    }

    modes = [];
    if (el('modeWide').checked) modes.push('wide');
    if (el('modeNarrow').checked) modes.push('narrow');
    if (modes.length === 0) {
      return toastAlert('Select at least one mode.');
    }

    // ส่งข้อความ "เหมือน QML"
    const msg = {
      objectName: 'Scan',
      frequency: { start: hzStart, stop: hzStop },
      modes: modes,
      stepHz: stepHz,
      dwellMs: dwellMs
    };
    sendScanPayload(msg);

    // อัปเดต UI
    setUiStateBusy(true);
    el('rfScanSteps').textContent = stepsTotal;
  }

  // ---- หยุดสแกน ----
  function stopScan(){
    const msg = { objectName: 'ScanStop' };
    sendScanPayload(msg);
    setUiStateBusy(false);
  }

  // ---- ใช้กับข้อความตอบกลับจาก backend เพื่ออัปเดต progress ----
  // ให้เรียก rfScanOnMessage(jsonObj) จาก webrx.js เมื่อมีข้อความเข้า
  window.rfScanOnMessage = function onMessage(j){
    if (!j || typeof j !== 'object') return;

    // ตัวอย่างที่รองรับ:
    // { objectName: "ScanProgress", currentHz: 145500000, pct: 42.3 }
    // { objectName: "ScanDone" }
    // { objectName: "ScanError", error: "..." }

    if (j.objectName === 'ScanProgress') {
      const pct = Math.max(0, Math.min(100, Number(j.pct) || 0));
      el('rfScanProgress').style.width = pct.toFixed(1) + '%';
      if (j.currentHz != null) {
        el('rfScanCurrent').textContent = hzToMHz(j.currentHz);
      }
    } else if (j.objectName === 'ScanDone') {
      setStatus('Done', 'primary');
      setTimeout(()=> setUiStateBusy(false), 300);
    } else if (j.objectName === 'ScanError') {
      setStatus('Error', 'danger');
      toastAlert(j.error || 'Unknown error');
      setUiStateBusy(false);
    }
  };

  // ---- Toast helper (ใช้ ModalAlert ที่คุณมีอยู่ก็ได้) ----
  function toastAlert(msg){
    console.warn('[RFScan]', msg);
    // ถ้ามี Bootstrap Toast ของคุณเอง ให้แทนที่ตรงนี้
    // ใช้ ModalAlert ที่มีแล้ว:
    const body = document.querySelector('#ModalAlert .modal-body');
    if (body) body.textContent = String(msg);
    const modal = new bootstrap.Modal(document.getElementById('ModalAlert'));
    modal.show();
  }

  // ---- bind ปุ่ม ----
  window.addEventListener('DOMContentLoaded', ()=>{
    el('btnStartScan').addEventListener('click', startScan);
    el('btnStopScan').addEventListener('click',  stopScan);
  });

})();

function changeMemory(){
  const myButton = document.getElementById("btnStopChange")
  const text = document.getElementById("memoryText")
  let currentState = 'Memory';
  
  myButton.onclick = function() {
    if (currentState === 'Memory') {
      currentState = ' Scan ';
      text.textContent = currentState;
    } else {
      currentState = 'Memory';
      text.textContent = currentState;
    }
  };
}