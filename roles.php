<?php
  session_start();
  if($_SESSION['UserID'] == "")
  {
    echo("<script>location.href = 'login.php';</script>");
  }
  else
  {
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
<!doctype html>
<html lang="en" data-bs-theme="auto">
  <head><script src="assets/js/color-modes.js"></script>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors">
    <meta name="generator" content="Hugo 0.122.0">
    <title>IFZ: Remote Control and Monitoring System</title>
    <link href="assets/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="dashboard.css" rel="stylesheet">
    <script src="assets/dist/js/bootstrap.bundle.min.js"></script>
    <script src="dashboard.js"></script>
    <script src="roles.js"></script>


  </head>

  
  <header class="navbar sticky-top flex-md-nowrap p-0 shadow" style="background-color:#000000DD;">
  <svg class="bi_logo m-1"><use xlink:href="dashboard.svg#logo"></use></svg>
  <ul class="navbar-nav flex-row d-md-none">
    <li class="nav-item text-nowrap">
      <button class="nav-link px-3 text-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <svg class="bi"><use xlink:href="dashboard.svg#list"/></svg>
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
        <svg class="bi my-1 theme-icon-active" width="1em" height="1em"><use href="dashboard.svg#circle-half"></use></svg>
        <span class="visually-hidden" id="bd-theme-text">Toggle theme</span>
      </button>
      <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="light" aria-pressed="false">
            <svg class="bi me-2 opacity-50" width="1em" height="1em"><use href="dashboard.svg#sun-fill"></use></svg>
            Light
            <svg class="bi ms-auto d-none" width="1em" height="1em"><use href="dashboard.svg#check2"></use></svg>
          </button>
        </li>
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="dark" aria-pressed="false">
            <svg class="bi me-2 opacity-50" width="1em" height="1em"><use href="dashboard.svg#moon-stars-fill"></use></svg>
            Dark
            <svg class="bi ms-auto d-none" width="1em" height="1em"><use href="dashboard.svg#check2"></use></svg>
          </button>
        </li>
        <li>
          <button type="button" class="dropdown-item d-flex align-items-center active" data-bs-theme-value="auto" aria-pressed="true">
            <svg class="bi me-2 opacity-50" width="1em" height="1em"><use href="dashboard.svg#circle-half"></use></svg>
            Auto
            <svg class="bi ms-auto d-none" width="1em" height="1em"><use href="dashboard.svg#check2"></use></svg>
          </button>
        </li>
      </ul>
    </div>

    
<?php
  $roleID = -1;
  if(isset($_POST['roleID']))
  {    
    $roleID = $_POST['roleID'];
  }
?>


<?php
  include('dbConfig.php');  
  $rolesList = array();
  $deviceListInRole = array();
  $rowDeviceListQuery = array();
  $strSQL = "SELECT DISTINCT roleID, roleName FROM role WHERE userID=".$userID." ORDER BY roleID;";
  $sqlQuery = mysqli_query($conn,$strSQL);
  if (!$sqlQuery) {
      echo ("Database deviceTemplate Error: ".$conn->error);
      exit();
  }
  if ($sqlQuery->num_rows > 0)
  {
    while($row = $sqlQuery->fetch_assoc()) 
    {
      array_push($rolesList, $row);
    }
  }

  $strSQL = "SELECT deviceList.id, deviceList.Name, deviceList.templateID, deviceList.ipaddress, deviceList.username, deviceList.password, deviceTemplate.iconName, deviceTemplate.description FROM deviceList INNER JOIN deviceTemplate ON deviceTemplate.id=deviceList.templateID ORDER BY deviceList.id";
  $deviceListQuery = mysqli_query($conn,$strSQL);
  if (!$deviceListQuery) {
      echo ("Database deviceList Error: ".$conn->error);
      exit();
  }
  if ($deviceListQuery->num_rows > 0)
  {
    while($row = $deviceListQuery->fetch_assoc()) 
    {
      array_push($rowDeviceListQuery, $row);
    }
  }

?>

<div class="modal fade" id="ModalNewDevice" tabindex="-1" aria-labelledby="newdevice" aria-hidden="true" style="--bs-modal-width: 35%;">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="newdevice">Role Setup</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
    <?php
      {       
        $roleName = "";
        echo '  <div class="container m-0 p-1" style="min-width: 100%;">';
        echo '    <div class="card m-0 p-2" style="width: 100%;height: 100%;">';
        echo '      <div class="row align-items-end" >';
        echo '        <div class="col-md-12">';
        echo '          <div class="mb-3">';
        echo '            <svg class="biDeviceList rounded-start" style="width:100%";><use id="iconNewDevice" xlink:href="dashboard.svg#edit"/></svg>';
        echo '          </div>'; 
        echo '           <div class="mb-3">';

        echo '            <button id="roleIdSelected" value="0"  text-align: right;" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center gap-1" data-bs-toggle="dropdown" aria-expanded="false" style="width:100%">';
        if ($rolesList == null)
        {
          echo '              <svg class="bi"><use id="roleIdSelectedSVG" xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#plus-circle"/></use></svg>';
          echo '            <span id="roleIdSelectedLabel">New Role</span>';
        }
        else
        {
          foreach ($rolesList as $role) 
          {
            if ($roleID == -1)
                $roleID = $role["roleID"];
            if ($roleID == $role["roleID"])
            {
              $roleName=$role["roleName"];
              echo '              <svg class="bi"><use id="roleIdSelectedSVG" xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#layer-group"/></use></svg>';
              echo '            <span id="roleIdSelectedLabel">'.$role["roleName"].'</span>';
            }
          }
        }
        echo '              <ul class="dropdown-menu" id="dropdownRoleIdSelected" style="min-width:100%">';   

        echo '                <li class="dropdown-item" onclick="setRoleIdToNewDevice(0,\'New Role\',';
        echo  htmlspecialchars(json_encode($rolesList));
        echo')">';
        echo '                <a class="dropdown-link d-flex align-items-center gap-2">';
        echo '                <svg class="bi"><use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#plus-circle"></use></svg>';
        echo                  'New Role';
        echo '                </a>';
        echo '                </li>';

        foreach ($rolesList as $role) 
        {
        echo '                <li class="dropdown-item" onclick="setRoleIdToNewDevice('.$role["roleID"].',\''.$role["roleName"].'\',';
        echo  htmlspecialchars(json_encode($rolesList));
        echo')">';
        echo '                <a class="dropdown-link d-flex align-items-center gap-2">';
        echo '                <svg class="bi"><use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#layer-group"></use></svg>';
        echo                  $role["roleName"];
        echo '                </a>';
        echo '                </li>';        
        }
        echo '              </ul>';  
        echo '            </button>';

        echo '          </div>';  

        echo '          <div class="mb-3">';
        echo '            <span for="roleNameToNewDevice" class="form-label">Role Name</span>';
        echo '            <input id="roleNameToNewDevice" type="text" class="form-control" value="'.$roleName.'">';
        echo '          </div>';  

        echo '    <div class="mb-3">';
        echo '            <button id="newDeviceIdSelect'.$row["roleIndex"].'" value="0"  text-align: right;" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center gap-1" data-bs-toggle="dropdown" aria-expanded="false" style="width:100%">';
        echo '              <svg class="bi"><use id="newDeviceIdSelectSVG'.$row["roleIndex"].'" xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#edit"/></use></svg>';
        echo '            <span id="newDeviceIdSelectLabel'.$row["roleIndex"].'">Change Role Name</span>';
        echo '              <ul class="dropdown-menu" id="dropdownNewDeviceIdSelect"  style="min-width:100%">';

        echo '                <li class="dropdown-item " onclick="setNewDeviceToRole(0,\'Change Role Name\',\'edit\',\'\',';
        echo  htmlspecialchars(json_encode(""));
        echo')">';
        echo '                <a class="dropdown-link d-flex align-items-center gap-2">';
        echo '                <svg class="bi"><use xlink:href="dashboard.svg#edit"></use></svg>';
        echo                 'Change Role Name';
        echo '                </a>';
        echo '                </li>';

        echo '                <li class="dropdown-item " onclick="setNewDeviceToRole(-1,\'Delete Role\',\'trash\',\'\',';
        echo  htmlspecialchars(json_encode(""));
        echo')">';
        echo '                <a class="dropdown-link d-flex align-items-center gap-2">';
        echo '                <svg class="bi"><use xlink:href="dashboard.svg#trash"></use></svg>';
        echo                 'Delete Role';
        echo '                </a>';
        echo '                </li>';
        

        echo '                <div class="dropdown-divider"></div>';
        echo '                <label for="roleNameToNewDevice" class="form-label m-2">Insert Device</label>';

        foreach ($rowDeviceListQuery as $rowDevice) 
        {
        if ($rowDevice['id'] == $row["deviceIndex"]){
          echo '                <li class="dropdown-item active" onclick="setNewDeviceToRole('.$rowDevice["id"].',\''.$rowDevice["Name"].'\',\''.$rowDevice["iconName"].'\',\''.$rowDevice["ipaddress"].'\',';
        }
        else
        {
          echo '                <li class="dropdown-item " onclick="setNewDeviceToRole('.$rowDevice["id"].',\''.$rowDevice["Name"].'\',\''.$rowDevice["iconName"].'\',\''.$rowDevice["ipaddress"].'\',';
        }
        echo  htmlspecialchars(json_encode($rowDeviceListQuery));
        echo')">';
        echo '                <a class="dropdown-link d-flex align-items-center gap-2">';
        echo '                <svg class="bi"><use xlink:href="dashboard.svg#'.$rowDevice["iconName"].'"></use></svg>';
        echo                  $rowDevice["Name"];
        echo '                </a>';
        echo '                </li>';        
        }
        echo '              </ul>';  
        echo '            </button>';
        echo '</div>';
        echo '        </div>';  


        echo '      </div>  ';          
        echo '    </div>  ';        
        echo '  </div>';        
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

<!-- Modal confirmToDeleteClient-->
<div class="modal fade" id="confirmToDeleteClient" tabindex="-1" aria-labelledby="confirmToDeleteClientLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="confirmToDeleteClientLabel">Please Confirm</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="resetCurrentId()"></button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="resetCurrentId()">Close</button>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="deleteDevice()" >Remove</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal confirmToEditClientInRole-->
<div class="modal fade" id="confirmToEditClientInRole" tabindex="-1" aria-labelledby="confirmToEditClientInRoleLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="confirmToEditClientInRoleLabel">Please Confirm</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="resetCurrentId()"></button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="resetCurrentId()">Close</button>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="applyChange()" >Save changes</button>
      </div>
    </div>
  </div>
</div>
<!-- Modal confirmToChangeActiveRoleID-->
<div class="modal fade" id="confirmToChangeActiveRoleID" tabindex="-1" aria-labelledby="confirmToChangeActiveRoleIDLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="confirmToChangeActiveRoleIDLabel">Please Confirm</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        Change Active Role ID. Please Confirm!
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" >Close</button>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="ChangeActiveRoleID()" >Select Role</button>
      </div>
    </div>
  </div>
</div>
<!-- Modal confirmToDeleteRoleID-->
<div class="modal fade" id="confirmToDeleteRoleID" tabindex="-1" aria-labelledby="confirmToDeleteRoleIDLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="confirmToDeleteRoleIDLabel">Please Confirm</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" >Close</button>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="deleteRoleID()" >Delete Role</button>
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
        Unable to connect to the rcms system.
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<div class="container-fluid">
  <div class="row">
    <div class="sidebar border border-right col-md-3 col-lg-2 col-xxl-2 p-0 bg-body-tertiary">
      <div class="offcanvas-md offcanvas-end bg-body-tertiary" tabindex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
        <div class="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" aria-current="page" href="index.php">
                <svg class="bi"><use xlink:href="dashboard.svg#house-fill"/></svg>
                Home
              </a>
            </li>
<!--             <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#">
                <svg class="bi"><use xlink:href="dashboard.svg#file-earmark"/></svg>
                Logs
              </a>
            </li> -->
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2 <?php if($deviceName == 'CWP') echo 'active'; ?> " href="javascript:locationreloadDevice(<?php echo $roleID; ?>,'CWP');">
                <svg class="bi"><use xlink:href="dashboard.svg#cwp"/></svg>
                CWP
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2 <?php if($deviceName == 'Radio') echo 'active'; ?> " href="javascript:locationreloadDevice(<?php echo $roleID; ?>,'Radio');">
                <svg class="bi"><use xlink:href="dashboard.svg#radio2"/></svg>
                Radio
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2 <?php if($deviceName == 'iGate4CH') echo 'active'; ?> " href="javascript:locationreloadDevice(<?php echo $roleID; ?>,'iGate4CH');">
                <svg class="bi"><use xlink:href="dashboard.svg#gateway"/></svg>
                Gateway
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2 <?php if($deviceName == 'PSU') echo 'active'; ?> " href="javascript:locationreloadDevice(<?php echo $roleID; ?>,'PSU');">
                <svg class="bi"><use xlink:href="dashboard.svg#psu"/></svg>
                Power Supply
              </a>
            </li> 
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2 <?php if($deviceName == 'Power Sensor') echo 'active'; ?> " href="javascript:locationreloadDevice(<?php echo $roleID; ?>,'Power Sensor');">
                <svg class="bi"><use xlink:href="dashboard.svg#powerSensor"/></svg>
                Power Sensor
              </a>
            </li>   
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2 <?php if($deviceName == "VoiceWay") echo 'active'; ?> " href="javascript:locationreloadDevice(<?php echo $roleID; ?>,'VoiceWay');">
                <svg class="bi"><use xlink:href="dashboard.svg#switch"/></svg>
                VoiceWay
              </a>
            </li>            
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2 <?php if($deviceName == "Radio Server") echo 'active'; ?> " href="javascript:locationreloadDevice(<?php echo $roleID; ?>,'Radio Server');">
                <svg class="bi"><use xlink:href="dashboard.svg#voicex"/></svg>
                VoiceX
              </a>
            </li>                    
            </ul>
          <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase"> <span>Device Manager</span> </h6>
          <ul class="nav flex-column mb-auto">
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="devices.php">
                <svg class="bi"><use xlink:href="dashboard.svg#puzzle"/></svg>
                Devices
              </a>
            </li>            
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2 active" href="roles.php">
                <svg class="bi"><use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#layer-group"/></svg>
                Roles
              </a>
            </li>
          </ul>

<!--           <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
            <span>Saved reports</span>
            <a class="link-secondary" href="#" aria-label="Add a new report">
              <svg class="bi"><use xlink:href="dashboard.svg#plus-circle"/></svg>
            </a>
          </h6>
          <ul class="nav flex-column mb-auto">
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#">
                <svg class="bi"><use xlink:href="dashboard.svg#file-earmark-text"/></svg>
                Current month
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="#">
                <svg class="bi"><use xlink:href="dashboard.svg#file-earmark-text"/></svg>
                Last quarter
              </a>
            </li>
          </ul> -->

          <hr class="my-3">

          <ul class="nav flex-column mb-auto">
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="user.php">
                <svg class="bi"><use xlink:href="fontawesome-free-5.15.4-web/sprites/regular.svg#user"/></svg>
                Users
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="system.php">
                <svg class="bi"><use xlink:href="dashboard.svg#gear-wide-connected"/></svg>
                Settings
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="logout.php">
                <svg class="bi"><use xlink:href="dashboard.svg#door-closed"/></svg>
                <?php echo "Sign out(" .$userName.")" ?>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <main class="col-md-9 ms-sm-auto col-lg-10 col-xxl-10 px-md-4">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Roles Configure</h1>
        <div class="btn-toolbar mb-2 mb-md-0">
          <!-- <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1 m-1"> -->
          <?php  
              if ($rolesList != null)  {
              echo '            <button id="roleIdSelect" value="0"  text-align: right;" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center gap-1 m-1" data-bs-toggle="dropdown" aria-expanded="false">';
              if ($roleID == -1){
                echo '              <svg class="bi"><use id="roleIdSelectSVG" xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#layer-group"/></use></svg>';
                echo '            <span id="roleIdSelectLabel">Roles</span>';
              }
              else
              {
                foreach ($rolesList as $role) {
                  if ($roleID == $role["roleID"])
                  {
                    echo '              <svg class="bi"><use id="roleIdSelectSVG" xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#layer-group"/></use></svg>';
                    echo '            <span id="roleIdSelectLabel">'.$role["roleName"].'</span>';
                  }
                }
              }
              echo '              <ul class="dropdown-menu">';     

              foreach ($rolesList as $role) 
              {
              echo '                <li class="dropdown-item" id="roleIdSelect'.$role["roleID"].'" onclick="selectRoleID('.$role["roleID"].',\''.$role["roleName"].'\',';
              echo  htmlspecialchars(json_encode($rolesList));
              echo')">';
              echo '                <a class="dropdown-link d-flex align-items-center gap-2" id="roleIdSelectLink'.$role["roleID"].'">';
              echo '                <svg class="bi"><use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#layer-group"></use></svg>';
              echo                  $role["roleName"];
              echo '                </a>';
              echo '                </li>';        
              }
              echo '              </ul>';  
              echo '            </button>';
            }

        // if ($userLevelAdmin == 1)
        {
            echo '<button id="deleterole" style="display: block;" type="button" class="btn btn-sm btn-outline-secondary   align-items-center gap-1 m-1 d-flex"  data-bs-toggle="modal" data-bs-target="#confirmToDeleteRoleID">';  
            echo '<svg class="bi"><use xlink:href="dashboard.svg#trash"/></svg>';  
            echo 'Delete Role';  
            echo '</button>      ';      
            echo '<button type="button" class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 m-1"  data-bs-toggle="modal" data-bs-target="#ModalNewDevice">';  
            echo '  <svg class="bi"><use xlink:href="dashboard.svg#gear-wide-connected"/></svg>';  
            echo '  Role Setup';  
            echo '</button>';  
          }
          ?>          
        </div>
      </div>  

      <?php   
        echo '<fieldset id="deviceControl" style="opacity:1">';

        foreach ($rolesList as $role)
        { 
          if ($role["roleID"] == $roleID)
            echo '<div style="display:block;" id="roleDiv'.$role["roleID"].'">';
          else
            echo '<div style="display:none;" id="roleDiv'.$role["roleID"].'">';
          echo '<h3 class="h3">'.$role["roleName"].'</h3>';

          $strSQL = "SELECT role.deviceID, role.deviceIdInRole, role.id AS roleIndex, deviceList.id AS deviceIndex, deviceList.Name, deviceList.templateID, deviceList.ipaddress, deviceList.username, deviceList.password, deviceTemplate.iconName FROM deviceList INNER JOIN deviceTemplate ON deviceTemplate.id=deviceList.templateID INNER JOIN role ON role.deviceID = deviceList.id WHERE role.userID=".$userID." AND role.roleID=".$role['roleID']." ORDER BY role.deviceIdInRole;";
          $sqlQuery = mysqli_query($conn,$strSQL);
          if (!$sqlQuery) {
              echo ("Database deviceTemplate Error: ".$conn->error);
              exit();
          }
          if ($sqlQuery->num_rows > 0)
          {
            echo '<div class="row row-cols-sm-1 row-cols-md-3 row-cols-lg-4 row-cols-lg-6">';
            while($row = $sqlQuery->fetch_assoc()) 
            {    
            echo '  <div id="container'.$row["roleIndex"].'" class="container m-0 p-1" style="min-width: 388px;">';          
            echo '<div class="card m-1 p-2" style="width: 100%;height: 100%;">';
            echo '<div class="row m-0">';
            echo '      <h5 id="DeviceName'.$row["roleIndex"].'" class="p-0 pb-1 pt-1 mb-1 border-bottom">'.$row["Name"].'</h5>';
            echo '</div>';
            echo '<div class="row align-items-end">';
            echo '  <div class="col-md-4">';
            echo '    <div class="mb-3">';
            echo '      <svg class="biDeviceList rounded-start"><use id="icon'.$row["roleIndex"].'" xlink:href="dashboard.svg#'.$row["iconName"].'"></use></svg>';
            echo '    </div>';
            echo '  </div>';
            echo '  <div class="col-md-8">';
            echo '    <div class="mb-3">';
            echo '            <button id="deviceIdSelect'.$row["roleIndex"].'" value="0"  text-align: right;" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center gap-1" data-bs-toggle="dropdown" aria-expanded="false" style="width:100%">';
            echo '              <svg class="bi"><use id="deviceIdSelectSVG'.$row["roleIndex"].'" xlink:href="dashboard.svg#'.$row["iconName"].'"/></use></svg>';
            echo '            <label id="deviceIdSelectLabel'.$row["roleIndex"].'">'.$row["Name"].'</label>';
            echo '              <ul class="dropdown-menu">';


            foreach ($rowDeviceListQuery as $rowDevice) 
            {
            if ($rowDevice['id'] == $row["deviceIndex"]){
              echo '                <li class="dropdown-item active" onclick="changeDevice('.$row["roleIndex"].','.$row["deviceIndex"].','.$rowDevice["id"].',\''.$rowDevice["Name"].'\',\''.$rowDevice["iconName"].'\',\''.$rowDevice["ipaddress"].'\',';
            }
            else
            {
              echo '                <li class="dropdown-item " onclick="changeDevice('.$row["roleIndex"].','.$row["deviceIndex"].','.$rowDevice["id"].',\''.$rowDevice["Name"].'\',\''.$rowDevice["iconName"].'\',\''.$rowDevice["ipaddress"].'\',';
            }
            echo  htmlspecialchars(json_encode($rowDeviceListQuery));
            echo')">';

            if ($rowDevice['id'] == $row["deviceIndex"])
              echo '                <a class="dropdown-link d-flex align-items-center gap-2 active">';
            else
              echo '                <a class="dropdown-link d-flex align-items-center gap-2">';
            echo '                <svg class="bi"><use xlink:href="dashboard.svg#'.$rowDevice["iconName"].'"></use></svg>';
            echo                  $rowDevice["Name"];
            echo '                </a>';
            echo '                </li>';        
            }
            echo '              </ul>';  
            echo '            </button>';
            echo '</div>';

            echo '    <div class="mb-3">';
            echo '      <label for="ipaddress'.$row["roleIndex"].'" class="form-label">IP Address</label>';
            echo '      <input id="ipaddress'.$row["roleIndex"].'" type="text" class="form-control text-center" disabled value="'.$row["ipaddress"].'">';
            echo '    </div>';
            echo '  </div>';
            echo '</div>';

            echo '<div class="row">';
            echo '       <div class="col-6">';
            echo '          <input id="ApplyButton'.$row["roleIndex"].'" type="button" value="Save Change" class="btn btn-primary" style="width:100%; display:none;" onclick="setCurrentRoleIdForApplyChange('.$row["roleIndex"].','.$role["roleID"].')" >';
            echo '       </div>';

            echo '       <div class="col-6">';
            echo '           <input type="button" value="Remove" class="btn btn-warning" style="width:100%;" onclick="setRoleIdForDelete('.$row["roleIndex"].','.$role['roleID'].')">';
            echo '       </div>';
            echo '</div>';
            echo '</div>';
            echo '</div>';
            }
            echo '</div>';
          }
          echo '</div> ';
          
        }
        echo '</fieldset>';
      ?>

    </main>

  </div>
</div>
</body>
<?php
  if ($roleID > 0) {
    echo '<script type="text/javascript">',
         'setCurrentRoleId('.$roleID.',"'.$roleName.'");',
         '</script>'

    ;
  }
?>
</html>
