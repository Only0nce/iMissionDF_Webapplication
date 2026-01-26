<?php
// showimg.php (FULL FILE)
// Picture viewer — list/view + download
// ✅ Delete = send WebSocket only (handled by Qt/C++), then wait "reloadweb" to reload page

session_start();
if (empty($_SESSION['UserID']) || !isset($_SESSION['userLevel'])) {
  echo("<script>location.href = 'login.php';</script>");
  exit();
}
$userName = $_SESSION['userName'] ?? "";

// =========================================================
// CONFIG  (ปรับ path รูปของคุณตรงนี้)
// =========================================================
$imgBaseDir = "/var/www/html/image";   // ✅ TODO: เปลี่ยนให้ตรงที่เก็บรูปจริง
$validExt   = ['jpg','jpeg','png','gif','webp'];
$perPage    = 24;
$currentScript = basename(__FILE__);

// =========================================================
// HELPERS
// =========================================================
function h($s): string {
  return htmlspecialchars((string)$s, ENT_QUOTES, "UTF-8");
}

function fileExt(string $file): string {
  return strtolower(pathinfo($file, PATHINFO_EXTENSION));
}

function isValidImageName(string $name, array $validExts): bool {
  if ($name === "") return false;
  $ext = fileExt($name);
  return in_array($ext, $validExts, true);
}

// ป้องกัน path traversal: รับ relative path ภายใต้ base dir เท่านั้น
function safeRealPathUnder(string $baseDir, string $relative): ?string {
  $baseReal = realpath($baseDir);
  if (!$baseReal) return null;

  $relative = str_replace(["\0"], "", $relative);
  $relative = ltrim($relative, "/\\");
  if ($relative === "") return null;

  if (strpos($relative, "..") !== false) return null;

  $candidate = $baseReal . DIRECTORY_SEPARATOR . $relative;
  $real = realpath($candidate);
  if (!$real) return null;

  if (strpos($real, $baseReal . DIRECTORY_SEPARATOR) !== 0) return null;
  if (!is_file($real)) return null;

  return $real;
}

function relPathFromBase(string $baseDir, string $absPath): string {
  $baseReal = realpath($baseDir);
  $absReal  = realpath($absPath);
  if (!$baseReal || !$absReal) return "";

  $prefix = $baseReal . DIRECTORY_SEPARATOR;
  if (strpos($absReal, $prefix) === 0) {
    return substr($absReal, strlen($prefix));
  }
  return "";
}

function fmtBytes($bytes): string {
  $b = (float)$bytes;
  if ($b < 1024) return number_format($b, 0) . " B";
  if ($b < 1024*1024) return number_format($b/1024, 1) . " KB";
  if ($b < 1024*1024*1024) return number_format($b/(1024*1024), 1) . " MB";
  return number_format($b/(1024*1024*1024), 2) . " GB";
}

function buildQuery(array $over = []): string {
  $base = $_GET;
  foreach ($over as $k=>$v) {
    if ($v === null) unset($base[$k]);
    else $base[$k] = $v;
  }
  return http_build_query($base);
}

// =========================================================
// INPUT
// =========================================================
$relFile = "";
$action  = "";

if (isset($_GET['file'])) {
  $relFile = trim(urldecode((string)$_GET['file']));
  $relFile = ltrim($relFile, "/\\");
}
if (isset($_GET['action'])) {
  $action = (string)$_GET['action'];
}

$q    = trim((string)($_GET['q'] ?? ""));
$day  = trim((string)($_GET['day'] ?? ""));     // optional filter

$page   = max(1, (int)($_GET['page'] ?? 1));
$offset = ($page - 1) * $perPage;

// =========================================================
// DOWNLOAD (single image)
// =========================================================
if ($action === "download" && $relFile !== "") {
  if (!isValidImageName(basename($relFile), $validExt)) {
    header("HTTP/1.0 404 Not Found");
    echo "Image not found or invalid file type.";
    exit();
  }

  $real = safeRealPathUnder($imgBaseDir, $relFile);
  if (!$real) {
    header("HTTP/1.0 404 Not Found");
    echo "Image not found or invalid file type.";
    exit();
  }

  $mime = @mime_content_type($real);
  if (!$mime) $mime = "application/octet-stream";

  header('Content-Description: File Transfer');
  header('Content-Type: ' . $mime);
  header('Content-Disposition: attachment; filename="' . basename($relFile) . '"');
  header('Content-Length: ' . filesize($real));
  header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
  header('Pragma: no-cache');

  readfile($real);
  exit();
}

// =========================================================
// MODE: viewer or list
// =========================================================
$showError    = false;
$errorMsg     = "";
$isViewerMode = ($relFile !== "");

// list
$imgs = [];
$total = 0;

// viewer data
$viewer = null;

$baseReal = realpath($imgBaseDir);
if (!$baseReal) {
  $showError = true;
  $errorMsg  = "Image base directory not found: " . $imgBaseDir;
} else {
  if ($isViewerMode) {
    if (!isValidImageName(basename($relFile), $validExt)) {
      $showError = true;
      $errorMsg  = "Image not found or invalid file type.";
    } else {
      $real = safeRealPathUnder($imgBaseDir, $relFile);
      if (!$real) {
        $showError = true;
        $errorMsg  = "Image not found or invalid file type.";
      } else {
        $viewer = [
          'rel'   => $relFile,
          'abs'   => $real,
          'mtime' => @filemtime($real) ?: 0,
          'size'  => @filesize($real) ?: 0,
        ];
      }
    }
  } else {
    $all = [];
    $it = new RecursiveIteratorIterator(
      new RecursiveDirectoryIterator($baseReal, FilesystemIterator::SKIP_DOTS)
    );

    $qLower   = strtolower($q);
    $dayLower = strtolower($day);

    foreach ($it as $fileInfo) {
      /** @var SplFileInfo $fileInfo */
      if (!$fileInfo->isFile()) continue;

      $name = $fileInfo->getFilename();
      if (!isValidImageName($name, $validExt)) continue;

      $abs = $fileInfo->getPathname();
      $rel = relPathFromBase($imgBaseDir, $abs);
      if ($rel === "") continue;

      $relLower = strtolower($rel);

      if ($qLower !== "" && strpos($relLower, $qLower) === false) continue;
      if ($dayLower !== "" && strpos($relLower, $dayLower) === false) continue;

      $all[] = [
        'rel'   => $rel,
        'name'  => $name,
        'mtime' => $fileInfo->getMTime(),
        'size'  => $fileInfo->getSize(),
      ];
    }

    usort($all, fn($a,$b) => $b['mtime'] <=> $a['mtime']);

    $total = count($all);
    $imgs  = array_slice($all, $offset, $perPage);
  }
}

// =========================================================
// URL base for preview (<img src=...>) if under /var/www/html
// =========================================================
$urlBase = "";
$baseReal2 = realpath($imgBaseDir);
if ($baseReal2 && strpos($baseReal2, "/var/www/html/") === 0) {
  $urlBase = "/" . substr($baseReal2, strlen("/var/www/html/"));
}
?>
<!doctype html>
<html lang="en" data-bs-theme="auto">
<head>
  <script src="assets/js/color-modes.js"></script>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>IFZ: Picture Viewer</title>
  <link href="assets/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="dashboard.css" rel="stylesheet">
  <script src="assets/dist/js/bootstrap.bundle.min.js"></script>

  <!-- ✅ JS ของหน้านี้ -->
  <script src="showimg.js?v=<?php echo time();?>"></script>

  <style>
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace; font-size: 0.88rem; }
    .sticky-actions { position: sticky; top: 64px; z-index: 50; background: var(--bs-body-bg); padding-top: 8px; padding-bottom: 8px; }
    .img-card { border-radius: 16px; overflow: hidden; }
    .thumb { width: 100%; height: 190px; object-fit: cover; background: rgba(255,255,255,0.04); }
    .viewer-img { width: 100%; max-height: 70vh; object-fit: contain; background: rgba(0,0,0,0.06); border-radius: 12px; }
  </style>
</head>

<header class="navbar sticky-top flex-md-nowrap p-0 shadow" style="background-color:#000000DD;">
  <svg class="bi_logo m-1"><use xlink:href="dashboard.svg?v=<?php echo time();?>#logo"></use></svg>
  <ul class="navbar-nav flex-row d-md-none">
    <li class="nav-item text-nowrap">
      <button class="nav-link px-3 text-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu">
        <svg class="bi"><use xlink:href="dashboard.svg?v=<?php echo time();?>#list"/></svg>
      </button>
    </li>
  </ul>
  <div id="navbarSearch" class="navbar-search w-100 collapse">
    <input class="form-control w-100 rounded-0 border-0" type="text" placeholder="Search" aria-label="Search">
  </div>
</header>

<body>
<div class="container-fluid">
  <div class="row">

    <!-- sidebar -->
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
                <svg class="bi"><use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#record-vinyl" /></svg>
                Recorder Playback
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" aria-current="page" href="eventLoggerData.php">
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
              <a class="nav-link d-flex align-items-center gap-2 active" href="showimg.php">
                <svg class="bi"><use xlink:href="dashboard.svg?v=<?php echo time();?>#picture" /></svg>
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
              <a class="nav-link d-flex align-items-center gap-2" href="controler.php">
                <svg class="bi"><use xlink:href="dashboard.svg?v=<?php echo time();?>#plus-circle"/></svg>
                Register Device
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" href="logout.php">
                <svg class="bi"><use xlink:href="dashboard.svg?v=<?php echo time();?>#door-closed"/></svg>
                <?php echo "Sign out(" . h($userName) . ")"; ?>
              </a>
            </li>
          </ul>

        </div>
      </div>
    </div>

    <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-2 border-bottom">
        <h1 class="h2"><?php echo $isViewerMode ? "Picture Viewer" : "Pictures"; ?></h1>

        <?php if ($isViewerMode): ?>
          <a href="<?php echo h($currentScript . "?" . buildQuery(['file'=>null,'action'=>null,'page'=>null])); ?>" class="btn btn-outline-secondary">
            <svg class="bi"><use xlink:href="dashboard.svg#arrow-left"/></svg>
            Back to List
          </a>
        <?php endif; ?>
      </div>

      <?php if($showError): ?>
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>Warning!</strong> <?php echo h($errorMsg); ?>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <a href="javascript:history.back()" class="btn btn-secondary">
          <svg class="bi"><use xlink:href="dashboard.svg#arrow-left"/></svg>
          Back
        </a>

      <?php else: ?>

        <?php if ($isViewerMode && $viewer): ?>
          <!-- SINGLE VIEW -->
          <div class="card img-card shadow-sm" data-rel="<?php echo h($viewer['rel']); ?>">
            <div class="card-body">
              <div class="d-flex flex-wrap gap-2 align-items-center justify-content-between">
                <div>
                  <div class="mono text-body-secondary">File</div>
                  <div class="mono fw-bold"><?php echo h($viewer['rel']); ?></div>
                  <div class="text-body-secondary small mt-1">
                    <?php echo date("Y-m-d H:i:s", (int)$viewer['mtime']); ?>
                    · <?php echo h(fmtBytes((int)$viewer['size'])); ?>
                  </div>
                </div>

                <div class="d-flex gap-2 flex-wrap">
                  <a href="<?php echo h($currentScript . "?" . buildQuery(['action'=>"download"])); ?>"
                     class="btn btn-primary">
                    <svg class="bi"><use xlink:href="dashboard.svg#download"/></svg>
                    Download
                  </a>

                  <!-- ✅ Delete = WS only -->
                  <button type="button"
                          class="btn btn-danger"
                          data-file="<?php echo h($viewer['rel']); ?>"
                          onclick="return window.SHOWIMG_deleteOneWS(this);">
                    <svg class="bi"><use xlink:href="dashboard.svg#trash"/></svg>
                    Delete
                  </button>

                  <a href="<?php echo h($currentScript . "?" . buildQuery(['file'=>null,'action'=>null,'page'=>null])); ?>"
                     class="btn btn-secondary">
                    <svg class="bi"><use xlink:href="dashboard.svg#arrow-left"/></svg>
                    Back
                  </a>
                </div>
              </div>

              <hr class="my-3">

              <?php
                $imgUrl = ($urlBase !== "") ? ($urlBase . "/" . $viewer['rel']) : ("");
              ?>

              <?php if ($imgUrl === ""): ?>
                <div class="alert alert-warning">
                  Base dir ไม่อยู่ใต้ /var/www/html จึงไม่สามารถ preview รูปผ่าน URL ได้ (แต่ Download ยังใช้ได้)
                </div>
              <?php else: ?>
                <img class="viewer-img" src="<?php echo h($imgUrl); ?>" alt="">
              <?php endif; ?>

            </div>
          </div>

        <?php else: ?>
          <!-- LIST + FILTER + BULK -->
          <form class="row g-2 align-items-end mb-3" method="GET">
            <div class="col-12 col-md-6">
              <label class="form-label">Search (path/name)</label>
              <input type="text" class="form-control" name="q" value="<?php echo h($q); ?>" placeholder="e.g. 2026-01-22 or camera1">
            </div>
            <div class="col-12 col-md-4">
              <label class="form-label">Day filter (contains)</label>
              <input type="text" class="form-control" name="day" value="<?php echo h($day); ?>" placeholder="e.g. 2026-01-22">
            </div>
            <div class="col-12 col-md-2 d-grid">
              <button class="btn btn-primary" type="submit">Filter</button>
            </div>
          </form>

          <?php if ($total <= 0): ?>
            <div class="alert alert-info">No image files found</div>
          <?php else: ?>

            <div class="sticky-actions border-bottom mb-3">
              <div class="d-flex flex-wrap gap-2 align-items-center">
                <button type="button" class="btn btn-outline-secondary btn-sm" onclick="SHOWIMG_toggleAll(true)">Select All</button>
                <button type="button" class="btn btn-outline-secondary btn-sm" onclick="SHOWIMG_toggleAll(false)">Clear</button>

                <!-- ✅ Bulk Delete = WS only -->
                <button type="button" class="btn btn-danger btn-sm" onclick="return window.SHOWIMG_sendDeleteSelectedWS();">
                  <svg class="bi"><use xlink:href="dashboard.svg#trash"/></svg>
                  Delete Selected
                </button>

                <span class="text-body-secondary small ms-2">
                  Selected: <span id="selCount">0</span>
                  · Total: <?php echo (int)$total; ?>
                </span>
              </div>
            </div>

            <div class="row g-3">
              <?php foreach ($imgs as $it): ?>
                <?php
                  $thumbUrl = ($urlBase !== "") ? ($urlBase . "/" . $it['rel']) : "";
                ?>
                <div class="col-12 col-md-6 col-lg-4">
                  <div class="card img-card h-100 shadow-sm log-card" data-rel="<?php echo h($it['rel']); ?>">
                    <?php if ($thumbUrl !== ""): ?>
                      <img class="thumb" src="<?php echo h($thumbUrl); ?>" alt="">
                    <?php else: ?>
                      <div class="thumb d-flex align-items-center justify-content-center text-body-secondary">
                        (no preview)
                      </div>
                    <?php endif; ?>

                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-start gap-2">
                        <div class="form-check">
                          <input class="form-check-input imgCheck"
                                 type="checkbox"
                                 value="<?php echo h($it['rel']); ?>"
                                 onchange="SHOWIMG_updateCount()">
                        </div>

                        <div class="flex-grow-1">
                          <div class="mono text-truncate" title="<?php echo h($it['rel']); ?>">
                            <?php echo h($it['rel']); ?>
                          </div>
                          <div class="text-body-secondary small mt-1">
                            <?php echo date("Y-m-d H:i:s", (int)$it['mtime']); ?>
                            · <?php echo h(fmtBytes((int)$it['size'])); ?>
                          </div>
                        </div>
                      </div>

                      <div class="mt-3 d-flex gap-2 flex-wrap">
                        <a class="btn btn-sm btn-primary"
                           href="<?php echo h($currentScript . "?" . buildQuery(['file'=>$it['rel'], 'action'=>null, 'page'=>null])); ?>">
                          View
                        </a>

                        <a class="btn btn-sm btn-outline-secondary"
                           href="<?php echo h($currentScript . "?" . buildQuery(['file'=>$it['rel'], 'action'=>"download", 'page'=>null])); ?>">
                          Download
                        </a>

                        <!-- ✅ Delete = WS only -->
                        <button type="button"
                                class="btn btn-sm btn-danger"
                                data-file="<?php echo h($it['rel']); ?>"
                                onclick="return window.SHOWIMG_deleteOneWS(this);">
                          Delete
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              <?php endforeach; ?>
            </div>

            <?php
              $pages = (int)ceil($total / $perPage);
              if ($pages > 1):
                $prev = max(1, $page - 1);
                $next = min($pages, $page + 1);
            ?>
              <nav class="mt-4">
                <ul class="pagination">
                  <li class="page-item <?php echo ($page <= 1) ? "disabled" : ""; ?>">
                    <a class="page-link" href="<?php echo h($currentScript . "?" . buildQuery(['page'=>$prev])); ?>">Prev</a>
                  </li>

                  <?php
                    $start = max(1, $page - 3);
                    $end   = min($pages, $page + 3);
                    if ($start > 1) {
                      echo '<li class="page-item"><a class="page-link" href="'.h($currentScript."?".buildQuery(['page'=>1])).'">1</a></li>';
                      if ($start > 2) echo '<li class="page-item disabled"><span class="page-link">…</span></li>';
                    }
                    for ($p=$start; $p<=$end; $p++){
                      $active = ($p === $page) ? "active" : "";
                      echo '<li class="page-item '.$active.'"><a class="page-link" href="'.h($currentScript."?".buildQuery(['page'=>$p])).'">'.$p.'</a></li>';
                    }
                    if ($end < $pages) {
                      if ($end < $pages - 1) echo '<li class="page-item disabled"><span class="page-link">…</span></li>';
                      echo '<li class="page-item"><a class="page-link" href="'.h($currentScript."?".buildQuery(['page'=>$pages])).'">'.$pages.'</a></li>';
                    }
                  ?>

                  <li class="page-item <?php echo ($page >= $pages) ? "disabled" : ""; ?>">
                    <a class="page-link" href="<?php echo h($currentScript . "?" . buildQuery(['page'=>$next])); ?>">Next</a>
                  </li>
                </ul>
              </nav>
            <?php endif; ?>

          <?php endif; ?>
        <?php endif; ?>

      <?php endif; ?>
    </main>

  </div>
</div>
</body>
</html>
