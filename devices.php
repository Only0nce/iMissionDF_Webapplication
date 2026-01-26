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
<?php
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
$roleID = -1;
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
    <script src="devices.js"></script>

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
  include('dbConfig.php');
  $ioPortList = array(1,2,3,4);
  $rowDeviceTemplate = array();
  $rowDeviceListQuery = array();
  $rowIDArray = array();
  $strSQL = "SELECT * FROM deviceTemplate ORDER BY id";
  $deviceTemplateQuery = mysqli_query($conn,$strSQL);
  if (!$deviceTemplateQuery) {
      echo ("Database deviceTemplate Error: ".$conn->error);
      exit();
  }
  if ($deviceTemplateQuery->num_rows > 0)
  {
    while($row = $deviceTemplateQuery->fetch_assoc()) 
    {
      array_push($rowDeviceTemplate, $row);
      array_push($rowIDArray, $row["id"]);
    }
  }

  $strSQL = "SELECT deviceList.id, deviceList.Name, deviceList.templateID, deviceList.ipaddress, deviceList.username, deviceList.password, deviceList.radioIoPort, deviceList.serialnumber, deviceTemplate.type, deviceTemplate.iconName, deviceTemplate.description FROM deviceList INNER JOIN deviceTemplate ON deviceTemplate.id=deviceList.templateID ORDER BY deviceList.id";
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

<!-- Modal confirmToEditClient-->
<div class="modal fade" id="confirmToEditClient" tabindex="-1" aria-labelledby="confirmToEditClientLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="confirmToEditClientLabel">Please Confirm</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="resetCurrentId()"></button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="resetCurrentId()">Close</button>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="editDevice()" >Save changes</button>
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

<div class="modal fade" id="ModalNewDevice" tabindex="-1" aria-labelledby="newdevice" aria-hidden="true" style="--bs-modal-width: 50%;">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="newdevice">Insert New Device</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
    <?php
      {        
        echo '  <div class="container m-0 p-1" style="min-width: 100%;">';
        echo '    <div class="card m-0 p-2" style="width: 100%;height: 100%;">';
        echo '      <div class="row align-items-end" >';
        echo '        <div class="col-md-4">';
        echo '          <div class="mb-3">';
        echo '            <svg class="biDeviceList rounded-start"><use id="icon0" xlink:href="dashboard.svg#puzzle"/></svg>';
        echo '          </div>'; 
        echo '           <div class="mb-3">';
        echo '            <label for="username0" class="form-label">User Name</label>';
        echo '            <input id="username0" type="text" class="form-control" value="">';
        echo '          </div>';  
        echo '          <div class="mb-3">';
        echo '            <label for="password0" class="form-label">Password</label>';
        echo '            <input id="password0" type="password" class="form-control" value="">';
        echo '          <div class="mb-3">';
        echo '            <label for="serialnumber0" class="form-label">Serial Number</label>';
        echo '            <input id="serialnumber0" type="text" style="text-transform:uppercase" class="form-control" value="">';
        echo '          </div>';
        echo '          </div>';  

        echo '        </div>';  
        echo '        <div class="col-md-8">';
        echo '          <h3 id="DeviceName0" class="h3 mb-3">Add Device</h3>';
        echo '          <div class="mb-3">';
        echo '            <label for="devicename0" class="form-label">Device Name</label>';
        echo '            <input id="devicename0" type="text" class="form-control mb-3" value="">';
        echo '          </div>';  
        echo '          <div class="mb-3">';
        echo '            <label for="ipaddress0" class="form-label">IP Address</label>';
        echo '            <input id="ipaddress0" type="text" class="form-control" value="">';
        echo '          </div>';                  
        echo '          <div class="mb-3">';
        echo '            <button id="deviceTemplate0" value="" style="width: 100%;height: 100%; text-align: right;" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center" data-bs-toggle="dropdown" aria-expanded="false">';
        echo '              <svg class="bi"><use id="deviceTemplateSVG0" xlink:href="dashboard.svg#puzzle"/></svg>';
        echo '            <span id="deviceTemplateLabel0">Select Device</span>';
        echo '            </button>';
        echo '              <ul class="dropdown-menu col-md-8">';

                          if ($deviceTemplateQuery->num_rows > 0)
                          {
                            foreach ($rowDeviceTemplate as $row) 
                            {                               
        echo '                <li class="dropdown-item" onclick="setDeviceTemplate(0,'.$row["id"].',\''.$row["iconName"].'\',\''.$row["description"].'\')">';
        echo '                <a class="dropdown-link d-flex align-items-center gap-2">';
        echo '                <svg class="bi"><use xlink:href="dashboard.svg#'.$row["iconName"].'"></use></svg>';
        echo                  $row["description"];
        echo '                </a>';
        echo '                </li>';
                            }
                          }

        echo '              </ul>';                
        echo '          </div> ';

        echo '          <div class="mb-3" id="ioPort0" style="display:none;">';
        echo '            <button id="ioPortValue0" value="1" style="width: 100%;height: 100%; text-align: right;" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center" data-bs-toggle="dropdown" aria-expanded="false">';
        echo '              <svg class="bi"><use id="ioPortSVG0" xlink:href="dashboard.svg#lanup"/></svg>';
        echo '            <label id="ioPortLabel0">IO Port: 1</label>';
        echo '            </button>';
        echo '              <ul class="dropdown-menu col-md-8">';

                            foreach ($ioPortList as $ioPort) 
                            {
                              echo '                  <li class="dropdown-item " onclick="setDeviceIOPort(0,'.$ioPort.')">';
                              echo '                  <a class="dropdown-link d-flex align-items-center gap-2">';
        echo '                <svg class="bi"><use xlink:href="dashboard.svg#lanup"></use></svg>';
        echo                  'IO Port: '.$ioPort;
        echo '                </a>';
        echo '                </li>';
                            }

        echo '              </ul>';                
        echo '          </div> ';

        echo '        </div>';


        echo '      </div>  ';          
        echo '    </div>  ';        
        echo '  </div>';        
      }
    ?>
      </div>
      <div class="modal-footer">
        <div class="row  col-lg-6 col-md-12 col-sm-12">
<!--           <div class="col-6">
            <button type="button" value="Apply" class="btn btn-primary" data-bs-dismiss="modal" onclick="insertClientInRole()">
          </div> -->
          <div class="col-6">
            <button type="button" class="btn btn-primary" onclick="insertClientInRole()" style="width: 100%;">Apply</button>
          </div>
          <div class="col-6">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" style="width: 100%;">Close</button>
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
              <a class="nav-link d-flex align-items-center gap-2 active" href="devices.php">
                <svg class="bi"><use xlink:href="dashboard.svg#puzzle"/></svg>
                Devices
              </a>
            </li>            
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="roles.php">
                <svg class="bi"><use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#layer-group"/></svg>
                Roles
              </a>
            </li>
          </ul>

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

    <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Configure all devices</h1>
        <div class="btn-toolbar mb-2 mb-md-0">
          <!-- <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1 m-1"> -->
        <?php    
        // include('ListVariable.php');        
        echo '            <button id="deviceIdSelect" value="0"  text-align: right;" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center gap-1 m-1" data-bs-toggle="dropdown" aria-expanded="false">';
        echo '              <svg class="bi"><use id="deviceIdSelectSVG" xlink:href="dashboard.svg#puzzle"/></use></svg>';
        echo '            <span id="deviceIdSelectLabel">Devices</span>';
        echo '              <ul class="dropdown-menu">';

        echo '                <li class="dropdown-item" onclick="showOnly1ID(0,\'All Device\',\'puzzle\',';
        echo  htmlspecialchars(json_encode($rowDeviceListQuery));
        echo')">';
        echo '                <a class="dropdown-link d-flex align-items-center gap-2">';
        echo '                <svg class="bi"><use xlink:href="dashboard.svg#puzzle"></use></svg>';
        echo '                All Device';
        echo '                </a>';
        echo '                </li>';     

        foreach ($rowDeviceListQuery as $rowDevice) 
        {
        echo '                <li class="dropdown-item" onclick="showOnly1ID('.$rowDevice["id"].',\''.$rowDevice["description"].'\',\''.$rowDevice["iconName"].'\',';
        echo  htmlspecialchars(json_encode($rowDeviceListQuery));
        echo')">';
        echo '                <a class="dropdown-link d-flex align-items-center gap-2">';
        echo '                <svg class="bi"><use xlink:href="dashboard.svg#'.$rowDevice["iconName"].'"></use></svg>';
        echo                  $rowDevice["description"];
        echo '                </a>';
        echo '                </li>';        
        }
        echo '              </ul>';  
        echo '            </button>';

        if ($userLevelAdmin == 1){
          echo '<button type="button" class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 m-1"  data-bs-toggle="modal" data-bs-target="#ModalNewDevice">';
          echo '    <svg class="bi"><use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#folder-plus"/></svg>';
          echo 'New Device';
          echo '  </button>';
        }
        ?>
          
            
        </div>
      </div>

    <?php
    {
      if ($userLevelAdmin == 1)
              echo '<fieldset id="deviceControl" style="opacity:1">';
            else
              echo '<fieldset id="deviceControl" disabled style="opacity:1">';
      echo '<div class="row row-cols-sm-1 row-cols-md-2 row-cols-lg-4 row-cols-xl-6">';
      foreach ($rowDeviceListQuery as $rowDevice) 
      {        
        echo '  <div id="container'.$rowDevice["id"].'" class="container m-0 p-1" style="min-width: 388px;">';
        echo '    <div class="card m-1 p-2" style="width: 100%;height: 100%;">';
        echo '    <div class="row m-0">';
        echo '      <h5 id="DeviceName'.$rowDevice["id"].'"class="p-0 pb-1 pt-1 mb-1 border-bottom">'.$rowDevice["Name"].'</h5>';
        echo '    </div>';
        echo '      <div class="row align-items-end" >';
        echo '        <div class="col-md-4">';
        echo '          <div class="mb-3">';
        echo '            <svg class="biDeviceList rounded-start"><use id="icon'.$rowDevice["id"].'" xlink:href="dashboard.svg#'.$rowDevice["iconName"].'"/></svg>';
        echo '          </div>'; 
        echo '           <div class="mb-3">';
        echo '            <label for="username'.$rowDevice["id"].'" class="form-label">User Name</label>';
        echo '            <input id="username'.$rowDevice["id"].'" type="text" class="form-control" value='.$rowDevice["username"].'>';
        echo '          </div>';  
        echo '          <div class="mb-3">';
        echo '            <label for="password'.$rowDevice["id"].'" class="form-label">Password</label>';
        echo '            <input id="password'.$rowDevice["id"].'" type="password" class="form-control" value='.$rowDevice["password"].'>';
        echo '          </div>';  
        echo '          <div class="mb-3">';
        echo '            <label for="serialnumber'.$rowDevice["id"].'" class="form-label">Serial Number</label>';
        echo '            <input id="serialnumber'.$rowDevice["id"].'" type="text" class="form-control mb-3" type="text" style="text-transform:uppercase" value="'.$rowDevice["serialnumber"].'">';

        echo '          </div>';

        echo '        </div>';  
        echo '        <div class="col-md-8">';
        // echo '          <h3 id="DeviceName'.$rowDevice["id"].'" class="h3 mb-3">'.$rowDevice["Name"].'</h3>';
        echo '          <div class="mb-3">';
        echo '            <label for="devicename'.$rowDevice["id"].'" class="form-label">Device Name</label>';
        echo '            <input id="devicename'.$rowDevice["id"].'" type="text" class="form-control mb-3" value="'.$rowDevice["Name"].'">';
        echo '          </div>';  
        echo '          <div class="mb-3">';
        echo '            <label for="ipaddress'.$rowDevice["id"].'" class="form-label">IP Address</label>';
        echo '            <input id="ipaddress'.$rowDevice["id"].'" type="text" class="form-control" value="'.$rowDevice["ipaddress"].'">';
        echo '          </div>';                  
        echo '          <div class="mb-3">';
        echo '            <button id="deviceTemplate'.$rowDevice["id"].'" value="'.$rowDevice["templateID"].'" style="width: 100%;height: 100%; text-align: right;" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center" data-bs-toggle="dropdown" aria-expanded="false">';
        echo '              <svg class="bi"><use id="deviceTemplateSVG'.$rowDevice["id"].'" xlink:href="dashboard.svg#'.$rowDevice["iconName"].'"/></svg>';
        echo '            <label id="deviceTemplateLabel'.$rowDevice["id"].'">'.$rowDevice["description"].'</label>';
        echo '            </button>';
        echo '              <ul class="dropdown-menu col-md-8">';

                          if ($deviceTemplateQuery->num_rows > 0)
                          {
                            foreach ($rowDeviceTemplate as $row) 
                            {
                              if ($row["id"] == $rowDevice["templateID"]){
                                echo '                  <li class="dropdown-item active" onclick="setDeviceTemplate('.$rowDevice["id"].','.$row["id"].',\''.$row["iconName"].'\',\''.$row["description"].'\')">';
                                echo '                  <a class="dropdown-link d-flex align-items-center gap-2 active">';
                              }
                              else {                                 
                                echo '                  <li class="dropdown-item" onclick="setDeviceTemplate('.$rowDevice["id"].','.$row["id"].',\''.$row["iconName"].'\',\''.$row["description"].'\')">';
                                echo '                  <a class="dropdown-link d-flex align-items-center gap-2">';
                              }
        echo '                <svg class="bi"><use xlink:href="dashboard.svg#'.$row["iconName"].'"></use></svg>';
        echo                  $row["description"];
        echo '                </a>';
        echo '                </li>';
                            }
                          }

        echo '              </ul>';                
        echo '          </div> ';

        if ($rowDevice["type"] == "Radio")
          echo '          <div class="mb-3" id="ioPort'.$rowDevice["id"].'" style="display:block;">';
        else
          echo '          <div class="mb-3" id="ioPort'.$rowDevice["id"].'" style="display:none;">';
        echo '            <button id="ioPortValue'.$rowDevice["id"].'" value="'.$rowDevice["radioIoPort"].'" style="width: 100%;height: 100%; text-align: right;" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center" data-bs-toggle="dropdown" aria-expanded="false">';
        echo '              <svg class="bi"><use id="ioPortSVG'.$rowDevice["id"].'" xlink:href="dashboard.svg#lanup"/></svg>';
        echo '            <label id="ioPortLabel'.$rowDevice["id"].'">IO Port: '.$rowDevice["radioIoPort"].'</label>';
        echo '            </button>';
        echo '              <ul class="dropdown-menu col-md-8">';

                            foreach ($ioPortList as $ioPort) 
                            {
                              if ($ioPort == $rowDevice["radioIoPort"])
                              {
                                echo '                  <li class="dropdown-item active" onclick="setDeviceIOPort('.$rowDevice["id"].','.$ioPort.')">';
                                echo '                  <a class="dropdown-link d-flex align-items-center gap-2 active">';
                              }
                              else 
                              {                                 
                                echo '                  <li class="dropdown-item " onclick="setDeviceIOPort('.$rowDevice["id"].','.$ioPort.')">';
                                echo '                  <a class="dropdown-link d-flex align-items-center gap-2">';
                              }
        echo '                <svg class="bi"><use xlink:href="dashboard.svg#lanup"></use></svg>';
        echo                  'IO Port: '.$ioPort;
        echo '                </a>';
        echo '                </li>';
                            }

        echo '              </ul>';                
        echo '          </div> ';

        echo '          <div class="row mb-3">';
        echo '                <div class="col-6">';
        echo '                   <input type="button" value="Apply" class="btn btn-primary" style="width:100%;" onclick="setCurrentId('.$rowDevice["id"].')" >';
        echo '                </div>';

        echo '                <div class="col-6">';
        echo '                    <input type="button" value="Remove" class="btn btn-warning" style="width:100%;" onclick="setCurrentIdForDelete('.$rowDevice["id"].')">';
        echo '                </div>';
        echo '          </div>';
        echo '        </div>';

        echo '      </div>  ';          
        echo '    </div>  ';        
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
</body>
</html>
