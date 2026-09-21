<?php
header('Content-Type: application/json; charset=utf-8');

// Preferred Wi‑Fi interface. Resolution is case-insensitive and can fall back to the first Wi‑Fi device.
$WIFI_DEV = 'wlP9p1s0';
$USE_SUDO_FOR_NMCLI = false;
$USE_SUDO_FOR_MMCLI = false;
$USE_SUDO_FOR_WRITE_ACTIONS = true;
$DEBUG_LOG_FILE = '/tmp/wifi_api_debug.log';


function debug_log($tag, $data) {
    global $DEBUG_LOG_FILE;
    $line = '[' . date('Y-m-d H:i:s') . '] ' . $tag . ' ';
    if (is_array($data) || is_object($data)) {
        $line .= json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } else {
        $line .= (string)$data;
    }
    $line .= PHP_EOL;
    @file_put_contents($DEBUG_LOG_FILE, $line, FILE_APPEND);
}

function command_exists($command) {
    [$rc, $out, $txt] = run_cmd('command -v ' . escapeshellarg($command));
    return $rc === 0 && trim($txt) !== '';
}

function is_sudo_permission_error($text) {
    $text = strtolower((string)$text);
    if ($text === '') return false;
    $needles = [
        'a password is required',
        'sudo:',
        'not allowed to execute',
        'is not in the sudoers file',
        'permission denied',
        'insufficient privileges',
        'polkit',
        'authentication is required',
        'interactive authentication required',
        'must be root',
    ];
    foreach ($needles as $needle) {
        if (strpos($text, $needle) !== false) return true;
    }
    return false;
}

function json_ok($data = []) {
    echo json_encode(['ok' => true, 'data' => $data], JSON_UNESCAPED_UNICODE);
    exit;
}

function json_err($msg, $code = 500, $extra = []) {
    http_response_code(is_int($code) ? $code : 500);
    echo json_encode(array_merge([
        'ok'   => false,
        'msg'  => $msg,
        'code' => $code,
    ], $extra), JSON_UNESCAPED_UNICODE);
    exit;
}

function run_cmd($cmd) {
    global $USE_SUDO_FOR_NMCLI, $USE_SUDO_FOR_MMCLI;

    $trimmed = ltrim((string)$cmd);
    if (strpos($trimmed, 'sudo ') !== 0) {
        if ($USE_SUDO_FOR_NMCLI && preg_match('/^nmcli(\s|$)/', $trimmed)) {
            $cmd = 'sudo -n ' . $trimmed;
        } elseif ($USE_SUDO_FOR_MMCLI && preg_match('/^mmcli(\s|$)/', $trimmed)) {
            $cmd = 'sudo -n ' . $trimmed;
        }
    }

    $out = [];
    $rc  = 0;
    exec($cmd . ' 2>&1', $out, $rc);
    return [$rc, $out, implode("\n", $out)];
}

function run_cmd_sudo($cmd) {
    $trimmed = ltrim((string)$cmd);
    if (strpos($trimmed, 'sudo ') !== 0) {
        $cmd = 'sudo -n ' . $trimmed;
    }
    $out = [];
    $rc  = 0;
    exec($cmd . ' 2>&1', $out, $rc);
    return [$rc, $out, implode("\n", $out)];
}

function run_nmcli($cmd, $writeAction = false) {
    global $USE_SUDO_FOR_WRITE_ACTIONS;
    if ($writeAction && $USE_SUDO_FOR_WRITE_ACTIONS) {
        return run_cmd_sudo($cmd);
    }
    return run_cmd($cmd);
}

function json_write_permission_err($actionName, $stderr, $extra = []) {
    $msg = 'NetworkManager write action failed for ' . $actionName . '. ';
    if (is_sudo_permission_error($stderr)) {
        $msg .= 'The web-server user cannot run nmcli write actions with sudo. Configure sudoers for passwordless nmcli.';
    } else {
        $msg .= trim((string)$stderr);
    }
    json_err($msg, 500, array_merge(['permission_issue' => is_sudo_permission_error($stderr)], $extra));
}


function ensure_nmcli_available() {
    if (!function_exists('exec')) {
        json_err('PHP exec() is disabled. Enable exec for the web server user before using Wi‑Fi controls.', 500);
    }

    [$rcNmcli, $outNmcli, $txtNmcli] = run_cmd('command -v nmcli');
    if ($rcNmcli !== 0 || trim($txtNmcli) === '') {
        json_err('nmcli command was not found on this system.', 500);
    }

    [$rcGeneral, $outGeneral, $txtGeneral] = run_cmd('nmcli -t -f RUNNING general');
    if ($rcGeneral !== 0) {
        json_err('NetworkManager is not accessible from PHP. Check service state and web-server permissions. ' . $txtGeneral, 500);
    }
}

function nmcli_split_escaped($line, $limit = null) {
    $parts = [];
    $buf = '';
    $len = strlen($line);
    $escaped = false;

    for ($i = 0; $i < $len; $i++) {
        $ch = $line[$i];

        if ($escaped) {
            $buf .= $ch;
            $escaped = false;
            continue;
        }

        if ($ch === '\\') {
            $escaped = true;
            continue;
        }

        if ($ch === ':' && ($limit === null || count($parts) < $limit - 1)) {
            $parts[] = $buf;
            $buf = '';
            continue;
        }

        $buf .= $ch;
    }

    if ($escaped) {
        $buf .= '\\';
    }

    $parts[] = $buf;
    return $parts;
}

function get_wifi_devices() {
    ensure_nmcli_available();
    [$rc, $lines, $txt] = run_cmd('nmcli -t -f DEVICE,TYPE device status');
    if ($rc !== 0) {
        json_err('Unable to read device list from NetworkManager. ' . $txt, 500);
    }

    $wifi = [];
    foreach ($lines as $line) {
        if (trim($line) === '') continue;
        $parts = nmcli_split_escaped($line, 2);
        $device = trim($parts[0] ?? '');
        $type   = trim($parts[1] ?? '');
        if ($device === '') continue;
        if ($type === 'wifi' || $type === '802-11-wireless') {
            $wifi[] = $device;
        }
    }
    return $wifi;
}

function resolve_wifi_device($preferred) {
    $devices = get_wifi_devices();
    if (empty($devices)) {
        json_err('No Wi‑Fi interface was found by NetworkManager.', 404);
    }

    foreach ($devices as $dev) {
        if ($dev === $preferred) return $dev;
    }
    foreach ($devices as $dev) {
        if (strcasecmp($dev, $preferred) === 0) return $dev;
    }
    return $devices[0];
}

function mask_to_prefix($mask) {
    $parts = explode('.', trim($mask));
    if (count($parts) !== 4) return null;

    $bin = '';
    foreach ($parts as $part) {
        if ($part === '' || !ctype_digit($part)) return null;
        $num = intval($part);
        if ($num < 0 || $num > 255) return null;
        $bin .= str_pad(decbin($num), 8, '0', STR_PAD_LEFT);
    }

    if (!preg_match('/^1*0*$/', $bin)) return null;
    return substr_count($bin, '1');
}

function get_radio_enabled() {
    [$rc, $lines, $txt] = run_cmd('nmcli radio wifi');
    if ($rc !== 0) {
        json_err('Unable to read Wi‑Fi radio state. ' . $txt, 500);
    }
    $val = strtolower(trim($lines[0] ?? ''));
    return in_array($val, ['enabled', 'on'], true);
}

function get_active_wifi_connection($wifiDev) {
    [$rc, $lines, $txt] = run_cmd('nmcli -t -f GENERAL.CONNECTION,GENERAL.DEVICE device show ' . escapeshellarg($wifiDev));
    if ($rc !== 0) return null;

    $connName = '';
    $devName  = '';

    foreach ($lines as $line) {
        if (strpos($line, ':') === false) continue;
        [$k, $v] = explode(':', $line, 2);
        $k = trim($k);
        $v = trim($v);
        if ($k === 'GENERAL.CONNECTION') $connName = $v;
        if ($k === 'GENERAL.DEVICE')     $devName  = $v;
    }

    if ($connName === '' || $connName === '--') return null;
    if ($devName === '') $devName = $wifiDev;

    return [
        'name'   => $connName,
        'device' => $devName,
    ];
}

function get_active_connection_ssid($connName) {
    if (!$connName) return '';
    [$rc, $lines, $txt] = run_cmd('nmcli -g 802-11-wireless.ssid connection show ' . escapeshellarg($connName));
    if ($rc !== 0) return '';
    return trim($lines[0] ?? '');
}

function band_label_from_freq($freq) {
    $freq = intval($freq);
    if ($freq >= 4900) return '5 GHz';
    if ($freq >= 2400) return '2.4 GHz';
    if ($freq > 0) return $freq . ' MHz';
    return '';
}

function make_row_key($ssid, $bssid, $freq, $channel) {
    $ssid = trim((string)$ssid);
    $bssid = trim((string)$bssid);
    $freq = trim((string)$freq);
    $channel = trim((string)$channel);
    if ($bssid !== '') return strtolower($bssid);
    return strtolower($ssid . '|' . $freq . '|' . $channel);
}

function get_wifi_profiles_by_ssid() {
    [$rc, $lines, $txt] = run_cmd('nmcli -t -f NAME,TYPE connection show');
    if ($rc !== 0) {
        json_err('Unable to read saved Wi‑Fi profiles. ' . $txt, 500);
    }

    $profiles = [];
    foreach ($lines as $line) {
        if (trim($line) === '') continue;
        $parts = nmcli_split_escaped($line, 2);
        $name = trim($parts[0] ?? '');
        $type = trim($parts[1] ?? '');
        if ($name === '') continue;
        if ($type !== '802-11-wireless' && $type !== 'wifi') continue;

        [$rcSsid, $ssidLines, $ssidTxt] = run_cmd('nmcli -g 802-11-wireless.ssid connection show ' . escapeshellarg($name));
        if ($rcSsid !== 0) continue;

        $ssid = trim($ssidLines[0] ?? '');
        if ($ssid === '') continue;
        if (!isset($profiles[$ssid])) {
            $profiles[$ssid] = $name;
        }
    }
    return $profiles;
}

function findWifiConnectionNameBySsid($ssid) {
    $ssid = trim((string)$ssid);
    if ($ssid === '') return null;
    $profiles = get_wifi_profiles_by_ssid();
    return $profiles[$ssid] ?? null;
}

function parse_connection_ipv4($connName) {
    [$rc, $lines, $txt] = run_cmd(
        'nmcli -t -f ipv4.method,ipv4.addresses,ipv4.gateway,ipv4.dns,ipv4.ignore-auto-dns connection show ' . escapeshellarg($connName)
    );
    if ($rc !== 0) {
        json_err('Unable to read IPv4 settings for profile ' . $connName . '. ' . $txt, 500);
    }

    $info = [
        'ipv4_method'       => 'auto',
        'ipv4_addresses'    => '',
        'ipv4_gateway'      => '',
        'dns'               => '',
        'dns_auto'          => true,
    ];

    foreach ($lines as $line) {
        if (strpos($line, ':') === false) continue;
        [$k, $v] = explode(':', $line, 2);
        $k = trim($k);
        $v = trim($v);
        switch ($k) {
            case 'ipv4.method':
                $info['ipv4_method'] = $v !== '' ? $v : 'auto';
                break;
            case 'ipv4.addresses':
                $info['ipv4_addresses'] = $v;
                break;
            case 'ipv4.gateway':
                $info['ipv4_gateway'] = $v;
                break;
            case 'ipv4.dns':
                $info['dns'] = str_replace(';', ', ', $v);
                break;
            case 'ipv4.ignore-auto-dns':
                $info['dns_auto'] = !in_array(strtolower($v), ['yes', 'true', '1'], true);
                break;
        }
    }

    return $info;
}

function prefix_to_mask($prefix) {
    $prefix = intval($prefix);
    if ($prefix < 0 || $prefix > 32) return '';
    $mask = [];
    for ($i = 0; $i < 4; $i++) {
        if ($prefix >= 8) {
            $mask[] = 255;
            $prefix -= 8;
        } elseif ($prefix > 0) {
            $mask[] = 256 - (1 << (8 - $prefix));
            $prefix = 0;
        } else {
            $mask[] = 0;
        }
    }
    return implode('.', $mask);
}

function parse_device_ipv4($wifiDev) {
    [$rc, $lines, $txt] = run_cmd('nmcli -t device show ' . escapeshellarg($wifiDev));
    if ($rc !== 0) {
        return [
            'dev_ip4_address' => '',
            'dev_ip4_gateway' => '',
            'dev_ip4_plain'   => '',
            'dev_ip4_prefix'  => '',
            'dev_ip4_netmask' => '',
        ];
    }

    $devIp4 = '';
    $devGw4 = '';
    foreach ($lines as $line) {
        if (strpos($line, ':') === false) continue;
        [$k, $v] = explode(':', $line, 2);
        $k = trim($k);
        $v = trim($v);
        if ($k === 'IP4.ADDRESS[1]' && $devIp4 === '') $devIp4 = $v;
        if ($k === 'IP4.GATEWAY' && $devGw4 === '')    $devGw4 = $v;
    }

    $plain = '';
    $prefix = '';
    $netmask = '';
    if ($devIp4 !== '') {
        $ipParts = explode('/', $devIp4, 2);
        $plain = trim($ipParts[0] ?? '');
        $prefix = trim($ipParts[1] ?? '');
        if ($prefix !== '' && ctype_digit($prefix)) {
            $netmask = prefix_to_mask(intval($prefix));
        }
    }

    return [
        'dev_ip4_address' => $devIp4,
        'dev_ip4_gateway' => $devGw4,
        'dev_ip4_plain'   => $plain,
        'dev_ip4_prefix'  => $prefix,
        'dev_ip4_netmask' => $netmask,
    ];
}

function parse_key_value_lines($lines) {
    $map = [];
    foreach ($lines as $line) {
        if (strpos($line, ':') === false) continue;
        [$k, $v] = explode(':', $line, 2);
        $k = trim($k);
        $v = trim($v);
        if ($k === '') continue;
        $map[$k] = $v;
    }
    return $map;
}

function pick_first_value($map, $keys) {
    foreach ($keys as $key) {
        $value = trim((string)($map[$key] ?? ''));
        if ($value !== '' && $value !== '--') return $value;
    }
    return '';
}

function find_lte_nm_device() {
    [$rc, $lines, $txt] = run_cmd('nmcli -t -f DEVICE,TYPE,STATE,CONNECTION device status');
    if ($rc !== 0) return null;

    $fallback = null;
    foreach ($lines as $line) {
        if (trim($line) === '') continue;
        $parts = nmcli_split_escaped($line, 4);
        $device = trim($parts[0] ?? '');
        $type = trim($parts[1] ?? '');
        $state = trim($parts[2] ?? '');
        $connection = trim($parts[3] ?? '');
        if (!in_array($type, ['gsm', 'cdma', 'wwan', 'modem'], true)) continue;
        $row = [
            'device' => $device,
            'type' => $type,
            'state' => $state,
            'connection' => $connection,
        ];
        if (in_array(strtolower($state), ['connected', 'connecting'], true)) {
            return $row;
        }
        if ($fallback === null) {
            $fallback = $row;
        }
    }
    return $fallback;
}

function find_first_modem_id() {
    if (!command_exists('mmcli')) return '';
    [$rc, $lines, $txt] = run_cmd('mmcli -L');
    if ($rc !== 0) return '';
    foreach ($lines as $line) {
        if (preg_match('~/Modem/(\d+)~', $line, $m)) {
            return $m[1];
        }
    }
    return '';
}

function parse_iface_snapshot($iface) {
    [$rc, $lines, $txt] = run_cmd('ifconfig ' . escapeshellarg($iface));
    if ($rc !== 0 || trim($txt) === '') {
        return null;
    }

    $joined = implode("\n", $lines);
    $flags = '';
    $mtu = '';
    $ipv4 = '';
    $ipv6 = '';
    $address = '';
    $txQueue = '';
    $rxPackets = '';
    $rxBytes = '';
    $txPackets = '';
    $txBytes = '';

    if (preg_match('/flags=\d+<([^>]+)>/', $joined, $m)) {
        $flags = trim($m[1]);
    }
    if (preg_match('/\bmtu\s+(\d+)/i', $joined, $m)) {
        $mtu = trim($m[1]);
    }
    if (preg_match('/\binet\s+([0-9.]+)/i', $joined, $m)) {
        $ipv4 = trim($m[1]);
    }
    if (preg_match('/\binet6\s+([0-9a-f:]+)/i', $joined, $m)) {
        $ipv6 = trim($m[1]);
    }
    if (preg_match('/\b(ether|unspec)\s+([^\n]+)/i', $joined, $m)) {
        $address = trim($m[1] . ' ' . trim($m[2]));
        $address = preg_replace('/\s+txqueuelen\s+\d+.*$/i', '', $address);
    }
    if (preg_match('/\btxqueuelen\s+(\d+)/i', $joined, $m)) {
        $txQueue = trim($m[1]);
    }
    if (preg_match('/RX packets\s+(\d+)\s+bytes\s+(\d+)/i', $joined, $m)) {
        $rxPackets = trim($m[1]);
        $rxBytes = trim($m[2]);
    }
    if (preg_match('/TX packets\s+(\d+)\s+bytes\s+(\d+)/i', $joined, $m)) {
        $txPackets = trim($m[1]);
        $txBytes = trim($m[2]);
    }

    $gateway = '';
    [$rcGw, $gwLines, $gwTxt] = run_cmd('ip -4 route show default dev ' . escapeshellarg($iface));
    if ($rcGw === 0) {
        $gwJoined = implode("\n", $gwLines);
        if (preg_match('/\bvia\s+([0-9.]+)/i', $gwJoined, $m)) {
            $gateway = trim($m[1]);
        }
    }

    return [
        'iface' => $iface,
        'flags' => $flags,
        'mtu' => $mtu,
        'ipv4' => $ipv4,
        'ipv6' => $ipv6,
        'address' => $address,
        'tx_queue' => $txQueue,
        'rx_packets' => $rxPackets,
        'rx_bytes' => $rxBytes,
        'tx_packets' => $txPackets,
        'tx_bytes' => $txBytes,
        'gateway' => $gateway,
    ];
}


function read_lte_signal_from_csq() {
    $result = [
        'ok' => false,
        'signal' => '',
        'csq' => '',
        'dbm' => '',
        'raw' => '',
        'permission_issue' => false,
        'error' => '',
    ];

    if (!command_exists('socat')) {
        $result['error'] = 'socat command not found';
        debug_log('lte_csq', $result);
        return $result;
    }

    if (!file_exists('/dev/mhi_DUN')) {
        $result['error'] = '/dev/mhi_DUN not found';
        debug_log('lte_csq', $result);
        return $result;
    }

    $shell = 'printf "AT+CSQ\\r" | socat - /dev/mhi_DUN,crnl';
    [$rc, $lines, $txt] = run_cmd('bash -lc ' . escapeshellarg($shell));
    $result['raw'] = trim((string)$txt);

    if ($rc !== 0) {
        $result['error'] = trim((string)$txt) !== '' ? trim((string)$txt) : 'AT+CSQ command failed';
        debug_log('lte_csq', $result);
        return $result;
    }

    if (preg_match('/\+CSQ:\s*(\d+)\s*,\s*(\d+)/i', $txt, $m)) {
        $csq = (int)$m[1];
        if ($csq >= 0 && $csq <= 31) {
            $dbm = -113 + (2 * $csq);
            $result['ok'] = true;
            $result['csq'] = (string)$csq;
            $result['dbm'] = (string)$dbm;
            $result['signal'] = $dbm . ' dBm';
        } elseif ($csq === 99) {
            $result['error'] = 'CSQ unknown';
        } else {
            $result['error'] = 'CSQ out of range: ' . $csq;
        }
    } else {
        $result['error'] = 'Unable to parse +CSQ response';
    }

    debug_log('lte_csq', $result);
    return $result;
}

function get_lte_state() {
    $state = [
        'sim_status' => 'No data',
        'operator' => '',
        'signal' => '',
        'registration_state' => '',
        'access_technology' => '',
        'imei' => '',
        'iccid' => '',
        'ip_address' => '',
        'gateway' => '',
        'device' => '',
        'note' => 'No LTE interface data available from backend yet.',
    ];

    $primaryIface = 'rmnet_mhi0.1';
    $fallbackIface = 'rmnet_mhi0';
    $snapshot = parse_iface_snapshot($primaryIface);
    if ($snapshot === null) {
        $snapshot = parse_iface_snapshot($fallbackIface);
    }

    if ($snapshot !== null) {
        $state['device'] = $snapshot['iface'];
        $state['operator'] = $snapshot['iface'];
        $state['registration_state'] = $snapshot['flags'] ?: '--';
        $state['ip_address'] = $snapshot['ipv4'] ?: 'No IPv4 assigned';
        $state['gateway'] = $snapshot['gateway'] ?: '--';
        $state['access_technology'] = $snapshot['ipv6'] ?: '';

        $flagsWords = strtolower((string)$snapshot['flags']);
        if ($flagsWords !== '' && strpos($flagsWords, 'up') !== false && strpos($flagsWords, 'running') !== false) {
            $state['sim_status'] = 'Ready';
        } elseif ($flagsWords !== '') {
            $state['sim_status'] = 'Not found';
        }

        $noteParts = [];
        $noteParts[] = 'Using interface ' . $snapshot['iface'] . ' (fallback ' . $fallbackIface . ')';
        if ($snapshot['ipv6'] !== '') $noteParts[] = 'IPv6 ' . $snapshot['ipv6'];
        if ($snapshot['mtu'] !== '') $noteParts[] = 'MTU ' . $snapshot['mtu'];
        if ($snapshot['tx_queue'] !== '') $noteParts[] = 'Queue ' . $snapshot['tx_queue'];
        $state['note'] = implode(' · ', $noteParts);
    }

    // Keep optional modem metadata when available, but the interface above is the primary source.
    $nmDevice = find_lte_nm_device();
    if ($nmDevice && $state['device'] === '') {
        $state['device'] = $nmDevice['device'];
        $live = parse_device_ipv4($nmDevice['device']);
        $state['ip_address'] = $live['dev_ip4_plain'] ?: $state['ip_address'];
        $state['gateway'] = $live['dev_ip4_gateway'] ?: $state['gateway'];
        if (!empty($nmDevice['connection']) && $state['operator'] === '') {
            $state['operator'] = $nmDevice['connection'];
        }
    }

    $csqSignal = read_lte_signal_from_csq();
    if ($csqSignal['ok']) {
        $state['signal'] = $csqSignal['signal'];
    }

    if (command_exists('mmcli')) {
        $modemId = find_first_modem_id();
        if ($modemId !== '') {
            [$rcModem, $modemLines, $modemTxt] = run_cmd('mmcli -m ' . escapeshellarg($modemId) . ' -K');
            if ($rcModem === 0) {
                $modem = parse_key_value_lines($modemLines);
                $simPath = pick_first_value($modem, ['modem.generic.sim', 'modem.3gpp.sim']);
                $operator = pick_first_value($modem, ['modem.3gpp.operator-name', 'modem.3gpp.operator-code']);
                $signal = pick_first_value($modem, ['modem.generic.signal-quality.value', 'modem.signal-quality.value']);
                $access = pick_first_value($modem, ['modem.generic.access-technologies', 'modem.3gpp.packet-service-state']);
                $imei = pick_first_value($modem, ['modem.3gpp.imei', 'modem.generic.equipment-identifier']);

                if ($operator !== '' && $state['operator'] === '') $state['operator'] = $operator;
                if ($state['signal'] === '' && $signal !== '') $state['signal'] = rtrim($signal, '%') . '%';
                if ($access !== '' && $state['access_technology'] === '') $state['access_technology'] = $access;
                if ($imei !== '') $state['imei'] = $imei;

                if ($simPath !== '') {
                    [$rcSim, $simLines, $simTxt] = run_cmd('mmcli -i ' . escapeshellarg($simPath) . ' -K');
                    if ($rcSim === 0) {
                        $sim = parse_key_value_lines($simLines);
                        $iccid = pick_first_value($sim, ['sim.properties.iccid', 'sim.iccid']);
                        if ($iccid !== '') $state['iccid'] = $iccid;
                    }
                }
            }
        }
    }

    if ($state['signal'] === '') {
        $state['signal'] = '--';
    }

    debug_log('lte_state', $state);
    return $state;
}

$action  = isset($_GET['action']) ? trim($_GET['action']) : '';
$method  = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$rawBody = file_get_contents('php://input');
$payload = json_decode($rawBody, true);
if (!is_array($payload)) $payload = [];

try {
    $wifiDev = null;
    $wifiActions = ['wifi_state', 'scan', 'join', 'disconnect', 'forget', 'advinfo', 'apply_ipv4', 'wifi_toggle'];
    if (in_array($action, $wifiActions, true)) {
        $wifiDev = resolve_wifi_device($WIFI_DEV);
    }

    switch ($action) {
        case 'lte_state': {
            json_ok(get_lte_state());
        }

        case 'wifi_state': {
            $enabled = get_radio_enabled();
            $active = get_active_wifi_connection($wifiDev);
            $live = $active ? parse_device_ipv4($wifiDev) : [
                'dev_ip4_address' => '',
                'dev_ip4_gateway' => '',
                'dev_ip4_plain'   => '',
                'dev_ip4_prefix'  => '',
                'dev_ip4_netmask' => '',
            ];
            json_ok([
                'enabled'         => $enabled,
                'device'          => $wifiDev,
                'active'          => (bool)$active,
                'connection_name' => $active['name'] ?? '',
                'active_ssid'     => $active ? get_active_connection_ssid($active['name']) : '',
                'current_ip'      => $live['dev_ip4_plain'] ?? '',
                'current_gateway' => $live['dev_ip4_gateway'] ?? '',
                'current_netmask' => $live['dev_ip4_netmask'] ?? '',
                'warning'         => '',
            ]);
        }

        case 'scan': {
            $enabled = get_radio_enabled();
            if (!$enabled) {
                json_ok([
                    'enabled' => false,
                    'device'  => $wifiDev,
                    'count'   => 0,
                    'rows'    => [],
                ]);
            }

            $profiles = get_wifi_profiles_by_ssid();
            $activeConn = get_active_wifi_connection($wifiDev);
            $activeSsid = $activeConn ? get_active_connection_ssid($activeConn['name']) : '';
            $live = $activeConn ? parse_device_ipv4($wifiDev) : [
                'dev_ip4_address' => '',
                'dev_ip4_gateway' => '',
                'dev_ip4_plain'   => '',
                'dev_ip4_prefix'  => '',
                'dev_ip4_netmask' => '',
            ];

            // Try a sudo rescan first, then fall back to a normal rescan so the page stays usable.
            $scanWarning = '';
            [$rcRescan, $rescanLines, $rescanTxt] = run_cmd_sudo('nmcli device wifi rescan ifname ' . escapeshellarg($wifiDev));
            if ($rcRescan !== 0) {
                $scanWarning = trim($rescanTxt);
                [$rcRescan2, $rescanLines2, $rescanTxt2] = run_cmd('nmcli device wifi rescan ifname ' . escapeshellarg($wifiDev));
                if ($rcRescan2 === 0) {
                    $rcRescan = 0;
                    $rescanTxt = $rescanTxt2;
                    if ($scanWarning !== '') {
                        $scanWarning = 'sudo rescan unavailable, fallback used';
                    }
                } else {
                    $scanWarning = trim(($scanWarning ? $scanWarning . ' | ' : '') . $rescanTxt2);
                }
            }
            usleep(900000);

            [$rc, $lines, $txt] = run_cmd(
                'nmcli -t -f IN-USE,BSSID,SSID,CHAN,FREQ,SIGNAL,SECURITY device wifi list ifname ' . escapeshellarg($wifiDev)
            );
            debug_log('wifi_scan', [
                'device' => $wifiDev,
                'rescan_rc' => $rcRescan,
                'rescan_txt' => $rescanTxt,
                'scan_warning' => $scanWarning,
                'list_rc' => $rc,
                'list_lines' => count($lines),
            ]);
            if ($rc !== 0) {
                json_err('Wi‑Fi scan failed. ' . $txt, 500, ['warning' => $scanWarning]);
            }

            $rows = [];
            foreach ($lines as $line) {
                if (trim($line) === '') continue;
                $parts = nmcli_split_escaped($line, 7);
                $inuse   = trim($parts[0] ?? '');
                $bssid   = trim($parts[1] ?? '');
                $ssid    = trim($parts[2] ?? '');
                $channel = trim($parts[3] ?? '');
                $freq    = trim($parts[4] ?? '');
                $signal  = intval(trim($parts[5] ?? '0'));
                $sec     = trim($parts[6] ?? '');
                if ($ssid === '') continue;

                $rows[] = [
                    'key'          => make_row_key($ssid, $bssid, $freq, $channel),
                    'ssid'         => $ssid,
                    'bssid'        => $bssid,
                    'channel'      => $channel,
                    'frequency'    => $freq,
                    'band'         => band_label_from_freq($freq),
                    'signal'       => max(0, min(100, $signal)),
                    'secure'       => ($sec !== '' && $sec !== '--'),
                    'security'     => $sec,
                    'active'       => ($inuse === '*'),
                    'known'        => isset($profiles[$ssid]),
                    'profile_name' => $profiles[$ssid] ?? '',
                    'device'       => $wifiDev,
                ];
            }

            usort($rows, function ($a, $b) {
                if ($a['active'] !== $b['active']) return $a['active'] ? -1 : 1;
                if ($a['known'] !== $b['known'])   return $a['known'] ? -1 : 1;
                if ($a['signal'] !== $b['signal']) return $a['signal'] > $b['signal'] ? -1 : 1;
                if (strcasecmp($a['ssid'], $b['ssid']) !== 0) return strcasecmp($a['ssid'], $b['ssid']);
                if (intval($a['frequency']) !== intval($b['frequency'])) return intval($a['frequency']) > intval($b['frequency']) ? -1 : 1;
                return strcasecmp($a['bssid'], $b['bssid']);
            });

            json_ok([
                'enabled'         => true,
                'device'          => $wifiDev,
                'count'           => count($rows),
                'rows'            => $rows,
                'active_ssid'     => $activeSsid,
                'current_ip'      => $live['dev_ip4_plain'] ?? '',
                'current_gateway' => $live['dev_ip4_gateway'] ?? '',
                'current_netmask' => $live['dev_ip4_netmask'] ?? '',
            ]);
        }

        case 'join': {
            if ($method !== 'POST') json_err('Method not allowed', 405);

            $ssid = trim((string)($payload['ssid'] ?? ''));
            $pass = (string)($payload['password'] ?? '');
            $bssid = trim((string)($payload['bssid'] ?? ''));
            if ($ssid === '') json_err('Missing ssid', 400);

            $connectCmd = 'nmcli device wifi connect ' . escapeshellarg($ssid);
            if ($bssid !== '') {
                $connectCmd .= ' bssid ' . escapeshellarg($bssid);
            }
            $connectCmd .= ' ifname ' . escapeshellarg($wifiDev);
            if ($pass !== '') {
                $connectCmd .= ' password ' . escapeshellarg($pass);
            }

            debug_log('join_request', ['ssid' => $ssid, 'bssid' => $bssid, 'device' => $wifiDev]);
            [$rcConnect, $connectLines, $connectTxt] = run_nmcli($connectCmd, true);
            if ($rcConnect === 0) {
                $profileName = findWifiConnectionNameBySsid($ssid);
                json_ok([
                    'ssid'         => $ssid,
                    'bssid'        => $bssid,
                    'device'       => $wifiDev,
                    'used_profile' => $profileName !== null,
                    'profile_name' => $profileName ?? '',
                    'output'       => $connectLines,
                ]);
            }

            $profileName = findWifiConnectionNameBySsid($ssid);
            if ($profileName !== null) {
                [$rcUp, $upLines, $upTxt] = run_nmcli(
                    'nmcli connection up ' . escapeshellarg($profileName) . ' ifname ' . escapeshellarg($wifiDev),
                    true
                );
                if ($rcUp === 0) {
                    json_ok([
                        'ssid'         => $ssid,
                        'bssid'        => $bssid,
                        'device'       => $wifiDev,
                        'used_profile' => true,
                        'profile_name' => $profileName,
                        'output'       => $upLines,
                    ]);
                }
                json_write_permission_err('join', ($connectTxt ?: $upTxt), [
                    'ssid' => $ssid,
                    'bssid' => $bssid,
                    'device' => $wifiDev,
                    'profile_name' => $profileName,
                ]);
            }

            json_write_permission_err('join', $connectTxt, ['ssid' => $ssid, 'bssid' => $bssid, 'device' => $wifiDev]);
        }

        case 'disconnect': {
            if ($method !== 'POST') json_err('Method not allowed', 405);
            $device = trim((string)($payload['device'] ?? $wifiDev));
            debug_log('disconnect_request', ['device' => $device]);
            [$rc, $lines, $txt] = run_nmcli('nmcli device disconnect ' . escapeshellarg($device), true);
            if ($rc !== 0) {
                json_write_permission_err('disconnect', $txt, ['device' => $device]);
            }
            json_ok(['device' => $device, 'output' => $lines]);
        }

        case 'forget': {
            if ($method !== 'POST') json_err('Method not allowed', 405);
            $ssid = trim((string)($payload['ssid'] ?? ''));
            if ($ssid === '') json_err('Missing ssid', 400);

            $connName = findWifiConnectionNameBySsid($ssid);
            if ($connName === null) {
                json_err('Saved Wi‑Fi profile was not found for this SSID.', 404, ['ssid' => $ssid]);
            }

            debug_log('forget_request', ['ssid' => $ssid, 'connection_name' => $connName]);
            [$rc, $out, $txt] = run_nmcli('nmcli connection delete ' . escapeshellarg($connName), true);
            if ($rc !== 0) {
                json_write_permission_err('forget', $txt, ['ssid' => $ssid, 'connection_name' => $connName]);
            }

            json_ok([
                'ssid'            => $ssid,
                'connection_name' => $connName,
                'output'          => $out,
            ]);
        }

        case 'advinfo': {
            $ssid = trim((string)($_GET['ssid'] ?? ''));
            $activeConn = get_active_wifi_connection($wifiDev);
            $activeSsid = $activeConn ? get_active_connection_ssid($activeConn['name']) : '';

            $connName = null;
            if ($ssid !== '') {
                $connName = findWifiConnectionNameBySsid($ssid);
                if ($connName === null && $activeConn && $activeSsid === $ssid) {
                    $connName = $activeConn['name'];
                }
                if ($connName === null) {
                    json_err('No saved or active profile was found for this SSID.', 404, ['ssid' => $ssid]);
                }
            } else {
                if (!$activeConn) {
                    json_err('Wi‑Fi is not connected and no SSID was provided.', 404);
                }
                $connName = $activeConn['name'];
                $ssid = $activeSsid;
            }

            $info = parse_connection_ipv4($connName);
            $live = ['dev_ip4_address' => '', 'dev_ip4_gateway' => ''];
            $isActiveTarget = ($activeConn && $activeConn['name'] === $connName);
            if ($isActiveTarget) {
                $live = parse_device_ipv4($wifiDev);
            }

            json_ok(array_merge($info, $live, [
                'ssid'            => $ssid,
                'device'          => $wifiDev,
                'connection_name' => $connName,
                'active'          => $isActiveTarget,
            ]));
        }

        case 'apply_ipv4': {
            if ($method !== 'POST') json_err('Method not allowed', 405);

            $ssid     = trim((string)($payload['ssid'] ?? ''));
            $methodV4 = trim((string)($payload['method'] ?? 'auto'));
            $ip       = trim((string)($payload['ip'] ?? ''));
            $mask     = trim((string)($payload['mask'] ?? ''));
            $gw       = trim((string)($payload['gw'] ?? ''));
            $dnsAuto  = (bool)($payload['dns_auto'] ?? true);
            $dns      = trim((string)($payload['dns'] ?? ''));

            $activeConn = get_active_wifi_connection($wifiDev);
            $activeSsid = $activeConn ? get_active_connection_ssid($activeConn['name']) : '';

            $connName = null;
            if ($ssid !== '') {
                $connName = findWifiConnectionNameBySsid($ssid);
                if ($connName === null && $activeConn && $activeSsid === $ssid) {
                    $connName = $activeConn['name'];
                }
            } elseif ($activeConn) {
                $connName = $activeConn['name'];
                $ssid = $activeSsid;
            }

            if ($connName === null) {
                json_err('Saved Wi‑Fi profile was not found for applying IPv4 settings.', 404, ['ssid' => $ssid]);
            }

            if ($methodV4 === 'manual') {
                if ($ip === '' || $mask === '') {
                    json_err('Manual IPv4 requires both IP Address and Subnet Mask.', 400);
                }
                $prefix = mask_to_prefix($mask);
                if ($prefix === null) {
                    json_err('Invalid Subnet Mask format.', 400);
                }

                debug_log('apply_ipv4_request', ['ssid' => $ssid, 'connection_name' => $connName, 'method' => $methodV4]);
                [$rc1, $out1, $txt1] = run_nmcli(
                    sprintf(
                        'nmcli connection modify %s ipv4.method manual ipv4.addresses %s',
                        escapeshellarg($connName),
                        escapeshellarg($ip . '/' . $prefix)
                    ),
                    true
                );
                if ($rc1 !== 0) json_write_permission_err('apply_ipv4_manual', $txt1, ['connection_name' => $connName]);

                if ($gw !== '') {
                    [$rcGw, $outGw, $txtGw] = run_nmcli(
                        sprintf('nmcli connection modify %s ipv4.gateway %s', escapeshellarg($connName), escapeshellarg($gw)),
                        true
                    );
                    if ($rcGw !== 0) json_write_permission_err('apply_ipv4_gateway', $txtGw, ['connection_name' => $connName]);
                } else {
                    [$rcGw, $outGw, $txtGw] = run_nmcli(
                        sprintf('nmcli connection modify %s ipv4.gateway ""', escapeshellarg($connName)),
                        true
                    );
                    if ($rcGw !== 0) json_write_permission_err('apply_ipv4_clear_gateway', $txtGw, ['connection_name' => $connName]);
                }
            } else {
                [$rc1, $out1, $txt1] = run_nmcli(
                    sprintf(
                        'nmcli connection modify %s ipv4.method auto ipv4.addresses "" ipv4.gateway ""',
                        escapeshellarg($connName)
                    ),
                    true
                );
                if ($rc1 !== 0) json_write_permission_err('apply_ipv4_auto', $txt1, ['connection_name' => $connName]);
            }

            if ($dnsAuto) {
                [$rcDns, $outDns, $txtDns] = run_nmcli(
                    sprintf('nmcli connection modify %s ipv4.dns "" ipv4.ignore-auto-dns no', escapeshellarg($connName)),
                    true
                );
                if ($rcDns !== 0) json_write_permission_err('apply_ipv4_dns_auto', $txtDns, ['connection_name' => $connName]);
            } else {
                [$rcDns, $outDns, $txtDns] = run_nmcli(
                    sprintf('nmcli connection modify %s ipv4.dns %s ipv4.ignore-auto-dns yes', escapeshellarg($connName), escapeshellarg($dns)),
                    true
                );
                if ($rcDns !== 0) json_write_permission_err('apply_ipv4_dns_manual', $txtDns, ['connection_name' => $connName]);
            }

            $reapplied = false;
            $reapplyWarning = '';
            $targetIsActive = ($activeConn && $activeConn['name'] === $connName);
            if ($targetIsActive) {
                [$rcUp, $outUp, $txtUp] = run_nmcli(
                    'nmcli connection up ' . escapeshellarg($connName) . ' ifname ' . escapeshellarg($wifiDev),
                    true
                );
                if ($rcUp === 0) {
                    $reapplied = true;
                } else {
                    $reapplyWarning = $txtUp;
                }
            }

            json_ok([
                'ssid'            => $ssid,
                'device'          => $wifiDev,
                'connection_name' => $connName,
                'active'          => $targetIsActive,
                'reapplied'       => $reapplied,
                'warning'         => $reapplyWarning,
            ]);
        }

        case 'wifi_toggle': {
            if ($method !== 'POST') json_err('Method not allowed', 405);
            $on = !empty($payload['on']);
            debug_log('wifi_toggle_request', ['enabled' => $on, 'device' => $wifiDev]);
            [$rc, $lines, $txt] = run_nmcli($on ? 'nmcli radio wifi on' : 'nmcli radio wifi off', true);
            if ($rc !== 0) {
                json_write_permission_err('wifi_toggle', $txt, ['enabled' => $on]);
            }
            json_ok([
                'enabled' => $on,
                'device'  => $wifiDev,
                'output'  => $lines,
            ]);
        }


        case 'health': {
            [$rcNmcli, $outNmcli, $txtNmcli] = run_cmd('command -v nmcli');
            [$rcGeneral, $outGeneral, $txtGeneral] = run_cmd('nmcli -t -f RUNNING general');
            $mmcliExists = command_exists('mmcli');
            json_ok([
                'exec_enabled' => function_exists('exec'),
                'nmcli_found' => ($rcNmcli === 0 && trim($txtNmcli) !== ''),
                'networkmanager_running' => ($rcGeneral === 0 && trim($txtGeneral) === 'running'),
                'nmcli_general_output' => $txtGeneral,
                'mmcli_found' => $mmcliExists,
                'device' => $wifiDev,
            ]);
        }

        case 'health_write': {
            [$rc, $out, $txt] = run_cmd_sudo('nmcli general permissions');
            json_ok([
                'sudo_write_ready' => ($rc === 0),
                'stdout' => $out,
                'stderr' => $txt,
                'permission_issue' => is_sudo_permission_error($txt),
            ]);
        }

        default:
            json_err('Unknown action', 400, ['action' => $action]);
    }
} catch (Throwable $e) {
    json_err('Unhandled server error: ' . $e->getMessage(), 500);
}