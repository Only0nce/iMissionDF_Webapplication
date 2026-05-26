<?php
  session_start();
  if($_SESSION['UserID'] == "")
  {
    echo("<script>location.href = 'login.php';</script>");
  }
  else{
    $userID = $_SESSION['UserID'];
  }

  if($_SESSION['userLevel'])
  {
    $userLevelAdmin = $_SESSION['userLevel'];
  }
  else
  {
    echo("<script>location.href = 'login.php';</script>");
  }
  if($_SESSION['userName'])
  {
    $userName = $_SESSION['userName'];
  }
?>

<?php
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
include('dbConfig.php');
include('timezone.php');
include('ListVariable.php');
?>
<!doctype html>
<html lang="en" data-bs-theme="auto">

<head>
    <script src="assets/js/color-modes.js"></script>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors">
    <meta name="generator" content="Hugo 0.122.0">
    <title>IFZ: iScan MR-10 WebRx</title>

    <link href="assets/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="dashboard.css" rel="stylesheet">

    <!-- ✅ NEW: Wi-Fi page theme (from your tar.xz style) -->
    <link rel="stylesheet" href="assets/wifi.css?v=<?php echo time(); ?>" />

    <script src="assets/dist/js/bootstrap.bundle.min.js"></script>
    <script src="dashboard.js"></script>
    <script src="settings.js?v=<?php echo time(); ?>"></script>

    <script src="js/jquery.min.js"></script>
    <script type="text/javascript" src="js/jquery-latest.min.js"></script>
    <script type="text/javascript" src="js/jquery-ui.js"></script>
    <link rel="stylesheet" type="text/css" href="css/jquery.datetimepicker.css">
    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/jquery.datetimepicker.js"></script>

    <!-- Wi-Fi dashboard layout tuning -->
    <style>
      .wifi-wrap {
        width: 100%;
        max-width: none;
      }
      .wifi-wrap .wifi-card {
        min-height: 100%;
      }
      .wifi-wrap .wifi-card + .wifi-card {
        margin-top: .5rem;
      }
    </style>
</head>

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

    <!-- Modal confirmToRebootSystem-->
    <div class="modal fade" id="confirmToRebootSystem" tabindex="-1" aria-labelledby="confirmToRebootSystemLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmToRebootSystemLabel">Please Confirm</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    System will be reboot. Please Confirm!
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                        onclick="confirmToRebootSystem()">REBOOT</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal confirmToUpdateSystem-->
    <div class="modal fade" id="confirmToUpdateSystem" tabindex="-1" aria-labelledby="confirmToUpdateSystemLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmToUpdateSystemLabel">Please Confirm</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    System will be update firmware. Please Confirm!
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                        onclick="systemupdate()">UPDATE</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Alert-->
    <div class="modal fade" id="ModalAlert" tabindex="-1" aria-labelledby="Alert" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="Alert">Alert</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Unable to connect to the iMission Receiver Module. (Modal Alert)
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Custom Alert-->
    <div class="modal fade" id="ModalCustomAlert" tabindex="-1" aria-labelledby="Alert" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="Alert">Alert</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <span id="textAlert"> Unable to connect to the iScan Receiver Module. (Modal Custom Alert) </span>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Custom Alert And Reload-->
    <div class="modal fade" id="ModalCustomAlertReload" tabindex="-1" aria-labelledby="Alert" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="Alert">Alert</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <span id="ModalCustomTextAlert"> Unable to connect to the iScan Receiver Module. (Modal Custom Alert
                        And Reload) </span>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <div class="container-fluid">
        <div class="row">
            <div class="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
                <div class="offcanvas-md offcanvas-end bg-body-tertiary" tabindex="-1" id="sidebarMenu"
                    aria-labelledby="sidebarMenuLabel">
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
                                <a class="nav-link d-flex align-items-center gap-2 active" href="wifi.php">
                                    <svg class="bi">
                                        <use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#wifi" />
                                    </svg>
                                    Wi-Fi & LTE Settings
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

            <!-- =========================================================
                 ✅ CHANGED ONLY THIS MAIN: replaced content with Wi-Fi UI
                 ========================================================= -->
            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">

                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">Wi-Fi & LTE Settings</h1>
                    <div class="btn-toolbar mb-2 mb-md-0">
                        <button id="buttonChangeID" type="button"
                            class="btn btn-sm btn-outline-secondary align-items-center gap-1 m-1 d-flex"
                            data-bs-toggle="modal" data-bs-target="#confirmToRebootSystem">
                            <svg class="bi">
                                <use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#redo-alt" />
                            </svg>
                            REBOOT
                        </button>
                    </div>
                </div>

                <div class="wifi-wrap">
                    <div id="wifiPageMessage" class="wifi-banner d-none"></div>

                    <div class="row g-2 wifi-dashboard-grid">
                        <div class="col-12 col-xl-3 d-flex">
                            <div class="card m-1 p-1 wifi-card flex-fill">
                                <h5 class="p-0 pb-1 pt-1 mb-2 border-bottom">Wi-Fi Control</h5>

                                <div class="wifi-setting-row">
                                    <div>
                                        <div class="wifi-setting-title">Wi-Fi</div>
                                        <div class="wifi-setting-subtitle">Enable or disable wireless networking on this device.</div>
                                    </div>
                                    <button class="toggle on" id="wifiToggle" type="button" role="switch" aria-checked="true"></button>
                                </div>

                                <div class="wifi-setting-row wifi-setting-row-stack">
                                    <div>
                                        <div class="wifi-setting-title">Refresh Available Networks</div>
                                        <div class="wifi-setting-subtitle">Run sudo nmcli device wifi rescan before listing nearby access points.</div>
                                    </div>
                                    <button class="btn btn-outline-secondary btn-sm" id="refreshBtn" type="button">Refresh</button>
                                </div>

                                <div class="wifi-meta-stack px-1 pb-1">
                                    <div class="wifi-help-note mb-0" id="wifiDeviceLabel">Interface: —</div>
                                    <div class="wifi-current-summary" id="wifiCurrentSummary">
                                        <div class="wifi-current-main">
                                            <span class="wifi-status-badge wifi-status-disconnected" id="wifiStatusBadge">Disconnected</span>
                                            <span class="wifi-current-ssid" id="wifiCurrentNetworkLabel">—</span>
                                        </div>
                                        <button class="btn btn-outline-secondary btn-sm wifi-edit-btn" id="wifiEditBtn" type="button" disabled aria-disabled="true" title="Edit Advanced Wi‑Fi Settings">
                                            <span class="wifi-edit-btn-icon" aria-hidden="true">⚙</span>
                                            <span>Edit</span>
                                        </button>
                                    </div>
                                </div>

                                <div class="wifi-control-details px-1 pb-1">
                                    <div class="wifi-control-detail">
                                        <span class="wifi-control-key">IP Address</span>
                                        <span class="wifi-control-value" id="wifiIpLabel">--</span>
                                    </div>
                                    <div class="wifi-control-detail">
                                        <span class="wifi-control-key">Gateway</span>
                                        <span class="wifi-control-value" id="wifiGatewayLabel">--</span>
                                    </div>
                                    <div class="wifi-control-detail">
                                        <span class="wifi-control-key">Netmask</span>
                                        <span class="wifi-control-value" id="wifiNetmaskLabel">--</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 col-xl-3 d-flex">
                            <div class="card m-1 p-1 wifi-card flex-fill">
                                <h5 class="p-0 pb-1 pt-1 mb-2 border-bottom">LTE Status Guide</h5>

                                <div class="wifi-control-details px-1 pb-1">
                                    <div class="wifi-control-detail">
                                        <span class="wifi-control-key">SIM Status</span>
                                        <span class="wifi-control-value" id="lteSimStatusLabel">No data</span>
                                    </div>
                                    <div class="wifi-control-detail">
                                        <span class="wifi-control-key">Interface</span>
                                        <span class="wifi-control-value" id="lteOperatorLabel">--</span>
                                    </div>
                                    <div class="wifi-control-detail">
                                        <span class="wifi-control-key">Signal</span>
                                        <span class="wifi-control-value" id="lteSignalLabel">--</span>
                                    </div>
                                    <div class="wifi-control-detail">
                                        <span class="wifi-control-key">Registration</span>
                                        <span class="wifi-control-value" id="lteRegistrationLabel">--</span>
                                    </div>
                                    <div class="wifi-control-detail">
                                        <span class="wifi-control-key">IMEI</span>
                                        <span class="wifi-control-value" id="lteImeiLabel">--</span>
                                    </div>
                                    <div class="wifi-control-detail">
                                        <span class="wifi-control-key">ICCID</span>
                                        <span class="wifi-control-value" id="lteIccidLabel">--</span>
                                    </div>
                                    <div class="wifi-control-detail">
                                        <span class="wifi-control-key">LTE IP Address</span>
                                        <span class="wifi-control-value" id="lteIpLabel">--</span>
                                    </div>
                                    <div class="wifi-control-detail">
                                        <span class="wifi-control-key">Gateway</span>
                                        <span class="wifi-control-value" id="lteGatewayLabel">--</span>
                                    </div>
                                </div>

                                <div class="wifi-help-note" id="lteStatusNote">
                                    LTE details use rmnet_mhi0.1 as the primary interface and fallback to rmnet_mhi0 during refresh.
                                </div>
                            </div>
                        </div>

                        <div class="col-12 col-xl-6 d-flex">
                            <div class="card m-1 p-1 wifi-card wifi-network-card flex-fill">
                                <div class="wifi-card-toolbar border-bottom">
                                    <div>
                                        <h5 class="p-0 mb-0">Choose a Network</h5>
                                        <div class="wifi-card-subtitle" id="wifiNetworkSummary">Found 0 networks</div>
                                    </div>
                                </div>

                                <section id="netList" class="wifi-network-list" aria-label="Wi-Fi Networks">
                                    <div class="wifi-state">
                                        <div class="wifi-state-title">Scanning networks…</div>
                                        <div class="wifi-state-subtitle">Please wait while available access points are detected.</div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>


                    <div class="overlay" id="overlay" role="dialog" aria-modal="true" aria-labelledby="modalTitle" aria-hidden="true">
                        <div class="wifi-modal" role="document">
                            <div class="wifi-modal-shell">
                                <div class="modal-header">
                                    <div>
                                        <h2 class="modal-title" id="modalTitle">Join Wi-Fi</h2>
                                        <p class="modal-sub" id="modalSub"></p>
                                    </div>
                                    <button class="close-x" id="closeModal" type="button" aria-label="Close">✕</button>
                                </div>

                                <div class="modal-body">
                                    <div class="mb-3">
                                        <label for="pwd" class="form-label">Password</label>
                                        <input id="pwd" class="form-control wifi-form-control" type="password" placeholder="Enter network password" autocomplete="current-password" />
                                    </div>

                                    <div class="form-check mb-2">
                                        <input id="showPwd" class="form-check-input" type="checkbox" />
                                        <label class="form-check-label" for="showPwd">Show Password</label>
                                    </div>

                                    <div class="error" id="modalError" aria-live="polite"></div>
                                </div>

                                <div class="modal-actions">
                                    <button class="btn btn-outline-secondary" id="cancelBtn" type="button">Cancel</button>
                                    <button class="btn btn-primary" id="joinBtn" type="button">Join Network</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="advOverlay" class="overlay" aria-hidden="true">
                        <div class="wifi-modal adv-modal" role="document">
                            <div class="wifi-modal-shell">
                                <div class="modal-header">
                                    <div>
                                        <h2 class="modal-title" id="advTitle">Advanced Wi-Fi Settings</h2>
                                        <p class="modal-sub" id="advSub"></p>
                                    </div>
                                    <button id="advClose" class="close-x" type="button" aria-label="Close">×</button>
                                </div>

                                <div class="modal-body adv-body">
                                    <div class="mb-3">
                                        <label class="form-label fw-semibold">IPv4 Configuration</label>
                                        <div class="small text-body-secondary" id="currentIpLabel">Now: —</div>
                                    </div>

                                    <div class="wifi-radio-grid mb-3">
                                        <label class="wifi-radio-card">
                                            <input type="radio" name="ipv4method" value="auto" checked>
                                            <span class="wifi-radio-title">Using DHCP</span>
                                            <span class="wifi-radio-subtitle">Let the network assign IP settings automatically.</span>
                                        </label>

                                        <label class="wifi-radio-card">
                                            <input type="radio" name="ipv4method" value="manual">
                                            <span class="wifi-radio-title">Manual</span>
                                            <span class="wifi-radio-subtitle">Enter a static address, subnet mask, and router.</span>
                                        </label>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label fw-semibold">IPv4 Address</label>
                                        <div class="row g-2">
                                            <div class="col-md-4">
                                                <label for="addrIp" class="form-label">IP Address</label>
                                                <input id="addrIp" class="form-control wifi-form-control" type="text" placeholder="192.168.10.50" disabled>
                                            </div>
                                            <div class="col-md-4">
                                                <label for="addrMask" class="form-label">Subnet Mask</label>
                                                <input id="addrMask" class="form-control wifi-form-control" type="text" placeholder="255.255.255.0" disabled>
                                            </div>
                                            <div class="col-md-4">
                                                <label for="addrGw" class="form-label">Router</label>
                                                <div class="input-group">
                                                    <input id="addrGw" class="form-control wifi-form-control" type="text" placeholder="192.168.10.254" disabled>
                                                    <button id="addrDel" type="button" class="btn btn-outline-secondary" title="Clear">Clear</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mb-2 d-flex justify-content-between align-items-center gap-2 flex-wrap">
                                        <div>
                                            <label class="form-label fw-semibold mb-0">DNS</label>
                                            <div class="small text-body-secondary">Configure DNS automatically or enter servers manually.</div>
                                        </div>
                                        <div class="d-flex align-items-center gap-2">
                                            <span class="small text-body-secondary">Automatic</span>
                                            <button id="dnsAutoToggle" class="toggle on" type="button" role="switch" aria-checked="true"></button>
                                        </div>
                                    </div>

                                    <div>
                                        <input id="dnsInput" class="form-control wifi-form-control" type="text" placeholder="8.8.8.8, 1.1.1.1" disabled>
                                    </div>
                                </div>

                                <div class="modal-actions adv-actions">
                                    <button id="advCancelBtn" class="btn btn-outline-secondary" type="button">Cancel</button>
                                    <button id="advDisconnectBtn" class="btn btn-danger" type="button">Forget Connection</button>
                                    <button id="advSaveBtn" class="btn btn-primary" type="button">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
            <!-- ==================== END MAIN ==================== -->

        </div>
    </div>

    <?php
  if(isset($_FILES['fileToUpload'])){
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
    $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
    if ($_FILES["fileToUpload"]["size"] > 200000000) {
      echo '<script language="javascript">';
      echo "ModalCustomAlert('Sorry, your file is too large.')";
      echo '</script>';
      $uploadOk = 0;
    }
    else if($imageFileType != "bin") {
      echo '<script language="javascript">';
      echo "ModalCustomAlert('Sorry, only update.bin files are allowed.')";
      echo '</script>';
      $uploadOk = 0;
    }
    else if ($uploadOk == 0) {
      echo '<script language="javascript">';
      echo "ModalCustomAlert('Sorry, your file was not uploaded.')";
      echo '</script>';
    }else {
      $movefile = move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], 'uploads/update.tar');
      if ($movefile)
      {
        echo '<script language="javascript">';
        echo "ModalCustomAlertReload('The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.');";
        echo "showFileUpdate();";
        echo '</script>';
      }
      else
      {
        echo "<script language='javascript'> ModalCustomAlert('Sorry, move_uploaded_file(uploads/update.tar): failed to open stream: Permission denied') </script>";
      }
    }
  }
  else if(isset($_FILES['fileToUploadFpga'])){
    $target_dir = "/var/www/html/uploads_fpga/";
    $target_file = $target_dir . basename($_FILES["fileToUploadFpga"]["name"]);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
    $check = getimagesize($_FILES["fileToUploadFpga"]["tmp_name"]);
    if ($_FILES["fileToUploadFpga"]["size"] > 200000000) {
      echo '<script language="javascript">';
      echo "ModalCustomAlert('Sorry, your file is too large.')";
      echo '</script>';
      $uploadOk = 0;
    }
    else if($imageFileType != "bin") {
      echo '<script language="javascript">';
      echo "ModalCustomAlert('Sorry, only update.bin files are allowed.')";
      echo '</script>';
      $uploadOk = 0;
    }
    else if ($uploadOk == 0) {
      echo '<script language="javascript">';
      echo "ModalCustomAlert('Sorry, your file was not uploaded.')";
      echo '</script>';
    }else {
      $movefile = move_uploaded_file($_FILES["fileToUploadFpga"]["tmp_name"], $target_dir.'update.tar');
      if ($movefile)
      {
        echo '<script language="javascript">';
        echo "ModalCustomAlertReload('The file ". basename( $_FILES["fileToUploadFpga"]["name"]). " has been uploaded.');";
        echo '</script>';
      }
      else
      {
        echo "<script language='javascript'> ModalCustomAlert('Sorry, move_uploaded_file(/var/www/html/uploads_fpga/update.tar): failed to open stream: Permission denied') </script>";
      }
    }
  }
  else if(isset($_FILES['filerestore']))
  {
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($_FILES["filerestore"]["name"]);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
    $check = getimagesize($_FILES["filerestore"]["tmp_name"]);
    if ($_FILES["filerestore"]["size"] > 50000000) {
      echo '<script language="javascript">';
      echo "alert('Sorry, your file is too large.')";
      echo '</script>';
      $uploadOk = 0;
    }
    if($imageFileType != "bin")
    {
      echo '<script language="javascript">';
      echo "alert('Sorry, only restore.bin files are allowed.')";
      echo '</script>';
      $uploadOk = 0;
    }
    if ($uploadOk == 0) {
      echo '<script language="javascript">';
      echo "alert('Sorry, your file was not uploaded.')";
      echo '</script>';
    }
    else
    {
      $movefile = move_uploaded_file($_FILES["filerestore"]["tmp_name"], 'uploads/database.tar');
      if ($movefile)
      {
        echo '<script language="javascript">';
        echo "ModalCustomAlertReload('The file ". basename( $_FILES["filerestore"]["name"]). " has been uploaded.');";
        echo "showRestoreDiv();";
        echo '</script>';

      } else {
        echo '<script language="javascript">';
        echo "ModalCustomAlertReload('Sorry, there was an error uploading your file.')";
        echo '</script>';
      }
    }
  }

  echo '<script language="javascript">';
  echo "WebSocketTest()";
  echo '</script>';
?>

    <script>
      window.WIFI_API_URL = 'api.php';
    </script>

    <!-- ✅ NEW: Wi-Fi logic -->
    <script src="assets/js/wifi.js?v=<?php echo time(); ?>"></script>

</body>
</html>