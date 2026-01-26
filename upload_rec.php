<?php
$targetDir = "/var/www/html/uploads/alsarecd_update/";
$targetFile = $targetDir . "update.deb";
$fileType = strtolower(pathinfo($_FILES["fileRecToUpload"]["name"], PATHINFO_EXTENSION));
// echo "fileName" . $_FILES["fileRecToUpload"]["name"] . " ";
// exit;
// Allow only .deb uploads
if ($fileType !== "deb") {
    echo "fileName" . $_FILES["fileRecToUpload"]["name"] . " ";
    echo "Error: Only .deb files are allowed.";
    exit;
}

// Delete existing iScan.bin if exists
if (file_exists($targetFile)) {
    unlink($targetFile);
}

if (move_uploaded_file($_FILES["fileRecToUpload"]["tmp_name"], $targetFile)) {
    echo "Upload successful. Saved as update.deb";

    // Optional: execute handler
    $output = shell_exec("/usr/bin/handle_update " . escapeshellarg($targetFile));
    echo "<pre>$output</pre>";
} else {
    echo "Upload failed.";
}
?>

