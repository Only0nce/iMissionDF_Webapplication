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
?>
<?php
include_once('dbConfig.php');

function setUserMessage($type, $text)
{
  $_SESSION['user_message'] = array('type' => $type, 'text' => $text);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
  $action = isset($_POST['action']) ? $_POST['action'] : '';
  $isAdmin = ($userLevelAdmin == 1);

  if ($action === 'create_user')
  {
    if (!$isAdmin)
    {
      setUserMessage('danger', 'Permission denied.');
    }
    else
    {
      $username = isset($_POST['username']) ? $_POST['username'] : '';
      $newPassword = isset($_POST['new_password']) ? $_POST['new_password'] : '';
      $confirmPassword = isset($_POST['confirm_password']) ? $_POST['confirm_password'] : '';

      if (($username === '') || ($newPassword === '') || ($confirmPassword === ''))
      {
        setUserMessage('danger', 'All fields are required.');
      }
      else if ($newPassword !== $confirmPassword)
      {
        setUserMessage('danger', 'Password confirmation does not match.');
      }
      else
      {
        $userlevelValue = 2;
        $stmt = $conn->prepare("INSERT INTO member (username, password, userlevel) VALUES (?, CONCAT('*', UPPER(SHA1(UNHEX(SHA1(?))))) , ?)");
        if (!$stmt)
        {
          setUserMessage('danger', 'Failed to prepare user create.');
        }
        else
        {
          $stmt->bind_param("ssi", $username, $newPassword, $userlevelValue);
          if ($stmt->execute())
          {
            setUserMessage('success', 'User created.');
          }
          else
          {
            setUserMessage('danger', 'Create failed: ' . $stmt->error);
          }
          $stmt->close();
        }
      }
    }
  }
  else
  {
    if ($action === '')
    {
      $action = 'update_user';
    }

    $targetUserId = isset($_POST['user_id']) ? (int)$_POST['user_id'] : 0;
    if ($targetUserId <= 0)
    {
      setUserMessage('danger', 'Invalid user.');
      header("Location: user.php");
      exit();
    }

    $isSelf = ($targetUserId === (int)$userID);
    if (!$isAdmin && !$isSelf)
    {
      setUserMessage('danger', 'Permission denied.');
      header("Location: user.php");
      exit();
    }

    if ($action === 'update_user')
    {
      $newPassword = isset($_POST['new_password']) ? $_POST['new_password'] : '';
      $confirmPassword = isset($_POST['confirm_password']) ? $_POST['confirm_password'] : '';

      if (($newPassword !== '') || ($confirmPassword !== ''))
      {
        if (($newPassword === '') || ($confirmPassword === ''))
        {
          setUserMessage('danger', 'Password fields are required.');
          header("Location: user.php");
          exit();
        }
        else if ($newPassword !== $confirmPassword)
        {
          setUserMessage('danger', 'Password confirmation does not match.');
          header("Location: user.php");
          exit();
        }
      }

      if (($newPassword === '') && ($confirmPassword === ''))
      {
        setUserMessage('warning', 'No changes to save.');
        header("Location: user.php");
        exit();
      }

      $stmt = $conn->prepare("UPDATE member SET password=CONCAT('*', UPPER(SHA1(UNHEX(SHA1(?))))) WHERE id=?");
      if ($stmt)
      {
        $stmt->bind_param("si", $newPassword, $targetUserId);
      }

      if (!$stmt)
      {
        setUserMessage('danger', 'Failed to prepare update.');
      }
      else if ($stmt->execute())
      {
        setUserMessage('success', 'User updated.');
      }
      else
      {
        setUserMessage('danger', 'Update failed: ' . $stmt->error);
      }
      if ($stmt)
      {
        $stmt->close();
      }
    }
    else if ($action === 'delete_user')
    {
      $stmt = $conn->prepare("DELETE FROM member WHERE id=?");
      if (!$stmt)
      {
        setUserMessage('danger', 'Failed to prepare delete.');
      }
      else
      {
        $stmt->bind_param("i", $targetUserId);
        if ($stmt->execute())
        {
          if ($stmt->affected_rows > 0)
          {
            setUserMessage('success', 'User removed.');
          }
          else
          {
            setUserMessage('warning', 'User not found.');
          }
        }
        else
        {
          setUserMessage('danger', 'Delete failed: ' . $stmt->error);
        }
        $stmt->close();
      }
    }
    else
    {
      setUserMessage('warning', 'Unknown action.');
    }
  }

  header("Location: user.php");
  exit();
}

$userMessage = null;
if (!empty($_SESSION['user_message']))
{
  $userMessage = $_SESSION['user_message'];
  unset($_SESSION['user_message']);
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
    <title>IFZ: SigSense PLC Analog Module</title>
    <link href="assets/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="dashboard.css" rel="stylesheet">
    <script src="assets/dist/js/bootstrap.bundle.min.js"></script>
    <script src="dashboard.js"></script>
    <!-- <script src="user.js"></script> -->

</head>


<header class="navbar sticky-top flex-md-nowrap p-0 shadow" style="background-color:#000000DD;">
    <svg class="bi_logo m-1">
        <use xlink:href="dashboard.svg#logo"></use>
    </svg>
    <ul class="navbar-nav flex-row d-md-none">
        <li class="nav-item text-nowrap">
            <button class="nav-link px-3 text-white" type="button" data-bs-toggle="offcanvas"
                data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false"
                aria-label="Toggle navigation">
                <svg class="bi">
                    <use xlink:href="dashboard.svg#list" />
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
                <use href="dashboard.svg#circle-half"></use>
            </svg>
            <span class="visually-hidden" id="bd-theme-text">Toggle theme</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
            <li>
                <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="light"
                    aria-pressed="false">
                    <svg class="bi me-2 opacity-50" width="1em" height="1em">
                        <use href="dashboard.svg#sun-fill"></use>
                    </svg>
                    Light
                    <svg class="bi ms-auto d-none" width="1em" height="1em">
                        <use href="dashboard.svg#check2"></use>
                    </svg>
                </button>
            </li>
            <li>
                <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="dark"
                    aria-pressed="false">
                    <svg class="bi me-2 opacity-50" width="1em" height="1em">
                        <use href="dashboard.svg#moon-stars-fill"></use>
                    </svg>
                    Dark
                    <svg class="bi ms-auto d-none" width="1em" height="1em">
                        <use href="dashboard.svg#check2"></use>
                    </svg>
                </button>
            </li>
            <li>
                <button type="button" class="dropdown-item d-flex align-items-center active" data-bs-theme-value="auto"
                    aria-pressed="true">
                    <svg class="bi me-2 opacity-50" width="1em" height="1em">
                        <use href="dashboard.svg#circle-half"></use>
                    </svg>
                    Auto
                    <svg class="bi ms-auto d-none" width="1em" height="1em">
                        <use href="dashboard.svg#check2"></use>
                    </svg>
                </button>
            </li>
        </ul>
    </div>
    <?php
  include_once('dbConfig.php');  
  $roleID = -1;
  $rowUserList = array();

if ($userLevelAdmin == 1)
  $strSQL = "SELECT member.id, member.Username, member.Password, member.userlevel FROM member WHERE Username!='supperadmin'";
else
  $strSQL = "SELECT member.id, member.Username, member.Password, member.userlevel FROM member WHERE id=".$userID;

  $rowUserListQuery = mysqli_query($conn,$strSQL);
  if (!$rowUserListQuery) 
  {
      echo ("Database deviceList Error: ".$conn->error);
      exit();
  }
  if ($rowUserListQuery->num_rows > 0)
  {
    while($row = $rowUserListQuery->fetch_assoc()) 
    {
      array_push($rowUserList, $row);
    }
  }
  else
  {
    // echo ("Database userlist is empty: ".$strSQL);
  }
?>
    <!-- Modal confirmToDeleteUser-->
    <div class="modal fade" id="confirmToDeleteUser" tabindex="-1" aria-labelledby="confirmToDeleteUserLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmToDeleteUserLabel">Please Confirm</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    ...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Remove</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal confirmToEditUser-->
    <div class="modal fade" id="confirmToEditClient" tabindex="-1" aria-labelledby="confirmToEditClientLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmToEditClientLabel">Please Confirm</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    ...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Save
                        changes</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Alert-->
    <div class="modal fade" id="ModalUserAlert" tabindex="-1" aria-labelledby="Alert" aria-hidden="true">
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
    <div class="modal fade" id="ModalAlert" tabindex="-1" aria-labelledby="Alert" aria-hidden="true">
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

    <div class="modal fade" id="ModalNewUser" tabindex="-1" aria-labelledby="newdevice" aria-hidden="true"
        style="--bs-modal-width: 50%;">
        <div class="modal-dialog">
            <div class="modal-content">
                <form method="post" action="user.php">
                    <input type="hidden" name="action" value="create_user">
                <div class="modal-header">
                    <h5 class="modal-title" id="newdevice">Insert New User</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <?php
      {  
        include('ListVariable.php');              
        echo '  <div class="container m-0 p-1" style="min-width: 100%;">';
        echo '    <div class="card m-0 p-2" style="width: 100%;height: 100%;">';
        echo '      <div class="row align-items-center" >';
        echo '        <div class="col-md-4">';
        echo '          <div class="mb-3">';
        echo '            <svg class="biDeviceList rounded-start"><use id="icon0" xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#user-plus"/></svg>';
        echo '          </div>'; 
        echo '        </div>';  
        echo '        <div class="col-md-8">';
        echo '           <div class="mb-3">';
        echo '            <label for="username0" class="form-label">User Name</label>';
        echo '            <input id="username0" name="username" type="username" class="form-control text-center" value="">';
        echo '          </div>';          
        echo '          <div class="mb-3">';
        echo '            <label for="newpassword0" class="form-label">New Password</label>';
        echo '            <input id="newpassword0" name="new_password" type="password" class="form-control text-center" value="">';
        echo '          </div>';   
        echo '          <div class="mb-3">';
        echo '            <label for="cfpassword0" class="form-label">Confirm Password</label>';
        echo '            <input id="cfpassword0" name="confirm_password" type="password" class="form-control text-center" value="">';
        echo '          </div>';                 
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
                            <button type="submit" class="btn btn-primary" style="width: 100%;">Apply</button>
                        </div>
                        <div class="col-6">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                                style="width: 100%;">Close</button>
                        </div>
                    </div>

                </div>
                </form>
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
                            <span>Device Manager</span>
                        </h6>

                        <ul class="nav flex-column mb-auto">
                            <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2 active" href="user.php">
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
                                    <svg class="bi">
                                        <use xlink:href="dashboard.svg?v=<?php echo time();?>#logdf" />
                                    </svg>
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

            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <div
                    class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">User management</h1>
                    <div class="btn-toolbar mb-2 mb-md-0">
                    </div>
                </div>
                <?php
      if ($userMessage)
      {
        $alertType = 'info';
        if (isset($userMessage['type']) && in_array($userMessage['type'], array('success', 'danger', 'warning', 'info'), true))
        {
          $alertType = $userMessage['type'];
        }
        $alertText = isset($userMessage['text']) ? $userMessage['text'] : '';
        echo '<div class="alert alert-' . htmlspecialchars($alertType, ENT_QUOTES) . ' mt-2" role="alert">';
        echo htmlspecialchars($alertText, ENT_QUOTES);
        echo '</div>';
      }
    ?>

                <?php
    {      
      echo '<div class="row row-cols-sm-1 row-cols-md-2 row-cols-lg-4 row-cols-xl-6">';
      foreach ($rowUserList as $rowUser) 
      {        
        $userEdit = ($rowUser['id'] == $userID);
        $canEditPassword = $userEdit || ($userLevelAdmin == 1);
        echo '  <div id="container'.$rowUser["id"].'" class="container m-0 p-1 align-items-center" style="min-width: 388px;">';

        echo '    <div class="card m-0 p-2" style="width: 100%;height: 100%;">';
        echo '      <form method="post" action="user.php" class="h-100">';
        echo '        <input type="hidden" name="user_id" value="'.$rowUser["id"].'">';
        echo '        <div class="row align-items-center" >';
        echo '        <div class="col-md-4">';
        echo '          <div class="mb-3">';
        if ($rowUser["userlevel"] == 1)
        {
          echo '            <svg class="biDeviceList rounded-start"><use id="icon0" xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#user-tie"/></svg>';
        }
        else
        {
          echo '            <svg class="biDeviceList rounded-start"><use id="icon0" xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#user"/></svg>';
        }
        echo '          </div>'; 
        echo '        </div>';  
        echo '        <div class="col-md-8">';
        echo '           <div class="mb-3" >';
        echo '            <label for="username'.$rowUser["id"].'" class="form-label">User Name</label>';
       
        if ($canEditPassword)
        {
          echo '            <input disabled id="username'.$rowUser["id"].'" type="username" class="form-control text-center" value="'.$rowUser["Username"].'">';
          echo '          </div>';          
          echo '          <div class="mb-3">';
          echo '            <label for="newpassword'.$rowUser["id"].'" class="form-label">New Password</label>';
          echo '            <input id="newpassword'.$rowUser["id"].'" name="new_password" type="password" class="form-control text-center" value="">';
          echo '          </div>';   
          echo '          <div class="mb-3">';
          echo '            <label for="cfpassword'.$rowUser["id"].'" class="form-label">Confirm Password</label>';
          echo '            <input id="cfpassword'.$rowUser["id"].'" name="confirm_password" type="password" class="form-control text-center" value="">';
          echo '          </div>';
          
        }
        else
        {
          echo '            <input disabled id="username'.$rowUser["id"].'" type="username" class="form-control text-center" value="'.$rowUser["Username"].'">';
          echo '          </div>';          

        }

        echo '        </div>';


        echo '      </div>  ';          
    

        if (($userEdit) || ($userLevelAdmin == 1))
        {
          echo '          <div class="row mb-3 " style="height:30px">';
          echo '</div>';
          echo '          <div class="row mb-3 " style="position:absolute; bottom:5px; width:100%">';
          if (($userLevelAdmin == 1) || ($userEdit))
          {
            echo '                <div class="col-6">';
            echo '                   <button type="submit" name="action" value="update_user" class="btn btn-primary" style="width:100%;">Apply</button>';
            echo '                </div>';
            echo '                <div class="col-6">';
            echo '                    <button type="submit" name="action" value="delete_user" class="btn btn-warning" style="width:100%;">Remove</button>';
            echo '                </div>';
          }
          echo '          </div>';
        }
        echo '      </form>';
        echo '    </div>';        
        echo '  </div>  ';  
      }
      echo '</div>';
    }
    ?>

            </main>
        </div>
    </div>
</body>

</html>
