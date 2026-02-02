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

  $currentScript = basename(__FILE__);
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

// ======================= Role / Device Query ส่วนสำคัญ =======================
$roleID   = -1;
$roleName = "";
$rolesList = []; 

// รับ roleID จาก GET (เวลาสลับ role จาก dropdown)
if (isset($_GET['roleID'])) {
    $roleID = (int)$_GET['roleID'];
}

// ----- โหลด Roles จาก DeviceGroups (GroupID = roleID, GroupsName = roleName, uniqueIdInGroup) -----
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
$sqlQuery = mysqli_query($conn,$strSQL);
if (!$sqlQuery) {
    echo ("Database DeviceGroups Error: ".$conn->error);
    exit();
}
if ($sqlQuery->num_rows > 0)
{
  while($row = $sqlQuery->fetch_assoc()) 
  {
    $rolesList[] = $row;
  }
}

if (!empty($rolesList) && $roleID == -1) {
    $roleID   = (int)$rolesList[0]['roleID'];
    $roleName = $rolesList[0]['roleName'];
}

$rowDeviceListQuery = array();
$strSQL = "
    SELECT 
        id,
        Name,
        IPAddress     AS ipaddress,
        deviceUniqueId,
        'puzzle'      AS iconName        -- ใช้ icon เดียวกันไปก่อน
    FROM DeviceList
    ORDER BY id
";
$deviceListQuery = mysqli_query($conn,$strSQL);
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
?>
<!doctype html>
<html lang="en" data-bs-theme="auto">
  <head><script src="assets/js/color-modes.js"></script>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors">
    <meta name="generator" content="Hugo 0.122.0">
    <title>IFZ: iScan MR-10 WebRx</title>
    <link href="assets/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="dashboard.css" rel="stylesheet">
    <script src="assets/dist/js/bootstrap.bundle.min.js"></script>
    <script src="dashboard.js"></script>
    <script src="settings.js?v=<?php echo time(); ?>"></script>
    <script src="dfrole.js?v=<?php echo time(); ?>"></script>
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

    <!-- Modal confirmToRebootSystem-->
    <div class="modal fade" id="confirmToRebootSystem" tabindex="-1" aria-labelledby="confirmToRebootSystemLabel" aria-hidden="true">
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
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" >Close</button>
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick="confirmToRebootSystem()" >REBOOT</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal confirmToUpdateSystem-->
    <div class="modal fade" id="confirmToUpdateSystem" tabindex="-1" aria-labelledby="confirmToUpdateSystemLabel" aria-hidden="true">
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
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" >Close</button>
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick="systemupdate()" >UPDATE</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Alert-->
    <div class="modal fade" id="ModalAlert" tabindex="-1" aria-labelledby="Alert" aria-hidden="true" >
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

    <!-- Modal Custom Alert-->
    <div class="modal fade" id="ModalCustomAlert" tabindex="-1" aria-labelledby="Alert" aria-hidden="true" >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="Alert">Alert</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <span id="textAlert"> Unable to connect to the iScan Receiver Module. </span>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Custom Alert And Reload-->
    <div class="modal fade" id="ModalCustomAlertReload" tabindex="-1" aria-labelledby="Alert" aria-hidden="true" >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="Alert">Alert</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <span id="ModalCustomTextAlert"> Unable to connect to the iScan Receiver Module. </span>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ============ Modal สำหรับ DF Role (Role Setup, ใช้ DeviceList / DeviceGroups) ============ -->

    <!-- Role Setup Modal -->
    <div class="modal fade" id="ModalNewDevice" tabindex="-1" aria-labelledby="newdevice" aria-hidden="true" style="--bs-modal-width: 35%;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="newdevice">DF Role Setup</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
          <?php
            {
              echo '  <div class="container m-0 p-1" style="min-width: 100%;">';
              echo '    <div class="card m-0 p-2" style="width: 100%;height: 100%;">';
              echo '      <div class="row align-items-end" >';
              echo '        <div class="col-md-12">';
              echo '          <div class="mb-3">';
              echo '            <svg class="biDeviceList rounded-start" style="width:100%"><use id="iconNewDevice" xlink:href="dashboard.svg#edit"/></svg>';
              echo '          </div>'; 
              echo '           <div class="mb-3">';

              echo '            <button id="roleIdSelected" value="0" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center gap-1" data-bs-toggle="dropdown" aria-expanded="false" style="width:100%">';
              if (empty($rolesList))
              {
                echo '              <svg class="bi"><use id="roleIdSelectedSVG" xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#plus-circle"/></use></svg>';
                echo '            <span id="roleIdSelectedLabel">New Role</span>';
              }
              else
              {
                $roleNameShow = "New Role";
                foreach ($rolesList as $r) 
                {
                  if ($roleID == (int)$r["roleID"])
                  {
                    $roleName = $r["roleName"];
                    $roleNameShow = $r["roleName"];
                    echo '              <svg class="bi"><use id="roleIdSelectedSVG" xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#layer-group"/></use></svg>';
                    echo '            <span id="roleIdSelectedLabel">'.htmlspecialchars($roleNameShow,ENT_QUOTES,"UTF-8").'</span>';
                  }
                }
                if ($roleID == -1) {
                  echo '              <svg class="bi"><use id="roleIdSelectedSVG" xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#plus-circle"/></use></svg>';
                  echo '            <span id="roleIdSelectedLabel">New Role</span>';
                }
              }
              echo '              <ul class="dropdown-menu" id="dropdownRoleIdSelected" style="min-width:100%">';   

              // New Role
              echo '                <li class="dropdown-item" onclick="setRoleIdToNewDevice(0,\'New Role\',';
              echo  htmlspecialchars(json_encode($rolesList),ENT_QUOTES,"UTF-8");
              echo')">';
              echo '                <a class="dropdown-link d-flex align-items-center gap-2">';
              echo '                <svg class="bi"><use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#plus-circle"></use></svg>';
              echo                  'New Role';
              echo '                </a>';
              echo '                </li>';

              // Existing Roles
              foreach ($rolesList as $r) 
              {
                $rid = (int)$r["roleID"];
                $rname = htmlspecialchars($r["roleName"],ENT_QUOTES,"UTF-8");
                echo '                <li class="dropdown-item" onclick="setRoleIdToNewDevice('.$rid.',\''.$rname.'\',';
                echo  htmlspecialchars(json_encode($rolesList),ENT_QUOTES,"UTF-8");
                echo')">';
                echo '                <a class="dropdown-link d-flex align-items-center gap-2">';
                echo '                <svg class="bi"><use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#layer-group"></use></svg>';
                echo                  $rname;
                echo '                </a>';
                echo '                </li>';        
              }
              echo '              </ul>';  
              echo '            </button>';

              echo '          </div>';  

              // Role Name input
              $roleNameForInput = ($roleID > 0 && !empty($roleName)) ? htmlspecialchars($roleName,ENT_QUOTES,"UTF-8") : "";
              echo '          <div class="mb-3">';
              echo '            <span for="roleNameToNewDevice" class="form-label">Role Name</span>';
              echo '            <input id="roleNameToNewDevice" type="text" class="form-control" value="'.$roleNameForInput.'">';
              echo '          </div>';  

              // Dropdown Change Role Name / Delete / Insert Device
              echo '    <div class="mb-3">';
              echo '      <button id="newDeviceIdSelect" value="0" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center gap-1" data-bs-toggle="dropdown" aria-expanded="false" style="width:100%">';
              echo '        <svg class="bi"><use id="newDeviceIdSelectSVG" xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#edit"/></use></svg>';
              echo '        <span id="newDeviceIdSelectLabel">Change Role Name / Delete / Insert Device</span>';
              echo '        <ul class="dropdown-menu" id="dropdownNewDeviceIdSelect"  style="min-width:100%">';

              // Change Role Name only
              echo '          <li class="dropdown-item " onclick="setNewDeviceToRole(0,\'Change Role Name\',\'edit\',';
              echo  htmlspecialchars(json_encode(""),ENT_QUOTES,"UTF-8");
              echo')">';
              echo '            <a class="dropdown-link d-flex align-items-center gap-2">';
              echo '              <svg class="bi"><use xlink:href="dashboard.svg#edit"></use></svg>';
              echo '              Change Role Name';
              echo '            </a>';
              echo '          </li>';

              // Delete Role
              echo '          <li class="dropdown-item " onclick="setNewDeviceToRole(-1,\'Delete Role\',\'trash\',';
              echo  htmlspecialchars(json_encode(""),ENT_QUOTES,"UTF-8");
              echo')">';
              echo '            <a class="dropdown-link d-flex align-items-center gap-2">';
              echo '              <svg class="bi"><use xlink:href="dashboard.svg#trash"></use></svg>';
              echo '              Delete Role';
              echo '            </a>';
              echo '          </li>';

              echo '          <div class="dropdown-divider"></div>';
              echo '          <label for="roleNameToNewDevice" class="form-label m-2">Insert Device</label>';

              // Insert Device จาก DeviceList
              foreach ($rowDeviceListQuery as $rowDevice) 
              {
                $did   = (int)$rowDevice["id"];
                $dname = htmlspecialchars($rowDevice["Name"],ENT_QUOTES,"UTF-8");
                $dip   = htmlspecialchars($rowDevice["ipaddress"],ENT_QUOTES,"UTF-8");
                $dicon = htmlspecialchars($rowDevice["iconName"],ENT_QUOTES,"UTF-8");

                echo '          <li class="dropdown-item" onclick="setNewDeviceToRole('.$did.',\''.$dname.'\',\''.$dicon.'\',';
                echo  htmlspecialchars(json_encode($rowDeviceListQuery),ENT_QUOTES,"UTF-8");
                echo')">';
                echo '            <a class="dropdown-link d-flex align-items-center gap-2">';
                echo '              <svg class="bi"><use xlink:href="dashboard.svg#'.$dicon.'"></use></svg>';
                echo                $dname;
                echo '            </a>';
                echo '          </li>';        
              }
              echo '        </ul>';  
              echo '      </button>';
              echo '    </div>';

              echo '        </div>';  // col-md-12
              echo '      </div>';    // row
              echo '    </div>';      // card
              echo '  </div>';        // container
            }
          ?>
          </div>
          <div class="modal-footer">
            <div class="row  col-lg-6 col-md-12 col-sm-12">
              <div class="col-6">
                <?php
                echo '<button type="button" class="btn btn-primary" onclick="applyInsertNewDeviceInRole('.$userID.')" style="width: 100%;">Apply</button>';
                ?>
              </div>
              <div class="col-6">
                <button type="button" class="btn btn-secondary" onclick="resetInsertNewDeviceInRole()" data-bs-dismiss="modal" style="width: 100%;">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal confirmToDeleteClient (ลบ device ใน role) -->
    <div class="modal fade" id="confirmToDeleteClient" tabindex="-1" aria-labelledby="confirmToDeleteClientLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="confirmToDeleteClientLabel">Please Confirm</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="resetCurrentId()"></button>
          </div>
          <div class="modal-body">
            Remove device from this DF Role?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="resetCurrentId()">Close</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="deleteDevice()" >Remove</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal confirmToEditClientInRole -->
    <div class="modal fade" id="confirmToEditClientInRole" tabindex="-1" aria-labelledby="confirmToEditClientInRoleLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="confirmToEditClientInRoleLabel">Please Confirm</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="resetCurrentId()"></button>
          </div>
          <div class="modal-body">
            Save change in DF Role device?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="resetCurrentId()">Close</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="applyChange()" >Save changes</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal confirmToChangeActiveRoleID -->
    <div class="modal fade" id="confirmToChangeActiveRoleID" tabindex="-1" aria-labelledby="confirmToChangeActiveRoleIDLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="confirmToChangeActiveRoleIDLabel">Please Confirm</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Change Active DF Role. Please Confirm!
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" >Close</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="ChangeActiveRoleID()" >Select Role</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal confirmToDeleteRoleID -->
    <div class="modal fade" id="confirmToDeleteRoleID" tabindex="-1" aria-labelledby="confirmToDeleteRoleIDLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="confirmToDeleteRoleIDLabel">Please Confirm</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Delete this DF Role from DeviceGroups?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" >Close</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="deleteRoleID()" >Delete Role</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ====================== MAIN LAYOUT ====================== -->
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
                <!-- <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" aria-current="page" href="eventLoggerData.php">
                    <svg class="bi"><use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg?v=<?php echo time();?>#layer-group"/></svg>
                    Event Logger
                  </a>
                </li> -->
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" aria-current="page" href="audiofiles">
                    <svg class="bi"><use xlink:href="fontawesome-free-5.15.4-web/sprites/regular.svg?v=<?php echo time();?>#file-audio"/></svg>
                    Audio Archive
                  </a>
                </li> 
                <li class="nav-item">
                <a class="nav-link d-flex align-items-center gap-2" aria-current="page" href="mapvisual.php">
                    <svg class="bi"><use xlink:href="dashboard.svg?v=<?php echo time();?>#mapvisual"/></svg>
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
                  <a class="nav-link d-flex align-items-center gap-2 active" href="dfrole.php">
                    <svg class="bi"><use xlink:href="dashboard.svg?v=<?php echo time();?>#DFGroup"/></svg>
                    DF Role Setting
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" href="dfdevice.php">
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
                    <a class="nav-link d-flex align-items-center gap-2 <?php if(isset($currentScript) && $currentScript == 'controler.php') echo 'active'; ?>"
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

        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">DF Role Setting</h1>
            <div class="btn-toolbar mb-2 mb-md-0">   
        <?php
        // search box
        echo '<div class="input-group m-1">
                <input type="text" class="form-control form-control-sm" id="deviceSearchBox" onkeyup="filterDeviceList()" placeholder="Search device...">
                <button class="btn btn-outline-secondary" type="button" onclick="filterDeviceList()">
                  <svg class="bi"><use xlink:href="dashboard.svg#search"/></use></svg>
                </button>
              </div>';

        // ===== ROLE DROPDOWN =====
        if (!empty($rolesList)) {

          echo '<div class="btn-group m-1">';

          // ปุ่มหลัก
          echo '<button id="roleIdSelect" value="0" type="button" '
            . 'class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center gap-1" '
            . 'data-bs-toggle="dropdown" aria-expanded="false">';

          // ไอคอน
          echo '  <svg class="bi"><use id="roleIdSelectSVG" xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#layer-group"/></use></svg>';

          // label ด้านบนปุ่ม
          if ($roleID == -1) {
            echo '  <span id="roleIdSelectLabel">Select Role</span>';
          } else {
            $foundLabel = false;
            foreach ($rolesList as $r) {
              if ($roleID == (int)$r["roleID"]) {
                echo '  <span id="roleIdSelectLabel">'.htmlspecialchars($r["roleName"], ENT_QUOTES, "UTF-8").'</span>';
                $roleName = $r["roleName"];
                $foundLabel = true;
                break;
              }
            }
            if (!$foundLabel) {
              echo '  <span id="roleIdSelectLabel">Select Role</span>';
            }
          }
          echo '</button>';

          // เมนู dropdown (ไม่มี All Role)
          echo '<ul class="dropdown-menu dropdown-menu-end">';

          foreach ($rolesList as $role) {
            $rid    = (int)$role["roleID"];
            $rname  = htmlspecialchars($role["roleName"], ENT_QUOTES, "UTF-8");
            $isActive = ($roleID == $rid) ? ' active' : '';

            echo '  <li>';
            echo '    <a class="dropdown-item'.$isActive.' d-flex align-items-center gap-2" '
              . 'href="javascript:void(0)" '
              . 'onclick="changeRoleFromDropdown('.$rid.',\''.$rname.'\')">';
            echo '      <svg class="bi"><use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#layer-group"></use></svg>';
            echo        $rname;
            echo '    </a>';
            echo '  </li>';
          }

          echo '</ul>';    // end dropdown-menu
          echo '</div>';   // end btn-group
        }

        // Delete Role & Role Setup button
        echo '<button id="deleterole" style="display: block;" type="button" class="btn btn-sm btn-outline-secondary align-items-center gap-1 m-1 d-flex"  data-bs-toggle="modal" data-bs-target="#confirmToDeleteRoleID">';
        echo '  <svg class="bi"><use xlink:href="dashboard.svg#trash"/></svg>';
        echo '  Delete Role';
        echo '</button>';

        echo '<button type="button" class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 m-1"  data-bs-toggle="modal" data-bs-target="#ModalNewDevice">';
        echo '  <svg class="bi"><use xlink:href="dashboard.svg#gear-wide-connected"/></svg>';
        echo '  Role Setup';
        echo '</button>';
        ?>
            </div>
          </div>

          <?php
            // =========== แสดง Card ของแต่ละ Role ===========

            echo '<fieldset id="deviceControl" style="opacity:1">';

            foreach ($rolesList as $r) {
              $rID   = (int)$r["roleID"];
              $rName = $r["roleName"];

              if ($rID == $roleID)
                echo '<div style="display:block;" id="roleDiv'.$rID.'">';
              else
                echo '<div style="display:none;" id="roleDiv'.$rID.'">';

              echo '<h3 class="h3">'.htmlspecialchars($rName,ENT_QUOTES,"UTF-8").'</h3>';

              // โหลด device ใน role นี้จาก DeviceGroups + DeviceList
              $strSQL = "
                  SELECT 
                      dg.id              AS roleIndex,
                      dg.GroupID         AS roleID,
                      dg.uniqueIdInGroup AS uniqueIdInGroup,
                      dg.deviceUniqueId  AS deviceUniqueId,
                      dl.id              AS deviceIndex,
                      dl.Name,
                      dl.IPAddress       AS ipaddress,
                      'puzzle'           AS iconName
                  FROM DeviceGroups dg
                  LEFT JOIN DeviceList dl
                        ON dl.deviceUniqueId = dg.deviceUniqueId
                  WHERE dg.GroupID = ".$rID."
                  ORDER BY dg.id
              ";
              $sqlQuery2 = mysqli_query($conn,$strSQL);
              if (!$sqlQuery2) {
                  echo ("Database DeviceGroups join DeviceList Error: ".$conn->error);
                  exit();
              }
              if ($sqlQuery2->num_rows > 0)
              {
                echo '<div class="row row-cols-sm-1 row-cols-md-3 row-cols-lg-4 row-cols-lg-6">';
                while($row = $sqlQuery2->fetch_assoc()) 
                {    
                  $roleIndex   = (int)$row["roleIndex"];   // dg.id
                  $deviceIndex = (int)$row["deviceIndex"]; // dl.id (อาจเป็น null ถ้าไม่มี device)
                  $devName     = htmlspecialchars($row["Name"] ?? "",ENT_QUOTES,"UTF-8");
                  $ipaddr      = htmlspecialchars($row["ipaddress"] ?? "",ENT_QUOTES,"UTF-8");
                  $iconName    = htmlspecialchars($row["iconName"],ENT_QUOTES,"UTF-8");

                  $groupUID    = htmlspecialchars($row["uniqueIdInGroup"] ?? "",ENT_QUOTES,"UTF-8");
                  $deviceUID   = htmlspecialchars($row["deviceUniqueId"] ?? "",ENT_QUOTES,"UTF-8");

                  echo '  <div id="container'.$roleIndex.'" class="container m-0 p-1" style="min-width: 388px;">';          
                  echo '    <div class="card m-1 p-2" style="width: 100%;height: 100%;">';
                  echo '      <div class="row m-0">';
                  echo '        <h5 id="DeviceName'.$roleIndex.'" class="p-0 pb-1 pt-1 mb-1 border-bottom">'.$devName.'</h5>';
                  echo '      </div>';

                  echo '      <div class="row align-items-end">';
                  echo '        <div class="col-md-4">';
                  echo '          <div class="mb-3">';
                  echo '            <svg class="biDeviceList rounded-start"><use id="icon'.$roleIndex.'" xlink:href="dashboard.svg#'.$iconName.'"></use></svg>';
                  echo '          </div>';
                  echo '        </div>';

                  echo '        <div class="col-md-8">';
                  echo '          <div class="mb-3">';
                  echo '            <button id="deviceIdSelect'.$roleIndex.'" value="'.$deviceIndex.'" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center gap-1" data-bs-toggle="dropdown" aria-expanded="false" style="width:100%">';
                  echo '              <svg class="bi"><use id="deviceIdSelectSVG'.$roleIndex.'" xlink:href="dashboard.svg#'.$iconName.'"/></use></svg>';
                  echo '              <label id="deviceIdSelectLabel'.$roleIndex.'">'.$devName.'</label>';
                  echo '              <ul class="dropdown-menu">';

                  foreach ($rowDeviceListQuery as $rowDevice) 
                  {
                    $did       = (int)$rowDevice["id"];
                    $dname     = htmlspecialchars($rowDevice["Name"],ENT_QUOTES,"UTF-8");
                    $dip       = htmlspecialchars($rowDevice["ipaddress"],ENT_QUOTES,"UTF-8");
                    $dicon     = htmlspecialchars($rowDevice["iconName"],ENT_QUOTES,"UTF-8");

                    if ($did == $deviceIndex){
                      echo '    <li class="dropdown-item active" onclick="changeDevice('.$roleIndex.','.$deviceIndex.','.$did.',\''.$dname.'\',\''.$dicon.'\',\''.$dip.'\',';
                    } else {
                      echo '    <li class="dropdown-item " onclick="changeDevice('.$roleIndex.','.$deviceIndex.','.$did.',\''.$dname.'\',\''.$dicon.'\',\''.$dip.'\',';
                    }
                    echo  htmlspecialchars(json_encode($rowDeviceListQuery),ENT_QUOTES,"UTF-8");
                    echo')">';

                    if ($did == $deviceIndex)
                      echo '      <a class="dropdown-link d-flex align-items-center gap-2 active">';
                    else
                      echo '      <a class="dropdown-link d-flex align-items-center gap-2">';

                    echo '        <svg class="bi"><use xlink:href="dashboard.svg#'.$dicon.'"></use></svg>';
                    echo          $dname;
                    echo '      </a>';
                    echo '    </li>';        
                  }

                  echo '              </ul>';  
                  echo '            </button>';
                  echo '          </div>';

                  echo '          <div class="mb-3">';
                  echo '            <label for="ipaddress'.$roleIndex.'" class="form-label">IP Address</label>';
                  echo '            <input id="ipaddress'.$roleIndex.'" type="text" class="form-control text-center" disabled value="'.$ipaddr.'">';
                  echo '          </div>';
                  echo '        </div>'; // col-md-8
                  echo '      </div>';   // row align-items-end

                  // hidden สำหรับ JS ส่งให้ Qt ใช้ EditGroupDevices
                  echo '      <input type="hidden" id="groupUID'.$roleIndex.'" value="'.$groupUID.'">';
                  echo '      <input type="hidden" id="deviceUID'.$roleIndex.'" value="'.$deviceUID.'">';

                  echo '      <div class="row mt-2">';
                  echo '        <div class="col-6">';
                  echo '          <input id="ApplyButton'.$roleIndex.'" type="button" value="Save Change" class="btn btn-primary" style="width:100%; display:none;" onclick="setCurrentRoleIdForApplyChange('.$roleIndex.','.$rID.')" >';
                  echo '        </div>';

                  echo '        <div class="col-6">';
                  echo '          <input type="button" value="Remove" class="btn btn-warning" style="width:100%;" onclick="setRoleIdForDelete('.$roleIndex.','.$rID.')">';
                  echo '        </div>';
                  echo '      </div>';

                  echo '    </div>'; // card
                  echo '  </div>';   // container
                }
                echo '</div>'; // row
              }

              echo '</div>'; // roleDiv
            }

            echo '</fieldset>';
          ?>

        </main>
      </div>
    </div>

    <?php
      // ส่งค่า role ปัจจุบันไป set ใน JS
      if ($roleID > 0 && $roleName !== "") {
        echo '<script type="text/javascript">',
             'setCurrentRoleId('.$roleID.',"'.htmlspecialchars($roleName,ENT_QUOTES,"UTF-8").'");',
             '</script>';
      }

      // ส่ง rolesList + DeviceList ไปให้ dfrole.js ใช้หา uniqueIdInGroup / deviceUniqueId
      echo '<script type="text/javascript">';
      echo 'window.rolesListData  = '.json_encode($rolesList, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES).';';
      echo 'window.deviceListData = '.json_encode($rowDeviceListQuery, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES).';';
      echo '</script>';
    ?>

  </body>
</html>
