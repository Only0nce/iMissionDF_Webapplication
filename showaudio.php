<?php
declare(strict_types=1);

session_start();

$audioRoot = __DIR__ . '/audiofiles';
$audioUrlBase = 'audiofiles';

/*
 * IFZ-AUDIO-UI-PERF PATCH
 * Large archive acceleration:
 * - The page may contain 20,000+ recordings.
 * - Avoid recursive disk scan on every page load.
 * - Use ?refresh=1 to force rebuild.
 */
$cachePath = '/tmp/ifz_audio_archive_index.json';
$cacheTtlSeconds = 60;
$allowedExt = array('wav'=>true, 'mp3'=>true, 'ogg'=>true, 'flac'=>true, 'm4a'=>true);
$perPageOptions = array(9, 12, 24, 48);
$defaultPerPage = 9;

function h($s) {
    return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function path_norm($p) {
    return str_replace('\\', '/', (string)$p);
}

function starts_with_compat($haystack, $needle) {
    $haystack = (string)$haystack;
    $needle = (string)$needle;
    return $needle === '' || strncmp($haystack, $needle, strlen($needle)) === 0;
}

function human_size($bytes) {
    $bytes = (int)$bytes;
    $units = array('B', 'KB', 'MB', 'GB', 'TB');
    $size = (float)$bytes;
    $i = 0;
    while ($size >= 1024 && $i < count($units) - 1) {
        $size /= 1024;
        $i++;
    }
    return $i === 0 ? sprintf('%d B', (int)$size) : sprintf('%.1f %s', $size, $units[$i]);
}

function rel_url($relativePath) {
    $parts = explode('/', path_norm($relativePath));
    $parts = array_map('rawurlencode', $parts);
    return implode('/', $parts);
}

function parse_audio_meta($relativePath, $filename, $mtime) {
    $parts = explode('/', path_norm($relativePath));
    $folder = count($parts) > 1 ? $parts[0] : 'Root';

    $meta = array(
        'folder' => $folder,
        'channel' => $folder,
        'frequency' => '',
        'fileDate' => '',
        'fileMonth' => '',
        'fileYear' => '',
        'fileTime' => '',
        'displayTitle' => $filename,
        'mtimeDate' => date('Y-m-d', $mtime),
        'mtimeMonth' => date('Y-m', $mtime),
        'mtimeYear' => date('Y', $mtime),
        'mtimeTime' => date('H:i:s', $mtime),
    );

    if (preg_match('/^(.+?)_(\d{8})_(\d{6})_(\d+)_([0-9]+(?:\.[0-9]+)?)\.[^.]+$/i', $filename, $m)) {
        $dateKey = $m[2];
        $timeKey = $m[3];

        $y = substr($dateKey, 0, 4);
        $mo = substr($dateKey, 4, 2);
        $d = substr($dateKey, 6, 2);
        $hh = substr($timeKey, 0, 2);
        $mm = substr($timeKey, 2, 2);
        $ss = substr($timeKey, 4, 2);

        $meta['channel'] = $m[1];
        $meta['frequency'] = $m[5] . ' MHz';
        $meta['fileDate'] = $y . '-' . $mo . '-' . $d;
        $meta['fileMonth'] = $y . '-' . $mo;
        $meta['fileYear'] = $y;
        $meta['fileTime'] = $hh . ':' . $mm . ':' . $ss;
        $meta['displayTitle'] = $m[5] . ' MHz';
    } elseif (preg_match('/([0-9]+(?:\.[0-9]+)?)\.(wav|mp3|ogg|flac|m4a)$/i', $filename, $m)) {
        $meta['frequency'] = $m[1] . ' MHz';
        $meta['displayTitle'] = $meta['frequency'];
    }

    foreach ($parts as $part) {
        if (preg_match('/^\d{8}$/', $part) && $meta['fileDate'] === '') {
            $y = substr($part, 0, 4);
            $mo = substr($part, 4, 2);
            $d = substr($part, 6, 2);
            $meta['fileDate'] = $y . '-' . $mo . '-' . $d;
            $meta['fileMonth'] = $y . '-' . $mo;
            $meta['fileYear'] = $y;
            break;
        }
    }

    return $meta;
}

function safe_audio_realpath($audioRoot, $relative) {
    $root = realpath($audioRoot);
    if ($root === false) {
        return null;
    }

    $relative = ltrim(path_norm($relative), '/');
    if ($relative === '' || strpos($relative, '..') !== false) {
        return null;
    }

    $full = realpath($root . '/' . $relative);
    if ($full === false) {
        return null;
    }

    $rootNorm = rtrim(path_norm($root), '/') . '/';
    $fullNorm = path_norm($full);

    if (!starts_with_compat($fullNorm, $rootNorm)) {
        return null;
    }

    return $full;
}

function collect_audio_files($audioRoot, $audioUrlBase, $allowedExt) {
    $items = array();
    $root = realpath($audioRoot);

    if ($root === false || !is_dir($root)) {
        return $items;
    }

    $rootNorm = rtrim(path_norm($root), '/') . '/';

    $it = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS),
        RecursiveIteratorIterator::LEAVES_ONLY
    );

    foreach ($it as $fileInfo) {
        if (!$fileInfo->isFile()) {
            continue;
        }

        $ext = strtolower($fileInfo->getExtension());
        if (!isset($allowedExt[$ext])) {
            continue;
        }

        $full = $fileInfo->getRealPath();
        if ($full === false) {
            continue;
        }

        $fullNorm = path_norm($full);
        if (!starts_with_compat($fullNorm, $rootNorm)) {
            continue;
        }

        $relative = substr($fullNorm, strlen($rootNorm));
        $filename = $fileInfo->getFilename();
        $mtime = $fileInfo->getMTime();
        $meta = parse_audio_meta($relative, $filename, $mtime);

        $items[] = array(
            'name' => $filename,
            'relative' => $relative,
            'url' => $audioUrlBase . '/' . rel_url($relative),
            'sizeBytes' => $fileInfo->getSize(),
            'sizeLabel' => human_size($fileInfo->getSize()),
            'mtime' => $mtime,
            'mtimeLabel' => date('Y-m-d H:i:s', $mtime),
            'folder' => $meta['folder'],
            'channel' => $meta['channel'],
            'frequency' => $meta['frequency'],
            'fileDate' => $meta['fileDate'],
            'fileMonth' => $meta['fileMonth'],
            'fileYear' => $meta['fileYear'],
            'fileTime' => $meta['fileTime'],
            'mtimeDate' => $meta['mtimeDate'],
            'mtimeMonth' => $meta['mtimeMonth'],
            'mtimeYear' => $meta['mtimeYear'],
            'displayTitle' => $meta['displayTitle'],
        );
    }

    return $items;
}


function collect_audio_files_cached($audioRoot, $audioUrlBase, $allowedExt, $cachePath, $cacheTtlSeconds) {
    $root = realpath($audioRoot);
    if ($root === false || !is_dir($root)) {
        return array();
    }

    $forceRefresh = isset($_GET['refresh']) && (string)$_GET['refresh'] === '1';

    if (!$forceRefresh && is_file($cachePath)) {
        $age = time() - filemtime($cachePath);

        if ($age >= 0 && $age <= $cacheTtlSeconds) {
            $json = @file_get_contents($cachePath);
            if ($json !== false) {
                $data = json_decode($json, true);

                if (is_array($data)
                    && isset($data['root'])
                    && isset($data['items'])
                    && $data['root'] === $root
                    && is_array($data['items'])) {
                    return $data['items'];
                }
            }
        }
    }

    $items = collect_audio_files($audioRoot, $audioUrlBase, $allowedExt);

    $payload = array(
        'schema' => 'ifz-audio-archive-index-v1',
        'generated_at' => time(),
        'root' => $root,
        'count' => count($items),
        'items' => $items,
    );

    $tmp = $cachePath . '.' . getmypid() . '.tmp';
    $encoded = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    if ($encoded !== false) {
        @file_put_contents($tmp, $encoded, LOCK_EX);
        @rename($tmp, $cachePath);
    }

    return $items;
}

function audio_cache_status($cachePath) {
    if (!is_file($cachePath)) {
        return 'cache: not built';
    }

    $age = max(0, time() - filemtime($cachePath));
    return 'cache: ' . $age . 's old';
}



function invalidate_audio_cache($cachePath) {
    if (is_file($cachePath)) {
        @unlink($cachePath);
    }
}

function cleanup_empty_audio_dirs($audioRoot) {
    $root = realpath($audioRoot);
    if ($root === false || !is_dir($root)) {
        return;
    }

    $rootNorm = rtrim(path_norm($root), '/') . '/';

    $it = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS),
        RecursiveIteratorIterator::CHILD_FIRST
    );

    foreach ($it as $info) {
        if (!$info->isDir()) {
            continue;
        }

        $dir = $info->getRealPath();
        if ($dir === false) {
            continue;
        }

        $dirNorm = rtrim(path_norm($dir), '/') . '/';

        if ($dirNorm === $rootNorm || !starts_with_compat($dirNorm, $rootNorm)) {
            continue;
        }

        $files = @scandir($dir);
        if (is_array($files) && count($files) === 2) {
            @rmdir($dir);
        }
    }
}

function audio_delete_item_date($item) {
    if (!empty($item['mtimeDate'])) {
        return $item['mtimeDate'];
    }

    if (!empty($item['fileDate'])) {
        return $item['fileDate'];
    }

    return '';
}

function delete_audio_period_files($audioRoot, $audioUrlBase, $allowedExt, $periodType, $periodKey) {
    $items = collect_audio_files($audioRoot, $audioUrlBase, $allowedExt);

    $matched = 0;
    $deleted = 0;
    $failed = 0;
    $bytesDeleted = 0;
    $bytesMatched = 0;
    $errors = array();

    foreach ($items as $item) {
        $date = audio_delete_item_date($item);
        $itemHour = audio_item_archive_hour($item);
        $matchedPeriod = false;

        if ($periodType === 'month') {
            if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
                $matchedPeriod = substr($date, 0, 7) === $periodKey;
            }
        } elseif ($periodType === 'day') {
            $matchedPeriod = $date === $periodKey;
        } elseif ($periodType === 'hour') {
            $parts = explode('|', $periodKey, 2);
            $matchedPeriod = count($parts) === 2 && $date === $parts[0] && $itemHour === $parts[1];
        }

        if (!$matchedPeriod) {
            continue;
        }

        $matched++;

        $real = safe_audio_realpath($audioRoot, $item['relative']);

        if ($real === null || !is_file($real)) {
            $failed++;
            if (count($errors) < 5) {
                $errors[] = 'not found or unsafe: ' . $item['relative'];
            }
            continue;
        }

        $size = @filesize($real);
        if ($size !== false) {
            $bytesMatched += (int)$size;
        }

        $dir = dirname($real);
        if (!is_writable($dir)) {
            $failed++;
            if (count($errors) < 5) {
                $errors[] = 'directory not writable: ' . $dir;
            }
            continue;
        }

        if (@unlink($real)) {
            $deleted++;
            if ($size !== false) {
                $bytesDeleted += (int)$size;
            }
        } else {
            $failed++;
            $err = error_get_last();
            if (count($errors) < 5) {
                $errors[] = basename($real) . ': ' . ($err && isset($err['message']) ? $err['message'] : 'unlink failed');
            }
        }
    }

    if ($deleted > 0) {
        cleanup_empty_audio_dirs($audioRoot);
    }

    return array(
        'matched' => $matched,
        'deleted' => $deleted,
        'failed' => $failed,
        'bytes' => $bytesDeleted,
        'matchedBytes' => $bytesMatched,
        'errors' => $errors,
    );
}


function csrf_token() {
    if (empty($_SESSION['audio_archive_csrf'])) {
        $_SESSION['audio_archive_csrf'] = bin2hex(random_bytes(16));
    }
    return $_SESSION['audio_archive_csrf'];
}

function verify_csrf() {
    return isset($_POST['csrf'], $_SESSION['audio_archive_csrf'])
        && hash_equals($_SESSION['audio_archive_csrf'], (string)$_POST['csrf']);
}

$flash = '';
$flashClass = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf()) {
        $flash = 'Invalid request token.';
        $flashClass = 'danger';
    } else {
        $action = (string)($_POST['action'] ?? '');

        if ($action === 'delete_one') {
            $file = (string)($_POST['file'] ?? '');
            $real = safe_audio_realpath($audioRoot, $file);
            if ($real !== null && is_file($real)) {
                unlink($real);
                $flash = 'Deleted 1 audio file.';
                $flashClass = 'success';
            } else {
                $flash = 'File not found.';
                $flashClass = 'danger';
            }
        }

        if ($action === 'delete_selected') {
            $files = $_POST['files'] ?? array();
            if (!is_array($files)) {
                $files = array();
            }

            $deleted = 0;
            foreach ($files as $file) {
                $real = safe_audio_realpath($audioRoot, (string)$file);
                if ($real !== null && is_file($real)) {
                    unlink($real);
                    $deleted++;
                }
            }

            $flash = 'Deleted ' . $deleted . ' selected audio file(s).';
            $flashClass = $deleted > 0 ? 'success' : 'danger';
        }
    }
}


        if ($action === 'delete_month') {
            $monthKey = (string)($_POST['month_key'] ?? '');

            if (!preg_match('/^\d{4}-\d{2}$/', $monthKey)) {
                $flash = 'Invalid month folder.';
                $flashClass = 'danger';
            } else {
                $result = delete_audio_period_files($audioRoot, $audioUrlBase, $allowedExt, 'month', $monthKey);
                invalidate_audio_cache($cachePath);

                $flash = 'Matched ' . (int)$result['matched'] . ', deleted ' . (int)$result['deleted'] . ', failed ' . (int)$result['failed'] . ' audio file(s) from month ' . $monthKey . ' (' . human_size((int)$result['bytes']) . ' deleted).';
                $flashClass = ((int)$result['failed'] === 0 && (int)$result['deleted'] > 0) ? 'success' : 'danger';
            }
        }

        if ($action === 'delete_day') {
            $dateKey = (string)($_POST['date_key'] ?? '');

            if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateKey)) {
                $flash = 'Invalid day folder.';
                $flashClass = 'danger';
            } else {
                $result = delete_audio_period_files($audioRoot, $audioUrlBase, $allowedExt, 'day', $dateKey);
                invalidate_audio_cache($cachePath);

                $flash = 'Matched ' . (int)$result['matched'] . ', deleted ' . (int)$result['deleted'] . ', failed ' . (int)$result['failed'] . ' audio file(s) from day ' . $dateKey . ' (' . human_size((int)$result['bytes']) . ' deleted).';
                $flashClass = ((int)$result['failed'] === 0 && (int)$result['deleted'] > 0) ? 'success' : 'danger';
            }
        }



        if ($action === 'delete_hour') {
            $dateKey = (string)($_POST['date_key'] ?? '');
            $hourKey = (string)($_POST['hour_key'] ?? '');

            if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateKey) || !preg_match('/^\d{2}$/', $hourKey)) {
                $flash = 'Invalid hour folder.';
                $flashClass = 'danger';
            } else {
                $result = delete_audio_period_files($audioRoot, $audioUrlBase, $allowedExt, 'hour', $dateKey . '|' . $hourKey);
                invalidate_audio_cache($cachePath);

                $flash = 'Matched ' . (int)$result['matched'] . ', deleted ' . (int)$result['deleted'] . ', failed ' . (int)$result['failed'] . ' audio file(s) from ' . $dateKey . ' ' . audio_hour_label($hourKey) . ' (' . human_size((int)$result['bytes']) . ' deleted).';
                $flashClass = ((int)$result['failed'] === 0 && (int)$result['deleted'] > 0) ? 'success' : 'danger';
            }
        }


$q = trim((string)($_GET['q'] ?? ''));
$date = trim((string)($_GET['date'] ?? ''));
$month = trim((string)($_GET['month'] ?? ''));
$year = trim((string)($_GET['year'] ?? ''));
$hour = trim((string)($_GET['hour'] ?? ''));
$page = max(1, (int)($_GET['page'] ?? 1));
$perPage = (int)($_GET['per_page'] ?? $defaultPerPage);

if (!in_array($perPage, $perPageOptions, true)) {
    $perPage = $defaultPerPage;
}

/*
 * Cascade selection normalization:
 * date => month/year, month => year.
 */
if ($date !== '' && preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    if ($month === '') {
        $month = substr($date, 0, 7);
    }
    if ($year === '') {
        $year = substr($date, 0, 4);
    }
} elseif ($month !== '' && preg_match('/^\d{4}-\d{2}$/', $month)) {
    if ($year === '') {
        $year = substr($month, 0, 4);
    }
}

if ($hour !== '' && !preg_match('/^\d{2}$/', $hour)) {
    $hour = '';
}

$allItems = collect_audio_files_cached($audioRoot, $audioUrlBase, $allowedExt, $cachePath, $cacheTtlSeconds);

$years = array();
foreach ($allItems as $item) {
    if ($item['mtimeYear'] !== '') {
        $years[$item['mtimeYear']] = true;
    }
    if ($item['fileYear'] !== '') {
        $years[$item['fileYear']] = true;
    }
}
$years = array_keys($years);
rsort($years, SORT_NATURAL);

$filtered = array();

foreach ($allItems as $item) {
    $itemDate = audio_item_archive_date($item);
    $itemMonth = audio_month_key_from_date($itemDate);
    $itemYear = preg_match('/^\d{4}/', $itemDate) ? substr($itemDate, 0, 4) : '';
    $itemHour = audio_item_archive_hour($item);

    if ($q !== '') {
        $hay = strtolower(implode(' ', array(
            $item['name'],
            $item['relative'],
            $item['folder'],
            $item['channel'],
            $item['frequency'],
            $item['mtimeLabel'],
            $itemDate,
            $itemHour,
        )));

        if (strpos($hay, strtolower($q)) === false) {
            continue;
        }
    }

    if ($year !== '' && $itemYear !== $year) {
        continue;
    }

    if ($month !== '' && $itemMonth !== $month) {
        continue;
    }

    if ($date !== '' && $itemDate !== $date) {
        continue;
    }

    if ($hour !== '' && $itemHour !== $hour) {
        continue;
    }

    $filtered[] = $item;
}


usort($filtered, function ($a, $b) {
    if ($a['mtime'] === $b['mtime']) {
        return strnatcasecmp($a['name'], $b['name']);
    }
    return $b['mtime'] <=> $a['mtime'];
});

$total = count($filtered);
$totalPages = max(1, (int)ceil($total / $perPage));
$page = min($page, $totalPages);
$offset = ($page - 1) * $perPage;
$pageItems = array_slice($filtered, $offset, $perPage);

function page_url($page) {
    $params = $_GET;
    $params['page'] = (int)$page;
    return '?' . http_build_query($params);
}


function audio_item_archive_date($item) {
    if (!empty($item['mtimeDate'])) {
        return $item['mtimeDate'];
    }

    if (!empty($item['fileDate'])) {
        return $item['fileDate'];
    }

    return '';
}

function audio_month_key_from_date($date) {
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        return '';
    }

    return substr($date, 0, 7);
}

function audio_month_label($monthKey) {
    $ts = strtotime($monthKey . '-01');
    if ($ts === false) {
        return $monthKey;
    }

    $lastDay = (int)date('t', $ts);
    return '1-' . $lastDay . '/' . date('m/Y', $ts);
}

function audio_day_label($date) {
    $ts = strtotime($date);
    if ($ts === false) {
        return $date;
    }

    return date('d/m/Y', $ts);
}

function build_audio_month_buckets($items) {
    $buckets = array();

    foreach ($items as $item) {
        $date = audio_item_archive_date($item);
        $monthKey = audio_month_key_from_date($date);

        if ($monthKey === '') {
            continue;
        }

        if (!isset($buckets[$monthKey])) {
            $buckets[$monthKey] = array(
                'key' => $monthKey,
                'label' => audio_month_label($monthKey),
                'count' => 0,
                'sizeBytes' => 0,
                'latestMtime' => 0,
                'latestLabel' => '',
            );
        }

        $buckets[$monthKey]['count']++;
        $buckets[$monthKey]['sizeBytes'] += (int)$item['sizeBytes'];

        if ((int)$item['mtime'] > $buckets[$monthKey]['latestMtime']) {
            $buckets[$monthKey]['latestMtime'] = (int)$item['mtime'];
            $buckets[$monthKey]['latestLabel'] = $item['mtimeLabel'];
        }
    }

    usort($buckets, function ($a, $b) {
        return strcmp($b['key'], $a['key']);
    });

    return $buckets;
}

function build_audio_day_buckets($items) {
    $buckets = array();

    foreach ($items as $item) {
        $date = audio_item_archive_date($item);

        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            continue;
        }

        if (!isset($buckets[$date])) {
            $buckets[$date] = array(
                'key' => $date,
                'label' => audio_day_label($date),
                'count' => 0,
                'sizeBytes' => 0,
                'latestMtime' => 0,
                'latestLabel' => '',
            );
        }

        $buckets[$date]['count']++;
        $buckets[$date]['sizeBytes'] += (int)$item['sizeBytes'];

        if ((int)$item['mtime'] > $buckets[$date]['latestMtime']) {
            $buckets[$date]['latestMtime'] = (int)$item['mtime'];
            $buckets[$date]['latestLabel'] = $item['mtimeLabel'];
        }
    }

    usort($buckets, function ($a, $b) {
        return strcmp($b['key'], $a['key']);
    });

    return $buckets;
}

function audio_link($params) {
    return 'showaudio.php?' . http_build_query($params);
}


function audio_item_archive_hour($item) {
    if (!empty($item['fileTime']) && preg_match('/^\d{2}:/', $item['fileTime'])) {
        return substr($item['fileTime'], 0, 2);
    }

    if (!empty($item['mtimeTime']) && preg_match('/^\d{2}:/', $item['mtimeTime'])) {
        return substr($item['mtimeTime'], 0, 2);
    }

    if (!empty($item['mtimeLabel']) && preg_match('/\s(\d{2}):\d{2}:\d{2}$/', $item['mtimeLabel'], $m)) {
        return $m[1];
    }

    return '';
}

function audio_hour_label($hour) {
    if (!preg_match('/^\d{2}$/', $hour)) {
        return $hour;
    }

    $h = (int)$hour;
    $next = $h + 1;

    return sprintf('%02d:00-%02d:00', $h, $next);
}

function build_audio_year_options($items) {
    $buckets = array();

    foreach ($items as $item) {
        $date = audio_item_archive_date($item);
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            continue;
        }

        $key = substr($date, 0, 4);

        if (!isset($buckets[$key])) {
            $buckets[$key] = array(
                'key' => $key,
                'label' => $key,
                'count' => 0,
                'sizeBytes' => 0,
                'latestMtime' => 0,
                'latestLabel' => '',
            );
        }

        $buckets[$key]['count']++;
        $buckets[$key]['sizeBytes'] += (int)$item['sizeBytes'];

        if ((int)$item['mtime'] > $buckets[$key]['latestMtime']) {
            $buckets[$key]['latestMtime'] = (int)$item['mtime'];
            $buckets[$key]['latestLabel'] = $item['mtimeLabel'];
        }
    }

    usort($buckets, function ($a, $b) {
        return strcmp($b['key'], $a['key']);
    });

    return $buckets;
}

function build_audio_month_options($items, $year) {
    $buckets = array();

    if ($year === '') {
        return $buckets;
    }

    foreach ($items as $item) {
        $date = audio_item_archive_date($item);
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            continue;
        }

        if (substr($date, 0, 4) !== $year) {
            continue;
        }

        $key = substr($date, 0, 7);

        if (!isset($buckets[$key])) {
            $buckets[$key] = array(
                'key' => $key,
                'label' => audio_month_label($key),
                'count' => 0,
                'sizeBytes' => 0,
                'latestMtime' => 0,
                'latestLabel' => '',
            );
        }

        $buckets[$key]['count']++;
        $buckets[$key]['sizeBytes'] += (int)$item['sizeBytes'];

        if ((int)$item['mtime'] > $buckets[$key]['latestMtime']) {
            $buckets[$key]['latestMtime'] = (int)$item['mtime'];
            $buckets[$key]['latestLabel'] = $item['mtimeLabel'];
        }
    }

    usort($buckets, function ($a, $b) {
        return strcmp($b['key'], $a['key']);
    });

    return $buckets;
}

function build_audio_day_options($items, $month) {
    $buckets = array();

    if ($month === '') {
        return $buckets;
    }

    foreach ($items as $item) {
        $date = audio_item_archive_date($item);
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            continue;
        }

        if (substr($date, 0, 7) !== $month) {
            continue;
        }

        if (!isset($buckets[$date])) {
            $buckets[$date] = array(
                'key' => $date,
                'label' => audio_day_label($date),
                'count' => 0,
                'sizeBytes' => 0,
                'latestMtime' => 0,
                'latestLabel' => '',
            );
        }

        $buckets[$date]['count']++;
        $buckets[$date]['sizeBytes'] += (int)$item['sizeBytes'];

        if ((int)$item['mtime'] > $buckets[$date]['latestMtime']) {
            $buckets[$date]['latestMtime'] = (int)$item['mtime'];
            $buckets[$date]['latestLabel'] = $item['mtimeLabel'];
        }
    }

    usort($buckets, function ($a, $b) {
        return strcmp($b['key'], $a['key']);
    });

    return $buckets;
}

function build_audio_hour_options($items, $dateKey) {
    $buckets = array();

    if ($dateKey === '') {
        return $buckets;
    }

    foreach ($items as $item) {
        $date = audio_item_archive_date($item);
        if ($date !== $dateKey) {
            continue;
        }

        $key = audio_item_archive_hour($item);
        if ($key === '') {
            continue;
        }

        if (!isset($buckets[$key])) {
            $buckets[$key] = array(
                'key' => $key,
                'label' => audio_hour_label($key),
                'count' => 0,
                'sizeBytes' => 0,
                'latestMtime' => 0,
                'latestLabel' => '',
            );
        }

        $buckets[$key]['count']++;
        $buckets[$key]['sizeBytes'] += (int)$item['sizeBytes'];

        if ((int)$item['mtime'] > $buckets[$key]['latestMtime']) {
            $buckets[$key]['latestMtime'] = (int)$item['mtime'];
            $buckets[$key]['latestLabel'] = $item['mtimeLabel'];
        }
    }

    krsort($buckets, SORT_NATURAL);
    return array_values($buckets);
}

function build_audio_hour_buckets($items) {
    $buckets = array();

    foreach ($items as $item) {
        $key = audio_item_archive_hour($item);

        if ($key === '') {
            continue;
        }

        if (!isset($buckets[$key])) {
            $buckets[$key] = array(
                'key' => $key,
                'label' => audio_hour_label($key),
                'count' => 0,
                'sizeBytes' => 0,
                'latestMtime' => 0,
                'latestLabel' => '',
            );
        }

        $buckets[$key]['count']++;
        $buckets[$key]['sizeBytes'] += (int)$item['sizeBytes'];

        if ((int)$item['mtime'] > $buckets[$key]['latestMtime']) {
            $buckets[$key]['latestMtime'] = (int)$item['mtime'];
            $buckets[$key]['latestLabel'] = $item['mtimeLabel'];
        }
    }

    krsort($buckets, SORT_NATURAL);
    return array_values($buckets);
}

$csrf = csrf_token();

/*
 * IFZ Audio Archive Folder Browser
 * Default: year/month folders -> day folders -> hour folders -> audio files.
 */
$archiveMode = 'months';

if ($q !== '') {
    $archiveMode = 'files';
} elseif ($date !== '' && $hour !== '') {
    $archiveMode = 'files';
} elseif ($date !== '') {
    $archiveMode = 'hours';
} elseif ($month !== '') {
    $archiveMode = 'days';
}

$yearOptions = build_audio_year_options($allItems);
$monthOptions = build_audio_month_options($allItems, $year);
$dayOptions = build_audio_day_options($allItems, $month);
$hourOptions = build_audio_hour_options($allItems, $date);

$monthBuckets = build_audio_month_buckets($filtered);
$dayBuckets = build_audio_day_buckets($filtered);
$hourBuckets = build_audio_hour_buckets($filtered);

?>

<!doctype html>
<html lang="en" data-bs-theme="auto">
<head>
  <script src="assets/theme/app-theme.js"></script>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>IFZ: Audio Archive</title>
  <link href="assets/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="dashboard.css" rel="stylesheet">
  <script src="assets/dist/js/bootstrap.bundle.min.js"></script>

  <!-- ✅ JS ของหน้านี้ -->

  <style>
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace; font-size: 0.88rem; }
    .sticky-actions { position: sticky; top: 64px; z-index: 50; background: var(--bs-body-bg); padding-top: 8px; padding-bottom: 8px; }
    .img-card { border-radius: 16px; overflow: hidden; }
    .thumb { width: 100%; height: 190px; object-fit: cover; background: rgba(255,255,255,0.04); }
    .viewer-img { width: 100%; max-height: 70vh; object-fit: contain; background: rgba(0,0,0,0.06); border-radius: 12px; }
  
/* IFZ-AUDIO-UI-PERF PATCH: card spacing/readability/performance */
.content,
main {
  padding-right: 24px !important;
}

.audio-card {
  min-height: 164px;
  padding: 0;
  transition: border-color .12s ease, background .12s ease;
}

.audio-card:hover {
  border-color: #52616d;
  background: #242c33;
}

.audio-card .form-check-input.audio-check {
  width: 14px;
  height: 14px;
  margin-left: 0;
  flex: 0 0 auto;
}

.audio-card .audio-title {
  display: flex;
  align-items: baseline;
  gap: 6px;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.audio-card .audio-freq {
  flex: 0 0 auto;
}

.audio-card .audio-meta {
  max-width: 100%;
  overflow: hidden;
}

.audio-card .audio-path {
  display: block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.audio-wave {
  max-width: 68%;
  min-width: 260px;
  height: 32px;
}

.audio-wave span {
  width: 3px;
  min-width: 3px;
}

.audio-card .btn {
  min-width: 64px;
}

.audio-card .px-3.pb-3.d-flex,
.audio-card .card-actions {
  flex-wrap: wrap;
}

.audio-toolbar-line {
  gap: 8px !important;
  flex-wrap: wrap;
}

.audio-archive-pager {
  border-top: 1px solid #3b4650;
  padding-top: 12px;
}

@media (max-width: 1400px) {
  .audio-wave {
    max-width: 82%;
  }
}

@media (max-width: 920px) {
  .audio-wave {
    max-width: 100%;
    min-width: 0;
  }
}


/* IFZ Audio Folder Browser */
.audio-folder-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(260px, 1fr));
  gap: 12px;
}

.audio-folder-card {
  display: block;
  text-decoration: none;
  color: inherit;
  background: #22292f;
  border: 1px solid #3b4650;
  border-radius: 8px;
  padding: 16px 18px;
  transition: border-color .12s ease, background .12s ease, transform .12s ease;
}

.audio-folder-card:hover {
  color: inherit;
  background: #242c33;
  border-color: #52616d;
  transform: translateY(-1px);
}

.audio-folder-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #e8eef4;
  font-weight: 800;
  font-size: 17px;
}

.audio-folder-icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid #4b5964;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #5aa1ff;
  background: #1d2329;
  flex: 0 0 auto;
}

.audio-folder-meta {
  margin-top: 10px;
  color: #a8b4bf;
  font-size: 13px;
  line-height: 1.55;
}

.audio-breadcrumb {
  color: #a8b4bf;
  font-size: 13px;
  margin: -4px 0 12px;
}

.audio-breadcrumb a {
  color: #5aa1ff;
  text-decoration: none;
}

.audio-breadcrumb a:hover {
  text-decoration: underline;
}

.audio-card {
  min-height: 164px;
}

.audio-card .audio-title {
  display: flex;
  align-items: baseline;
  gap: 6px;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.audio-card .audio-freq {
  flex: 0 0 auto;
}

.audio-path {
  display: block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.audio-wave {
  max-width: 68%;
  min-width: 260px;
  height: 32px;
}

.audio-wave span {
  width: 3px;
  min-width: 3px;
}

.audio-toolbar-line {
  gap: 8px !important;
  flex-wrap: wrap;
}

.audio-archive-pager {
  border-top: 1px solid #3b4650;
  padding-top: 12px;
}

@media (max-width: 1400px) {
  .audio-folder-grid {
    grid-template-columns: repeat(2, minmax(260px, 1fr));
  }

  .audio-wave {
    max-width: 82%;
  }
}

@media (max-width: 920px) {
  .audio-folder-grid {
    grid-template-columns: 1fr;
  }

  .audio-wave {
    max-width: 100%;
    min-width: 0;
  }
}


/* IFZ Audio Folder Delete Actions */
.audio-folder-open {
  display: block;
  color: inherit;
  text-decoration: none;
}

.audio-folder-open:hover {
  color: inherit;
  text-decoration: none;
}

.audio-folder-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.audio-folder-actions .btn {
  min-width: 96px;
}

.audio-folder-card form {
  margin: 0;
}


/* IFZ Audio Auto Filter */
#audioFilterForm .audio-search-filter,
#audioFilterForm .audio-auto-filter {
  transition: border-color .12s ease, box-shadow .12s ease;
}

#audioFilterForm .audio-filter-pending {
  border-color: #5aa1ff !important;
  box-shadow: 0 0 0 2px rgba(90, 161, 255, .16);
}


/* IFZ Audio Cascade Filter */
.audio-cascade-note {
  color: #a8b4bf;
  font-size: 12px;
  margin-top: 4px;
}
.audio-folder-card .btn {
  min-width: 96px;
}

</style>

<style>
.audio-card {
  background: #22292f;
  border: 1px solid #3b4650;
  border-radius: 8px;
  overflow: hidden;
}
.audio-card .audio-title {
  font-weight: 700;
  color: #e8eef4;
}
.audio-card .audio-freq {
  color: #4be37b;
  font-family: Consolas, Monaco, monospace;
}
.audio-card .audio-meta {
  color: #a8b4bf;
  font-size: 13px;
  line-height: 1.45;
}
.audio-wave {
  height: 36px;
  display: flex;
  align-items: center;
  gap: 3px;
  overflow: hidden;
}
.audio-wave span {
  width: 4px;
  min-width: 4px;
  border-radius: 2px;
  background: linear-gradient(to top, #1266d9, #45cfff);
  opacity: .86;
}
.audio-player {
  display: none;
}
.audio-card.playing .audio-player {
  display: block;
}
.audio-player audio {
  width: 100%;
  height: 34px;
}
.audio-toolbar-line {
  border-top: 1px solid #3b4650;
  margin-top: 14px;
  padding-top: 14px;
}
</style>

  <link href="assets/theme/app-theme.css" rel="stylesheet">
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
            <!-- <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" aria-current="page" href="eventLoggerData.php">
                <svg class="bi"><use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg?v=<?php echo time();?>#layer-group"/></svg>
                Event Logger
              </a>
            </li> -->
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2 active" aria-current="page" href="showaudio.php">
                <svg class="bi"><use xlink:href="fontawesome-free-5.15.4-web/sprites/regular.svg?v=<?php echo time();?>#file-audio"/></svg>
                Audio Archive
              </a>
            </li>
            <!-- <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-2" aria-current="page" href="mapvisual.php">
                <svg class="bi"><use xlink:href="dashboard.svg?v=<?php echo time();?>#mapvisual"/></svg>
                Map Visual
              </a>
            </li> -->
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
                <a class="nav-link d-flex align-items-center gap-2" href="wifi.php">
                    <svg class="bi">
                        <use xlink:href="fontawesome-free-5.15.4-web/sprites/solid.svg#wifi" />
                    </svg>
                    Wi-Fi & LTE Settings
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
        
        
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 class="h2">Audio Archive</h1>
        </div>

        <div class="audio-breadcrumb">
          <a href="showaudio.php">Audio Archive</a>
          <?php if ($month !== ''): ?>
            <span> / <?php echo h(audio_month_label($month)); ?></span>
          <?php endif; ?>
          <?php if ($date !== ''): ?>
            <span> / <?php echo h(audio_day_label($date)); ?></span>
          <?php endif; ?>
          <?php if ($hour !== ''): ?>
            <span> / <?php echo h(audio_hour_label($hour)); ?></span>
          <?php endif; ?>
        </div>

        <?php if ($flash !== ''): ?>
          <div class="alert alert-<?php echo $flashClass === 'success' ? 'success' : 'danger'; ?> py-2">
            <?php echo h($flash); ?>
          </div>
        <?php endif; ?>

        <form method="get" class="mb-3" id="audioFilterForm">
          <div class="row g-2 align-items-end">
            <div class="col-md-2">
              <label class="form-label fw-semibold">Year</label>
              <select class="form-select form-select-sm audio-cascade-filter" name="year" data-level="year">
                <option value="">Select year</option>
                <?php foreach ($yearOptions as $opt): ?>
                  <option value="<?php echo h($opt['key']); ?>" <?php echo $year === $opt['key'] ? 'selected' : ''; ?>>
                    <?php echo h($opt['label']); ?> (<?php echo (int)$opt['count']; ?>)
                  </option>
                <?php endforeach; ?>
              </select>
            </div>

            <div class="col-md-3">
              <label class="form-label fw-semibold">Month</label>
              <select class="form-select form-select-sm audio-cascade-filter" name="month" data-level="month" <?php echo $year === '' ? 'disabled' : ''; ?>>
                <option value="">Select month</option>
                <?php foreach ($monthOptions as $opt): ?>
                  <option value="<?php echo h($opt['key']); ?>" <?php echo $month === $opt['key'] ? 'selected' : ''; ?>>
                    <?php echo h($opt['label']); ?> (<?php echo (int)$opt['count']; ?>)
                  </option>
                <?php endforeach; ?>
              </select>
            </div>

            <div class="col-md-3">
              <label class="form-label fw-semibold">Day</label>
              <select class="form-select form-select-sm audio-cascade-filter" name="date" data-level="date" <?php echo $month === '' ? 'disabled' : ''; ?>>
                <option value="">Select day</option>
                <?php foreach ($dayOptions as $opt): ?>
                  <option value="<?php echo h($opt['key']); ?>" <?php echo $date === $opt['key'] ? 'selected' : ''; ?>>
                    <?php echo h($opt['label']); ?> (<?php echo (int)$opt['count']; ?>)
                  </option>
                <?php endforeach; ?>
              </select>
            </div>

            <div class="col-md-2">
              <label class="form-label fw-semibold">Time</label>
              <select class="form-select form-select-sm audio-cascade-filter" name="hour" data-level="hour" <?php echo $date === '' ? 'disabled' : ''; ?>>
                <option value="">Select time</option>
                <?php foreach ($hourOptions as $opt): ?>
                  <option value="<?php echo h($opt['key']); ?>" <?php echo $hour === $opt['key'] ? 'selected' : ''; ?>>
                    <?php echo h($opt['label']); ?> (<?php echo (int)$opt['count']; ?>)
                  </option>
                <?php endforeach; ?>
              </select>
            </div>

            <div class="col-md-1">
              <label class="form-label fw-semibold">Show</label>
              <select class="form-select form-select-sm audio-cascade-filter" name="per_page" data-level="per_page">
                <?php foreach ($perPageOptions as $opt): ?>
                  <option value="<?php echo (int)$opt; ?>" <?php echo $perPage === $opt ? 'selected' : ''; ?>>
                    <?php echo (int)$opt; ?>
                  </option>
                <?php endforeach; ?>
              </select>
            </div>

            <div class="col-md-1">
              <a class="btn btn-sm btn-outline-secondary w-100" href="showaudio.php">Clear</a>
            </div>

            <div class="col-12">
              <div class="audio-cascade-note">
                Select step by step: Year → Month → Day → Time. Options are generated from existing recordings only.
                · <a class="text-secondary" href="showaudio.php?refresh=1">Refresh index</a>
                · <?php echo h(audio_cache_status($cachePath)); ?>
              </div>
            </div>
          </div>
        </form>

        <?php if ($archiveMode === 'months'): ?>
          <div class="audio-toolbar-line d-flex align-items-center gap-2 mb-3">
            <span class="text-secondary small">
              Month folders: <?php echo count($monthBuckets); ?>
              · Total files: <?php echo (int)$total; ?>
            </span>
          </div>

          <?php if (count($monthBuckets) === 0): ?>
            <div class="border border-secondary rounded p-4 text-center text-secondary">
              Select a year to browse available month folders.
            </div>
          <?php else: ?>
            <section class="audio-folder-grid">
              <?php foreach ($monthBuckets as $bucket): ?>
                <?php $monthFormId = 'delete_month_' . str_replace('-', '_', $bucket['key']); ?>
                <div class="audio-folder-card">
                  <a class="audio-folder-open" href="<?php echo h(audio_link(array('year' => substr($bucket['key'], 0, 4), 'month' => $bucket['key'], 'per_page' => $perPage))); ?>">
                    <div class="audio-folder-title">
                      <span class="audio-folder-icon">▣</span>
                      <span><?php echo h($bucket['label']); ?></span>
                    </div>

                    <div class="audio-folder-meta">
                      Files: <?php echo (int)$bucket['count']; ?><br>
                      Size: <?php echo h(human_size($bucket['sizeBytes'])); ?><br>
                      Latest: <?php echo h($bucket['latestLabel']); ?>
                    </div>
                  </a>

                  <div class="audio-folder-actions">
                    <a class="btn btn-sm btn-primary" href="<?php echo h(audio_link(array('year' => substr($bucket['key'], 0, 4), 'month' => $bucket['key'], 'per_page' => $perPage))); ?>">Open</a>
                    <button class="btn btn-sm btn-danger"
                            type="submit"
                            form="<?php echo h($monthFormId); ?>"
                            onclick="return confirmDeleteBucket('month', '<?php echo h($bucket['label']); ?>', <?php echo (int)$bucket['count']; ?>);">
                      Delete Month
                    </button>
                  </div>

                  <form method="post" id="<?php echo h($monthFormId); ?>" style="display:none;">
                    <input type="hidden" name="csrf" value="<?php echo h($csrf); ?>">
                    <input type="hidden" name="action" value="delete_month">
                    <input type="hidden" name="month_key" value="<?php echo h($bucket['key']); ?>">
                  </form>
                </div>
              <?php endforeach; ?>
            </section>
          <?php endif; ?>

        <?php elseif ($archiveMode === 'days'): ?>
          <div class="audio-toolbar-line d-flex align-items-center gap-2 mb-3">
            <a class="btn btn-sm btn-outline-secondary" href="<?php echo h(audio_link(array('year' => $year, 'per_page' => $perPage))); ?>">Back to months</a>
            <span class="text-secondary small">
              <?php echo h(audio_month_label($month)); ?>
              · Day folders: <?php echo count($dayBuckets); ?>
              · Files: <?php echo (int)$total; ?>
            </span>
          </div>

          <?php if (count($dayBuckets) === 0): ?>
            <div class="border border-secondary rounded p-4 text-center text-secondary">
              No audio days found for this month.
            </div>
          <?php else: ?>
            <section class="audio-folder-grid">
              <?php foreach ($dayBuckets as $bucket): ?>
                <?php $dayFormId = 'delete_day_' . str_replace('-', '_', $bucket['key']); ?>
                <div class="audio-folder-card">
                  <a class="audio-folder-open" href="<?php echo h(audio_link(array('year' => substr($bucket['key'], 0, 4), 'month' => substr($bucket['key'], 0, 7), 'date' => $bucket['key'], 'per_page' => $perPage))); ?>">
                    <div class="audio-folder-title">
                      <span class="audio-folder-icon">◷</span>
                      <span><?php echo h($bucket['label']); ?></span>
                    </div>

                    <div class="audio-folder-meta">
                      Files: <?php echo (int)$bucket['count']; ?><br>
                      Size: <?php echo h(human_size($bucket['sizeBytes'])); ?><br>
                      Latest: <?php echo h($bucket['latestLabel']); ?>
                    </div>
                  </a>

                  <div class="audio-folder-actions">
                    <a class="btn btn-sm btn-primary" href="<?php echo h(audio_link(array('year' => substr($bucket['key'], 0, 4), 'month' => substr($bucket['key'], 0, 7), 'date' => $bucket['key'], 'per_page' => $perPage))); ?>">Open</a>
                    <button class="btn btn-sm btn-danger"
                            type="submit"
                            form="<?php echo h($dayFormId); ?>"
                            onclick="return confirmDeleteBucket('day', '<?php echo h($bucket['label']); ?>', <?php echo (int)$bucket['count']; ?>);">
                      Delete Day
                    </button>
                  </div>

                  <form method="post" id="<?php echo h($dayFormId); ?>" style="display:none;">
                    <input type="hidden" name="csrf" value="<?php echo h($csrf); ?>">
                    <input type="hidden" name="action" value="delete_day">
                    <input type="hidden" name="date_key" value="<?php echo h($bucket['key']); ?>">
                  </form>
                </div>
              <?php endforeach; ?>
            </section>
          <?php endif; ?>

        <?php elseif ($archiveMode === 'hours'): ?>
          <div class="audio-toolbar-line d-flex align-items-center gap-2 mb-3">
            <a class="btn btn-sm btn-outline-secondary" href="<?php echo h(audio_link(array('year' => $year, 'month' => $month, 'per_page' => $perPage))); ?>">Back to days</a>
            <span class="text-secondary small">
              <?php echo h(audio_day_label($date)); ?>
              · Time folders: <?php echo count($hourBuckets); ?>
              · Files: <?php echo (int)$total; ?>
            </span>
          </div>

          <?php if (count($hourBuckets) === 0): ?>
            <div class="border border-secondary rounded p-4 text-center text-secondary">
              No audio time ranges found for this day.
            </div>
          <?php else: ?>
            <section class="audio-folder-grid">
              <?php foreach ($hourBuckets as $bucket): ?>
                <?php $hourFormId = 'delete_hour_' . str_replace('-', '_', $date) . '_' . $bucket['key']; ?>
                <div class="audio-folder-card">
                  <a class="audio-folder-open" href="<?php echo h(audio_link(array('year' => $year, 'month' => $month, 'date' => $date, 'hour' => $bucket['key'], 'per_page' => $perPage))); ?>">
                    <div class="audio-folder-title">
                      <span class="audio-folder-icon">◴</span>
                      <span><?php echo h($bucket['label']); ?></span>
                    </div>

                    <div class="audio-folder-meta">
                      Files: <?php echo (int)$bucket['count']; ?><br>
                      Size: <?php echo h(human_size($bucket['sizeBytes'])); ?><br>
                      Latest: <?php echo h($bucket['latestLabel']); ?>
                    </div>
                  </a>

                  <div class="audio-folder-actions">
                    <a class="btn btn-sm btn-primary" href="<?php echo h(audio_link(array('year' => $year, 'month' => $month, 'date' => $date, 'hour' => $bucket['key'], 'per_page' => $perPage))); ?>">Open</a>
                    <button class="btn btn-sm btn-danger"
                            type="submit"
                            form="<?php echo h($hourFormId); ?>"
                            onclick="return confirmDeleteBucket('time', '<?php echo h(audio_day_label($date) . ' ' . $bucket['label']); ?>', <?php echo (int)$bucket['count']; ?>);">
                      Delete Time
                    </button>
                  </div>

                  <form method="post" id="<?php echo h($hourFormId); ?>" style="display:none;">
                    <input type="hidden" name="csrf" value="<?php echo h($csrf); ?>">
                    <input type="hidden" name="action" value="delete_hour">
                    <input type="hidden" name="date_key" value="<?php echo h($date); ?>">
                    <input type="hidden" name="hour_key" value="<?php echo h($bucket['key']); ?>">
                  </form>
                </div>
              <?php endforeach; ?>
            </section>
          <?php endif; ?>

        <?php else: ?>
          <form method="post" id="bulkForm">
            <input type="hidden" name="csrf" value="<?php echo h($csrf); ?>">
            <input type="hidden" name="action" value="delete_selected">

            <div class="audio-toolbar-line d-flex align-items-center gap-2 mb-3">
              <a class="btn btn-sm btn-outline-secondary" href="<?php echo h(audio_link(array('year' => $year, 'month' => $month, 'date' => $date, 'per_page' => $perPage))); ?>">Back to time</a>

              <button type="button" class="btn btn-sm btn-outline-secondary" onclick="selectAllAudio()">Select All</button>
              <button type="button" class="btn btn-sm btn-outline-secondary" onclick="clearAudioSelection()">Clear</button>
              <button type="submit" class="btn btn-sm btn-danger" onclick="return confirmDeleteSelected()">Delete Selected</button>

              <span class="text-secondary small ms-2">
                Selected: <span id="selectedCount">0</span>
                · Total: <?php echo (int)$total; ?>
                · Latest first
              </span>
            </div>

            <?php if (count($pageItems) === 0): ?>
              <div class="border border-secondary rounded p-4 text-center text-secondary">
                No audio files found for the selected time range.
              </div>
            <?php else: ?>
              <div class="row g-3">
                <?php foreach ($pageItems as $item): ?>
                  <?php
                    $title = $item['frequency'] !== '' ? $item['frequency'] : $item['displayTitle'];
                    $seed = sprintf('%u', crc32($item['relative']));
                  ?>
                  <div class="col-md-6 col-xl-4">
                    <div class="audio-card h-100" data-card>
                      <div class="p-3">
                        <div class="d-flex align-items-start gap-2">
                          <input class="form-check-input audio-check mt-1" type="checkbox" name="files[]"
                                 value="<?php echo h($item['relative']); ?>" onchange="updateSelectedCount()">

                          <div class="min-w-0 flex-grow-1">
                            <div class="audio-title">
                              <span class="audio-freq"><?php echo h($title); ?></span>
                              <?php echo h(' ' . $item['folder']); ?>
                            </div>

                            <div class="audio-meta mt-1">
                              <?php echo h($item['name']); ?><br>
                              Modified: <?php echo h($item['mtimeLabel']); ?> · <?php echo h($item['sizeLabel']); ?><br>
                              <span class="audio-path" title="<?php echo h($item['relative']); ?>">
                                Path: <?php echo h($item['relative']); ?>
                              </span>
                            </div>

                            <div class="audio-wave mt-3">
                              <?php for ($i = 0; $i < 36; $i++): ?>
                                <?php $height = 6 + abs(((int)$seed + ($i * 17) + (($i % 5) * 13)) % 25); ?>
                                <span style="height: <?php echo (int)$height; ?>px"></span>
                              <?php endfor; ?>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="px-3 pb-3 d-flex gap-2 flex-wrap">
                        <button class="btn btn-sm btn-primary" type="button"
                                onclick="playCard(this, '<?php echo h($item['url']); ?>')">Play</button>
                        <a class="btn btn-sm btn-outline-light" href="<?php echo h($item['url']); ?>" download>Download</a>
                        <button class="btn btn-sm btn-danger" type="button"
                                onclick="deleteOne('<?php echo h($item['relative']); ?>')">Delete</button>
                      </div>

                      <div class="audio-player px-3 pb-3">
                        <audio controls preload="none"></audio>
                      </div>
                    </div>
                  </div>
                <?php endforeach; ?>
              </div>
            <?php endif; ?>
          </form>

          <form method="post" id="deleteOneForm" style="display:none;">
            <input type="hidden" name="csrf" value="<?php echo h($csrf); ?>">
            <input type="hidden" name="action" value="delete_one">
            <input type="hidden" name="file" id="deleteOneFile" value="">
          </form>

          <nav class="audio-archive-pager d-flex justify-content-center align-items-center gap-2 mt-3">
            <a class="btn btn-sm btn-outline-secondary <?php echo $page <= 1 ? 'disabled' : ''; ?>"
               href="<?php echo h(page_url(1)); ?>">First</a>
            <a class="btn btn-sm btn-outline-secondary <?php echo $page <= 1 ? 'disabled' : ''; ?>"
               href="<?php echo h(page_url(max(1, $page - 1))); ?>">Previous</a>

            <span class="text-secondary small px-2">Page <?php echo (int)$page; ?> / <?php echo (int)$totalPages; ?></span>

            <a class="btn btn-sm btn-outline-secondary <?php echo $page >= $totalPages ? 'disabled' : ''; ?>"
               href="<?php echo h(page_url(min($totalPages, $page + 1))); ?>">Next</a>
            <a class="btn btn-sm btn-outline-secondary <?php echo $page >= $totalPages ? 'disabled' : ''; ?>"
               href="<?php echo h(page_url($totalPages)); ?>">Last</a>
          </nav>
        <?php endif; ?>

        <div class="text-secondary small mt-3">
          Source: /var/www/html/audiofiles · Newest files are always shown first.
        </div>

<script>
function setupAudioCascadeFilter() {
  var form = document.getElementById('audioFilterForm');
  if (!form) return;

  form.querySelectorAll('.audio-cascade-filter').forEach(function(el) {
    el.addEventListener('change', function() {
      var level = el.getAttribute('data-level');

      var month = form.querySelector('[name="month"]');
      var date = form.querySelector('[name="date"]');
      var hour = form.querySelector('[name="hour"]');

      if (level === 'year') {
        if (month) month.value = '';
        if (date) date.value = '';
        if (hour) hour.value = '';
      } else if (level === 'month') {
        if (date) date.value = '';
        if (hour) hour.value = '';
      } else if (level === 'date') {
        if (hour) hour.value = '';
      }

      form.submit();
    });
  });
}

function confirmDeleteBucket(kind, label, count) {
  var title = 'folder';
  if (kind === 'month') title = 'month folder';
  if (kind === 'day') title = 'day folder';
  if (kind === 'time') title = 'time folder';

  return confirm(
    'Delete entire ' + title + ': ' + label + '\\n' +
    'Files: ' + count + '\\n\\n' +
    'This permanently deletes the audio files in this folder. Continue?'
  );
}

function updateSelectedCount() {
  var count = document.querySelectorAll('.audio-check:checked').length;
  var el = document.getElementById('selectedCount');
  if (el) el.textContent = String(count);
}

function selectAllAudio() {
  document.querySelectorAll('.audio-check').forEach(function(cb) { cb.checked = true; });
  updateSelectedCount();
}

function clearAudioSelection() {
  document.querySelectorAll('.audio-check').forEach(function(cb) { cb.checked = false; });
  updateSelectedCount();
}

function confirmDeleteSelected() {
  var count = document.querySelectorAll('.audio-check:checked').length;
  if (count <= 0) {
    alert('Please select audio files first.');
    return false;
  }
  return confirm('Delete ' + count + ' selected audio file(s)?');
}

function deleteOne(relativePath) {
  if (!confirm('Delete this audio file?')) return;
  document.getElementById('deleteOneFile').value = relativePath;
  document.getElementById('deleteOneForm').submit();
}

function playCard(button, url) {
  var card = button.closest('[data-card]');
  if (!card) return;

  var audio = card.querySelector('audio');
  if (!audio) return;

  document.querySelectorAll('[data-card]').forEach(function(other) {
    if (other !== card) {
      other.classList.remove('playing');
      var otherAudio = other.querySelector('audio');
      if (otherAudio) otherAudio.pause();
    }
  });

  if (audio.getAttribute('src') !== url) {
    audio.setAttribute('src', url);
  }

  card.classList.add('playing');
  audio.play().catch(function(err) {
    console.warn('Audio playback failed:', err);
  });
}

setupAudioCascadeFilter();
updateSelectedCount();
</script>




  </div>
</div>
</body>
</html>
