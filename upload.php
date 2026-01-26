<?php
$targetDir = "/var/www/html/uploads/";
$targetFile = $targetDir . "iScan.bin";
$fileType = strtolower(pathinfo($_FILES["updateFile"]["name"], PATHINFO_EXTENSION));

// Allow only .bin uploads
if ($fileType !== "bin") {
    echo "Error: Only .bin files are allowed.";
    exit;
}

// Delete existing iScan.bin if exists
if (file_exists($targetFile)) {
    unlink($targetFile);
}

if (move_uploaded_file($_FILES["updateFile"]["tmp_name"], $targetFile)) {
    echo "Upload successful. Saved as iScan.bin";

    // Optional: execute handler
    $output = shell_exec("/usr/bin/handle_update " . escapeshellarg($targetFile));
    echo "<pre>$output</pre>";
} else {
    echo "Upload failed.";
}
?>

