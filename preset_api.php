<?php
header('Content-Type: application/json; charset=utf-8');

$path = "/var/lib/openwebrx/preset.json";

if (!file_exists($path)) {
    echo json_encode(['ok' => false, 'error' => 'preset.json not found']);
    exit;
}

$json = file_get_contents($path);
$data = json_decode($json, true);

if ($data === null) {
    echo json_encode(['ok' => false, 'error' => 'JSON decode error']);
    exit;
}

$presetsList = $data['presetsList'] ?? [];

$action = $_POST['action'] ?? '';

if ($action === 'rename') {
    $id   = $_POST['id']   ?? '';
    $name = $_POST['name'] ?? '';

    if ($id === '' || !isset($presetsList[$id])) {
        echo json_encode(['ok' => false, 'error' => 'Preset not found for id: ' . $id]);
        exit;
    }

    // ใช้ข้อมูลเดิมทั้งหมดจาก PHP แล้วเปลี่ยนแค่ name
    $presetsList[$id]['name'] = $name;

    // เขียนกลับลงไฟล์
    $data['presetsList'] = $presetsList;
    file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

    // ดึงค่าปัจจุบันของ preset นี้ส่งกลับไปให้ JS ใช้
    $preset = $presetsList[$id];

    echo json_encode([
        'ok'     => true,
        'id'     => $id,
        'preset' => $preset
    ]);
    exit;
}

/* ถ้ามี action อื่น ๆ เช่น add/delete อยู่แล้ว ก็เขียนต่อข้างล่างนี้ */

echo json_encode(['ok' => false, 'error' => 'Invalid action']);
