<?php
include('dbConfig.php');

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch data ordered by newest first
$sql = "SELECT id, event_time, event_name, dac_file_path, url, timestamp FROM eventlogger ORDER BY timestamp DESC";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Event Logger</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #007BFF;
            color: white;
        }
    </style>
</head>
<body>

<h2>Event Logger Data</h2>

<table>
    <tr>
        <th>ID</th>
        <th>Event Time</th>
        <th>Event Name</th>
        <th>Download File</th>
    </tr>

    <?php
    if ($result->num_rows > 0) 
    {
        $id=0;
        while ($row = $result->fetch_assoc()) {
            $filePath = str_replace("/usr/share/apache2/default-site/htdocs", "", $row['dac_file_path']);
            $id = $id+1;
            echo "<tr>
                    <td>{$id}</td>
                    <td>{$row['event_time']}</td>
                    <td>{$row['event_name']}</td>
                    <td><a href='$filePath' download>Download</a></td>
                </tr>";
        }
    } else {
        echo "<tr><td colspan='6'>No records found</td></tr>";
    }
    ?>

</table>

</body>
</html>

<?php
$conn->close();
?>
