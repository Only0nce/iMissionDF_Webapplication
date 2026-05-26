<?php
  session_start();
  if($_SESSION['UserID'] == "")
  {
    echo("<script>location.href = 'login.php';</script>");
    exit();
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
    exit();
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

include('dbConfig2.php');
include('timezone.php');
include('ListVariable.php');

// === ดึงข้อมูลจาก DeviceList: id, Name, IPAddress, deviceUniqueId ===
$rowDeviceListQuery = array();

$strSQL = "
    SELECT 
        id,
        Name,
        IPAddress AS ipaddress,
        deviceUniqueId
    FROM DeviceList
    ORDER BY id
";
$deviceListQuery = mysqli_query($conn, $strSQL);
if (!$deviceListQuery) {
    echo ("Database DeviceList Error: ".$conn->error);
    exit();
}
if ($deviceListQuery->num_rows > 0)
{
  while($row = $deviceListQuery->fetch_assoc()) 
  {
    $rowDeviceListQuery[] = $row;
  }
}

// JSON สำหรับ dropdown "Devices"
$devicesJson = htmlspecialchars(json_encode($rowDeviceListQuery), ENT_QUOTES, 'UTF-8');

// JSON สำหรับ existingDevices ให้ JS ใช้ตรวจซ้ำ (ไม่ต้อง htmlspecialchars เพราะจะใส่ใน <script> เป็น JS object)
$existingDevicesJson = json_encode($rowDeviceListQuery, JSON_UNESCAPED_UNICODE);
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
    <title>IFZ: iScan MR-10 WebRx - DF Device Settings</title>

    <link href="assets/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="dashboard.css" rel="stylesheet">

    <!-- Device Card Styling -->
    <style>
      .device-card {
        border-radius: 0.75rem;
        box-shadow: 0 0.25rem 0.75rem rgba(15, 23, 42, 0.15);
        border: 1px solid rgba(148, 163, 184, 0.3);
        transition:
          transform 0.15s ease,
          box-shadow 0.15s ease,
          border-color 0.15s ease;
      }

      [data-bs-theme="dark"] .device-card {
        border-color: rgba(148, 163, 184, 0.35);
        box-shadow: 0 0.35rem 1rem rgba(15, 23, 42, 0.8);
      }

      .device-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 0.75rem 1.5rem rgba(15, 23, 42, 0.22);
        border-color: rgba(59, 130, 246, 0.7);
      }

      .device-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: .5rem;
        margin-bottom: .75rem;
      }

      .device-card-title {
        font-size: 0.95rem;
        font-weight: 600;
        margin: 0;
        word-break: break-word;
      }

      .device-card-badge {
        font-size: 0.7rem;
        padding: 0.15rem 0.55rem;
        border-radius: 999px;
        background: rgba(59, 130, 246, 0.08);
        color: #1d4ed8;
        white-space: nowrap;
      }

      [data-bs-theme="dark"] .device-card-badge {
        background: rgba(59, 130, 246, 0.16);
        color: #bfdbfe;
      }

      .device-card-label {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: .04em;
        color: var(--bs-secondary-color);
        margin-bottom: 0.2rem;
      }

      .device-card .form-control {
        font-size: 0.85rem;
        padding: 0.35rem 0.5rem;
      }

      .device-card-actions {
        margin-top: 0.4rem;
      }

      .device-card-actions .btn {
        font-size: 0.8rem;
        padding: 0.35rem 0.5rem;
      }

      /* Scan table rows */
      .scan-row {
        cursor: pointer;
        transition: background-color 0.15s ease, border-color 0.15s ease;
      }
      .scan-row:hover {
        background-color: rgba(148, 163, 184, 0.10) !important;
      }
      .scan-row-selected,
      .scan-row-selected td,
      .scan-row-selected th {
        background-color: rgba(59, 130, 246, 0.25) !important;
        border-color: rgba(59, 130, 246, 0.45) !important;
      }
      .scan-row-selected:hover td {
        background-color: rgba(59, 130, 246, 0.30) !important;
      }
    </style>

    <script src="assets/dist/js/bootstrap.bundle.min.js"></script>
    <script src="dashboard.js"></script>

    <!-- ✅ inject existingDevices ให้ dfdevice.js ใช้ -->
    <script>
      // existingDevices จาก PHP: [{id,Name,ipaddress,deviceUniqueId}, ...]
      var existingDevices = <?php echo $existingDevicesJson ? $existingDevicesJson : "[]"; ?>;
    </script>

    <!-- ✅ js หลักของหน้านี้ -->
    <script src="dfdevice.js?v=<?php echo time(); ?>"></script>

    <!-- (ของเดิมคุณมี jQuery เยอะ) -->
    <script src="js/jquery.min.js"></script>
    <script type="text/javascript" src="js/jquery-latest.min.js"></script>
    <script type="text/javascript" src="js/jquery-ui.js"></script>
    <link rel="stylesheet" type="text/css" href="css/jquery.datetimepicker.css">
    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/jquery.datetimepicker.js"></script>
  </head>

  <header class="navbar sticky-top flex-md-nowrap p-0 shadow" style="background-color:#000000DD;">
    <svg class="bi_logo m-1"><use xlink:href="dashboard.svg?v=<?php echo time();?>#logo"></use></svg>
    <ul class="navbar-nav flex-row d-md-none">
      <li class="nav-item text-nowrap">
        <button class="nav-link px-3 text-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
          <svg class="bi"><use xlink:href="dashboard.svg?v=<?php echo time();?>#list"/></svg>
        </button>
      </li>
    </ul>

    <div id="navbarSearch" class="navbar-search w-100 collapse">
      <input class="form-control w-100 rounded-0 border-0" type="text" placeholder="Search" aria-label="Search">
    </div>
  </header>

  <body>
    <div class="dropdown position-fixed bottom-0 end-0 mb-3 me-3 bd-mode-toggle">
      <button class="btn btn-bd-primary py-2 dropdown-toggle d-flex align-items-center"
              id="bd-theme"
              type="button"
              aria-expanded="false"
              data-bs-toggle="dropdown"
              aria-label="Toggle theme (auto)">
        <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="dashboard.svg?v=<?php echo time();?>#circle-half"></use></svg>
        <span class="visually-hidden" id="bd-theme-text">Toggle theme</span>
      </button>
      <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="light" aria-pressed="false">
            <svg class="bi me-2 opacity-50" width="1em" height="1em"><use href="dashboard.svg?v=<?php echo time();?>#sun-fill"></use></svg>
            Light
            <svg class="bi ms-auto d-none" width="1em" height="1em"><use href="dashboard.svg?v=<?php echo time();?>#check2"></use></svg>
          </button>
        </li>
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="dark" aria-pressed="false">
            <svg class="bi me-2 opacity-50" width="1em" height="1em"><use href="dashboard.svg?v=<?php echo time();?>#moon-stars-fill"></use></svg>
            Dark
            <svg class="bi ms-auto d-none" width="1em" height="1em"><use href="dashboard.svg?v=<?php echo time();?>#check2"></use></svg>
          </button>
        </li>
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center active" data-bs-theme-value="auto" aria-pressed="true">
            <svg class="bi me-2 opacity-50" width="1em" height="1em"><use href="dashboard.svg?v=<?php echo time();?>#circle-half"></use></svg>
            Auto
            <svg class="bi ms-auto d-none" width="1em" height="1em"><use href="dashboard.svg?v=<?php echo time();?>#check2"></use></svg>
          </button>
        </li>
      </ul>
    </div>

    <!-- ✅ Single Reusable Alert Modal -->
    <div class="modal fade" id="ModalAlert" tabindex="-1" aria-labelledby="ModalAlertTitle" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="ModalAlertTitle">Alert</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <span id="ModalAlertBody">Alert</span>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="ModalAlertCloseBtn">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal New Device -->
    <div class="modal fade" id="ModalNewDevice" tabindex="-1" aria-labelledby="newdevice" aria-hidden="true" style="--bs-modal-width: 50%;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="newdevice">Insert New Device</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            <div class="container m-0 p-1" style="min-width: 100%;">
              <div class="card m-0 p-2" style="width: 100%;height: 100%;">
                <div class="row">
                  <div class="col-12">
                    <h3 id="DeviceName0" class="h3 mb-3">Add Device</h3>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="devicename0" class="form-label">Device Name</label>
                      <input id="devicename0" type="text" class="form-control" value="">
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="ipaddress0" class="form-label">IP Address</label>
                      <input id="ipaddress0" type="text" class="form-control" value="">
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="deviceuniqueid0" class="form-label">Serial Number</label>
                      <input id="deviceuniqueid0" type="text" class="form-control" style="text-transform:uppercase" value="">
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div class="modal-footer">
            <div class="row col-lg-6 col-md-12 col-sm-12">
              <div class="col-6">
                <button type="button" class="btn btn-primary" onclick="insertClient()" style="width: 100%;">Apply</button>
              </div>
              <div class="col-6">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" style="width: 100%;">Close</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Modal Scan Devices -->
    <div class="modal fade" id="ModalScanDevices" tabindex="-1" aria-labelledby="scanDevicesLabel" aria-hidden="true" style="--bs-modal-width: 70%;">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title" id="scanDevicesLabel">Scan Devices on Network</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            <div class="container-fluid m-0 p-1" style="min-width: 100%;">
              <div class="card m-0 p-2" style="width: 100%; height: 100%;">

                <div class="row align-items-center mb-2">
                  <div class="col">
                    <h3 class="h5 mb-0">Network Scan</h3>
                    <small class="text-body-secondary">Scan subnet for iScan MR-10 / DF devices</small>
                  </div>

                  <!-- ✅ Start/End IP -->
                  <div class="col-12 col-lg-auto mt-2 mt-lg-0">
                    <div class="input-group input-group-sm">
                      <span class="input-group-text">Start</span>
                      <input id="scanStartIp" type="text" class="form-control" placeholder="192.168.10.1" value="192.168.10.1">
                      <span class="input-group-text">End</span>
                      <input id="scanEndIp" type="text" class="form-control" placeholder="192.168.10.254" value="192.168.10.254">
                    </div>
                  </div>

                  <div class="col-auto d-flex gap-2 mt-2 mt-lg-0">
                    <button id="btnScanDevices"
                            type="button"
                            class="btn btn-sm btn-primary"
                            onclick="scanDevicesButtonClicked()">
                      <span id="btnScanDevicesLabel">Scan</span>
                    </button>
                    <button id="btnSelectAllScan"
                            type="button"
                            class="btn btn-sm btn-outline-secondary"
                            onclick="dfScan_selectAllValid()">
                      Select All
                    </button>
                    <button id="btnClearScan"
                            type="button"
                            class="btn btn-sm btn-outline-secondary"
                            onclick="dfScan_clearSelection()">
                      Clear
                    </button>
                  </div>
                </div>

                <div class="row">
                  <div class="col-12">
                    <div class="table-responsive" style="max-height: 350px; overflow-y: auto;">
                      <table class="table table-sm align-middle mb-0 table-hover">
                        <thead class="table-light">
                          <tr>
                            <th style="width: 32px; cursor: pointer;"
                                onclick="dfScan_toggleAllFromHeader()">
                              <input id="chkScanAll"
                                    type="checkbox"
                                    class="form-check-input"
                                    onclick="dfScan_toggleAllCheckbox(this)">
                            </th>

                            <th style="cursor: pointer;" onclick="dfScan_toggleAllFromHeader()">Name</th>
                            <th style="cursor: pointer;" onclick="dfScan_toggleAllFromHeader()">IP Address</th>
                            <th style="cursor: pointer;" onclick="dfScan_toggleAllFromHeader()">Serial</th>
                            <th style="cursor: pointer;" onclick="dfScan_toggleAllFromHeader()">Ping</th>
                            <th style="cursor: pointer;" onclick="dfScan_toggleAllFromHeader()">Status</th>
                          </tr>
                        </thead>
                        <tbody id="scanTableBody">
                          <!-- JS เติม -->
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div class="modal-footer">
            <div class="row col-lg-8 col-md-12 col-sm-12">
              <div class="col-md-6 col-12 mb-2 mb-md-0">
                <button id="btnAddSelectedScan"
                        type="button"
                        class="btn btn-success"
                        style="width: 100%;"
                        onclick="dfScan_addSelected()">
                  Add Selected
                </button>
              </div>
              <div class="col-md-6 col-12">
                <button type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal"
                        style="width: 100%;">Close</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="container-fluid">
      <div class="row">
        <div class="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
          <div class="offcanvas-md offcanvas-end bg-body-tertiary" tabindex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
            <div class="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
              <ul class="nav flex-column">
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" aria-current="page" href="index.php">
                    <svg class="bi"><use xlink:href="dashboard.svg#house-fill"/></svg>
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
                  <a class="nav-link d-flex align-items-center gap-2" aria-current="page" href="audiofiles">
                    <svg class="bi"><use xlink:href="fontawesome-free-5.15.4-web/sprites/regular.svg?v=<?php echo time();?>#file-audio"/></svg>
                    Audio Archive
                  </a>
                </li>
                <!---<li class="nav-item">
                <a class="nav-link d-flex align-items-center gap-2" aria-current="page" href="mapvisual.php">
                    <svg class="bi"><use xlink:href="dashboard.svg?v=<?php echo time();?>#mapvisual"/></svg>
                    Map Visual
                </a>
                </li>-->
              </ul>

              <hr class="my-3">
              <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
                <span>Device Manager</span>
              </h6>

              <ul class="nav flex-column mb-auto">
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" href="user.php">
                    <svg class="bi"><use xlink:href="fontawesome-free-5.15.4-web/sprites/regular.svg#user"/></svg>
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
                    <svg class="bi"><use xlink:href="dashboard.svg?v=<?php echo time();?>#DFGroup"/></svg>
                    DF Role Setting
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2 active" href="dfdevice.php">
                    <svg class="bi"><use xlink:href="dashboard.svg?v=<?php echo time();?>#DFDevice"/></svg>
                    DF Device Settings
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" href="settings.php">
                    <svg class="bi"><use xlink:href="dashboard.svg#gear-wide-connected"/></svg>
                    Settings
                  </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link d-flex align-items-center gap-2" href="wifi.php">
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
                            <use xlink:href="dashboard.svg?v=<?php echo time();?>#plus-circle"/>
                        </svg>
                        Register Device
                    </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" href="logout.php">
                    <svg class="bi"><use xlink:href="dashboard.svg?v=<?php echo time();?>#door-closed"/></svg>
                    <?php echo "Sign out(" .$userName.")" ?>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">DF Device Settings</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
              <?php
              // search box
              echo '<div class="input-group m-1">
                      <input type="text" class="form-control form-control-sm" id="deviceSearchBox" onkeyup="filterDeviceList()" placeholder="Search device...">
                      <button class="btn btn-outline-secondary" type="button" onclick="filterDeviceList()">
                        <svg class="bi"><use xlink:href="dashboard.svg#search"/></use></svg>
                      </button>
                    </div>';

              // dropdown filter
              echo '
                <button id="deviceIdSelect" value="0" type="button"
                        class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center gap-1 m-1"
                        data-bs-toggle="dropdown" aria-expanded="false">
                  <svg class="bi"><use id="deviceIdSelectSVG" xlink:href="dashboard.svg#puzzle"/></use></svg>
                  <span id="deviceIdSelectLabel">Devices</span>
                </button>
                <ul class="dropdown-menu">
              ';

              echo '
                <li class="dropdown-item" onclick="showOnly1ID(0,\'All Device\',\'puzzle\','.$devicesJson.')">
                  <a class="dropdown-link d-flex align-items-center gap-2">
                    <svg class="bi"><use xlink:href="dashboard.svg#puzzle"></use></svg>
                    All Device
                  </a>
                </li>
              ';

              foreach ($rowDeviceListQuery as $rowDevice)
              {
                $id   = (int)$rowDevice["id"];
                $name = htmlspecialchars($rowDevice["Name"], ENT_QUOTES, 'UTF-8');
                echo '
                  <li class="dropdown-item" onclick="showOnly1ID('.$id.',\''.$name.'\',\'puzzle\','.$devicesJson.')">
                    <a class="dropdown-link d-flex align-items-center gap-2">
                      <svg class="bi"><use xlink:href="dashboard.svg#puzzle"></use></svg>
                      '.$name.'
                    </a>
                  </li>
                ';
              }

              echo '</ul>';

              if ($userLevelAdmin == 1){
                echo '<button type="button" class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 m-1"  data-bs-toggle="modal" data-bs-target="#ModalNewDevice">';
                echo '    <svg class="bi"><use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#folder-plus"/></svg>';
                echo 'New Device';
                echo '  </button>';
              }

              echo '<button type="button"
                          class="btn btn-sm btn-outline-success d-flex align-items-center gap-1 m-1"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalScanDevices">';
              echo '    <svg class="bi"><use xlink:href="dashboard.svg#search"/></use></svg>';
              echo 'Scan Devices';
              echo '</button>';
              ?>
            </div>
          </div>

          <?php
          {
            if ($userLevelAdmin == 1)
              echo '<fieldset id="deviceControl" style="opacity:1">';
            else
              echo '<fieldset id="deviceControl" disabled style="opacity:1">';

            echo '<div class="row g-3">';

            foreach ($rowDeviceListQuery as $rowDevice)
            {
              $id   = (int)$rowDevice["id"];
              $name = htmlspecialchars($rowDevice["Name"]);
              $ip   = htmlspecialchars($rowDevice["ipaddress"]);
              $uid  = htmlspecialchars($rowDevice["deviceUniqueId"]);

              echo '  <div id="container'.$id.'" class="col-12 col-sm-6 col-lg-4 col-xl-3">';
              echo '    <div class="card device-card h-100">';
              echo '      <div class="card-body">';

              echo '        <div class="device-card-header">';
              echo '          <h5 id="DeviceName'.$id.'" class="device-card-title">'.$name.'</h5>';
              if (!empty($uid)) {
                echo '          <span class="device-card-badge">SN: '.$uid.'</span>';
              } else {
                echo '          <span class="device-card-badge">No SN</span>';
              }
              echo '        </div>';

              echo '        <div class="mb-2">';
              echo '          <div class="device-card-label">Device Name</div>';
              echo '          <input id="devicename'.$id.'" type="text" class="form-control" value="'.$name.'">';
              echo '        </div>';

              echo '        <div class="mb-2">';
              echo '          <div class="device-card-label">IP Address</div>';
              echo '          <input id="ipaddress'.$id.'" type="text" class="form-control" value="'.$ip.'">';
              echo '        </div>';

              echo '        <div class="mb-3">';
              echo '          <div class="device-card-label">Serial Number</div>';
              echo '          <input id="deviceuniqueid'.$id.'" '
                  .'type="text" class="form-control" '
                  .'style="text-transform:uppercase" '
                  .'value="'.$uid.'" '
                  .'data-original-sn="'.$uid.'">';
              echo '        </div>';

              echo '        <div class="device-card-actions d-flex gap-2">';
              echo '          <button type="button" class="btn btn-primary flex-fill" onclick="setCurrentId('.$id.')">Apply</button>';
              echo '          <button type="button" class="btn btn-warning flex-fill" onclick="setCurrentIdForDelete('.$id.')">Remove</button>';
              echo '        </div>';

              echo '      </div>';
              echo '    </div>';
              echo '  </div>';
            }

            echo '</div>';
          }
          echo '</fieldset>';
          ?>

        </main>
      </div>
    </div>

<?php
  if ($userID > 0)
  {
    echo '<script type="text/javascript">',
         'setUserID('.$userID.');',
         '</script>'
    ;
  }
?>

<!-- ✅ helper showModalAlert (modal ของหน้านี้) -->
<script>
function showModalAlert(message) {
  try {
    var bodySpan = document.getElementById("ModalAlertBody");
    if (bodySpan) bodySpan.textContent = message;

    var modalElement = document.getElementById("ModalAlert");
    if (modalElement && typeof bootstrap !== "undefined") {
      var modal = bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.show();
    } else {
      alert(message);
    }
  } catch (e) {
    console.error("showModalAlert error:", e);
    alert(message);
  }
}
window.showModalAlert = showModalAlert;
</script>

</body>
</html>
