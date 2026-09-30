<!DOCTYPE html>
<html lang="en">
<head>
  <script src="assets/theme/app-theme.js"></script>
    <meta charset="UTF-8">
    <title>Live Audio Stream</title>
    <style>
        canvas {
            width: 100%;
            height: 150px;
            background: black;
        }
        button {
            margin-top: 10px;
            padding: 10px 20px;
            font-size: 16px;
        }
    </style>
  <link href="assets/theme/app-theme.css" rel="stylesheet">
</head>
<body>
    <h2>Live Audio Stream (Low Latency via AudioWorklet)</h2>
    <canvas id="scope"></canvas>
    <button id="toggleBtn">Pause</button>

    <script src="stream.js"></script>
</body>
</html>
