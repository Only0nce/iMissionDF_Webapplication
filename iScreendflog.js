
(function () {
  "use strict";

  // =============================
  // WebSocket
  // =============================
  let ws = null;
  let wsUri = null;

  function log(...a) { console.log("[DFLOG]", ...a); }
  function warn(...a) { console.warn("[DFLOG]", ...a); }
  function err(...a) { console.error("[DFLOG]", ...a); }

  function wsSend(obj) {
    try {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        warn("WS not open, drop:", obj);
        alert("WebSocket not connected");
        return false;
      }
      ws.send(JSON.stringify(obj));
      return true;
    } catch (e) {
      err("wsSend error:", e);
      return false;
    }
  }

  function connectWS() {
    if (!("WebSocket" in window)) {
      alert("WebSocket NOT supported by your Browser!");
      return;
    }

    // ✅ ws://<host>:8000
    wsUri = "ws://" + location.hostname + ":8000";
    ws = new WebSocket(wsUri);

    ws.onopen = function () {
      log("WS open:", wsUri);
      // optional handshake
      wsSend({ menuID: "DFLOG_page_online", path: location.pathname });
    };

    ws.onmessage = function (evt) {
      const received = evt.data;

      let obj = null;
      try { obj = JSON.parse(received); }
      catch (_) { return; } // ignore non-json

      handleWsMessage(obj);
    };

    ws.onclose = function () {
      warn("WS closed, reconnect...");
      setTimeout(connectWS, 1500);
    };

    ws.onerror = function (e) {
      warn("WS error", e);
    };
  }

  // =============================
  // DOM helpers
  // =============================
  function qs(sel, root = document) { return root.querySelector(sel); }
  function qsAll(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  function toast(msg) {
    // คุณจะเปลี่ยนเป็น Bootstrap toast ได้ภายหลัง
    alert(msg);
  }

  function cssEscape(s) {
    // escape สำหรับ querySelector attribute
    return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  }

  function removeCardByRel(rel) {
    // ต้องมีใน HTML: class="log-card" data-rel="REL/PATH.csv"
    const card = document.querySelector('.log-card[data-rel="' + cssEscape(rel) + '"]');
    if (!card) return;

    // ถ้ามี col wrapper -> ลบทั้งก้อน
    const col = card.closest(".col-12");
    if (col) col.remove();
    else card.remove();
  }

  function setCardDeleting(rel, deleting) {
    const card = document.querySelector('.log-card[data-rel="' + cssEscape(rel) + '"]');
    if (!card) return;
    if (deleting) {
      card.style.opacity = "0.55";
      card.style.pointerEvents = "none";
    } else {
      card.style.opacity = "";
      card.style.pointerEvents = "";
    }
  }

  // =============================
  // Selection helpers
  // =============================
  window.DFLOG_updateCount = function () {
    const n = qsAll(".logCheck").filter(x => x.checked).length;
    const el = document.getElementById("selCount");
    if (el) el.textContent = String(n);
  };

  window.DFLOG_toggleAll = function (on) {
    qsAll(".logCheck").forEach(c => (c.checked = !!on));
    window.DFLOG_updateCount();
  };

  // =============================
  // Delete via WS
  // =============================
  // เรียกจากปุ่ม bulk: onclick="return DFLOG_sendDeleteSelectedWS();"
  window.DFLOG_sendDeleteSelectedWS = function () {
    const selected = qsAll(".logCheck").filter(x => x.checked).map(x => String(x.value || ""));
    if (selected.length <= 0) {
      alert("No files selected.");
      return false;
    }
    if (!confirm("Delete " + selected.length + " selected file(s)?")) return false;

    // lock UI cards
    selected.forEach(rel => setCardDeleting(rel, true));

    wsSend({
      menuID: "DFLOG_delete_selected",
      files: selected
    });

    return false; // prevent form submit
  };

  function sendDeleteOne(rel) {
    if (!rel) return;
    if (!confirm("Delete this log: " + rel + " ?")) return;

    setCardDeleting(rel, true);

    wsSend({
      menuID: "DFLOG_delete_one",
      rel: rel
    });
  }

  function bindDeleteButtons() {
    // ปุ่มเดี่ยว: <button class="df-del-one" data-file="REL.csv">
    qsAll(".df-del-one").forEach(btn => {
      if (btn.__df_bound) return;
      btn.__df_bound = true;

      btn.addEventListener("click", function (e) {
        e.preventDefault();
        const rel = String(btn.dataset.file || "");
        sendDeleteOne(rel);
      });
    });
  }

  // =============================
  // Handle WS responses from C++/Qt
  // =============================
  function handleWsMessage(obj) {
    const menuID = String(obj.menuID || "");

    // ---- single delete result
    if (menuID === "DFLOG_delete_result") {
      const ok  = !!obj.ok;
      const rel = String(obj.rel || "");
      const msg = String(obj.msg || "");

      if (rel) setCardDeleting(rel, false);

      if (ok && rel) {
        removeCardByRel(rel);
        window.DFLOG_updateCount();
        toast("Deleted: " + rel);
      } else {
        toast("Delete failed: " + (msg || rel || "unknown"));
      }
      return;
    }

    // ---- bulk delete result
    if (menuID === "DFLOG_delete_bulk_result") {
      const deleted = Array.isArray(obj.deleted) ? obj.deleted : [];
      const failed  = Array.isArray(obj.failed) ? obj.failed : [];

      // unlock all cards first
      deleted.forEach(rel => setCardDeleting(String(rel), false));
      failed.forEach(x => setCardDeleting(String(x.rel || ""), false));

      // remove deleted cards
      deleted.forEach(rel => removeCardByRel(String(rel)));
      window.DFLOG_updateCount();

      let out = "";
      if (deleted.length > 0) out += "Deleted " + deleted.length + " file(s). ";
      if (failed.length > 0) {
        out += "Failed " + failed.length + " file(s).";
        const preview = failed.slice(0, 3).map(x => {
          const r = String(x.rel || "");
          const m = String(x.msg || "");
          return r + (m ? (": " + m) : "");
        }).join(" | ");
        if (preview) out += " (" + preview + ")";
      }
      if (!out) out = "Done.";
      toast(out);
      return;
    }
  if (menuID === "reloadweb") {
    window.location.reload();
    return;
  }
    // ถ้ามีเมนูอื่นๆ ก็ปล่อยผ่าน
    // log("WS msg:", obj);
  }

  // ===============================
  // MGRS -> Google Maps
  // ===============================
  function bindMgrsLinks() {
    qsAll(".mgrs-link").forEach(function (el) {
      if (el.__mgrs_bound) return;
      el.__mgrs_bound = true;

      el.addEventListener("click", function (e) {
        e.preventDefault();

        const raw = String(el.dataset.mgrs || "");
        const mgrsStr = raw.replace(/\s+/g, "").toUpperCase();
        if (!mgrsStr) return;

        try {
          const pt = mgrs.toPoint(mgrsStr); // [lon, lat]
          const lon = Number(pt[0]).toFixed(6);
          const lat = Number(pt[1]).toFixed(6);

          const url = "https://www.google.com/maps?q=" + encodeURIComponent(lat + "," + lon);
          window.open(url, "_blank", "noopener");
        } catch (e2) {
          alert("Invalid MGRS: " + raw);
          console.error(e2);
        }
      });
    });
  }

  // =============================
  // Init
  // =============================
  document.addEventListener("DOMContentLoaded", function () {
    connectWS();
    bindDeleteButtons();
    bindMgrsLinks();
    window.DFLOG_updateCount();
  });

})();
