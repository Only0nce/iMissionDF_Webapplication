<?php
    $dbHost = '127.0.0.1';
    $dbUsername = 'orinnx';
    $dbPassword = 'Ifz8zean6868**';
    $dbName = 'iScreen';
    $conn = new mysqli($dbHost, $dbUsername, $dbPassword, $dbName);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

?>
