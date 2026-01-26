<?php
  session_start();

  if (empty($_SESSION['UserID'])) {
    header('Location: login.php');
    exit;
  }
  $userID = $_SESSION['UserID'];

  if (!isset($_SESSION['userLevel'])) {
    header('Location: login.php');
    exit;
  }
  $userLevelAdmin = $_SESSION['userLevel'];

  $userName = $_SESSION['userName'] ?? '';
?>

<?php
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

?>
<!doctype html>
<html lang="en" data-bs-theme="auto">
<?php
include('dbConfig.php');
include('ListAudioGain.php');
?>

<head>
    <script src="assets/js/color-modes.js"></script>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors">
    <meta name="generator" content="Hugo 0.122.0">
    <meta http-equiv="Cache-Control" content="no-cache">
    <title>IFZ: iScan MR-10 WebRx</title>
    <link href="assets/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="dashboard.css" rel="stylesheet">
    <script src="dashboard.js?v=<?php echo time();?>"></script>
    <!-- <script src="index_socket.client.js?v=<?php echo time();?>"></script> -->
    <link href="fontawesome-free-5.15.4-web/css/all.min.css" rel="stylesheet" />
    <link href="nouislider.min.css" rel="stylesheet">
    <link rel="stylesheet" href="nouislider_theme.css">
    <script src="nouislider.min.js"></script>

    <style>
    :root {
        --btn-back-border: rgb(93, 101, 109);
        --btn-back-text: #444;
        --btn-back-hover-bg: #e9ecef;
    }

    [data-bs-theme="dark"] {
        --btn-back-border: #aaa;
        --btn-back-text: #fff;
        --btn-back-hover-bg: #333;
    }

    #scanDetailBackBtn {
        border-color: var(--btn-back-border);
        color: var(--btn-back-text);
    }

    #scanDetailBackBtn:hover {
        background: var(--btn-back-hover-bg);
    }

    .scan-detail-clock {
        font-weight: 700;
        font-size: 1.05rem;
        letter-spacing: 0.2px;
        color: var(--accent-color);
        background: var(--card-bg-hover);
        border: 1px solid var(--border-color);
        border-radius: 10px;
        padding: 6px 12px;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }

    .scan-result-time {
        display: block;
        font-weight: 600;
        font-size: 0.9rem;
        /* slightly smaller than preset-title */
        color: var(--text-sub);
        padding-top: 4px;
        line-height: 1.35;
    }

    .scan-detail-clock {
        flex: 1;
        text-align: center;
        font-weight: 600;
        font-size: 0.95rem;
        color: var(--text-main, #1f2933);
        white-space: nowrap;
    }

    .scan-preset-single {
        margin-bottom: 16px;
    }

    .scan-preset-single .preset-body {
        margin-top: 0px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        padding-top: 0px;
    }

    .scan-detail-panel {
        margin-top: 8px;
    }

    #scanRFDetailGrid .preset-card {
        margin-bottom: 10px;
    }



    .delete-all-btn {
        padding: 6px 14px;
        font-size: 14px;
        font-weight: 600;
        border-radius: 8px;
        border: 1px solid #ef4444;
        background: rgba(220, 38, 38, 0.15);
        color: #f87171;
        cursor: pointer;

        transition: 0.2s ease-in-out;
    }

    .delete-all-btn:hover {
        background: #ef4444;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(239, 68, 68, 0.35);
    }

    .delete-all-btn:active {
        transform: translateY(0);
        box-shadow: none;
    }

    /* ===== Theme variables ===== */
    :root[data-bs-theme="dark"] {
        --card-bg: #1c2430;
        --card-bg-hover: #222b38;
        --border-color: #3d4a5c;
        --border-hover: #00c896;
        --accent-color: #00c896;
        --text-main: #e6edf3;
        --text-sub: #9aa6b2;
    }

    :root[data-bs-theme="light"] {
        --card-bg: #ffffff;
        --card-bg-hover: #f4f6fb;
        --border-color: #ced4da;
        --border-hover: #0d6efd;
        --accent-color: #0d6efd;
        --text-main: #1f2933;
        --text-sub: #6c757d;
    }


    /* ===== Add New Preset Card (Dark + Light mode) ===== */
    #add-preset-card {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 150px;

        border: 2px dashed var(--border-color);
        border-radius: 14px;

        background: var(--card-bg);
        transition: 0.25s ease-in-out;
        cursor: pointer;
    }

    #add-preset-card:hover {
        border-color: var(--border-hover);
        background: var(--card-bg-hover);
        box-shadow: 0 0 12px rgba(0, 0, 0, 0.18);
        transform: scale(1.03);
    }

    #add-preset-card .add-card-inner {
        text-align: center;
        padding: 20px 10px;
    }

    #add-preset-card .add-icon-circle {
        width: 48px;
        height: 48px;
        margin: 0 auto 10px;
        border-radius: 50%;
        background: var(--accent-color);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 22px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
    }

    #add-preset-card .add-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-main);
    }

    #add-preset-card .add-sub {
        font-size: 13px;
        color: var(--text-sub);
        margin-top: 4px;
    }


    .scan-progress .progress {
        height: 18px;
        border-radius: 999px;
        overflow: hidden;
    }

    #scanProgressBar {
        font-size: 0.75rem;
        font-weight: 600;
    }

    /* ===== FORCE STOP BUTTON DISABLED STYLE ===== */
    #btnStartScan.disabled,
    #btnStartScan:disabled,
    #btnStopScan.disabled,
    #btnStopScan:disabled {
        cursor: not-allowed !important;
        pointer-events: auto !important;
        /* ต้องเปิด เพื่อให้ cursor ทำงาน! */
        opacity: 0.45 !important;
    }

    #scanRF,
    #memoryRF {
        transition: opacity 0.3s ease;
    }

    /* ===== Scan Mode Header ===== */
    .scan-header-box {
        padding: 15px 18px;
        margin-bottom: 12px;
        border-radius: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        background: var(--scan-header-bg);
        border: 1px solid var(--scan-header-border);
    }

    .scan-header-title {
        font-size: 1.15rem;
        font-weight: 700;
        letter-spacing: 0.5px;
        color: var(--scan-header-text);
    }

    .scan-header-count {
        font-size: 0.95rem;
        font-weight: 500;
        color: var(--scan-header-text-sub);
    }

    /* ===========================================================
   PRESET CARD THEME SYSTEM (Memory + Scan)
   Theme Controlled by: <html data-bs-theme="dark"> or "light"
   Applies to:
       #memoryRF .preset-card
       #scanRFGrid .preset-card
   =========================================================== */

    /* ------------------------------
   DARK MODE
   ------------------------------ */
    html[data-bs-theme="dark"] #memoryRF .preset-card,
    html[data-bs-theme="dark"] #scanRFGrid .preset-card {
        background: linear-gradient(145deg, #151922, #0d1016);
        border-radius: 18px;
        padding: 16px 18px;
        border: 1px solid rgba(255, 255, 255, 0.05);
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.6);
        transition: 0.18s ease-in-out;
        color: #e6edf3;
    }

    html[data-bs-theme="dark"] #memoryRF .preset-card:hover,
    html[data-bs-theme="dark"] #scanRFGrid .preset-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.85);
        border-color: rgba(0, 200, 150, 0.7);
    }

    /* body ภายในการ์ด */
    html[data-bs-theme="dark"] #memoryRF .preset-body,
    html[data-bs-theme="dark"] #scanRFGrid .preset-body {
        background: rgba(10, 13, 20, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.04);
        border-radius: 12px;
        padding: 12px;
    }

    html[data-bs-theme="dark"] #memoryRF .preset-row span:first-child,
    html[data-bs-theme="dark"] #scanRFGrid .preset-row span:first-child {
        color: #8e9bb0;
    }

    html[data-bs-theme="dark"] #memoryRF .preset-row span:last-child,
    html[data-bs-theme="dark"] #scanRFGrid .preset-row span:last-child {
        color: #f0f4f9;
    }

    /* mode badge */
    html[data-bs-theme="dark"] .badge-mod {
        background: rgba(0, 200, 150, 0.14);
        border: 1px solid rgba(0, 200, 150, 0.42);
        color: #34d399;
    }


    /* ===========================================================
   LIGHT MODE
   =========================================================== */
    html[data-bs-theme="light"] #memoryRF .preset-card,
    html[data-bs-theme="light"] #scanRFGrid .preset-card {
        background: #ffffff;
        border-radius: 16px;
        padding: 16px 18px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 10px 18px rgba(0, 0, 0, 0.06);
        transition: 0.18s ease-in-out;
        color: #1f2937;
    }

    html[data-bs-theme="light"] #memoryRF .preset-card:hover,
    html[data-bs-theme="light"] #scanRFGrid .preset-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 16px 30px rgba(0, 0, 0, 0.1);
        border-color: #00c896;
    }

    /* inner body */
    html[data-bs-theme="light"] #memoryRF .preset-body,
    html[data-bs-theme="light"] #scanRFGrid .preset-body {
        background: #f7fafc;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 12px;
    }

    html[data-bs-theme="light"] #memoryRF .preset-row span:first-child,
    html[data-bs-theme="light"] #scanRFGrid .preset-row span:first-child {
        color: #6b7280;
    }

    html[data-bs-theme="light"] #memoryRF .preset-row span:last-child,
    html[data-bs-theme="light"] #scanRFGrid .preset-row span:last-child {
        color: #1f2937;
    }

    /* mode badge */
    html[data-bs-theme="light"] .badge-mod {
        background: rgba(0, 200, 150, 0.18);
        color: #059669;
        border: 1px solid rgba(0, 200, 150, 0.35);
    }


    /* ===========================================================
   GRID LAYOUT (ใช้ทั้ง 2 โหมด)
   =========================================================== */
    #memoryRF .preset-grid,
    #scanRFGrid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 18px;
        margin-top: 20px;
    }


    /* ========= THEME VARIABLES (Light / Dark) ========= */
    :root[data-bs-theme="light"] {
        --preset-card-bg: #ffffff;
        --preset-card-border: rgba(148, 163, 184, 0.35);
        --preset-card-shadow:
            0 10px 20px -2px rgba(0, 0, 0, 0.04),
            0 2px 15px -3px rgba(0, 0, 0, 0.07);
        --preset-card-hover-bg: radial-gradient(circle at top left, #f9fafb 0%, #e5e7eb 55%, #d1d5db 100%);
        --preset-card-hover-border: rgba(37, 99, 235, 0.7);
        --preset-card-hover-shadow:
            0 18px 40px rgba(37, 99, 235, 0.25);

        --preset-title-color: #0f172a;
        --preset-subtitle-color: #4b5563;

        --preset-body-bg: #f3f4f6;
        --preset-row-label-color: #6b7280;
        --preset-row-value-color: #111827;
    }

    :root[data-bs-theme="dark"] {
        --preset-card-bg: #212529;
        --preset-card-border: rgba(148, 163, 184, 0.35);
        --preset-card-shadow:
            0 14px 28px rgba(0, 0, 0, 0.45),
            0 10px 10px rgba(0, 0, 0, 0.35);
        --preset-card-hover-bg: radial-gradient(circle at top left, #0f172a 0%, #020617 55%, #000 100%);
        --preset-card-hover-border: rgba(45, 212, 191, 0.7);
        --preset-card-hover-shadow:
            0 18px 40px rgba(15, 118, 110, 0.55);

        --preset-title-color: #e5e7eb;
        --preset-subtitle-color: #9ca3af;

        --preset-body-bg: rgba(15, 23, 42, 0.85);
        --preset-row-label-color: #9ca3af;
        --preset-row-value-color: #e5e7eb;
    }

    /* ========= PRESET PAGE LAYOUT ========= */
    .preset-page {
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding: 16px;
    }

    .current-rx-card {
        border-left: 4px solid #22c55e;
        /* เขียว online */
    }

    .preset-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        /* 5 ใบต่อแถว */
        gap: 20px;
        padding: 20px;
    }

    .preset-card {
        min-width: 250px;
        /* ควบคุมขนาดขั้นต่ำ */
        max-width: 280px;
        /* ควบคุมขนาดสูงสุดให้เท่ากัน */
        height: 230px;
        /* สูงคงที่ไม่แกว่ง */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 16px;
        border-radius: 16px;
        background: #1E2530;
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.4);
    }

    /* ========= BASE CARD ========= */
    .type-card-with-links,
    .type-card-with-links * {
        box-sizing: border-box;
    }

    .type-card-with-links {
        background: var(--preset-card-bg);
        border-radius: 14px;
        padding: 18px 18px 14px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        justify-content: space-between;
        position: relative;
        box-shadow: var(--preset-card-shadow);
        border: 1px solid var(--preset-card-border);
        transition:
            transform 0.18s ease-out,
            box-shadow 0.18s ease-out,
            border-color 0.18s ease-out,
            background 0.18s ease-out;
    }

    .type-card-with-links:hover {
        transform: translateY(-4px);
        box-shadow: var(--preset-card-hover-shadow);
        border-color: var(--preset-card-hover-border);
        background: var(--preset-card-hover-bg);
        cursor: pointer;
    }

    /* header ในการ์ด */
    .preset-card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
    }

    .preset-title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--preset-title-color);
        letter-spacing: 0.02em;
    }

    .preset-subtitle {
        font-size: 0.85rem;
        color: var(--preset-subtitle-color);
        margin-top: 2px;
    }

    /* body ข้อมูล key-value */
    .preset-body {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 8px 10px;
        border-radius: 10px;
        background: var(--preset-body-bg);
        width: 100%;
        align-items: center;
        /* จัดให้อยู่ตรงกลาง */
        height: auto;
    }

    .preset-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.82rem;
        color: var(--preset-row-value-color);
    }

    .preset-row span:first-child {
        color: var(--preset-row-label-color);
    }

    /* badges */
    .preset-badges {
        display: flex;
        gap: 6px;
        align-items: center;
    }

    .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 3px 8px;
        border-radius: 999px;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }

    .badge-live {
        background: rgba(34, 197, 94, 0.16);
        color: #4ade80;
        border: 1px solid rgba(74, 222, 128, 0.6);
    }

    .badge-mod {
        background: rgba(56, 189, 248, 0.15);
        color: #7dd3fc;
        border: 1px solid rgba(56, 189, 248, 0.6);
    }

    /* ปุ่มด้านล่างการ์ด */
    .links {
        display: flex;
        justify-content: flex-end;
        gap: 5px;
        margin-top: 8px;
    }

    .link-primary-base {
        width: 100px;
        height: 40px;
        border: none;
        padding: 6px 0;
        border-radius: 999px;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        transition:
            background 0.18s ease-out,
            color 0.18s ease-out,
            box-shadow 0.18s ease-out,
            transform 0.08s ease-out;
    }

    .primary-action {
        background: linear-gradient(135deg, #22c55e, #16a34a);
        color: #020617;
        box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
    }

    .primary-action:hover {
        transform: translateY(-1px);
        box-shadow: 0 12px 28px rgba(34, 197, 94, 0.55);
    }

    .secondary-action {
        background: transparent;
        color: rgba(17, 179, 30, 0.9);
        border: 1px solid rgba(148, 163, 184, 0.6);
    }

    .secondary-action:hover {
        background: rgba(7, 155, 19, 0.9);
        color: #e5e7eb;
    }

    .ghost-action {
        background: transparent;
        color: rgb(168, 4, 4);
        border: 1px solid rgba(148, 163, 184, 0.6);
    }

    .ghost-action:hover {
        background: rgba(255, 0, 0, 0.9);
        color: #f9fafb;
    }

    /* ========= ZOOM UI BAR (Light / Dark mode) ========= */

    /* Theme variables เฉพาะปุ่มใน zoom-ui-bar */
    :root[data-bs-theme="light"] {
        --zoom-btn-bg: #f0f2f4;
        --zoom-btn-bg-hover: #e4e7eb;
        --zoom-btn-border: #cbd5e1;
        --zoom-btn-text: #1e293b;

        --zoom-secondary-bg1: #f3f4f6;
        --zoom-secondary-bg2: #e5e7eb;
        --zoom-secondary-text: #1e293b;
        --zoom-secondary-border: rgba(0, 0, 0, 0.15);

        --zoom-outline-info-bg1: rgba(56, 189, 248, 0.08);
        --zoom-outline-info-bg2: rgba(56, 189, 248, 0.15);
        --zoom-outline-info-text: #0f6aa9;
        --zoom-outline-info-border: rgba(14, 165, 233, 0.4);
    }

    :root[data-bs-theme="dark"] {
        --zoom-btn-bg: #2f3a41;
        --zoom-btn-bg-hover: #364249;
        --zoom-btn-border: #4b5563;
        --zoom-btn-text: #e2e8f0;

        --zoom-secondary-bg1: #3f4950;
        --zoom-secondary-bg2: #31383e;
        --zoom-secondary-text: #eaf2f7;
        --zoom-secondary-border: rgba(170, 200, 230, 0.14);

        --zoom-outline-info-bg1: rgba(28, 40, 46, 0.75);
        --zoom-outline-info-bg2: rgba(24, 33, 39, 0.75);
        --zoom-outline-info-text: #7ee1c4;
        --zoom-outline-info-border: rgba(126, 225, 196, 0.35);
    }

    /* ========= ตัวกล่อง Zoom UI ========= */
    .zoom-ui-bar {
        position: fixed;
        /* ลอยบนสุด */
        z-index: 1000;
        pointer-events: none;
        /* ให้คลิกโดนเฉพาะกล่องข้างใน */
        inset: auto auto auto auto;
        transform: none !important;
        contain: layout paint;
        opacity: 0.25;
        /* จางตอนปกติ */
        transition: opacity 0.25s ease-in-out;
    }

    .zoom-ui-bar:hover {
        opacity: 1;
        /* ชัดเมื่อ hover */
    }

    .zoom-ui-bar .zoom-box {
        pointer-events: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    /* ========= ปุ่มพื้นฐานใน zoom-ui-bar ========= */
    .zoom-ui-bar .btn {
        width: 150px;
        height: 42px;
        padding: 0;
        border-radius: 12px;
        font-size: 14px;
        line-height: 42px;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        background: var(--zoom-btn-bg);
        border: 1px solid var(--zoom-btn-border);
        color: var(--zoom-btn-text);

        transition:
            background 0.18s ease-out,
            color 0.18s ease-out,
            box-shadow 0.18s ease-out,
            transform 0.08s ease-out;
    }

    .zoom-ui-bar .btn:hover {
        transform: translateY(-1px);
        background: var(--zoom-btn-bg-hover);
        box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.08),
            0 6px 18px rgba(0, 0, 0, 0.45);
    }

    .zoom-ui-bar .btn:active {
        transform: translateY(0);
        box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.06),
            0 2px 10px rgba(0, 0, 0, 0.35);
    }

    .zoom-ui-bar .btn:focus-visible {
        outline: none;
        box-shadow:
            0 0 0 2px rgba(23, 160, 137, 0.35),
            0 6px 18px rgba(0, 0, 0, 0.45),
            inset 0 0 0 1px rgba(255, 255, 255, 0.08);
    }

    /* lock ฟอนต์ไม่ให้สวิงตาม content ข้างล่าง */
    .zoom-ui-bar,
    .zoom-ui-bar * {
        font-size: 14px;
        /* lock ขนาดอักษรของ zoom UI */
    }

    /* ========= ปุ่ม Zoom (- / Reset / +) ========= */
    .zoom-ui-bar .btn.btn-secondary {
        background: linear-gradient(180deg, var(--zoom-secondary-bg1) 0%, var(--zoom-secondary-bg2) 100%);
        color: var(--zoom-secondary-text);
        border-color: var(--zoom-secondary-border);
    }

    .zoom-ui-bar .btn.btn-secondary:hover {
        background: linear-gradient(180deg, var(--zoom-secondary-bg2) 0%, var(--zoom-secondary-bg1) 100%);
    }

    /* ปรับ Reset ให้กว้างขึ้นนิดนึง */
    .zoom-ui-bar .btn[title="Reset (R)"] {
        width: auto;
        padding: 0 10px;
        font-size: 14px;
    }

    /* ========= ปุ่ม Waterfall / Max Hold ========= */
    .zoom-ui-bar .btn.btn-outline-info {
        background: linear-gradient(180deg, var(--zoom-outline-info-bg1) 0%, var(--zoom-outline-info-bg2) 100%);
        color: var(--zoom-outline-info-text);
        border-color: var(--zoom-outline-info-border);
        width: auto;
        padding: 0 12px;
        font-size: 14px;
    }

    .zoom-ui-bar .btn.btn-outline-info:hover {
        background: linear-gradient(180deg, var(--zoom-outline-info-bg2) 0%, var(--zoom-outline-info-bg1) 100%);
        color: var(--zoom-outline-info-text);
        box-shadow:
            0 2px 12px rgba(0, 0, 0, 0.35),
            inset 0 0 0 1px rgba(255, 255, 255, 0.06);
    }

    /* สถานะ active สำหรับ toggle (เช่น Waterfall, Max Hold เปิดอยู่) */
    .zoom-ui-bar .btn.btn-outline-info.active,
    .zoom-ui-bar .btn.btn-outline-info[aria-pressed="true"] {
        background: linear-gradient(180deg, rgba(20, 68, 60, 0.95) 0%, rgba(17, 56, 49, 0.95) 100%);
        color: #e9fffa !important;
        border-color: rgba(126, 225, 196, 0.85);
    }
    </style>


</head>

<!-- Modal Alert-->
<div class="modal fade" id="ModalAlert" tabindex="-1" aria-labelledby="Alert" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="Alert">Alert</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                Unable to connect to the iScan Receiver Module.
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
<header class="navbar sticky-top flex-md-nowrap p-0 shadow" style="background-color:#000000DD;">
    <svg class="bi_logo m-1">
        <use xlink:href="dashboard.svg?v=<?php echo time();?>#logo"></use>
    </svg>
    <ul class="navbar-nav flex-row d-md-none">
        <li class="nav-item text-nowrap">
            <button class="nav-link px-3 text-white" type="button" data-bs-toggle="offcanvas"
                data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false"
                aria-label="Toggle navigation">
                <svg class="bi">
                    <use xlink:href="dashboard.svg?v=<?php echo time();?>#list" />
                </svg>
            </button>
        </li>
    </ul>

    <div id="navbarSearch" class="navbar-search w-100 collapse">
        <input class="form-control w-100 rounded-0 border-0" type="text" placeholder="Search" aria-label="Search">
    </div>
</header>

<body>
    <div class="dropdown position-fixed bottom-0 end-0 mb-3 me-3 bd-mode-toggle">
        <button class="btn btn-bd-primary py-2 dropdown-toggle d-flex align-items-center" id="bd-theme" type="button"
            aria-expanded="false" data-bs-toggle="dropdown" aria-label="Toggle theme (auto)">
            <svg class="bi my-1 theme-icon-active" width="1em" height="1em">
                <use href="dashboard.svg?v=<?php echo time();?>#circle-half"></use>
            </svg>
            <span class="visually-hidden" id="bd-theme-text">Toggle theme</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
            <li>
                <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="light"
                    aria-pressed="false">
                    <svg class="bi me-2 opacity-50" width="1em" height="1em">
                        <use href="dashboard.svg?v=<?php echo time();?>#sun-fill"></use>
                    </svg>
                    Light
                    <svg class="bi ms-auto d-none" width="1em" height="1em">
                        <use href="dashboard.svg?v=<?php echo time();?>#check2"></use>
                    </svg>
                </button>
            </li>
            <li>
                <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="dark"
                    aria-pressed="false">
                    <svg class="bi me-2 opacity-50" width="1em" height="1em">
                        <use href="dashboard.svg?v=<?php echo time();?>#moon-stars-fill"></use>
                    </svg>
                    Dark
                    <svg class="bi ms-auto d-none" width="1em" height="1em">
                        <use href="dashboard.svg?v=<?php echo time();?>#check2"></use>
                    </svg>
                </button>
            </li>
            <li>
                <button type="button" class="dropdown-item d-flex align-items-center active" data-bs-theme-value="auto"
                    aria-pressed="true">
                    <svg class="bi me-2 opacity-50" width="1em" height="1em">
                        <use href="dashboard.svg?v=<?php echo time();?>#circle-half"></use>
                    </svg>
                    Auto
                    <svg class="bi ms-auto d-none" width="1em" height="1em">
                        <use href="dashboard.svg?v=<?php echo time();?>#check2"></use>
                    </svg>
                </button>
            </li>
        </ul>
    </div>
    <div class="container-fluid">
        <div class="row">
            <div class="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
                <div class="offcanvas-md offcanvas-end bg-body-tertiary" tabindex="-1" id="sidebarMenu"
                    aria-labelledby="sidebarMenuLabel">
                    <div class="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
                        <ul class="nav flex-column">
                            <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2 <?php if($deviceName == "") echo 'active'; ?> "
                                    aria-current="page" href="javascript:location.reload();">
                                    <svg class="bi">
                                        <use xlink:href="dashboard.svg?v=<?php echo time();?>#house-fill" />
                                    </svg>
                                    Home
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2" href="playRecording.php">
                                    <svg class="bi">
                                        <use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#record-vinyl" />
                                    </svg>
                                    Recorder Playback
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2" aria-current="page"
                                    href="eventLoggerData.php">
                                    <svg class="bi">
                                        <use
                                            xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg?v=<?php echo time();?>#layer-group" />
                                    </svg>
                                    Event Logger
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2" aria-current="page"
                                    href="audiofiles">
                                    <svg class="bi">
                                        <use
                                            xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg?v=<?php echo time();?>#file-audio" />
                                    </svg>
                                    Audio Archive
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2" aria-current="page"
                                    href="mapvisual.php">
                                    <svg class="bi">
                                        <use xlink:href="dashboard.svg?v=<?php echo time();?>#mapvisual" />
                                    </svg>
                                    Map Visual
                                </a>
                            </li>
                        </ul>

                        <hr class="my-3">
                        <h6
                            class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
                            <span>Device Manager</span>
                        </h6>


                        <ul class="nav flex-column mb-auto">
                            <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2" href="user.php">
                                    <svg class="bi">
                                        <use xlink:href="fontawesome-free-5.15.4-web/sprites/regular.svg#user" />
                                    </svg>
                                    Users
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2" href="showimg.php">
                                    <svg class="bi">
                                        <use xlink:href="dashboard.svg?v=<?php echo time();?>#picture" />
                                    </svg>
                                    Picture
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2" href="iScreendflog.php">
                                    <svg class="bi">
                                        <use xlink:href="dashboard.svg?v=<?php echo time();?>#logdf" />
                                    </svg>
                                    DFlog Viewer
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2" href="dfrole.php">
                                    <svg class="bi">
                                        <use xlink:href="dashboard.svg#DFGroup" />
                                    </svg>
                                    DF Role Setting
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2" href="dfdevice.php">
                                    <svg class="bi">
                                        <use xlink:href="dashboard.svg?v=<?php echo time();?>#DFDevice" />
                                    </svg>
                                    DF Device Settings
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2" href="settings.php">
                                    <svg class="bi">
                                        <use xlink:href="dashboard.svg?v=<?php echo time();?>#gear-wide-connected" />
                                    </svg>
                                    Settings
                                </a>
                            </li>

                            <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2" href="controler.php">
                                    <svg class="bi">
                                        <use xlink:href="dashboard.svg?v=<?php echo time();?>#plus-circle" />
                                    </svg>
                                    Register Device
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2" href="logout.php">
                                    <svg class="bi">
                                        <use xlink:href="dashboard.svg?v=<?php echo time();?>#door-closed" />
                                    </svg>
                                    <?php echo "Sign out(" .$userName.")" ?>
                                </a>
                            </li>
                        </ul>

                        <hr class="my-3">
                        <div id="div1" class=" container m-0 p-1 " style=" width: 98%;">
                            <div id="modulationPanel" style="display: none;">
                                <div class="card p-1 " id="setModCard">
                                    <h5 class="text-center">Option decode mode</h5>

                                    <div class="btn-group mb-2" role="group">
                                        <button id="btnAnalog" class="btn btn-outline-primary"
                                            onclick="setModeGroupUI('Analog')">Analog</button>
                                        <button id="btnDigital" class="btn btn-outline-primary"
                                            onclick="setModeGroupUI('Digital')">Digital</button>
                                    </div>


                                    <div class="row row-cols-2 g-2" id="modeOptions"></div>
                                    <div class="row row-cols-2 g-2 mt-3" id="bwOptions"></div>

                                    <div class="btn-group mt-3" role="group">
                                        <button class="btn btn-outline-secondary w-100"
                                            onclick="cancelModSelection()">Cancel</button>
                                        <button class="btn btn-out
              line-primary w-100" onclick="applyModSelection()">Update</button>
                                    </div>
                                </div>
                            </div>

                            <button id="toggleModBtn" class="btn btn-outline-primary mt-2 w-100"
                                onclick="toggleModulationPanel()">
                                <span id="toggleModLabel">Show Modulation Settings</span>
                            </button>
                        </div>


                        <div id="bandwidthInputs" class=" container m-0 p-1 " style=" width: 98%; display: none;">
                            <div id="div2" class=" card m-1 p-3 " style=" width: 100%;height: 100%;">
                                <div>
                                    <label for="lowCutInput">Low Cut (Hz):</label>
                                    <input class="form-control" type="number" id="lowCutInput" value="300" min="0"
                                        step="100">
                                </div>
                                <div>
                                    <label for="highCutInput">High Cut (Hz):</label>
                                    <input class="form-control" type="number" id="highCutInput" value="3000" min="0"
                                        step="100">
                                </div>
                                <button class="btn btn-outline-primary mt-2 w-100" onclick="sendCutFrequencies()">Apply
                                    Cut Frequencies</button>
                            </div>
                        </div>

                        <div
                            class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                            <!-- <h1 class="h2">ADC Trigger Setting</h1> -->
                            <div class="btn-toolbar mb-2 mb-md-0"></div>
                        </div>




                        <div id="div1" class=" container m-0 p-1 " style=" width: 98%;">
                            <div id="div2" class=" card m-1 p-3 " style=" width: 100%;height: 100%;">
                                <label class="form-label fw-bold">Waterfall dB Range:
                                    <span id="dbRangeLabel" class="badge bg-secondary ms-2">Min: -120 dB Max: -30
                                        dB</span></label>
                                <div id="dbRangeSlider" class="mb-2"></div>
                            </div>

                        </div>

                        <div id="div1" class=" container m-0 p-1 " style=" width: 98%;">
                            <div id="div2" class=" card m-1 p-3 " style=" width: 100%;height: 100%;">
                                <label class="form-label fw-bold">
                                    Squelch Threshold:
                                    <span id="sqlLevelLabel" class="badge bg-secondary ms-2">-150 dB</span>
                                </label>
                                <div id="sqlLevelSlider" class="mb-2"></div>
                            </div>
                        </div>


                        <div id="div1" class=" container m-0 p-1 " style=" width: 98%;">
                            <div id="div2" class=" card m-1 p-2 " style=" width: 100%;height: 100%;">
                                <canvas id="smeter-fill" height="80" width="776"
                                    style="border-width:0px;margin-bottom: 0px;"></canvas>
                            </div> <!-- div2 -->
                        </div> <!-- div1 -->



                    </div>
                </div>
            </div>
            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">

                <?php 
                    if ($userLevelAdmin != 1)
                    echo '<fieldset id="deviceControl" disabled style="opacity:0.8">';
                    else
                    echo '<fieldset id="deviceControl" style="opacity:1">';
                ?>


                <div
                    class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">iScan Monitoring Receiver MR-10</h1>
                    <div class="btn-toolbar mb-2 mb-md-0"></div>
                </div>

                <div class="input-group mb-2" style=" min-width: 420px;">
                    <input id="manualFreqInput" type="number" class="form-control" placeholder="Enter freq (MHz)"
                        step="0.0001" onchange="setOffset();" min=30 max=3200>
                    <button id="manualFreqButton" class="btn btn-primary">Set Frequency (MHz)</button>
                </div>

                <div id="div0" class=" row row-cols-sm-1 row-cols-md-1 row-cols-lg-1 row-cols-xl-1 ">

                    <div id="div1" class=" container m-0 p-1 " style=" min-width: 420px;">
                        <div id="div2" class=" card m-1 p-1 " style=" width: 100%;height: 100%;">
                            <div id="spectrum-container">
                                <!-- ✅ แถบปุ่มซูมแบบ sticky อยู่บน plot -->
                                <div class="zoom-ui-bar">
                                    <div class="zoom-box">
                                        <button class="btn btn-secondary" onclick="zoomCanvasOut()"
                                            title="Zoom Out (–)">−</button>
                                        <button class="btn btn-secondary" onclick="zoomCanvasReset()"
                                            title="Reset (R)">Reset</button>
                                        <button class="btn btn-secondary" onclick="zoomCanvasIn()"
                                            title="Zoom In (+)">+</button>
                                        <button class="btn btn-secondary" onclick="clearMax()"
                                            title="Clear Max Hold">Clear Max Hold</button>

                                        <!-- ✅ Toggle Waterfall -->
                                        <button id="btnToggleWaterfall" class="btn btn-outline-info"
                                            onclick="toggleWaterfall()" title="Show/Hide Waterfall (W)">
                                            Waterfall: On
                                        </button>

                                        <button id="maxHoldCheckbox" class="btn btn-outline-info"
                                            onclick="toggleMaxHold(this)" title="Toggle Max Hold">
                                            Show Max Hold: On
                                        </button>

                                    </div>
                                </div>

                                <canvas id="waterfall-scale" width="4096" height="20"
                                    style="border-width:0;margin-bottom:0;"></canvas>
                                <canvas id="spectrum-plot" width="4096" height="400"
                                    style="border-width:0;margin-bottom:0;"></canvas>
                                <canvas id="waterfall" width="4096" height="400"
                                    style="border-width:0;margin-bottom:0;"></canvas>
                            </div>



                        </div> <!-- div2 -->
                    </div> <!-- div1 -->
                </div> <!-- div0 -->

                <div id="div2" class="m-0 p-1 " style=" width: 100%;height: 100%;">
                    <!-- ===== RF Scan Panel ===== -->
                    <div class="mt-3" id="rfScanCard">
                        <div class="d-flex align-items-center gap-2">
                            <strong>RF Scan</strong>
                        </div>

                        <div class="card-body">
                            <div class="row g-2">
                                <div class="col-6 col-md-6">
                                    <label class="form-label">Start (MHz)</label>
                                    <input id="rfStartMHz" type="number" step="0.0001" class="form-control"
                                        value="88.0000" min=30 max=3000>
                                </div>
                                <div class="col-6 col-md-6">
                                    <label class="form-label">Stop (MHz)</label>
                                    <input id="rfStopMHz" type="number" step="0.0001" class="form-control"
                                        value="108.0000" min=30 max=3000>
                                </div>
                            </div>

                            <div class="d-flex gap-2 mt-3 flex-wrap">
                                <div class="d-flex gap-2 flex-grow-1">
                                    <button id="btnStartScan" class="btn btn-primary flex-grow-1">
                                        <i class="fas fa-play"></i> <text>Start Scan</text>
                                    </button>
                                    <button id="btnStopScan"
                                        class="btn btn-outline-danger flex-grow-1 disabled not-allowed" disabled>
                                        <i class="fas fa-stop"></i> <text>Stop</text>
                                    </button>
                                </div>
                                <div class="d-flex gap-2 flex-grow-1">
                                    <button id="btnShowMemory" class="btn btn-outline-success flex-grow-1"
                                        style="border-radius:10px; box-shadow:0 6px 18px rgba(0,0,0,0.25);">
                                        <i class="fas fa-database"></i> Memory
                                    </button>
                                    <button id="btnShowScan" class="btn btn-outline-warning flex-grow-1"
                                        style="border-radius:10px; box-shadow:0 6px 18px rgba(0,0,0,0.25);">
                                        <i class="fas fa-broadcast-tower"></i> Scan
                                    </button>
                                </div>
                            </div>


                            <!-- 🔵 Scan progress bar -->
                            <div class="scan-progress mt-2">
                                <div class="progress mt-2">
                                    <div id="scanProgressBar"
                                        class="progress-bar progress-bar-striped progress-bar-animated"
                                        role="progressbar" style="width: 0%;" aria-valuemin="0" aria-valuemax="100">
                                        0%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br>
                    <?php
                        $path = "/var/lib/openwebrx/preset.json";
                        $presetsList = [];
                        $currentRx = [];

                        if (is_readable($path)) {
                            $json = file_get_contents($path);
                            if ($json !== false) {
                                $data = json_decode($json, true);
                                if (is_array($data)) {
                                    $currentRx   = $data['currentRx'] ?? [];
                                    $presetsList = $data['presetsList'] ?? [];
                                }
                            }
                        }

                        $index = 0;
                    ?>
                    <script>
                    const presetsList =
                        <?php echo json_encode($presetsList, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP); ?>;
                    </script>

                    <div class="preset-page" id="memoryRF">

                        <div class="scan-header-box"
                            style="display:flex;justify-content:space-between;align-items:center;">

                            <div class="scan-header-title">MEMORY MODE</div>

                            <div style="display:flex;align-items:center;gap:8px;">

                                <!-- Label -->
                                <div style="font-weight:600; color:#ccc; margin-left:12px;">Filter</div>

                                <!-- Dropdown -->
                                <select id="memoryModeSelect" class="form-select"
                                    style="padding:6px 10px;border-radius:6px; margin-right:10px;">
                                    <option value="all">All</option>
                                    <!-- <option value="wfm">WFM</option>
                                    <option value="fm">FM</option>
                                    <option value="am">AM</option>
                                    <option value="dmr">DMR</option> -->
                                </select>

                                <!-- Total count -->
                                <div class="memory-header-count" style="white-space: nowrap;">
                                    Total: <?= count($presetsList) ?> channels
                                </div>


                                <!-- ✅ Delete All -->
                                <button id="deleteAllMemoryBtn" style="margin-left:12px; white-space: nowrap;"
                                    class="delete-all-btn" onclick="deleteAllMemoryPresets()">
                                    Delete All
                                </button>
                            </div>

                        </div>


                        <div class="preset-grid">
                            <?php foreach ($presetsList as $id => $p): ?>
                            <?php $p['_id'] = $id; ?>
                            <!-- เพิ่ม index ID ที่ต้องการ -->
                            <div class="type-card-with-links preset-card" id="preset-card-<?= $index ?>">

                                <div class="preset-card-header">
                                    <div>
                                        <div class="preset-title">
                                            <?= htmlspecialchars($p['name'] ?? 'Preset') ?>
                                        </div>
                                        <div class="preset-subtitle">
                                            <?= number_format(($p['offset_freq'] + $p['center_freq']) / 1e6, 3) ?> MHz
                                            (<?= htmlspecialchars(strtoupper($p['mod'])) ?>)
                                        </div>
                                    </div>
                                    <div class="preset-badges">
                                        <?php if (!empty($p['mod'])): ?>
                                        <span class="badge badge-mod">
                                            <?= htmlspecialchars(strtoupper($p['mod'])) ?>
                                        </span>
                                        <?php endif; ?>
                                    </div>
                                </div>

                                <div class="preset-body">
                                    <div class="preset-row">
                                        <span>Bandwidth:&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        <span>
                                            <?php
                                $bw = ($p['high_cut'] - $p['low_cut']) / 1e3;
                                $bw_trunc = number_format((($bw * 10) / 10), 3, '.', '');
                            ?>
                                            <?= $bw_trunc ?> kHz
                                        </span>
                                    </div>
                                    <div class="preset-row">
                                        <span>Squelch:&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        <span><?= htmlspecialchars($p['squelch_level']) ?> dB</span>
                                    </div>
                                </div>

                                <div class="links">
                                    <button class="link-primary-base secondary-action" onclick="editPreset(this)"
                                        data-id="<?= $p['_id'] ?>"
                                        data-name="<?= htmlspecialchars($p['name'], ENT_QUOTES) ?>"
                                        data-freq="<?= htmlspecialchars(($p['offset_freq'] + $p['center_freq']) / 1e6, ENT_QUOTES) ?>"
                                        data-mod="<?= htmlspecialchars($p['mod'], ENT_QUOTES) ?>">
                                        Edit
                                    </button>

                                    <button class="link-primary-base ghost-action" onclick="deletePreset(this)"
                                        data-id="<?= $p['_id'] ?>">
                                        Delete
                                    </button>
                                </div>

                            </div>

                            <?php $index++; ?>
                            <?php endforeach; ?>

                            <!-- ✚ Add New Preset card (styled like normal card) -->
                            <div class="type-card-with-links preset-card scan-preset-card add-new" id="add-preset-card">
                                <div class="add-card-inner">
                                    <div class="add-icon-circle">
                                        <i class="fas fa-plus"></i>
                                    </div>
                                    <div class="add-title">Add New Preset</div>
                                    <div class="add-sub">Create a new memory preset</div>
                                </div>
                            </div>

                        </div>
                    </div>


                    <?php
                        $path = "/var/lib/openwebrx/scanpreset.json";

                        if (!file_exists($path)) {
                            // ถ้าไม่มีไฟล์ ให้ยังแสดงหน้าอื่นต่อ ไม่ต้อง die ทั้งหน้า
                            $profiles = [];
                        } else {
                            $json = file_get_contents($path);
                            $data2 = json_decode($json, true);

                            if ($data2 === null) {
                                $profiles = [];
                            } else {
                                // profiles เป็น array ของ preset ต่างๆ
                                $profiles = $data2['profiles'] ?? [];
                            }
                        }
                    ?>
                    <script>
                    window.INIT_SCAN_PROFILES = <?php echo json_encode(
                            $profiles,
                            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
                        ); ?>;
                    </script>

                    <div class="preset-page" id="scanRF" style="display:none;">
                        <!-- ==== NEW: SECTION HEADER FOR SCAN MODE ==== -->
                        <div class="scan-header-box"
                            style="display:flex;justify-content:space-between;align-items:center;">

                            <div class="scan-header-title">SCAN MODE</div>

                            <div style="display:flex;align-items:center;gap:8px;">

                                <!-- Label -->
                                <div style="font-weight:600; color:#ccc; margin-left:12px;">Filter</div>

                                <div class="scan-date-filters"
                                    style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                                    <!-- Date dropdown -->
                                    <select id="scanFilterDate" class="form-select"
                                        style="width: 190px; background:#131a24; color:#e6edf3; border-radius:8px; border:1px solid #2b3545;">
                                        <option value="">Date</option>
                                    </select>

                                    <!-- Hour dropdown (จะถูกเติมจาก JS ตามวันที่ที่เลือก) -->
                                    <select id="scanFilterHour" class="form-select"
                                        style="width: 140px; background:#131a24; color:#e6edf3; border-radius:8px; border:1px solid #2b3545;">
                                        <option value="">Hour</option>
                                    </select>

                                    <!-- <button id="scanFilterApply" class="btn btn-sm btn-primary"
                                        style="border-radius:8px;">Apply</button> -->
                                    <button id="scanFilterClear" class="btn btn-sm btn-outline-light"
                                        style="border-radius:8px;">Clear</button>
                                </div>

                                <!-- Total count -->
                                <div id="scanTotalCount" class="scan-header-count" style="white-space: nowrap;">
                                    Total found: <span id="scanTotalCountNumber"><?= count($profiles) ?></span> channels
                                </div>


                                <!-- ✅ Delete All -->
                                <button id="deleteAllScanBtn" style="margin-left:12px; white-space: nowrap;"
                                    class="delete-all-btn" onclick="deleteAllScanPresets()">
                                    Delete All
                                </button>
                            </div>

                        </div>

                        <div class="preset-grid" id="scanRFGrid">
                            <?php foreach ($profiles as $id => $p): ?>

                            <?php
                                // frequency center in MHz
                                $centerMHz = $p['frequency'] ?? 0;

                                // mode (wide, narrow, etc)
                                $mode = strtoupper($p['mode'] ?? '');

                                // compute BW by start/end (MHz → kHz)
                                $start = $p['startHz'] ?? 0;
                                $end   = $p['endHz'] ?? 0;
                                $bwCalc = ($end - $start) * 1000; // MHz → kHz
                                $bwCalc = floor($bwCalc * 10) / 10; // ทศนิยม 1 ตำแหน่ง

                                // title name (เช่น 88.004 MHz)
                                $name = number_format($centerMHz, 3) . " MHz";
                            ?>

                            <div class="type-card-with-links preset-card scan-preset-card scan-preset-card-clickable"
                                id="scan-preset-card-<?= htmlspecialchars($p['_id'], ENT_QUOTES) ?>"
                                data-center-mhz="<?= $centerMHz ?>" data-start-mhz="<?= $start ?>"
                                data-end-mhz="<?= $end ?>" data-mode="<?= strtolower($mode) ?>"
                                data-id="<?= htmlspecialchars($p['_id'], ENT_QUOTES) ?>">

                                <div class="scan-tag">SCAN #<?= $id + 1 ?></div>

                                <div class="preset-card-header">
                                    <div>
                                        <div class="preset-title"><?= htmlspecialchars($name) ?></div>
                                        <div class="preset-subtitle"><?= $mode ?></div>
                                    </div>
                                </div>

                                <div class="preset-body">
                                    <div class="preset-row">
                                        <span>Bandwidth:&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        <span>~<?= $bwCalc ?> kHz</span>
                                    </div>

                                    <div class="preset-row">
                                        <span>Range:&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        <span><?= number_format($start, 3) ?> - <?= number_format($end, 3) ?> MHz</span>
                                    </div>
                                    <div class="links">
                                        <button class="link-primary-base secondary-action"
                                            onclick="savePresetScan(this)" data-id="<?= $p['_id'] ?>"
                                            data-name="<?= htmlspecialchars($p['name'], ENT_QUOTES) ?>"
                                            data-freq="<?= htmlspecialchars(($p['offset_freq'] + $p['center_freq']) / 1e6, ENT_QUOTES) ?>"
                                            data-mod="<?= htmlspecialchars($p['mod'], ENT_QUOTES) ?>">
                                            Save
                                        </button>
                                        <button class="link-primary-base ghost-action" onclick="deletePresetScan(this)"
                                            data-id="<?= $p['_id'] ?>">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <?php endforeach; ?>
                        </div>
                    </div>


                </div>

        </div> <!-- div0 -->

        </fieldset>
        </main>

        <script>
        const SETTINGS_JSON = <?php echo file_get_contents("/var/lib/openwebrx/settings.json"); ?>;
        </script>

        <!-- Add New Preset Modal -->
        <div class="modal fade" id="addPresetModal" tabindex="-1" aria-labelledby="addPresetModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="background-color:#1E2530; color:#e6edf3;">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addPresetModalLabel">Add New Preset</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <label for="addPresetNameInput" class="form-label">Preset Name</label>
                        <input type="text" class="form-control" id="addPresetNameInput"
                            placeholder="e.g. FM 98.000 MHz">
                        <div class="form-text" style="color:#9aa6b2;">
                            The current Frequency, Bandwidth, Squelch, and Modulation will be used to create the preset.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="addPresetSaveBtn">Save Preset</button>
                    </div>
                </div>
            </div>
        </div>
</body>
<script src="assets/dist/js/bootstrap.bundle.min.js"></script>
<?php
  if ($roleID > 0) {
    echo '<script type="text/javascript">',
         'setCurrentRoleId('.$userID.','.$roleID.',"'.$roleName.'","'.$deviceName.'");',
         '</script>'

    ;
  }
?>
<script src="webrx.js?v=<?php echo time() ?>"></script>
<script src="modulation_selector.js?v=<?php echo time() ?>"></script>


</html>