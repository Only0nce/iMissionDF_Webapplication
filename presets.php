<?php
header('Content-Type: application/json; charset=utf-8');

$path = "/var/lib/openwebrx/preset.json";
if (!file_exists($path)) {
    echo json_encode(['error' => 'preset file not found']);
    exit;
}

$data = json_decode(file_get_contents($path), true);
$currentRx   = $data['currentRx']   ?? [];
$presetsList = $data['presetsList'] ?? [];

// ส่งกลับเป็น JSON
echo json_encode([
    'currentRx'   => $currentRx,
    'presetsList' => $presetsList,
], JSON_UNESCAPED_UNICODE);

