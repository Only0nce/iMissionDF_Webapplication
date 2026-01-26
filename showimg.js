(function () {
  "use strict";

  // =============================
  // WebSocket
  // =============================
  let ws = null;
  let wsUri = null;

  function log(...a) { console.log("[SHOWIMG]", ...a); }
  function warn(...a) { console.warn("[SHOWIMG]", ...a); }
  function err(...a) { console.error("[SHOWIMG]", ...a); }

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

    wsUri = "ws://" + location.hostname + ":8000";
    ws = new WebSocket(wsUri);

    ws.onopen = function () {
      log("WS open:", wsUri);
      wsSend({ menuID: "SHOWIMG_page_online", path: location.pathname });
    };

    ws.onmessage = function (evt) {
      let obj = null;
      try { obj = JSON.parse(evt.data); }
      catch (_) { return; }
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
    alert(msg);
  }

  function cssEscape(s) {
    return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  }

  function findCardByRel(rel) {
    return document.querySelector('.log-card[data-rel="' + cssEscape(rel) + '"]')
        || document.querySelector('.img-card[data-rel="' + cssEscape(rel) + '"]');
  }

  function setCardDeleting(rel, deleting) {
    const card = findCardByRel(rel);
    if (!card) return;
    if (deleting) {
      card.style.opacity = "0.55";
      card.style.pointerEvents = "none";
    } else {
      card.style.opacity = "";
      card.style.pointerEvents = "";
    }
  }

  function removeCardByRel(rel) {
    const card = findCardByRel(rel);
    if (!card) return;
    const col = card.closest(".col-12");
    if (col) col.remove();
    else card.remove();
  }

  // =============================
  // Selection
  // =============================
  window.SHOWIMG_updateCount = function () {
    const n = qsAll(".imgCheck").filter(x => x.checked).length;
    const el = qs("#selCount");
    if (el) el.textContent = String(n);
  };

  window.SHOWIMG_toggleAll = function (on) {
    qsAll(".imgCheck").forEach(c => (c.checked = !!on));
    window.SHOWIMG_updateCount();
  };

  // =============================
  // Delete via WS (ONLY)
  // =============================
  window.SHOWIMG_deleteOneWS = function (btn) {
    const rel = String(btn?.dataset?.file || "");
    if (!rel) return false;

    if (!confirm("Delete this image: " + rel + " ?")) return false;

    setCardDeleting(rel, true);

    wsSend({
      menuID: "SHOWIMG_delete_one",
      rel: rel
    });

    return false;
  };

  window.SHOWIMG_sendDeleteSelectedWS = function () {
    const selected = qsAll(".imgCheck").filter(x => x.checked).map(x => String(x.value || ""));
    if (selected.length <= 0) {
      alert("No files selected.");
      return false;
    }
    if (!confirm("Delete " + selected.length + " selected file(s)?")) return false;

    selected.forEach(rel => setCardDeleting(rel, true));

    wsSend({
      menuID: "SHOWIMG_delete_selected",
      files: selected
    });

    return false;
  };

  // =============================
  // Handle WS responses
  // =============================
  function handleWsMessage(obj) {
    const menuID = String(obj.menuID || "");

    // ✅ Qt ส่งมาให้ reload หน้า
    if (menuID === "reloadweb") {
      window.location.reload();
      return;
    }

    // (optional) ถ้า Qt ส่ง result รายตัวมา
    if (menuID === "SHOWIMG_delete_one_result") {
      const ok = !!obj.ok;
      const rel = String(obj.rel || "");
      const reason = String(obj.reason || "");

      if (rel) setCardDeleting(rel, false);

      if (ok && rel) {
        removeCardByRel(rel);
        window.SHOWIMG_updateCount();
        toast("Deleted: " + rel);
      } else {
        toast("Delete failed: " + (reason || rel || "unknown"));
      }
      return;
    }

    if (menuID === "SHOWIMG_delete_selected_result") {
      const results = Array.isArray(obj.results) ? obj.results : [];
      let deleted = 0, failed = 0;

      results.forEach(r => {
        const rel = String(r.rel || "");
        const ok  = !!r.ok;
        const reason = String(r.reason || "");

        if (rel) setCardDeleting(rel, false);

        if (ok && rel) {
          deleted++;
          removeCardByRel(rel);
        } else {
          failed++;
          // ไม่ต้อง toast ทีละอัน
        }
      });

      window.SHOWIMG_updateCount();

      let out = "";
      if (deleted > 0) out += "Deleted " + deleted + " file(s). ";
      if (failed > 0) out += "Failed " + failed + " file(s).";
      if (!out) out = "Done.";
      toast(out);
      return;
    }

    // log("WS msg:", obj);
  }

  // =============================
  // Init
  // =============================
  document.addEventListener("DOMContentLoaded", function () {
    connectWS();
    window.SHOWIMG_updateCount();
  });

})();
