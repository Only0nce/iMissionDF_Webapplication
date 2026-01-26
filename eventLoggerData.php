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
    <meta http-equiv="Cache-Control" content="no-cache">
    <title>IFZ: SigSense PLC Analog Module</title>
    <link href="assets/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="dashboard.css" rel="stylesheet">
    <script src="dashboard.js"></script>
    <!-- <script src="index_socket.client.js?v=<?php echo time();?>"></script> -->
    <link href="fontawesome-free-5.15.4-web/css/all.min.css" rel="stylesheet"/>
  </head>

   <!-- Modal Alert-->
  <div class="modal fade" id="ModalAlert" tabindex="-1" aria-labelledby="Alert" aria-hidden="true" >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="Alert">Alert</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Unable to connect to the SigSense High Speed ADC PLC Module.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
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
    <div class="container-fluid">
      <div class="row">
        <div class="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
          <div class="offcanvas-md offcanvas-end bg-body-tertiary" tabindex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
                <div class="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
              <ul class="nav flex-column">
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" href="index.php">
                    <svg class="bi"><use xlink:href="dashboard.svg?v=<?php echo time();?>#house-fill"/></svg>
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
                  <a class="nav-link d-flex align-items-center gap-2 <?php if($deviceName == "") echo 'active'; ?> " aria-current="page" href="javascript:location.reload();">
                    <svg class="bi"><use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg?v=<?php echo time();?>#layer-group"/></svg>
                    Event Logger
                  </a>
                </li>
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
            <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase"> <span>Device Manager</span> </h6>

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
                    <svg class="bi">
                        <use xlink:href="dashboard.svg?v=<?php echo time();?>#logdf" />
                    </svg>
                    DFlog Viewer 
                </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="dfrole.php">
                  <svg class="bi"><use xlink:href="dashboard.svg#DFGroup"/></svg>
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
                <svg class="bi"><use xlink:href="dashboard.svg?v=<?php echo time();?>#gear-wide-connected"/></svg>
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
                <?php echo "Sign out(" .$userName.")" ?>
              </a>
            </li>
          </ul>
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


  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Event Logger Data</h1>
    <div class="btn-toolbar mb-2 mb-md-0"></div>
  </div>


<div id= "div0" class=" row row-cols-sm-1 row-cols-md-1 row-cols-lg-2 row-cols-xl-2 ">

<?php
include('dbConfig.php');

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch data ordered by newest first
$sql = "SELECT id, event_time, event_name, dac_file_path, url, signal_phase, timestamp FROM eventlogger ORDER BY timestamp DESC";
$result = $conn->query($sql);
?>

<table class="styled-table">
    <tr>
        <th>ID</th>
        <th>Date Time</th>
        <th>Event Time</th>
        <th>Event Name</th>
        <th>Phase</th>
        <th>Raw</th>
    </tr>

    <?php
    if ($result->num_rows > 0) 
    {
        $id=0;
        while ($row = $result->fetch_assoc()) {
            $filePath = str_replace("/usr/share/apache2/default-site/htdocs", "", $row['dac_file_path']);
            $id = $id+1;
            echo "<tr>
                    <td>{$id}</td>
                    <td>{$row['timestamp']}</td>
                    <td>{$row['event_time']}</td>
                    <td>{$row['event_name']}</td>
                    <td>{$row['signal_phase']}</td>
                    
                    <td>
                        <a href='$filePath' download>
                            <svg class='bi'><use xlink:href='fontawesome-free-5.15.4-web/sprites/solid.svg?v=<?php echo time();?>#download'/></svg>                            
                        </a>
                    </td>
                </tr>";
        }
    } else {
        echo "<tr><td colspan='6'>No records found</td></tr>";
    }
    ?>

</table>

</div> <!-- div0 -->



</fieldset>  
</main>

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
<script src="slider.js"></script>


</html>