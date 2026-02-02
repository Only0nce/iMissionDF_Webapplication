<?php
// ===== SESSION CHECK =====
session_start();

if (!isset($_SESSION['UserID']) || $_SESSION['UserID'] == "") {
    echo("<script>location.href = 'login.php';</script>");
    exit;
}

$userID    = $_SESSION['UserID'];
// prefer 'userLevel' (set by check_login.php), fall back to legacy 'Status'
$userLevel = isset($_SESSION['userLevel']) ? $_SESSION['userLevel'] : (isset($_SESSION['Status']) ? $_SESSION['Status'] : 0);
$EnableRecoreder = $_SESSION['EnableRecoreder'] ?? 0;
$userName  = $_SESSION['userName'] ?? "";

// current script for active menu highlighting
$currentScript = basename($_SERVER['SCRIPT_NAME']);
?>

<!doctype html>
<html lang="en" data-bs-theme="auto">
<?php
include('dbConfig.php');
include('ListAudioGain.php');
?>
<head>
    <script src="assets/js/color-modes.js"></script>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <meta http-equiv="Cache-Control" content="no-cache">

    <title>IFZ: Voice Recorder</title>

    <link href="assets/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="dashboard.css" rel="stylesheet">

    <script src="js/jquery.min.js?v=<?php echo time(); ?>"></script>
    <script src="js/jquery-ui.js?v=<?php echo time(); ?>"></script>
    <script src="myfunctionPlayBack.js?v=<?php echo time(); ?>"></script>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>

    <link href="fontawesome-free-5.15.4-web/css/all.min.css" rel="stylesheet" />
    <link href="nouislider.min.css" rel="stylesheet">
    <link rel="stylesheet" href="nouislider_theme.css">
    <script src="nouislider.min.js"></script>

    <script src="dashboard.js?v=<?php echo time(); ?>"></script>

    <script src="https://unpkg.com/wavesurfer.js"></script>
    <script src="https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.min.js"></script>
    <script src="https://unpkg.com/wavesurfer.js@7/dist/plugins/timeline.min.js"></script>
    <script src="https://unpkg.com/wavesurfer.js@7/dist/plugins/regions.min.js"></script>


    <style>
        .search-form label {
            font-weight: 500;
        }

        #mergedDurations {
            font-size: 0.9rem;
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
                    data-bs-toggle="offcanvas"
                    data-bs-target="#sidebarMenu"
                    aria-controls="sidebarMenu"
                    aria-expanded="false"
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
    <!-- Theme toggle — เหมือน index.php -->
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

    <!-- ===== LAYOUT เหมือน index.php ===== -->
    <div class="container-fluid">
        <div class="row">
            <!-- ==== SIDEBAR (คัดลอกจาก index.php แล้วเปลี่ยน active) ==== -->
            <div class="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
                <div class="offcanvas-md offcanvas-end bg-body-tertiary"
                     tabindex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
                    <div class="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">

                        <ul class="nav flex-column">
                            <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2 <?php if($currentScript=='index.php') echo 'active'; ?>"
                                   aria-current="page" href="index.php">
                                    <svg class="bi">
                                        <use xlink:href="dashboard.svg?v=<?php echo time();?>#house-fill" />
                                    </svg>
                                    Home
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2 <?php if($currentScript=='playRecording.php') echo 'active'; ?>"
                                   href="playRecording.php">
                                    <svg class="bi">
                                        <use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#record-vinyl" />
                                    </svg>
                                    Recorder Playback
                                </a>
                            </li>                             
                            <!-- <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2 <?php if($currentScript=='eventLoggerData.php') echo 'active'; ?>"
                                   href="eventLoggerData.php">
                                    <svg class="bi">
                                        <use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg?v=<?php echo time();?>#layer-group" />
                                    </svg>
                                    Event Logger
                                </a>
                            </li> -->
                            <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2" aria-current="page"
                                    href="audiofiles">
                                    <svg class="bi">
                                        <use
                                            xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg?v=<?php echo time();?>#file-audio" />
                                    </svg>
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
                                <a class="nav-link d-flex align-items-center gap-2 <?php if($currentScript=='user.php') echo 'active'; ?>"
                                   href="user.php">
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
                                <a class="nav-link d-flex align-items-center gap-2 <?php if($currentScript=='settings.php') echo 'active'; ?>"
                                   href="settings.php">
                                    <svg class="bi">
                                        <use xlink:href="dashboard.svg?v=<?php echo time();?>#gear-wide-connected" />
                                    </svg>
                                    Settings
                                </a>
                            </li>

                            <li class="nav-item">
                                <a class="nav-link d-flex align-items-center gap-2 <?php if($currentScript=='controler.php') echo 'active'; ?>"
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
                                    <?php echo "Sign out(" . htmlspecialchars($userName) . ")"; ?>
                                </a>
                            </li>
                        </ul>

                        <hr class="my-3">
                        <div class="container m-0 p-1" style="width: 98%;">
                            <!-- ตอนนี้ยังไม่ใส่อะไร ถ้าอยากเอา card พิเศษแบบ index.php มาใส่ ก็ copy block มาวางตรงนี้ได้ -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- ==== MAIN CONTENT ==== -->
            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">

                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">Voice Recorder</h1>
                </div>

                <!-- ===== Search Form ===== -->
                <form id="searchForm" class="search-form mb-4">
                    <div class="row g-3">
                        <div class="col-md-2">
                            <label for="searchDevice" class="form-label text-white">Device</label>
                            <select class="form-select" id="searchDevice" name="searchDevice">
                                <option value="">Select Device</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <label for="searchFrequency" class="form-label text-white">Frequency (MHz)</label>
                            <input type="number" class="form-control" id="searchFrequency" name="searchFrequency" placeholder="Frequency (MHz)">
                        </div>
                        <div class="col-md-3">
                            <label for="startDate" class="form-label text-white">Start Date/Time</label>
                            <input type="datetime-local" class="form-control" id="startDate" name="startDate" step="1">
                        </div>
                        <div class="col-md-2">
                            <label for="intervalSelect" class="form-label text-white">Interval (minutes)</label>
                            <select id="intervalSelect" class="form-select">
                                <option value="0">Same Time</option>
                                <option value="5">+5 minutes</option>
                                <option value="10">+10 minutes</option>
                                <option value="15">+15 minutes</option>
                                <option value="30">+30 minutes</option>
                                <option value="45">+45 minutes</option>
                                <option value="60">+60 minutes</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="endDate" class="form-label text-white">End Date/Time</label>
                            <input type="datetime-local" class="form-control" id="endDate" name="endDate" step="1" readonly>
                        </div>
                        <div class="col-12 mt-2">
                            <button type="button" class="btn btn-success me-2" onclick="sendRecordSearch()">Search</button>
                            <button type="button" class="btn btn-secondary me-2" id="btnClear" onclick="clearSearchForm()">Clear</button>
                        </div>
                    </div>
                </form>

                <!-- ===== Result & Waveform ===== -->
                <div id="resultArea"></div>

                <div style="position: relative;">
                    <div id="mergedWaveform"></div>
                    <div id="waveRegionsOverlay"
                         style="position: absolute; top: 0; left: 0; height: 100%; width: 100%; pointer-events: none;">
                    </div>
                </div>
                <div id="mergedDurations" class="mt-3 text-white"></div>

            </main>
        </div>
    </div>

    <script src="assets/dist/js/bootstrap.bundle.min.js"></script>

    <!-- ===== JS helper เดิมของคุณ (format freq, update endTime) ===== -->
    <script>
    document.addEventListener('DOMContentLoaded', () => {
        const freqInput = document.getElementById('searchFrequency');

        freqInput.addEventListener('blur', () => {
            const raw = freqInput.value.trim();

            if (raw === '') {
                freqInput.value = "";
                return;
            }

            let num = parseFloat(raw);

            // ถ้าไม่มีจุด ให้ตีความเป็น kHz แล้วหาร 1000
            if (!raw.includes(".")) {
                num = (parseInt(raw) / 1000).toFixed(3);
            } else {
                num = num.toFixed(3);
            }

            freqInput.value = num;
        });
    });
    </script>

    <script>
    document.addEventListener('DOMContentLoaded', () => {
        const startDateInput = document.getElementById('startDate');
        const intervalSelect = document.getElementById('intervalSelect');
        const endDateInput = document.getElementById('endDate');

        function updateEndDate() {
            const startValue = startDateInput.value;
            const intervalMinutes = parseInt(intervalSelect.value);
            if (startValue) {
                const startDate = new Date(startValue);
                const endDate = new Date(startDate.getTime() + intervalMinutes * 60000);
                const year   = endDate.getFullYear();
                const month  = String(endDate.getMonth() + 1).padStart(2, '0');
                const day    = String(endDate.getDate()).padStart(2, '0');
                const hour   = String(endDate.getHours()).padStart(2, '0');
                const minute = String(endDate.getMinutes()).padStart(2, '0');
                const second = String(endDate.getSeconds()).padStart(2, '0');
                endDateInput.value = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
            } else {
                endDateInput.value = '';
            }
        }

        startDateInput.addEventListener('change', updateEndDate);
        intervalSelect.addEventListener('change', updateEndDate);
    });
    </script>

</body>
</html>
