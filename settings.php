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
    <script src="assets/dist/js/bootstrap.bundle.min.js"></script>
    <script src="dashboard.js"></script>
    <script src="settings.js?v=<?php echo time(); ?>"></script>


    <script src="js/jquery.min.js"></script>
    <script type="text/javascript" src="js/jquery-latest.min.js"></script>
    <script type="text/javascript" src="js/jquery-ui.js"></script>
    <link rel="stylesheet" type="text/css" href="css/jquery.datetimepicker.css">
    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/jquery.datetimepicker.js"></script>

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
                                <a class="nav-link d-flex align-items-center gap-2 active" href="settings.php">
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
            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <div
                    class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">System And Update</h1>
                    <div class="btn-toolbar mb-2 mb-md-0">
                        <button id="buttonChangeID" type="button"
                            class="btn btn-sm btn-outline-secondary   align-items-center gap-1 m-1 d-flex"
                            data-bs-toggle="modal" data-bs-target="#confirmToRebootSystem">
                            <svg class="bi">
                                <use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#redo-alt" />
                            </svg>
                            REBOOT
                        </button>
                    </div>
                </div>

                <?php
      if ($userLevelAdmin == 1)
              echo '<fieldset id="deviceControl" style="opacity:1">';
            else
              echo '<fieldset id="deviceControl" disabled style="opacity:1">';
      echo '<div class="row row-cols-sm-1 row-cols-md-2 row-cols-lg-4 row-cols-xl-6">';

        echo '  <div class="card m-1 p-1" style="min-width: 367px;">';
        echo '    <div class="container m-0 p-2" style="width: 100%;height: 100%;">';
        echo '      <div class="row align-items-center" >';
        echo '        <div class="col-md-4">';
        echo '          <div class="mb-2">';
        echo '            <svg class="biDeviceList rounded-start"><use id="upload" xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#upload"/></svg>';
        echo '          </div>'; 
        echo '        </div>';  
        echo '        <div class="col-md-8">';
        echo '           <div class="mb-2">';
        echo '            <label for="swversion" class="form-label">Software Version</label>';
        echo '            <input id="swversion" type="swversion" class="form-control text-center" disabled value="Software version">';
        echo '          </div>';          
        echo '                <form action="" method="post" enctype="multipart/form-data" >';
        echo '          <div class="mb-2">';
        echo '                <div class="selected_list"> <span>Resource</span>';
        echo '                  <input class="form-control" type="file" name="fileToUpload"/>';
        echo '                  </div>';
        echo '                  </div>';
        echo '          <div class="mb-2">';
        echo '                <div class="selected_list"><span></span>';
        echo '                  <button style="width: 100%;height: 100%; " class="btn btn-outline-primary d-flex justify-content-between align-items-center" type="submit">';
        echo '                    <svg class="bi"><use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#upload"></use></svg>';
        echo '                    <span style="display: flex; justify-content: center; width:100%">UPLOAD</span>';
        echo '                  </button>';
        echo '                </div>';
        echo '                </div>';
        echo '                </form>';

        
        if (file_exists('uploads/update.tar')){
          echo '          <div class="mb-2" id="updateButton" style="display:block;">';
        }
        else {
          echo '          <div class="mb-2" id="updateButton" style="display:none;">';
        }
          echo    '<h5>Found update file, Pls update your system.</h5>';
          echo'    <button style="width: 100%;height: 100%; " class="btn btn-outline-primary d-flex justify-content-between align-items-center" type="button" id="update" name="update"  data-bs-toggle="modal" data-bs-target="#confirmToUpdateSystem" >';
          echo '         <svg class="bi"><use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#sync-alt"></use></svg>';
          echo '         <span style="display: flex; justify-content: center; width:100%">UPDATE</span>            </button>';
          echo '          </div>';                 
        
        
        
        echo '          </div> ';

        echo '        </div>';


        echo '      </div>  ';          
        echo '    </div>  ';     


        echo '<div class="card m-1 p-1 " style="min-width: 367px;">';
        echo '  <div class="container m-0 p-2" style="width: 100%;height: 100%;">';
        echo '    <div class="row align-items-center">';
        echo '      <div class="col-md-4">';
        echo '        <div class="mb-2">';
        echo '          <svg class="biDeviceList rounded-start"><use id="upload" xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#upload"/></svg>';
        echo '        </div>';
        echo '      </div>';
        echo '      <div class="col-md-8">';
        echo '        <div class="mb-2">';
        echo '          <label class="form-label">Upload alsarecd_update.deb</label>';
        echo '        </div>';
        echo '        <form action="upload_rec.php" method="post" enctype="multipart/form-data">';
        echo '          <div class="mb-2">';
        echo '            <input type="file" name="fileRecToUpload" class="form-control"/>';
        echo '            <input type="hidden" name="target" value="/var/www/html/uploads/alsarecd_update/update.deb">';
        echo '          </div>';
        echo '          <div class="mb-2">';
        echo '            <button type="submit" style="width: 100%;height: 100%; " class="btn btn-outline-primary d-flex justify-content-between align-items-center">Upload alsarecd_update</button>';
        echo '          </div>';
        echo '        </form>';
        echo '      </div>';
        echo '    </div>';
        echo '  </div>';
        echo '</div>';

        echo '  <div class="card m-1 p-1" style="min-width: 368px; display: none">';
        echo '    <div class="container m-0 p-2" style="width: 100%;height: 100%;">';
        echo '      <div class="row align-items-center" >';
 
        echo '    <div class="row m-0">';
        echo '      <h5 id="dateTimeDiv"class="p-0 pb-1 pt-1 mb-1 border-bottom">Backup And Restore</h5>';
        echo '    </div>';

        echo '        <div class="col-md-5">';
        echo '          <div class="mb-2 divcenter">';
        echo '            <svg class="biEth"><use  xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#sync-alt"/></svg>';
        echo '          </div>';
        echo '        </div>';  

        echo '        <div class="col-md-7">';
        echo '<h5>Backup</h5>';
        echo '<div class="updatediv"><span></span>';  
        echo '<button style="width: 100%;" class="btn btn-primary" type="submit" id="backup" name="backup" onClick="systembackup()">BACKUP</button>';
        echo '</div>';

        echo '<div class="updatediv"><span></span>';  
        echo '</div>';

        echo '        <form action="" method="post" enctype="multipart/form-data" >';
        echo '        <h5>Restore</h5>';
        echo '        <div class="mb-2"> <span>Resource</span>';
        echo '        <input type="file" class="form-control" name="filerestore"/>';
        echo '        </div>';
        echo '        <div class=""mb-2"><span></span>';
        echo '           <button style="width: 100%;height: 100%; " class="btn btn-outline-primary d-flex justify-content-between align-items-center" type="submit" value="restorefile">';
        echo '              <svg class="bi"><use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#upload"></use></svg>';
        echo '              <span style="display: flex; justify-content: center; width:100%">UPLOAD</span>';
        echo '           </button>';
        echo '        </div>';
        echo '        </form>';
        if (file_exists('uploads/database.tar'))
        {
          echo '          <div id="restoreDiv" class="modal-footer" style="display: block;">';
          echo '            <div class="mb-2">';
          echo('            <span>Found restore file, Pls restore your system.</span>');
          echo('            <button style="width: 100%;" class="btn btn-primary" type="submit" id="restore" name="restore" onClick="systemrestore()">RESTORE</button>');
          echo '            </div>';
          echo '          </div> '; 
        }     
        else
        {
          echo '          <div id="restoreDiv" class="modal-footer" style="display: none;">';
          echo '            <div class="mb-2">';
          echo('            <span>Found restore file, Pls restore your system.</span>');
          echo('            <button style="width: 100%;" class="btn btn-primary" type="submit" id="restore" name="restore" onClick="systemrestore()">RESTORE</button>');
          echo '            </div>';
          echo '          </div> '; 
        }
        echo '        </div>';
        echo '      </div>  ';  
        echo '    </div>';  
        echo '  </div>';

          echo '  <div class="card m-1 p-1" style="min-width: 367px; display: none";>';
          echo '    <div class="container m-0 p-2" style="width: 100%;height: 100%;">';
          echo '    <div class="row align-items-center" >';

          echo '    <div class="row m-0" >';
          echo '      <h5 id="dateTimeDiv"class="p-0 pb-1 pt-1 mb-1 border-bottom">Date Time Setting</h5>';
          echo '    </div>';

          echo '        <div class="col-md-5">';
          echo '          <div class="mb-2 divcenter">';
          echo '            <svg class="biEth"><use  xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#clock"/></svg>';
          echo '          </div>';
          echo '           <div class="mb-2">';
          echo '            <label id="currentDate" class="form-label text-center">Current Date</label>';
          echo '          </div>';           
          echo '           <div class="mb-2">';
          echo '            <label id="currentTime" class="form-label text-center">Current Time</label>';
          echo '          </div>';   
          echo '        </div>';   

          echo '        <div class="col-md-7">';
          echo '          <div class="mb-2">';
          echo '            <select class="form-select" aria-label="Default select example" name="dateTimeMethod" id="dateTimeMethod" onchange="datetimeMethod()">';
          echo '            <option value="0">Select option</option>';
          echo '            <option value="1">Automatically From NTP</option>';
          echo '            <option value="2">Manually</option>';
          echo '            </select>';
          echo '          </div>'; 
          echo '          <div class="mb-2" id="divManual" style="display: none">'; 
          echo '           <div class="mb-2">';
          echo '            <label for="startdate" class="form-label">Date Time</label>';
          echo '            <input class="form-control text-center" type="text" name="startdate" value="" id="startdate" />'; 
          echo '          </div>'; 
          echo '          <div class="mb-2">';
          echo '            <button type="button" style="width: 100%;" class="btn btn-primary" id="updateDateTime" name="updateDateTime" onClick="updateTime()">Setup Date Time</button>'; 
          echo '          </div>'; 
          echo '          </div>'; 
          echo '          <script type="text/javascript">'; 
          echo '            jQuery(\'#startdate\').datetimepicker();'; 
          echo '          </script>'; 


          echo '          <div id="divNTP" style="display: none">';
          echo '           <div class="mb-2">';
          echo '              <label for="ntpserver1" class="form-label">NTP Server 1</label>';
          echo '              <input class="form-control text-center" type="text" id="ntpserver1" name="ntpserver1"  value=""/>';
          echo '            </div>';
          echo '           <div class="mb-2">';
          echo '              <label for="ntpserver2" class="form-label">NTP Server 2</label>';
          echo '              <input class="form-control text-center" type="text" id="ntpserver2" name="ntpserver2"  value=""/>';
          echo '            </div>';
          echo '           <div class="mb-2">';
          echo '              <label for="ntpserver3" class="form-label">NTP Server 3</label>';
          echo '              <input class="form-control text-center" type="text" id="ntpserver3" name="ntpserver3"  value=""/>';
          echo '            </div>';
          echo '           <div class="mb-2">';
          echo '              <label for="ntpserver4" class="form-label">NTP Server 4</label>';
          echo '              <input class="form-control text-center" type="text" id="ntpserver4" name="ntpserver4"  value=""/>';
          echo '            </div>';
          echo '            <div class="selected_list"><span></span>';
          echo '              <button type="button" style="width: 100%;" class="btn btn-primary" id="updateNTP" name="updateNTP"  onClick="updateNTPServer()">Update NTP Server</button>';
          echo '            </div>';
          echo '          </div>';

          echo '          <div class="mb-2"> <span>Location</span>';
          echo '            <select  class="form-select" aria-label="Default select example" id="LocationList" name="LocationList" onChange="setLocation()" >';
                          foreach ($location as $row) {
                            echo "<option class='selectedlt' value='" . $row . "'>" . $row . "</option>";
                          }
          echo '            </select>';                
          echo '          </div>'; 

          echo '    </div>';          
          echo '    </div>';           
          echo '  </div>';  
          echo '  </div>';  


                echo '
        <!-- ================= NTP SERVER ================= -->
        <div id="divNtp0" class="card m-1 p-1" style="min-width:367px;">
        <div class="container m-0 p-2" style="width:100%;height:100%;">

            <div class="row m-0">
            <h5 class="p-0 pb-1 pt-1 mb-2 border-bottom">NTP Server</h5>
            </div>

            <div class="row align-items-start">

            <!-- LEFT -->
            <div class="col-md-6 text-center align-self-start">
            <div id="ntpAutoFields0">
            <div class="mb-2">
            <label class="form-label">NTP Server 1</label>
            <input id="ntpserver0_1"
                    type="text"
                    class="form-control text-center"
                    placeholder="pool.ntp.org">
            </div>

            <div class="mb-2">
            <label class="form-label">NTP Server 2</label>
            <input id="ntpserver0_2"
                    type="text"
                    class="form-control text-center"
                    placeholder="time.google.com">
            </div>

            <div class="mb-2">
            <label class="form-label">NTP Server 3</label>
            <input id="ntpserver0_3"
                    type="text"
                    class="form-control text-center"
                    placeholder="time.cloudflare.com">
            </div>

            <div class="mb-2">
            <label class="form-label">NTP Server 4</label>
            <input id="ntpserver0_4"
                    type="text"
                    class="form-control text-center"
                    placeholder="time.windows.com">
            </div>
            </div>

            <div id="ntpManualFields0" style="display: none;">
            <div class="mb-2">
            <label class="form-label">Manual Date Time</label>
            <input id="ntpmanual0"
                    type="text"
                    class="form-control text-center"
                    placeholder="YYYY-MM-DD HH:MM:SS">
            </div>
            </div>
            </div>

            <!-- RIGHT -->
            <div class="col-md-6">

                <label class="form-label">Sync Mode</label>
                <button id="ntpmode0"
                        type="button"
                        class="btn btn-outline-secondary dropdown-toggle w-100 d-flex justify-content-between"
                        data-bs-toggle="dropdown">
                <span id="ntpmodeLabel0">Automatic</span>
                </button>

                <ul class="dropdown-menu w-100">
                <li class="dropdown-item" onclick="setNtpMode(0,\'Automatic\')">Automatic</li>
                <li class="dropdown-item" onclick="setNtpMode(0,\'Manual\')">Manual</li>
                </ul>

                <div class="mb-2 mt-2">
                <label class="form-label">Timezone</label>
                <select id="ntptimezone0"
                        class="form-select text-center">
                </select>
                </div>

                <div class="mb-2">
                <label class="form-label">Last Sync</label>
                <input id="ntplastsync0"
                        type="text"
                        class="form-control text-center"
                        disabled
                        placeholder="--">
                </div>

            </div>

            </div>

            <div class="mt-3 text-center">
            <button type="button"
                    class="btn btn-primary w-50"
                    onclick="applyNtpServer(0)">
                Apply
            </button>
            </div>

        </div>
        </div>
        ';
        

        $ethIndex = 0;
        foreach ($EthPhyNameList as $EthPhyName) 
        {
          echo '  <div id="divEth'.$ethIndex.'" class="card m-1 p-1" style="min-width: 367px; display:block;">';
          echo '    <div class="container m-0 p-2" style="width: 100%;height: 100%;">';
          echo '      <div class="row align-items-center" >';
          echo '    <div class="row m-0">';
          echo '      <h5 id="DeviceName'.$ethIndex.'"class="p-0 pb-1 pt-1 mb-1 border-bottom">'.$EthPhyName.'</h5>';
          echo '    </div>';
          echo '        <div class="col-md-6">';
          echo '          <div class="m-0 divcenter">';
          echo '            <svg class="biEth "><use id="ethernet'.$ethIndex.'" xlink:href="dashboard.svg#ethernet2"/></svg>';
          echo '          </div>'; 
          echo '           <div class="mb-2">';
          echo '            <label for="ipaddress'.$ethIndex.'" class="form-label">IP Address</label>';
          echo '            <input id="ipaddress'.$ethIndex.'" type="text" class="form-control text-center" placeholder="IP Address">';
          echo '          </div>'; 

          echo '           <div class="mb-2">';
          echo '            <label for="netmask'.$ethIndex.'" class="form-label">Subnet Mask</label>';
          echo '            <input id="netmask'.$ethIndex.'" type="text" class="form-control text-center" placeholder="Subnet Mask">';
          echo '          </div>'; 
          echo '           <div class="mb-2">';
          echo '            <label for="gateway'.$ethIndex.'" class="form-label">Gateway</label>';
          echo '            <input id="gateway'.$ethIndex.'" type="text" class="form-control text-center" placeholder="Gateway">';
          echo '          </div>';  

          echo '        </div>';           

          echo '        <div class="col-md-6">';
          echo '            <label for="dhcpmethod'.$ethIndex.'" class="form-label">DHCP</label>';
          echo '            <button id="dhcpmethod'.$ethIndex.'" value="on" style="width: 100%;height: 100%; text-align: right;" type="button" class="btn btn-outline-secondary dropdown-toggle d-flex justify-content-between align-items-center" data-bs-toggle="dropdown" aria-expanded="false">';
          echo '            <label id="dhcpmethodLabel'.$ethIndex.'">DHCP Method</label>';
          echo '            </button>';
          echo '              <ul class="dropdown-menu col-md-8">';

                              foreach ($dhcpmethod as $dhcp) 
                              {
                                  echo '                  <li class="dropdown-item" onclick="setDHCP('.$ethIndex.',\''.$dhcp.'\')">';
                                  echo '                  <a class="dropdown-link d-flex align-items-center gap-2">';
          echo                  $dhcp;
          echo '                </a>';
          echo '                </li>';
                              }

          echo '              </ul>';           

          echo '           <div class="mb-2">';

          echo '          </div>'; 
        
          echo '           <div class="mb-2">';
          echo '            <label for="dns1'.$ethIndex.'" class="form-label">Primary DNS</label>';
          echo '            <input id="dns1'.$ethIndex.'" type="text" class="form-control text-center" placeholder="Primary DNS">';
          echo '          </div>';           
          echo '           <div class="mb-2">';
          echo '            <label for="dns2'.$ethIndex.'" class="form-label">Secondary DNS</label>';
          echo '            <input id="dns2'.$ethIndex.'" type="text" class="form-control text-center" placeholder="Secondary DNS">';
          echo '          </div>';            
          echo '           <div class="mb-2">';
          echo '            <label for="macaddress'.$ethIndex.'" class="form-label">MAC Address</label>';
          echo '            <input disabled id="macaddress'.$ethIndex.'" type="text" class="form-control text-center text-uppercase" placeholder="MAC Address">';
          echo '          </div>'; 
          echo '        </div>'; 
          echo '      </div>';          
          
          
          echo '          <div class="modal-footer">';
          echo '            <div class="row  col-6">';
          echo '                <button type="button" class="btn btn-primary" onclick="applyNetwork('.$ethIndex.')" style="width: 100%;">Apply</button>';
          echo '            </div>';
          echo '          </div>';    

          echo '  </div>';   
          echo '    </div>';   
          $ethIndex += 1;
        }

        // ===== iGate Recorder Mapping Card (Combined) =====
        echo '  <div class="card m-1 p-1" style="min-width: 367px;">';
        echo '    <div class="container m-0 p-2" style="width: 100%;height: 100%;">';
        echo '      <div class="row m-0">';
        echo '        <h5 class="p-0 pb-1 pt-1 mb-1 border-bottom">iGate Recorder Mapping</h5>';
        echo '      </div>';
        echo '      <div class="row mt-2">';
        echo '        <div class="col-12">';
        
        // ===== Recorder 1 Section =====
        echo '          <h6 class="mb-2">Recorder 1</h6>';
        
        // Recorder 1 Status
        echo '          <div class="mb-2 d-flex flex-column">';
        echo '            <span class="small text-uppercase text-muted">Recorder 1 Status</span>';
        echo '            <span id="status1_1" class="fw-semibold">IDLE</span>';
        echo '          </div>';

        // Recorder 1 URI
        echo '          <div class="mb-2">';
        echo '            <label for="recoreder1_uri_1" class="form-label">Recorder 1 URI</label>';
        echo '            <input';
        echo '              type="text"';
        echo '              id="recoreder1_uri_1"';
        echo '              name="recoreder1_uri_1"';
        echo '              class="form-control text-center"';
        echo '              placeholder="192.168.10.34:554"';
        echo '              minlength="7" maxlength="64" required>';
        echo '          </div>';

        // iGate 1/1 URI
        echo '          <div class="mb-2">';
        echo '            <label for="iGate1_uri_1" class="form-label">iGate 1/1 URI</label>';
        echo '            <input';
        echo '              type="text"';
        echo '              id="iGate1_uri_1"';
        echo '              name="iGate1_uri_1"';
        echo '              class="form-control text-center"';
        echo '              placeholder="igate1@192.168.10.44"';
        echo '              minlength="7" maxlength="64" required>';
        echo '          </div>';

        // Stream 1 controls
        echo '          <div class="row g-2 align-items-center mb-3">';
        echo '            <div class="col-auto">';
        echo '              <div class="form-check mb-0">';
        echo '                <input class="form-check-input" type="checkbox" id="recorder1_1" checked>';
        echo '              </div>';
        echo '            </div>';
        echo '            <div class="col-auto">';
        echo '              <span class="small text-muted">Stream 1</span>';
        echo '            </div>';
        echo '            <div class="col">';
        echo '              <button type="button" class="btn btn-primary w-100" onclick="applyRecSettings(1,1)">Apply</button>';
        echo '            </div>';
        echo '          </div>';

        // ===== Divider =====
        echo '          <hr class="my-3">';

        // ===== Recorder 2 Section =====
        echo '          <h6 class="mb-2">Recorder 2</h6>';
        
        // Recorder 2 Status
        echo '          <div class="mb-2 d-flex flex-column">';
        echo '            <span class="small text-uppercase text-muted">Recorder 2 Status</span>';
        echo '            <span id="status2_1" class="fw-semibold">IDLE</span>';
        echo '          </div>';

        // Recorder 2 URI
        echo '          <div class="mb-2">';
        echo '            <label for="recoreder2_uri_1" class="form-label">Recorder 2 URI</label>';
        echo '            <input';
        echo '              type="text"';
        echo '              id="recoreder2_uri_1"';
        echo '              name="recoreder2_uri_1"';
        echo '              class="form-control text-center"';
        echo '              placeholder="192.168.10.35:554"';
        echo '              minlength="7" maxlength="64" required>';
        echo '          </div>';

        // iGate 1/2 URI
        echo '          <div class="mb-2">';
        echo '            <label for="iGate2_uri_1" class="form-label">iGate 1/2 URI</label>';
        echo '            <input';
        echo '              type="text"';
        echo '              id="iGate2_uri_1"';
        echo '              name="iGate2_uri_1"';
        echo '              class="form-control text-center"';
        echo '              placeholder="igate5@192.168.10.44"';
        echo '              minlength="7" maxlength="64" required>';
        echo '          </div>';

        // Stream 2 controls
        echo '          <div class="row g-2 align-items-center mb-2">';
        echo '            <div class="col-auto">';
        echo '              <div class="form-check mb-0">';
        echo '                <input class="form-check-input" type="checkbox" id="recorder2_1" checked>';
        echo '              </div>';
        echo '            </div>';
        echo '            <div class="col-auto">';
        echo '              <span class="small text-muted">Stream 2</span>';
        echo '            </div>';
        echo '            <div class="col">';
        echo '              <button type="button" class="btn btn-primary w-100" onclick="applyRecSettings(1,2)">Apply</button>';
        echo '            </div>';
        echo '          </div>';

        echo '        </div>'; // col-12
        echo '      </div>';   // row mt-2
        echo '    </div>';     // container
        echo '  </div>';       // card
        // ===== END Card =====


      echo '<div class="card m-1 p-1" style="min-width: 367px; display: none">
              <div class="container m-0 p-2" style="width: 100%;height: 100%;">
              <div class="row align-items-center" >

              <div class="row m-0">
                <h5 id="dateTimeDiv"class="p-0 pb-1 pt-1 mb-1 border-bottom">Recorder Address Setting</h5>
              </div>

                  <div class="col-md-5">
                    <div class="mb-2 divcenter">
                      <svg class="biEth"><use  xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#server"/></svg>
                    </div>
                  </div>   

                  <div class="col-md-7">
                    <div id="divIpPLCSet" style="display: block">
                     <div class="mb-2">
                        <label for="adcRemoteAddress" class="form-label">Recorder A</label>
                        <input class="form-control text-center" type="text" id="adcRemoteAddress" name="adcRemoteAddress"  value=""/>
                      </div>
                      <div class="selected_list"><span></span>
                        <button type="button" style="width: 100%;" class="btn btn-primary" id="updateSigSense" name="updateSigSense"  onClick="updateSigSense()">Update Address</button>
                      </div>
                     <div class="mb-2">
                        <label for="plcServerAddress" class="form-label">Recorder B</label>
                        <input class="form-control text-center" type="text" id="plcServerAddress" name="plcServerAddress"  value=""/>
                      </div>
                      <div class="selected_list"><span></span>
                        <button type="button" style="width: 100%;" class="btn btn-primary" id="updateController" name="updateController"  onClick="updateController()">Update Address</button>
                      </div>
                    </div>
              </div>            
              </div>           
            </div>  
            </div>';
      echo '  </div>';             
    echo '</fieldset>';
    ?>

            </main>
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
    // Allow certain file formats
    else if($imageFileType != "bin") {
      echo '<script language="javascript">';
      echo "ModalCustomAlert('Sorry, only update.bin files are allowed.')";
      echo '</script>';
      $uploadOk = 0;
    }
    // Check if $uploadOk is set to 0 by an error
    else if ($uploadOk == 0) {
      echo '<script language="javascript">';
      echo "ModalCustomAlert('Sorry, your file was not uploaded.')";
      echo '</script>';
    // if everything is ok, try to upload file
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
</body>

</html>
