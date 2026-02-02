<?php
session_start();

/* ==== SESSION CHECK ให้เหมือน index.php / playRecording.php ==== */
if ($_SESSION['UserID'] == "") {
    echo("<script>location.href = 'login.php';</script>");
    exit;
} else {
    $userID = $_SESSION['UserID'];
}

if (isset($_SESSION['userLevel'])) {
    $userLevelAdmin = $_SESSION['userLevel'];
} else {
    echo("<script>location.href = 'login.php';</script>");
    exit;
}

$userName = $_SESSION['userName'] ?? "";

/* ใช้สำหรับทำ active menu */
$currentScript = basename($_SERVER['SCRIPT_NAME']);

include('dbConfig.php');
include('ListAudioGain.php');
?>
<!doctype html>
<html lang="en" data-bs-theme="auto">
<head>
    <script src="assets/js/color-modes.js"></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="VoiceX Voice Recorder - Register Device" />
    <meta name="keywords" content="ED137, SIP" />
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />

    <!-- CSS / JS เหมือน playRecording.php -->
    <link href="assets/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="dashboard.css" rel="stylesheet">
    <link href="fontawesome-free-5.15.4-web/css/all.min.css" rel="stylesheet" />
    <link href="nouislider.min.css" rel="stylesheet">
    <link rel="stylesheet" href="nouislider_theme.css">
    <link rel="icon" type="image/png" href="favicon.ico" sizes="16x16" />

    <!-- jQuery เหมือนหน้า playRecording -->
    <script src="js/jquery.min.js?v=<?php echo time();?>"></script>
    <script src="js/jquery-ui.js?v=<?php echo time();?>"></script>

    <!-- script controller -->
    <script src="myfunctionControler.js?v=<?php echo time();?>"></script>
    <script src="nouislider.min.js"></script>
    <script src="dashboard.js?v=<?php echo time();?>"></script>

    <style>
/* Device form dark theme */
.device-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    width: 100%;
    max-width: none;
    box-sizing: border-box;
    background: #09070a;
    padding: 18px;
    border-radius: 10px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.6);
}
.device-form .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.device-form label {
    color: #fff;
    font-weight: 700;
    font-size: 0.95rem;
}
.device-form input[type=text],
.device-form select,
.device-form textarea {
    background: #222533;
    color: #ffffff;
    border: 1px solid rgba(255,255,255,0.1);
    padding: 10px 12px;
    border-radius: 8px;
    outline: none;
    box-shadow: inset 0 -2px 6px rgba(0,0,0,0.6);
}

.device-form input[type=text]::placeholder,
.device-form textarea::placeholder {
    color: #888;
}

.device-form input[type=text]:focus,
.device-form select:focus,
.device-form textarea:focus {
    background: #2a2f40;
    color: #ffffff;
    border-color: #00d4ff;
    box-shadow: inset 0 -2px 6px rgba(0,0,0,0.6), 0 0 0 0.2rem rgba(0, 212, 255, 0.25);
}
.device-form input[readonly] {
    opacity: 0.8;
}

/* Modal form inputs - override Bootstrap */
#editDeviceModal .form-control,
#addDeviceModal .form-control {
    background: #222533 !important;
    color: #ffffff !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
}

#editDeviceModal .form-control::placeholder,
#addDeviceModal .form-control::placeholder {
    color: #888;
}

#editDeviceModal .form-control:focus,
#addDeviceModal .form-control:focus {
    background: #2a2f40 !important;
    color: #ffffff !important;
    border-color: #00d4ff !important;
    box-shadow: inset 0 -2px 6px rgba(0,0,0,0.6), 0 0 0 0.2rem rgba(0, 212, 255, 0.25) !important;
}

/* Add Device Button */
button[onclick="openAddDeviceModal()"] {
    padding: 10px 24px !important;
    font-size: 1rem !important;
    font-weight: 600 !important;
    min-width: 200px !important;
}

.device-form .form-actions {
    grid-column: 1 / -1;
    display: flex;
    justify-content: flex-end;
}
.btn-register {
    background: linear-gradient(90deg, #2fa6ff, #00c2ff);
    color: #fff;
    border: none;
    padding: 12px 26px;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 8px 20px rgba(47,166,255,0.12);
}
.device-name-input {
    border-radius: .25rem;      /* ถ้าอยากเหลี่ยมจริง ๆ ใส่ 0 */
}

@media (max-width: 900px) {
    .device-form {
        grid-template-columns: 1fr;
    }
    .device-form .form-actions {
        justify-content: stretch;
    }
}

/* Device table */
.table-wrapper { 
    width: 100%; 
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    border-radius: 8px;
    overflow: hidden;
}
.table-responsive { overflow-x: auto; }
#deviceTable {
    width: 100%;
    table-layout: auto;
    border-collapse: separate;
    border-spacing: 0;
    background: #ffffff;
    border: 1px solid #e0e0e0;
}
/* #deviceTable .form-control { width: 100%; max-width: 100%; } */
#deviceTable .small-input { max-width: 80px; }

#deviceTable thead th {
    text-align: left;
    white-space: nowrap;
    color: #2c3e50;
    background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
    font-weight: 700;
    font-size: 0.95rem;
    position: sticky;
    top: 0;
    z-index: 5;
    border-bottom: 2px solid #007bff;
    padding: 12px 8px;
    border-right: 1px solid #dee2e6;
}

#deviceTable thead th:last-child {
    border-right: none;
}

#deviceTable th.group-id,      #deviceTable td.group-id      { 
    width: 64px; 
    border-left: 2px solid #007bff;
    text-align: center;
}
#deviceTable th.group-device,  #deviceTable td.group-device  { border-left: 2px solid #007bff; }
#deviceTable th.group-network, #deviceTable td.group-network { border-left: 2px solid #17a2b8; }
#deviceTable th.group-meta,    #deviceTable td.group-meta    { border-left: 2px solid #6c757d; }
#deviceTable th.group-action,  #deviceTable td.group-action  { border-left: 2px solid #28a745; }

#deviceTable tbody td { 
    vertical-align: middle;
    color: #212529;
    background: #ffffff;
    padding: 10px 8px;
    border-bottom: 1px solid #e9ecef;
    border-right: 1px solid #f1f3f5;
}

#deviceTable tbody td:last-child {
    border-right: none;
}

#deviceTable tbody tr:hover { 
    background: linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%);
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

#deviceTable tbody tr:nth-child(even) {
    background: #fafbfc;
}

#deviceTable tbody tr:nth-child(even):hover {
    background: linear-gradient(90deg, #f1f3f5 0%, #fafbfc 100%);
}

/* Checkbox styling */
#deviceTable .group-select {
    text-align: center;
}
#deviceTable .select-device,
#deviceTable input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    margin: 0 auto;
    display: inline-block;
}

/* Form controls inside table */
#deviceTable .form-control,
#deviceTable input[type=text],
#deviceTable input[type=number],
#deviceTable select {
    background: #f8f9fa;
    color: #000000;
    border: 1px solid #ced4da;
}
#deviceTable .form-control:focus,
#deviceTable input:focus,
#deviceTable select:focus {
    background: #ffffff;
    color: #000000;
    border-color: #86b7fe;
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(13,110,253,.25);
}

/* Specific input field sizes */
input[name="nameDevice"] {
    width: 160px;
    height: 32px;
    text-align: left;
    padding: 5px 10px;
    border: 1px solid #ced4da;
    border-radius: 5px;
    font-size: 14px;
    color: #000;
    background: #f8f9fa;
}

input[name="ipDevice"] {
    width: 120px;
    height: 32px;
    text-align: left;
    padding: 5px 10px;
    border: 1px solid #ced4da;
    border-radius: 5px;
    font-size: 14px;
    color: #000;
    background: #f8f9fa;
}

input[name="uriDevice"] {
    width: 140px;
    height: 32px;
    text-align: left;
    padding: 5px 10px;
    border: 1px solid #ced4da;
    border-radius: 5px;
    font-size: 14px;
    color: #000;
    background: #f8f9fa;
}

input[name="freqDevice"] {
    width: 100px;
    height: 32px;
    text-align: left;
    padding: 5px 10px;
    border: 1px solid #ced4da;
    border-radius: 5px;
    font-size: 14px;
    color: #000;
    background: #f8f9fa;
}

input[name="updatedAt"] {
    width: 200px;
    height: 32px;
    text-align: left;
    padding: 5px 10px;
    border: 1px solid #ced4da;
    border-radius: 5px;
    font-size: 14px;
    color: #000;
    background: #f8f9fa;
}

/* Focus states for specific inputs */
input[name="nameDevice"]:focus,
input[name="ipDevice"]:focus,
input[name="uriDevice"]:focus,
input[name="freqDevice"]:focus,
input[name="updatedAt"]:focus {
    background: #ffffff;
    border-color: #86b7fe;
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(13,110,253,.25);
}


#deviceTable tbody.populated-by-js tr {
    animation: fadeIn 220ms ease-in;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* Device Card Grid */
#deviceCardGrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
    width: 100%;
}

.device-card-wrapper {
    width: 100%;
}

.device-card {
    background: #1a1a2e;
    border: 2px solid #0f3460;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    overflow: hidden;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.device-card:hover {
    box-shadow: 0 6px 20px rgba(15, 52, 96, 0.5);
    transform: translateY(-4px);
    border-color: #00d4ff;
}

.device-card-header {
    background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
    color: #ffffff;
    padding: 14px 16px;
    font-weight: 700;
    font-size: 1.1rem;
    border-bottom: 2px solid #00d4ff;
    text-align: center;
    word-break: break-word;
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.device-card-body {
    padding: 16px;
    color: #e0e0e0;
    flex-grow: 1;
}

.device-card-body .info-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 8px 0;
    border-bottom: 1px solid #2d3d54;
    font-size: 0.9rem;
    line-height: 1.4;
    gap: 12px;
    flex-wrap: wrap;
}

.device-card-body .info-row:last-child {
    border-bottom: none;
}

.device-card-body .label {
    font-weight: 600;
    color: #ffffff;
    flex: 0 0 auto;
    min-width: 100px;
}

.device-card-body .value {
    flex: 1;
    text-align: right;
    color: #00d4ff;
    word-break: break-word;
    font-size: 0.9rem;
    min-width: 100px;
}

.device-card-footer {
    padding: 12px 16px;
    background: #0f3460;
    border-top: 1px solid #2d3d54;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.device-card-footer button {
    font-size: 0.85rem;
    padding: 10px 12px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 600;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.device-card-footer .btn-edit {
    background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
    color: white;
}

.device-card-footer .btn-edit:hover {
    background: linear-gradient(135deg, #34c759 0%, #2db84d 100%);
    box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
    transform: translateY(-2px);
}

.device-card-footer .btn-delete {
    background: linear-gradient(135deg, #dc3545 0%, #bd2130 100%);
    color: white;
}

.device-card-footer .btn-delete:hover {
    background: linear-gradient(135deg, #e74c3c 0%, #c9302c 100%);
    box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
    transform: translateY(-2px);
}

/* search input */
#deviceSearch { max-width: 320px; }

#footer {
    margin-top: 20px;
    padding: 10px 0;
    text-align: center;
    font-size: 0.8rem;
    color: #9aa6b2;
}


</style>
    <title>iVoiceX Voice Recorder - Register Device</title>
</head>

<body>
<header class="navbar sticky-top flex-md-nowrap p-0 shadow" style="background-color:#000000DD;">
    <svg class="bi_logo m-1">
        <use xlink:href="dashboard.svg?v=<?php echo time();?>#logo"></use>
    </svg>
    <ul class="navbar-nav flex-row d-md-none">
        <li class="nav-item text-nowrap">
            <button class="nav-link px-3 text-white" type="button"
                    data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu"
                    aria-controls="sidebarMenu" aria-expanded="false"
                    aria-label="Toggle navigation">
                <svg class="bi">
                    <use xlink:href="dashboard.svg?v=<?php echo time();?>#list"/>
                </svg>
            </button>
        </li>
    </ul>

    <div id="navbarSearch" class="navbar-search w-100 collapse">
        <input class="form-control w-100 rounded-0 border-0"
               type="text" placeholder="Search" aria-label="Search">
    </div>
</header>

<!-- Theme toggle (เหมือน playRecording.php) -->
<div class="dropdown position-fixed bottom-0 end-0 mb-3 me-3 bd-mode-toggle">
    <button class="btn btn-bd-primary py-2 dropdown-toggle d-flex align-items-center"
            id="bd-theme" type="button" aria-expanded="false"
            data-bs-toggle="dropdown" aria-label="Toggle theme (auto)">
        <svg class="bi my-1 theme-icon-active" width="1em" height="1em">
            <use href="dashboard.svg?v=<?php echo time();?>#circle-half"></use>
        </svg>
        <span class="visually-hidden" id="bd-theme-text">Toggle theme</span>
    </button>
    <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
        <li>
            <button type="button" class="dropdown-item d-flex align-items-center"
                    data-bs-theme-value="light" aria-pressed="false">
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
            <button type="button" class="dropdown-item d-flex align-items-center"
                    data-bs-theme-value="dark" aria-pressed="false">
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
            <button type="button" class="dropdown-item d-flex align-items-center active"
                    data-bs-theme-value="auto" aria-pressed="true">
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
        <!-- ===== SIDEBAR เหมือน playRecording.php ===== -->
        <div class="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
            <div class="offcanvas-md offcanvas-end bg-body-tertiary" tabindex="-1"
                 id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
                <div class="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
                        <ul class="nav flex-column">
                            <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2" aria-current="page"
                                    href="index.php">
                                    <svg class="bi">
                                        <use xlink:href="dashboard.svg#house-fill" />
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
                            <!-- <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2" aria-current="page"
                                    href="eventLoggerData.php">
                                    <svg class="bi">
                                        <use
                                            xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg?v=<?php echo time();?>#layer-group" />
                                    </svg>
                                    Event Logger
                                </a>
                            </li> -->
                            <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2" aria-current="page"
                                    href="audiofiles">
                                    <svg class="bi">
                                        <use
                                            xlink:href="fontawesome-free-5.15.4-web/sprites/regular.svg?v=<?php echo time();?>#file-audio" />
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
                            <span>Device Manager</span> </h6>

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
                                    <svg class="bi"><use xlink:href="dashboard.svg?v=<?php echo time();?>#logdf" /></svg>
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
                                        <use xlink:href="dashboard.svg#gear-wide-connected" />
                                    </svg>
                                    Settings
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2 <?php if($currentScript == 'controler.php') echo 'active'; ?>"
                                    href="controler.php">
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
                </div>
            </div>
        </div>

        <!-- ===== MAIN CONTENT ===== -->
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 class="h2">iVoiceX Voice Recorder</h1>
                <div class="btn-toolbar mb-2 mb-md-0"></div>
            </div>

            <div class="center">
                <div id="deviceListContainer">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h3 class="mb-0">Device List</h3>
                        <div class="d-flex align-items-center gap-2">
                            <input id="deviceSearch" class="form-control form-control-sm" placeholder="Search name / IP / URI" style="max-width: 250px;" />
                            <button id="clearSearch" class="btn btn-sm btn-outline-light">Clear</button>
                            <button type="button" class="btn btn-primary" onclick="openAddDeviceModal()">
                                <i class="fas fa-plus"></i> Add Device
                            </button>
                        </div>
                    </div>
                    <div id="deviceCardGrid" class="row g-3">
                        <!-- Cards will be populated by myfunctionControler.js -->
                    </div>
                </div>
            </div>

            <div id="footer">
                IFZ TECHNOLOGIES CO.,LTD. 36/58-59, KHLONG SONG TON NUN, LAT KRABANG, BANGKOK 10520 TEL 021717257.
            </div>
        </main>
    </div>
</div>

<script src="assets/dist/js/bootstrap.bundle.min.js"></script>

<!-- Edit Device Modal -->
<div class="modal fade" id="editDeviceModal" tabindex="-1" aria-labelledby="editDeviceModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editDeviceModalLabel">Edit Device</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="editDeviceForm">
                <div class="modal-body">
                    <input type="hidden" id="edit_id" name="id" />
                    
                    <div class="form-group">
                        <label for="edit_nameDevice">Device Name:</label>
                        <input type="text" id="edit_nameDevice" name="nameDevice" class="form-control" required />
                    </div>

                    <div class="form-group">
                        <label for="edit_sid">SID:</label>
                        <input type="text" id="edit_sid" name="sid" class="form-control" required />
                    </div>

                    <div class="form-group">
                        <label for="edit_payload_size">Payload Size:</label>
                        <input type="text" id="edit_payload_size" name="payload_size" class="form-control" required />
                    </div>

                    <div class="form-group">
                        <label for="edit_terminal_type">Terminal Type:</label>
                        <input type="text" id="edit_terminal_type" name="terminal_type" class="form-control" required />
                    </div>

                    <div class="form-group">
                        <label for="edit_ipaddress">IP Address:</label>
                        <input type="text" id="edit_ipaddress" name="ipaddress" class="form-control" required />
                    </div>

                    <div class="form-group">
                        <label for="edit_uri">URI:</label>
                        <input type="text" id="edit_uri" name="uri" class="form-control" required />
                    </div>

                    <div class="form-group">
                        <label for="edit_freq">Frequency (MHz):</label>
                        <input type="text" id="edit_freq" name="freq" class="form-control" required />
                    </div>

                    <div class="form-group">
                        <label for="edit_group">Group:</label>
                        <input type="text" id="edit_group" name="group" class="form-control" required />
                    </div>

                    <div class="form-group">
                        <label for="edit_visible">Visible:</label>
                        <input type="text" id="edit_visible" name="visible" class="form-control" required />
                    </div>

                    <div class="form-group">
                        <label for="edit_ambient">Ambient:</label>
                        <input type="text" id="edit_ambient" name="ambient" class="form-control" required />
                    </div>

                    <div class="form-group">
                        <label for="edit_last_access">Last Access:</label>
                        <input type="text" id="edit_last_access" name="last_access" class="form-control" readonly />
                    </div>

                    <div class="form-group">
                        <label for="edit_chunk">Chunk:</label>
                        <input type="text" id="edit_chunk" name="chunk" class="form-control" required />
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger me-2" onclick="deleteDeviceFromModal()">Delete</button>
                    <button type="button" class="btn btn-primary" onclick="saveDeviceChanges()">Save Changes</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Add Device Modal -->
<div class="modal fade" id="addDeviceModal" tabindex="-1" aria-labelledby="addDeviceModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addDeviceModalLabel">Add New Device</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="addDeviceForm">
                <div class="modal-body">
                    <div class="form-group">
                        <label for="add_nameDevice">Device Name:</label>
                        <input type="text" id="add_nameDevice" name="nameDevice" class="form-control" required />
                    </div>

                    <div class="form-group">
                        <label for="add_sid">SID:</label>
                        <input type="text" id="add_sid" name="sid" class="form-control" required />
                    </div>

                    <div class="form-group">
                        <label for="add_payload_size">Payload Size:</label>
                        <input type="text" id="add_payload_size" name="payload_size" class="form-control" required />
                    </div>

                    <div class="form-group">
                        <label for="add_terminal_type">Terminal Type:</label>
                        <input type="text" id="add_terminal_type" name="terminal_type" class="form-control" required />
                    </div>

                    <div class="form-group">
                        <label for="add_ipaddress">IP Address:</label>
                        <input type="text" id="add_ipaddress" name="ipaddress" class="form-control" required />
                    </div>

                    <div class="form-group">
                        <label for="add_uri">URI:</label>
                        <input type="text" id="add_uri" name="uri" class="form-control" required />
                    </div>

                    <div class="form-group">
                        <label for="add_freq">Frequency (MHz):</label>
                        <input type="text" id="add_freq" name="freq" class="form-control" required />
                    </div>

                    <div class="form-group">
                        <label for="add_group">Group:</label>
                        <input type="text" id="add_group" name="group" class="form-control" required />
                    </div>

                    <div class="form-group">
                        <label for="add_visible">Visible:</label>
                        <input type="text" id="add_visible" name="visible" class="form-control" required />
                    </div>

                    <div class="form-group">
                        <label for="add_ambient">Ambient:</label>
                        <input type="text" id="add_ambient" name="ambient" class="form-control" required />
                    </div>

                    <div class="form-group">
                        <label for="add_chunk">Chunk:</label>
                        <input type="text" id="add_chunk" name="chunk" class="form-control" required />
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="saveNewDevice()">Create Device</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
// Auto-convert frequency to MHz format
function convertFrequencyToMHz(input) {
    let value = input.value.trim();
    
    if (value === '') {
        return;
    }
    
    // Remove any non-numeric characters except decimal point
    value = value.replace(/[^\d.]/g, '');
    
    let numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
        return;
    }
    
    // If value is greater than or equal to 10000, assume it's in Hz and convert to MHz
    if (numValue >= 10000) {
        numValue = numValue / 1000;
    }
    
    // Format to 3 decimal places
    input.value = numValue.toFixed(3);
}

// Attach event listeners to frequency inputs
document.addEventListener('DOMContentLoaded', function() {
    const editFreq = document.getElementById('edit_freq');
    const addFreq = document.getElementById('add_freq');
    
    if (editFreq) {
        // Trigger on blur (when user leaves the field)
        editFreq.addEventListener('blur', function() {
            convertFrequencyToMHz(this);
        });
        
        // Also trigger on Enter key
        editFreq.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                convertFrequencyToMHz(this);
                this.blur();
            }
        });
    }
    
    if (addFreq) {
        // Trigger on blur (when user leaves the field)
        addFreq.addEventListener('blur', function() {
            convertFrequencyToMHz(this);
        });
        
        // Also trigger on Enter key
        addFreq.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                convertFrequencyToMHz(this);
                this.blur();
            }
        });
    }
});
</script>

</body>
</html>
