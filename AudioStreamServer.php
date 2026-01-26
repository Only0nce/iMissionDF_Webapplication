<!DOCTYPE html>
<html lang="en">
<head>
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
</head>
<body>
    <h2>Live Audio Stream (Low Latency via AudioWorklet)</h2>
    <canvas id="scope"></canvas>
    <button id="toggleBtn">Pause</button>

    <script src="stream.js"></script>
</body>
</html>
