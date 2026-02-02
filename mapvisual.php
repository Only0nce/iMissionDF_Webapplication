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

  $currentScript = basename($_SERVER['SCRIPT_NAME']);
?>

<?php
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// ===== โหลด DB + timezone + ตัวแปรทั่วไป =====
include('dbConfig2.php');
include('timezone.php');
include('ListVariable.php');

// ======================= โหลด Role จาก DeviceGroups =======================
$roleID     = -1;
$roleName   = "";
$rolesList  = [];

// รับ roleID จาก GET ถ้ามี (เผื่ออยากเปิดมาพร้อม role ที่เลือก)
if (isset($_GET['roleID'])) {
    $roleID = (int)$_GET['roleID'];
}

// ดึง Role จาก DeviceGroups
$strSQL = "
    SELECT 
        GroupID        AS roleID,
        GroupsName     AS roleName,
        MIN(uniqueIdInGroup) AS uniqueIdInGroup
    FROM DeviceGroups
    WHERE GroupID IS NOT NULL
    GROUP BY GroupID, GroupsName
    ORDER BY GroupID
";
$sqlQuery = mysqli_query($conn, $strSQL);
if (!$sqlQuery) {
    echo ('Database DeviceGroups Error: ' . $conn->error);
    exit();
}
if ($sqlQuery->num_rows > 0) {
    while ($row = $sqlQuery->fetch_assoc()) {
        $rolesList[] = $row;
    }
}

if (!empty($rolesList) && $roleID == -1) {
    $roleID   = (int)$rolesList[0]['roleID'];
    $roleName = $rolesList[0]['roleName'];
}
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
    <title>IFZ: iScan MR-10 WebRx - Map Visual</title>

    <!-- Bootstrap -->
    <link href="assets/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="dashboard.css" rel="stylesheet">

    <!-- MapLibre GL CSS & JS -->
    <link href="assets/maplibre/maplibre-gl.css" rel="stylesheet">
    <script src="assets/maplibre/maplibre-gl.js"></script>

    <script src="assets/dist/js/bootstrap.bundle.min.js"></script>
    <script src="dashboard.js"></script>
    <script src="mapvisual.js?v=<?php echo time(); ?>"></script>

    <style>
      #map {
        width: 100%;
        height: 980px;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
      }

      .maplibregl-ctrl-top-right {
        margin-top: 60px;
      }
      /* Base transparent colored button */
      .conn-glass {
        background: rgba(108, 117, 125, 0.15); /* เทาโปร่ง default */
        border: 1px solid rgba(108, 117, 125, 0.45);
        color: #ffffff;

        border-radius: 999px;
        font-weight: 600;
        letter-spacing: 0.4px;

        transition: background 0.25s ease,
                    box-shadow 0.25s ease,
                    transform 0.2s ease;
      }

      /* Hover */
      .conn-glass:hover {
        box-shadow: 0 4px 14px rgba(0,0,0,0.25);
        transform: translateY(-1px);
      }

      /* ===== LOCAL (Green transparent) ===== */
      .conn-glass.local {
        background: rgba(25, 135, 84, 0.25);   /* green */
        border-color: rgba(25, 135, 84, 0.85);
        color: #e6fff4;
      }

      /* ===== REMOTE (Red transparent) ===== */
      .conn-glass.remote {
        background: rgba(220, 53, 69, 0.25);   /* red */
        border-color: rgba(220, 53, 69, 0.85);
        color: #ffe6ea;
      }

      /* ===== Light theme ===== */
      [data-bs-theme="light"] .conn-glass {
        color: #757575;
      }

      /* ===== Dark theme ===== */
      [data-bs-theme="dark"] .conn-glass {
        color: #757575;
      }


    </style>
  </head>

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
      <input class="form-control w-100 rounded-0 border-0" type="text"
             placeholder="Search" aria-label="Search">
    </div>
  </header>

  <body>
    <!-- Theme toggle -->
    <div class="dropdown position-fixed bottom-0 end-0 mb-3 me-3 bd-mode-toggle">
      <button class="btn btn-bd-primary py-2 dropdown-toggle d-flex align-items-center"
              id="bd-theme"
              type="button"
              aria-expanded="false"
              data-bs-toggle="dropdown"
              aria-label="Toggle theme (auto)">
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

    <!-- Modal Alert -->
    <div class="modal fade" id="ModalAlert" tabindex="-1" aria-labelledby="Alert"
         aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="Alert">Alert</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"
                    aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <span id="ModalAlertBody">Unable to connect to the iScan Receiver Module.</span>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary"
                    data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div class="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
          <div class="offcanvas-md offcanvas-end bg-body-tertiary" tabindex="-1"
               id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
            <div class="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
              <ul class="nav flex-column">
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2"
                     aria-current="page" href="index.php">
                    <svg class="bi"><use xlink:href="dashboard.svg#house-fill"/></svg>
                    Home
                  </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link d-flex align-items-center gap-2"
                       href="playRecording.php">
                        <svg class="bi">
                            <use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#record-vinyl" />
                        </svg>
                        Recorder Playback
                    </a>
                </li>
                <!-- <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2"
                     href="eventLoggerData.php">
                    <svg class="bi">
                      <use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg?v=<?php echo time();?>#layer-group"/>
                    </svg>
                    Event Logger
                  </a>
                </li> -->
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2"
                     href="audiofiles">
                    <svg class="bi">
                      <use xlink:href="fontawesome-free-5.15.4-web/sprites/regular.svg?v=<?php echo time();?>#file-audio"/>
                    </svg>
                    Audio Archive
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2 active"
                     href="mapvisual.php">
                    <svg class="bi">
                      <use xlink:href="dashboard.svg?v=<?php echo time();?>#mapvisual"/>
                    </svg>
                    Map Visual
                  </a>
                </li>
              </ul>
              <hr class="my-3">
              <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
                <span>Device Manager</span>
              </h6>

              <ul class="nav flex-column mb-auto">
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" href="user.php">
                    <svg class="bi">
                      <use xlink:href="fontawesome-free-5.15.4-web/sprites/regular.svg#user"/>
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
                      <use xlink:href="dashboard.svg?v=<?php echo time();?>#DFGroup"/>
                    </svg>
                    DF Role Setting
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" href="dfdevice.php">
                    <svg class="bi">
                      <use xlink:href="dashboard.svg?v=<?php echo time();?>#DFDevice"/>
                    </svg>
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
                    <?php echo "Sign out(" .htmlspecialchars($userName,ENT_QUOTES,"UTF-8").")" ?>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- MAIN CONTENT -->
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Map Visual</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
              <div class="btn-group m-1 conn-switch">
                <button id="connSwitch"
                        type="button"
                        class="btn conn-glass d-flex align-items-center gap-2 px-3"
                        onclick="toggleConnectionMode()">
                  <svg class="bi" width="18" height="18">
                    <use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#plug"></use>
                  </svg>
                  <span id="connSwitchLabel">LOCAL</span>
                </button>
              </div>

              <div class="btn-group m-1" id="styleButtons">

                <button id="mapStyleSelect"
                        value="satellite"
                        type="button"
                        class="btn btn-outline-secondary dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style="min-width: 180px;">
                  <span id="mapStyleSelectLabel">Map Style : Satellite</span>
                </button>

                <ul class="dropdown-menu" id="dropdownMapStyleSelect" style="min-width: 100%;">
                  <li class="dropdown-item" onclick="selectMapStyle('satellite')">Satellite</li>
                  <li class="dropdown-item" onclick="selectMapStyle('bright')">Bright</li>
                  <li class="dropdown-item" onclick="selectMapStyle('dark')">Dark</li>
                  <!-- <li class="dropdown-item" onclick="selectMapStyle('fiord')">Fiord</li> -->
                </ul>

              </div>
              <!-- Role Selection -->
              <div class="btn-group m-1">
                <?php
                  $hasRoles = isset($rolesList) && is_array($rolesList) && count($rolesList) > 0;
                  $currentRoleLabel = "Select Role";
                  if ($hasRoles) {
                    if ($roleID > 0) {
                      foreach ($rolesList as $r) {
                        if ($roleID == (int)$r["roleID"]) {
                          $currentRoleLabel = htmlspecialchars($r["roleName"], ENT_QUOTES, "UTF-8");
                          break;
                        }
                      }
                    } else {
                      $currentRoleLabel = htmlspecialchars($rolesList[0]["roleName"], ENT_QUOTES, "UTF-8");
                    }
                  }
                ?>

                <button id="roleIdSelect"
                        value="<?php echo ($roleID > 0 ? (int)$roleID : 0); ?>"
                        type="button"
                        class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center gap-1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style="min-width: 200px;">

                  <svg class="bi">
                    <use id="roleIdSelectSVG"
                         xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#layer-group"></use>
                  </svg>

                  <span id="roleIdSelectLabel">
                    <?php echo $currentRoleLabel; ?>
                  </span>
                </button>

                <ul class="dropdown-menu dropdown-menu-end">
                  <?php if ($hasRoles): ?>
                    <?php foreach ($rolesList as $role): ?>
                      <?php
                        $rid      = (int)$role["roleID"];
                        $rnameRaw = $role["roleName"];
                        $rname    = htmlspecialchars($rnameRaw, ENT_QUOTES, "UTF-8");
                        $isActive = ($roleID == $rid) ? " active" : "";
                      ?>
                      <li>
                        <a class="dropdown-item<?php echo $isActive; ?> d-flex align-items-center gap-2"
                           href="javascript:void(0)"
                           onclick="changeRoleFromDropdown(<?php echo $rid; ?>, '<?php echo $rname; ?>')">
                          <svg class="bi">
                            <use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#layer-group"></use>
                          </svg>
                          <?php echo $rname; ?>
                        </a>
                      </li>
                    <?php endforeach; ?>
                  <?php else: ?>
                    <li>
                      <span class="dropdown-item disabled">No Roles</span>
                    </li>
                  <?php endif; ?>
                </ul>
              </div>

            </div> <!-- btn-toolbar -->

          </div>

          <!-- แผนที่ MapLibre GL -->
          <div id="map"></div>

        </main>
      </div>
    </div>

    <script>
      const STYLE_URLS = {
        satellite: "http://192.168.10.13:8080/styles/satellite-hybrid/style.json",
        bright:    "http://192.168.10.13:8080/styles/osm-bright-ifz/style.json",
        dark:      "http://192.168.10.13:8080/styles/googlemapbright/style.json"
        // fiord:     "http://192.168.10.13:8080/styles/fiord/style.json"
      };

      let currentStyleKey = "satellite";
      let map = null;

      document.addEventListener("DOMContentLoaded", function () {
        map = new maplibregl.Map({
          container: "map",
          style: STYLE_URLS[currentStyleKey],
          center: [100.523186, 13.736717], // [lon, lat]
          zoom: 11
        });

        map.addControl(new maplibregl.NavigationControl(), "top-right");
      });

      // เปลี่ยน style บนแผนที่
      function changeMapStyle(styleKey) {
        console.log("changeMapStyle:", styleKey);

        const styleUrl = STYLE_URLS[styleKey];
        if (!styleUrl) {
          console.error("Style not found:", styleKey);
          return;
        }

        if (!map) {
          console.warn("Map is not ready yet");
          return;
        }

        if (styleKey === currentStyleKey) {
          return;
        }

        currentStyleKey = styleKey;
        map.setStyle(styleUrl);
      }

      // ใช้กับ dropdown Map Style
      function selectMapStyle(styleKey) {
        changeMapStyle(styleKey);

        const label = document.getElementById("mapStyleSelectLabel");
        if (label) {
          const names = {
            satellite: "Satellite",
            bright:    "Bright",
            dark:      "Dark"
            // fiord:     "Fiord"
          };
          label.textContent = "Map Style : " + (names[styleKey] || styleKey);
        }
      }

      // ใช้กับ dropdown Role
      // function changeRoleFromDropdown(roleID, roleName) {
      //   console.log("changeRoleFromDropdown", roleID, roleName);

      //   const label = document.getElementById("roleIdSelectLabel");
      //   const btn   = document.getElementById("roleIdSelect");
      //   if (label) label.textContent = roleName;
      //   if (btn)   btn.value = roleID;

      //   // ถ้ามี WebSocket จาก mapvisual.js ก็ส่งไปแจ้ง Qt
      //   try {
      //     if (window.ws && ws.readyState === WebSocket.OPEN) {
      //       const payload = {
      //         menuID: "ChangeActiveRoleID",
      //         roleID: roleID
      //       };
      //       ws.send(JSON.stringify(payload));
      //     }
      //   } catch (e) {
      //     console.warn("changeRoleFromDropdown: ws send error", e);
      //   }

      //   // ถ้าต้องการ reload หน้าแทน:
      //   // window.location.href = "mapvisual.php?roleID=" + roleID;
      // }
    </script>

  </body>
</html>
