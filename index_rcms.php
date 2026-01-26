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
    <script src="dashboard.js"></script>
    <script src="index.js"></script>
    <link href="fontawesome-free-5.15.4-web/css/all.min.css" rel="stylesheet"/>
  </head>
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
<!-- Modal Custom Alert-->
<div class="modal fade" id="ModalCustomAlert" tabindex="-1" aria-labelledby="Alert" aria-hidden="true" >
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="Alert">Alert</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <span id="textAlert"> Unable to connect to the rcms system. </span>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
 
<!-- Modal Alert-->
<div class="modal fade" id="ModalFreqAlert" tabindex="-1" aria-labelledby="Alert" aria-hidden="true" >
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="Alert">Alert</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        Incorrect frequency
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

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
  $deviceName = "";
  $roleID = -1;
  if(isset($_POST['roleID']))
  {    
    $roleID = $_POST['roleID'];
  }
  $roleName = "";
?>


<?php
  include('dbConfig.php');
  include('ListVariable.php');

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
      if ($roleID == -1)
            $roleID = $row["roleID"];         
      if ($roleID == $row["roleID"])
          $roleName = $row["roleName"];
    }
  }
  if($_POST['deviceName'])
  {
    $deviceName = $_POST['deviceName'];
    $strSQL = "SELECT role.deviceID, role.deviceIdInRole, role.id AS roleIndex, deviceList.id AS deviceIndex, deviceList.Name, deviceList.templateID, deviceList.ipaddress, deviceList.username, deviceList.password, deviceList.radioIoPort, deviceList.serialnumber, deviceTemplate.iconName , deviceTemplate.type , deviceTemplate.description FROM deviceList INNER JOIN deviceTemplate ON deviceTemplate.id=deviceList.templateID INNER JOIN role ON role.deviceID = deviceList.id WHERE role.userID=".$userID." AND role.roleID=".$roleID." AND deviceTemplate.type='".$deviceName."' ORDER BY role.deviceIdInRole;";
  }
  else
  {

   $strSQL = "SELECT role.deviceID, role.deviceIdInRole, role.id AS roleIndex, deviceList.id AS deviceIndex, deviceList.Name, deviceList.templateID, deviceList.ipaddress, deviceList.username, deviceList.password, deviceList.radioIoPort, deviceList.serialnumber, deviceTemplate.iconName , deviceTemplate.type , deviceTemplate.description FROM deviceList INNER JOIN deviceTemplate ON deviceTemplate.id=deviceList.templateID INNER JOIN role ON role.deviceID = deviceList.id WHERE role.userID=".$userID." AND role.roleID=".$roleID." ORDER BY role.deviceIdInRole;";
  }

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
<div class="container-fluid">
  <div class="row">
    <div class="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
      <div class="offcanvas-md offcanvas-end bg-body-tertiary" tabindex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
<!--         <div class="offcanvas-header">
        <button class="nav-link px-3 text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSearch" aria-controls="navbarSearch" aria-expanded="false" aria-label="Toggle search">
        <svg class="bi_logo"><use xlink:href="dashboard.svg#logo"/></svg>
        </button>
        </div> -->
        <div class="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2 <?php if($deviceName == "") echo 'active'; ?> " aria-current="page" href="javascript:locationreloadDevice(<?php echo $roleID; ?>,'');;">
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
              <a class="nav-link d-flex align-items-center gap-2" href="roles.php">
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

    <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <div class="btn-toolbar mb-2 mb-md-0">
        <h1 class="h2"><?php echo $roleName ?></h1>
        </div>
        
        <div class="btn-toolbar mb-2 mb-md-0">
          <!-- <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1 m-1"> -->
          <?php            
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
                    $roleName = $role["roleName"];
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
          ?>
      
        </div>
      </div>
        <?php         
          {
            if ($userLevelAdmin == 1)
              echo '<fieldset id="deviceControl" style="opacity:1">';
            else
              echo '<fieldset id="deviceControl" disabled style="opacity:1">';
            echo '<div class="row row-cols-sm-1 row-cols-md-3 row-cols-lg-4 row-cols-xl-6">';
            foreach ($rowDeviceListQuery as $rowDevice) 
            {
                echo '<div class="container m-0 p-1" style="min-width: 388px;">';

                echo '<div class="card m-1 p-2" style="width: 100%;height: 100%;">';

                echo '<div class="row g-0">';
                if ($rowDevice["serialnumber"] != "")
                echo '      <h6 id="serialnumber'.$rowDevice["roleIndex"].'" style="font-family:courier; text-transform:uppercase; height:28px;" class="p-0 pb-1 pt-1 mb-0 mt-0 ">S/N: '.$rowDevice["serialnumber"].'</h6>';
                else
                  echo '      <h6 id="serialnumber'.$rowDevice["roleIndex"].'" style="font-family:courier; text-transform:uppercase; height:28px;" class="p-0 pb-1 pt-1 mb-0 mt-0 ">'.$rowDevice["serialnumber"].'</h6>';
                echo '</div>';
                echo '<div class="row g-0">';
                echo '  <div class="col-12" " data-bs-toggle="tooltip" data-placement="top" title="'.$rowDevice["description"].'">';
                if ($rowDevice["type"] == "Radio")
                  echo '  <button id="buttonconnected'.$rowDevice["roleIndex"].'" value="0" type="button" style="width: 100%; border-width:0px;" class="btn btn-sm d-flex align-items-center gap-2 m-1 p-1 btn-transition" onclick="post(\'http://'.$rowDevice["ipaddress"].'/check_login2.php\', {\'username\':\''.$rowDevice["username"].'\', \'password\':\''.$rowDevice["password"].'\'})" >';
                else
                  echo '  <button id="buttonconnected'.$rowDevice["roleIndex"].'" value="0" type="button" style="width: 100%; border-width:0px;" class="btn btn-sm d-flex align-items-center gap-2 m-1 p-1 btn-transition" onclick="post(\'http://'.$rowDevice["ipaddress"].'/check_login.php\', {\'username\':\''.$rowDevice["username"].'\', \'password\':\''.$rowDevice["password"].'\'})" >';
                echo '    <svg id="connected'.$rowDevice["roleIndex"].'" style="width: 100%;" class="biDeviceIndex rounded-start"><use xlink:href="dashboard.svg#'.$rowDevice["iconName"].'"/></svg>';
                echo '    </button>';
                echo '  </div>';

                echo '<div class="row g-0">';
                echo '      <h5 class="p-0 pb-1 pt-1 mb-1 mt-2">'.$rowDevice["Name"].'</h5>';
                echo '</div>';

                echo '      <div class="card p-1 justify-content-center" style="min-height: 120px;">';

                if ($rowDevice["type"] == "VoiceWay")
                {
                  echo '        <div class="row m-1 p-0 justify-content-md-center" style="width: 100%;">';                
                  for($i=1; $i<=8; $i++)
                  {                  
                    echo '          <div class="col-1" style="padding: 0px; margin:2px">';
                    echo '            <button type="button" id="buttonVWUP'.$i.'_'.$rowDevice["roleIndex"].'" class="btn align-items-center gap-0 m-0 p-0" style="border-width: 0px;" onclick="sendSwitchUp('.$rowDevice["roleIndex"].','.$i.')">';
                    echo '              <svg id="svgVWUp'.$i.'_'.$rowDevice["roleIndex"].'" class="biVoiceWay p-0"><use xlink:href="dashboard.svg#lanup"/></svg>';
                    echo '            </button>';
                    echo '          </div>';                    
                  }                
                  echo '        </div>';

                  echo '        <div class="row m-1 p-0 justify-content-md-center" style="width: 100%;">';                
                  for($i=9; $i<=16; $i++)
                  {                  
                    echo '          <div class="col-1" style="padding: 0px; margin:2px">';
                    echo '            <button type="button" id="buttonVWDown'.$i.'_'.$rowDevice["roleIndex"].'" class="btn align-items-center gap-0 m-0 p-0" style="border-width: 0px;" onclick="sendSwitchLow('.$rowDevice["roleIndex"].','.$i.')">';
                    echo '              <svg id="svgVWDown'.$i.'_'.$rowDevice["roleIndex"].'" class="biVoiceWay p-0"><use xlink:href="dashboard.svg#landown"/></svg>';
                    echo '            </button>';
                    echo '          </div>';                    
                  }                
                  echo '        </div>';
                }
                else if (($rowDevice["type"] == "iGate4CH") || ($rowDevice["description"] == "iCon 4 Channels"))
                {
                  echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;">';                
                  for($i=1; $i<=4; $i++)
                  {           
                    echo '       <div id="cardTxRx'.$i.'_'.$rowDevice["roleIndex"].'" class="card col-4" style="padding: 2px; margin:2px;">'; 
                    echo '        <div class="row m-0 p-0" style="width: 100%;">';       
                    echo '        <div class="col-6 m-0 p-0">';
                    echo '          <button type="button" disabled style="width: 100%;border-width: 0px; " class="btn align-items-center gap-0 m-0 p-0 btn-transition">';
                    echo '          <svg id="buttonRx'.$i.'_'.$rowDevice["roleIndex"].'"  class="bi_iGate"><use xlink:href="dashboard.svg#rx"/></svg>';
                    echo '          </button>';
                    echo '        </div>';    
                    echo '        <div class="col-6 m-0 p-0">';
                    echo '          <button type="button" disabled style="width: 100%;border-width: 0px; " class="btn align-items-center gap-0 m-0 p-0 btn-transition" >';
                    echo '          <svg id="buttonTx'.$i.'_'.$rowDevice["roleIndex"].'"  class="bi_iGate"><use xlink:href="dashboard.svg#tx"/></svg>';
                    echo '          </button>';
                    echo '        </div>'; 
                    echo '        </div>';      
                    echo '       </div>';            
                    if($i == 2){
                      echo '       </div>';    
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;">';                               
                    }                      
                  }                
                  echo '        </div>';
                }
                else if ($rowDevice["description"] == "Digital PSU")
                {
                  echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;">';                
                  for($i=0; $i<=3; $i++)
                  {           
                    echo '       <div id="cardTxRx'.$i.'_'.$rowDevice["roleIndex"].'" class="card col-5" style="padding: 2px; margin:2px;">'; 
                    echo '        <div class="row m-0 p-0" style="width: 100%;">';   
                    if($i == 0)
                    {
                      echo '        <div class="col-4 m-0 p-0">';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft2 class="col-12 m-0 p-0">Voltage</psuLabelLeft2> </div>';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft class="col-12 m-0 p-0" id="vOut'.$i.'_'.$rowDevice["roleIndex"].'">13.3V</psuLabelLeft> </div>';
                      echo '        </div>';

                      echo '        <div class="col-4 m-0 p-0">';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft2 class="col-12 m-0 p-0">Power</psuLabelLeft2> </div>';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft class="col-12 m-0 p-0" id="pOut'.$i.'_'.$rowDevice["roleIndex"].'">500W</psuLabelLeft> </div>';
                      echo '        </div>'; 
                      echo '        <div class="col-4 m-0 p-0">';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft2 class="col-12 m-0 p-0">Current</psuLabelLeft2> </div>';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft class="col-12 m-0 p-0" id="iOut'.$i.'_'.$rowDevice["roleIndex"].'">60.0A</psuLabelLeft> </div>';
                      echo '        </div>'; 
                    }
                    else
                    {
                      echo '        <div class="col-4 m-0 p-0">';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft2 class="col-12 m-0 p-0">Channel</psuLabelLeft2> </div>';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft class="col-12 m-0 p-0">'.$i.'</psuLabelLeft> </div>';
                      echo '        </div>'; 
                      echo '        <div class="col-4 m-0 p-0">';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft2 class="col-12 m-0 p-0">Power</psuLabelLeft2> </div>';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft class="col-12 m-0 p-0" id="pOut'.$i.'_'.$rowDevice["roleIndex"].'">500W</psuLabelLeft> </div>';
                      echo '        </div>'; 
                      echo '        <div class="col-4 m-0 p-0">';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft2 class="col-12 m-0 p-0">Current</psuLabelLeft2> </div>';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft class="col-12 m-0 p-0" id="iOut'.$i.'_'.$rowDevice["roleIndex"].'">60.0A</psuLabelLeft> </div>';
                      echo '        </div>';                      
                    }
                    echo '        </div>';      
                    echo '       </div>';            
                    if($i == 1)
                    {
                      echo '       </div>';    
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;">';                               
                    }                      
                  }
                  echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;">';     
                  echo '        <div id="cardBatt_'.$rowDevice["roleIndex"].'" class="card col-10">';          
                  echo '          <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft2 class="col-12 m-0 p-0">Battery</psuLabelLeft2> </div>';  
                  echo '          <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft class="col-12 m-0 p-0" id="vbatt_'.$rowDevice["roleIndex"].'">00.0V</psuLabelLeft> </div>';              

                  echo '        </div>';
                  echo '        </div>';

                  echo '        </div>';
                }
                else if ($rowDevice["description"] == "Power Sensor")
                {
                  echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;">';                
                  for($i=0; $i<=1; $i++)
                  {           
                    echo '       <div id="cardTxRx'.$i.'_'.$rowDevice["roleIndex"].'" class="card col-10" style="padding: 2px; margin:2px;">'; 
                    echo '        <div class="row m-0 p-0" style="width: 100%;">';   
                    if($i == 0)
                    {
                      echo '        <div class="col-4 m-0 p-0">';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft2 class="col-12 m-0 p-0">FWD(dBm)</psuLabelLeft2> </div>';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft class="col-12 m-0 p-1" id="fwdPowerDB_'.$rowDevice["roleIndex"].'"></psuLabelLeft> </div>';
                      echo '        </div>';

                      echo '        <div class="col-4 m-0 p-0">';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft2 class="col-12 m-0 p-0">RWD(dBm)</psuLabelLeft2> </div>';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft class="col-12 m-0 p-1" id="rwdPowerDB_'.$rowDevice["roleIndex"].'"></psuLabelLeft> </div>';
                      echo '        </div>'; 
                      echo '        <div class="col-4 m-0 p-0">';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft2 class="col-12 m-0 p-0">VSWR</psuLabelLeft2> </div>';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft class="col-12 m-0 p-1" id="vswr_'.$rowDevice["roleIndex"].'"></psuLabelLeft> </div>';
                      echo '        </div>'; 
                    }
                    else
                    {
                      echo '        <div class="col-4 m-0 p-0">';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft2 class="col-12 m-0 p-0">FWD(W)</psuLabelLeft2> </div>';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft class="col-12 m-0 p-1" id="fwdPowerWatt_'.$rowDevice["roleIndex"].'"></psuLabelLeft> </div>';
                      echo '        </div>';

                      echo '        <div class="col-4 m-0 p-0">';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft2 class="col-12 m-0 p-0">RWD(W)</psuLabelLeft2> </div>';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft class="col-12 m-0 p-1" id="rwdPowerWatt_'.$rowDevice["roleIndex"].'"></psuLabelLeft> </div>';
                      echo '        </div>'; 
                      echo '        <div class="col-4 m-0 p-0">';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft2 class="col-12 m-0 p-0"></psuLabelLeft2> </div>';
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;"> <psuLabelLeft class="col-12 m-0 p-1" id="swr_'.$rowDevice["roleIndex"].'"></psuLabelLeft> </div>';
                      echo '        </div>';                    
                    }
                    echo '        </div>';      
                    echo '       </div>';            
                     
                  }

                  echo '        </div>';
                }
                else if ($rowDevice["description"] == "iCon 10 Channels")
                {
                  echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;">';                
                  for($i=1; $i<=10; $i++)
                  {           
                    echo '       <div id="cardTxRx'.$i.'_'.$rowDevice["roleIndex"].'" class="col-2" style="padding: 1px; margin:1px; width:19%; ">'; 
                    echo '        <div class="row m-0 p-0" style="width: 100%;">';       
                    echo '        <div class="col-6 m-0 p-0">';
                    echo '          <button type="button" disabled style="width: 100%;border-width: 0px; padding:1px; " class="btn align-items-center gap-0 m-0 btn-transition" >';
                    echo '          <svg id="rxButton'.$i.'_'.$rowDevice["roleIndex"].'"  class="bi_iGate"><use xlink:href="dashboard.svg#rx"/></svg>';
                    echo '          </button>';
                    echo '        </div>'; 
                    echo '        <div class="col-6 m-0 p-0">';
                    echo '          <button type="button" disabled style="width: 100%;border-width: 0px; padding:1px; " class="btn align-items-center gap-0 m-0 btn-transition">';
                    echo '          <svg id="txButton'.$i.'_'.$rowDevice["roleIndex"].'"  class="bi_iGate"><use xlink:href="dashboard.svg#tx"/></svg>';
                    echo '          </button>';
                    echo '        </div>';                     
                    echo '        </div>';      
                    echo '       </div>';            
                    if($i == 5){
                      echo '       </div>';    
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;">';                               
                    }                      
                  }                
                  echo '        </div>';
                }
                else if ($rowDevice["description"] == "VoiceX Radio Server")
                {
                  echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;">';                
                  for($i=1; $i<=10; $i++)
                  {           
                    echo '       <div id="cardTxRx'.$i.'_'.$rowDevice["roleIndex"].'" class="card col-2" style="padding: 2px; margin:2px">'; 
                    echo '        <div class="row m-0 p-0" style="width: 100%;">';       
                    echo '        <div class="col-6 m-0 p-0">';
                    echo '         <div class="container align-items-center m-0 p-0 ">';
                    echo '               <div class="icon-badge-container">'; 
                    echo '                <i class="far fa-arrow-alt-circle-down icon-badge-icon"></i>'; 
                    echo '                <div id="callInNum'.$i.'_'.$rowDevice["roleIndex"].'" class="icon-badge">0</div>'; 
                    echo '               </div>'; 
                    echo '        </div>'; 
                    echo '        </div>'; 
                    echo '        <div class="col-6 m-0 p-0">';
                    echo '        <div class="col-6 m-0 p-0">';
                    echo '         <div class="container align-items-center  m-0 p-0 ">';
                    echo '               <div class="icon-badge-container">'; 
                    echo '                <i class="far fa-arrow-alt-circle-up icon-badge-icon"></i>'; 
                    echo '                <div id="callOutNum'.$i.'_'.$rowDevice["roleIndex"].'" class="icon-badge">0</div>'; 
                    echo '               </div>'; 
                    echo '        </div>'; 
                    echo '        </div>'; 
                    echo '        </div>';                     
                    echo '        </div>';      
                    echo '       </div>';            
                    if($i == 5){
                      echo '       </div>';    
                      echo '        <div class="row m-0 p-0 justify-content-md-center" style="width: 100%;">';                               
                    }                      
                  }                
                  echo '        </div>';
                }
                else if ($rowDevice["description"] == "Redifon Receiver Mode")
                {
                  echo '        <div class="row m-0 p-0" style="width: 100%;">'; 
                  echo '        <div class="col-4 m-0 p-0">';
                  echo '          <div style="display:block; margin:1px">';      
                  echo '            <input id="frequency'.$rowDevice["roleIndex"].'" type="number" class="form-control text-center" placeholder="Frequency" onchange="setRadioParameter('.$rowDevice["roleIndex"].',this.value,'.$rowDevice["radioIoPort"].',\'setFrequency\',\''.$rowDevice["description"].'\')" data-bs-toggle="tooltip" data-placement="top" title="Frequency(kHz)"> ';   
                  echo '          </div>';   

                  echo '          <div id="EmissionModeDiv" style="display:block; margin:1px" data-bs-toggle="tooltip" title="Emission Mode">';
                  echo '            <button id="EmissionMode'.$rowDevice["roleIndex"].'" value="1" style="width: 100%;height: 100%; text-align: right;" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center" data-bs-toggle="dropdown" aria-expanded="false">';
                  echo '            <label id="EmissionModeLabel'.$rowDevice["roleIndex"].'">Emission</label>';
                  echo '            </button>';
                  echo '              <ul class="dropdown-menu col-md-8">';
                  $RedifonEmissionValueindex = 0;
                                      foreach ($RedifonEmissionMode as $Emission) 
                                      {
                  echo '                  <li class="dropdown-item " onclick="setRadioEmissionMode('.$rowDevice["roleIndex"].',\''.$Emission.'\',\''.$RedifonEmissionValue[$EmissionValueindex].'\','.$rowDevice["radioIoPort"].',\'SetEmission\',\''.$rowDevice["description"].'\')" >';
                  echo '                  <a class="dropdown-link d-flex align-items-center gap-2">';
                  echo                  $Emission;
                  echo '                </a>';
                  echo '                </li>';
                  $RedifonEmissionValueindex += 1;
                                      }
                  echo '              </ul>';                
                  echo '          </div> ';
                  echo '          <div style="display:block; margin:1px" data-bs-toggle="tooltip" title="RIT Frequency">';      
                  echo '            <input id="RITFrequency'.$rowDevice["roleIndex"].'" type="number" value="0" min="-2999" max="2999" step="1" class="form-control text-center" placeholder="RIT Frequency"  onchange="setRadioParameter('.$rowDevice["roleIndex"].',this.value,'.$rowDevice["radioIoPort"].',\'RITFrequency\',\''.$rowDevice["description"].'\')" > ';   
                  echo '          </div>';    
                  echo '        </div>';
                  echo '        <div class="col-4 m-0 p-0">';

                  echo '          <div id="AGCModeDiv" style="display:block; margin:1px" data-bs-toggle="tooltip" title="Automatic gain control (AGC)">';
                  echo '            <button id="AGCMode'.$rowDevice["roleIndex"].'" value="'.$AGCModeValue[0].'" style="width: 100%;height: 100%; text-align: right;" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center" data-bs-toggle="dropdown" aria-expanded="false">';
                  echo '            <label id="AGCModeLabel'.$rowDevice["roleIndex"].'">AGC</label>';
                  echo '            </button>';
                  echo '              <ul class="dropdown-menu col-md-8">';
                                      foreach ($RedifonAGCMode as $AGC) 
                                      {
                  echo '                  <li class="dropdown-item " onclick="setAGCMode('.$rowDevice["roleIndex"].',\''.$AGC.'\',\''.$AGC.'\','.$rowDevice["radioIoPort"].',\'SetAGC\',\''.$rowDevice["description"].'\')" > ';   
                  echo '                  <a class="dropdown-link d-flex align-items-center gap-2">';
                  echo                  $AGC;
                  echo '                </a>';
                  echo '                </li>';
                                      }
                  echo '              </ul>';                
                  echo '          </div> ';

                  echo '          <div id="MuteModeDiv" style="display:none; margin:1px" data-bs-toggle="tooltip" title="Mute Function">';
                  echo '            <button id="MuteMode'.$rowDevice["roleIndex"].'" value="1" style="width: 100%;height: 100%; text-align: right;" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center" data-bs-toggle="dropdown" aria-expanded="false">';
                  echo '            <label id="MuteModeLabel'.$rowDevice["roleIndex"].'">Mute</label>';
                  echo '            </button>';
                  echo '              <ul class="dropdown-menu col-md-8">';
                  $MuteModeIndex = 0;
                                      foreach ($MuteMode as $Mute) 
                                      {
                  echo '                  <li class="dropdown-item " onclick="setMuteMode('.$rowDevice["roleIndex"].',\''.$Mute.'\',\''.$MuteModeValue[$MuteModeIndex].'\','.$rowDevice["radioIoPort"].',\'SetMute\',\''.$rowDevice["description"].'\')" > ';   
                  echo '                  <a class="dropdown-link d-flex align-items-center gap-2">';
                  echo                  $Mute;
                  echo '                </a>';
                  echo '                </li>';
                  $MuteModeIndex += 1;
                                      }
                  echo '              </ul>';            
                  echo '          </div> ';

                  echo '          <div id="IFFilterDiv" style="display:block; margin:1px" data-bs-toggle="tooltip" title="IF Filter">';
                  echo '            <button id="IFFilter'.$rowDevice["roleIndex"].'" value="300" style="width: 100%;height: 100%; text-align: right;" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center" data-bs-toggle="dropdown" aria-expanded="false">';
                  echo '            <label id="IFFilterLabel'.$rowDevice["roleIndex"].'">IF Filter</label>';
                  echo '            </button>';
                  echo '              <ul class="dropdown-menu col-md-8">';
                 foreach ($IFFilterValue as $IFFilter) 
                                      {
                  echo '                  <li class="dropdown-item " onclick="setMuteMode('.$rowDevice["roleIndex"].',\''.$Mute.'\',\''.$IFFilter.'\','.$rowDevice["radioIoPort"].',\'IFFilter\',\''.$rowDevice["description"].'\')" > ';   
                  echo '                  <a class="dropdown-link d-flex align-items-center gap-2">';
                  echo                  $IFFilter;
                  echo '                </a>';
                  echo '                </li>';
                                      }     
                  echo '              </ul>';            
                  echo '          </div> ';

                  echo '        </div>';
                  echo '        <div class="col-4 m-0 p-0">';
                  echo '          <div style="display:none; margin:1px" data-bs-toggle="tooltip" title="Squelch Level">';      
                  echo '            <input id="squelch'.$rowDevice["roleIndex"].'" type="number" class="form-control text-center" placeholder="Squelch"  onchange="setRadioParameter('.$rowDevice["roleIndex"].',this.value,'.$rowDevice["radioIoPort"].',\'setSquelch\',\''.$rowDevice["description"].'\')" > ';   
                  echo '          </div>';   
                  echo '          <div style="display:block; margin:1px" data-bs-toggle="tooltip" title="RF Gain Level (dB)">';      
                  echo '            <input id="rfGain'.$rowDevice["roleIndex"].'" type="number" value="0" min="-110" max="0" step="-1" class="form-control text-center" placeholder="RF Gain (dB)"  onchange="setRadioParameter('.$rowDevice["roleIndex"].',this.value,'.$rowDevice["radioIoPort"].',\'setRfGain\',\''.$rowDevice["description"].'\')" > ';   
                  echo '          </div>';   
                  echo '          <div style="display:block; margin:1px" data-bs-toggle="tooltip" title="BFO Frequency">';      
                  echo '            <input id="BFOFrequency'.$rowDevice["roleIndex"].'" type="number" value="0" min="-7990" max="7990" step="1" class="form-control text-center" placeholder="BFO Frequency"  onchange="setRadioParameter('.$rowDevice["roleIndex"].',this.value,'.$rowDevice["radioIoPort"].',\'BFOFrequency\',\''.$rowDevice["description"].'\')" > ';   
                  echo '          </div>';  
                  echo '        </div>';
                  echo '        </div>';
                }
                else if ($rowDevice["description"] == "RT2200 Receiver Mode")
                {
                  echo '        <div class="row m-0 p-0" style="width: 100%;">'; 
                  echo '        <div class="col-4 m-0 p-0">';
                  echo '          <div style="display:block; margin:1px">';      
                  echo '            <input id="frequency'.$rowDevice["roleIndex"].'" type="number" class="form-control text-center" placeholder="Frequency" onchange="setRadioParameter('.$rowDevice["roleIndex"].',this.value,'.$rowDevice["radioIoPort"].',\'setFrequency\',\''.$rowDevice["description"].'\')" data-bs-toggle="tooltip" data-placement="top" title="Frequency(kHz)"> ';   
                  echo '          </div>';   

                  echo '          <div id="EmissionModeDiv" style="display:block; margin:1px" data-bs-toggle="tooltip" title="Emission Mode">';
                  echo '            <button id="EmissionMode'.$rowDevice["roleIndex"].'" value="1" style="width: 100%;height: 100%; text-align: right;" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center" data-bs-toggle="dropdown" aria-expanded="false">';
                  echo '            <label id="EmissionModeLabel'.$rowDevice["roleIndex"].'">Emission</label>';
                  echo '            </button>';
                  echo '              <ul class="dropdown-menu col-md-8">';
                  $EmissionValueindex = 0;
                                      foreach ($EmissionMode as $Emission) 
                                      {
                  echo '                  <li class="dropdown-item " onclick="setRadioEmissionMode('.$rowDevice["roleIndex"].',\''.$Emission.'\',\''.$EmissionValue[$EmissionValueindex].'\','.$rowDevice["radioIoPort"].',\'SetEmission\',\''.$rowDevice["description"].'\')" >';
                  echo '                  <a class="dropdown-link d-flex align-items-center gap-2">';
                  echo                  $Emission;
                  echo '                </a>';
                  echo '                </li>';
                  $EmissionValueindex += 1;
                                      }
                  echo '              </ul>';                
                  echo '          </div> ';

                  echo '        </div>';
                  echo '        <div class="col-4 m-0 p-0">';

                  echo '          <div id="AGCModeDiv" style="display:block; margin:1px" data-bs-toggle="tooltip" title="Automatic gain control (AGC)">';
                  echo '            <button id="AGCMode'.$rowDevice["roleIndex"].'" value="'.$AGCModeValue[0].'" style="width: 100%;height: 100%; text-align: right;" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center" data-bs-toggle="dropdown" aria-expanded="false">';
                  echo '            <label id="AGCModeLabel'.$rowDevice["roleIndex"].'">AGC</label>';
                  echo '            </button>';
                  echo '              <ul class="dropdown-menu col-md-8">';
                  $AGCModeIndex = 0;
                                      foreach ($AGCMode as $AGC) 
                                      {
                  echo '                  <li class="dropdown-item " onclick="setAGCMode('.$rowDevice["roleIndex"].',\''.$AGC.'\',\''.$AGCModeValue[$AGCModeIndex].'\','.$rowDevice["radioIoPort"].',\'SetAGC\',\''.$rowDevice["description"].'\')" > ';   
                  echo '                  <a class="dropdown-link d-flex align-items-center gap-2">';
                  echo                  $AGC;
                  echo '                </a>';
                  echo '                </li>';
                  $AGCModeIndex += 1;
                                      }
                  echo '              </ul>';                
                  echo '          </div> ';

                  echo '          <div id="MuteModeDiv" style="display:block; margin:1px" data-bs-toggle="tooltip" title="Mute Function">';
                  echo '            <button id="MuteMode'.$rowDevice["roleIndex"].'" value="1" style="width: 100%;height: 100%; text-align: right;" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center" data-bs-toggle="dropdown" aria-expanded="false">';
                  echo '            <label id="MuteModeLabel'.$rowDevice["roleIndex"].'">Mute</label>';
                  echo '            </button>';
                  echo '              <ul class="dropdown-menu col-md-8">';
                  $MuteModeIndex = 0;
                                      foreach ($MuteMode as $Mute) 
                                      {
                  echo '                  <li class="dropdown-item " onclick="setMuteMode('.$rowDevice["roleIndex"].',\''.$Mute.'\',\''.$MuteModeValue[$MuteModeIndex].'\','.$rowDevice["radioIoPort"].',\'SetMute\',\''.$rowDevice["description"].'\')" > ';   
                  echo '                  <a class="dropdown-link d-flex align-items-center gap-2">';
                  echo                  $Mute;
                  echo '                </a>';
                  echo '                </li>';
                  $MuteModeIndex += 1;
                                      }
                  echo '              </ul>';                
                  echo '          </div> ';

                  echo '        </div>';
                  echo '        <div class="col-4 m-0 p-0">';
                  echo '          <div style="display:block; margin:1px" data-bs-toggle="tooltip" title="Squelch Level">';      
                  echo '            <input id="squelch'.$rowDevice["roleIndex"].'" type="number" class="form-control text-center" placeholder="Squelch"  onchange="setRadioParameter('.$rowDevice["roleIndex"].',this.value,'.$rowDevice["radioIoPort"].',\'setSquelch\',\''.$rowDevice["description"].'\')" > ';   
                  echo '          </div>';   
                  echo '          <div style="display:block; margin:1px" data-bs-toggle="tooltip" title="RF Gain Level (dB)">';      
                  echo '            <input id="rfGain'.$rowDevice["roleIndex"].'" type="number" class="form-control text-center" placeholder="RF Gain (dB)"  onchange="setRadioParameter('.$rowDevice["roleIndex"].',this.value,'.$rowDevice["radioIoPort"].',\'setRfGain\',\''.$rowDevice["description"].'\')" > ';   
                  echo '          </div>';   
                  echo '        </div>';
                  echo '        </div>';
                }
                else if ($rowDevice["description"] == "RT2200 Transmitter Mode")
                {
                  echo '        <div class="row m-0 p-0" style="width: 100%;">'; 
                  echo '        <div class="col-4 m-0 p-0">';
                  echo '          <div style="display:block; margin:1px">';      
                  echo '            <input id="frequency'.$rowDevice["roleIndex"].'" type="number" class="form-control text-center" placeholder="Frequency"  onchange="setRadioParameter('.$rowDevice["roleIndex"].',this.value,'.$rowDevice["radioIoPort"].',\'setFrequency\',\''.$rowDevice["description"].'\')" data-bs-toggle="tooltip" data-placement="top" title="Frequency(kHz)"> ';   
                  echo '          </div>';   

                  echo '          <div id="EmissionModeDiv" style="display:block; margin:1px" data-bs-toggle="tooltip" title="Emission Mode">';
                  echo '            <button id="EmissionMode'.$rowDevice["roleIndex"].'" value="1" style="width: 100%;height: 100%; text-align: right;" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center" data-bs-toggle="dropdown" aria-expanded="false">';
                  echo '            <label id="EmissionModeLabel'.$rowDevice["roleIndex"].'">Emission</label>';
                  echo '            </button>';
                  echo '              <ul class="dropdown-menu col-md-8">';
                  $EmissionValueindex = 0;
                                      foreach ($EmissionMode as $Emission) 
                                      {
                  echo '                  <li class="dropdown-item " onclick="setRadioEmissionMode('.$rowDevice["roleIndex"].',\''.$Emission.'\',\''.$EmissionValue[$EmissionValueindex].'\','.$rowDevice["radioIoPort"].',\'SetEmission\',\''.$rowDevice["description"].'\')" >';
                  echo '                  <a class="dropdown-link d-flex align-items-center gap-2">';
                  echo                  $Emission;
                  echo '                </a>';
                  echo '                </li>';
                  $EmissionValueindex += 1;
                                      }
                  echo '              </ul>';                
                  echo '          </div> ';
                  echo '            <div class="form-check">';      
                  echo '              <input class="form-check-input" type="checkbox" onclick="onKeyInhibitChange('.$rowDevice["roleIndex"].','.$rowDevice["radioIoPort"].',this.checked);" id="KeyInhibit'.$rowDevice["roleIndex"].'">';      
                  echo '              <label class="form-check-label pt-1" for="KeyInhibit'.$rowDevice["roleIndex"].'" style="font-size: 0.875em;">';      
                  echo '                Key Inhibit';      
                  echo '              </label>';      
                  echo '            </div>';      
                  echo '        </div>';
                  echo '        <div class="col-4 m-0 p-0">';

                  echo '          <div id="VOX_DOX_ModeModeDiv" style="display:block; margin:1px" data-bs-toggle="tooltip" title="VOX DOX Enable/Disable"> '; 
                  echo '            <button id="VOX_DOX_Mode'.$rowDevice["roleIndex"].'" value="1" style="width: 100%;height: 100%; text-align: right;" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center" data-bs-toggle="dropdown" aria-expanded="false">';
                  echo '            <label id="VOX_DOX_ModeLabel'.$rowDevice["roleIndex"].'">VOX Disable</label>';
                  echo '            </button>';
                  echo '              <ul class="dropdown-menu col-md-8">';
                                      foreach ($VOX_DOX_Mode as $VOX) 
                                      {
                  echo '                  <li class="dropdown-item " onclick="setVoxRadioParameter('.$rowDevice["roleIndex"].',\''.$VOX.'\','.$rowDevice["radioIoPort"].',\'SetVOX\')" >';
                  echo '                  <a class="dropdown-link d-flex align-items-center gap-2">';
                  echo                  $VOX;
                  echo '                </a>';
                  echo '                </li>';
                                      }
                  echo '              </ul>';                
                  echo '          </div> ';

                  echo '          <div id="VOXEnableModeDiv'.$rowDevice["roleIndex"].'" style="display:none; margin:1px" data-bs-toggle="tooltip" title="VOX DOX Mode"> '; 
                  echo '            <button id="VOXEnableMode'.$rowDevice["roleIndex"].'" value="1" style="width: 100%;height: 100%; text-align: right;" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center" data-bs-toggle="dropdown" aria-expanded="false">';
                  echo '            <label id="VOXEnableModeLabel'.$rowDevice["roleIndex"].'">Monitor/Status</label>';
                  echo '            </button>';
                  echo '              <ul class="dropdown-menu col-md-8">';
                                      foreach ($VOXEnableMode as $VOXEnable) 
                                      {
                  echo '                  <li class="dropdown-item " onclick="setVoxRadioParameter('.$rowDevice["roleIndex"].',\''.$VOXEnable.'\','.$rowDevice["radioIoPort"].',\'VOXEnableMode\')" >';
                  echo '                  <a class="dropdown-link d-flex align-items-center gap-2">';
                  echo                  $VOXEnable;
                  echo '                </a>';
                  echo '                </li>';
                                      }
                  echo '              </ul>';                
                  echo '          </div> ';
                  echo '          <div id="VOXApplyDiv'.$rowDevice["roleIndex"].'" style="display:none; margin:1px">';
                  echo '          <input type="button" value="Apply" class="btn btn-primary" style="width:100%;" onclick="ApplyVox('.$rowDevice["roleIndex"].','.$rowDevice["radioIoPort"].')">';
                  echo '        </div>';
                  echo '        </div>';
                  echo '        <div class="col-4 m-0 p-0">';
                  echo '          <div style="margin:1px" data-bs-toggle="tooltip" title="Transmit power (percentage)">';      
                  echo '            <input id="XmtPower'.$rowDevice["roleIndex"].'" type="number" class="form-control text-center" placeholder="Tx Power (%)"  onchange="setRadioParameter('.$rowDevice["roleIndex"].',this.value,'.$rowDevice["radioIoPort"].',\'setTxpower\',\''.$rowDevice["description"].'\')" > ';
                  echo '          </div>';   
                  echo '        <div id="VOXVarDiv'.$rowDevice["roleIndex"].'" style="display:none; width:100%;" class="m-0 p-0">';
                  echo '          <div style="margin:1px" data-bs-toggle="tooltip" title="VOX Threshold (dB)">';
                  echo '            <input id="Threshold'.$rowDevice["roleIndex"].'" type="number" class="form-control text-center" placeholder="Threshold (dB)"  onchange="setVoxRadioParameter('.$rowDevice["roleIndex"].',this.value,'.$rowDevice["radioIoPort"].',\'setThreshold\')" > ';
                  echo '          </div>';   
                  echo '          <div style="margin:1px" data-bs-toggle="tooltip" title="VOX Unkey Delay (Secound)">';      
                  echo '            <input id="UnkeyDelay'.$rowDevice["roleIndex"].'" type="number" class="form-control text-center" placeholder="Unkey Delay (sec)"  onchange="setVoxRadioParameter('.$rowDevice["roleIndex"].',this.value,'.$rowDevice["radioIoPort"].',\'setUnkeyDelay\')" > ';
                  echo '          </div>';  
                  echo '          </div>';   
                  echo '        </div>';
                  echo '        </div>';
                }
                echo '        </div>';

                echo '<div class="row g-0">';
                echo '    <div class="card-body">';
                echo '      <p id="lastUpdate'.$rowDevice["roleIndex"].'" class="card-text"><small class="text-muted"></small></p>';
                echo '    </div>';                
                echo '</div>';

                echo '</div>';
                echo '</div>';
                echo '</div>';
            }    

          echo '</div>';
        }
          mysqli_close($conn);
        ?>
      </fieldset>
    </main>
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

<script>
// Initialize tooltips
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})
</script>
</html>
