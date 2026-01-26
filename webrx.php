<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>iScan WebRX Dashboard</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- <script src="receiver.js"></script> -->
  <script src="dashboard.js"></script>
  <link href="css/bootstrap.min.css" rel="stylesheet">
  <style>
    body { background-color: #121212; color: #fff; }
    canvas { background: #1e1e1e; border: 1px solid #444; margin-bottom: 20px; width: 100%; }
    #smeter-bar { width: 100%; height: 25px; background: #333; border: 1px solid #666; }
    #smeter-fill { height: 100%; width: 0%; background: lime; }
    .section { margin-bottom: 2rem; }
  </style>
</head>
<body class="p-4">
  <div class="container">
    <h2 class="mb-4">📡 OpenWebRX Dashboard</h2>

    <!-- Frequency Controls -->
    <div class="section">
      <label for="freqInput" class="form-label">Tune Frequency (Hz):</label>
      <div class="input-group">
        <input type="number" id="freqInput" class="form-control" value="98000000">
        <button class="btn btn-primary" onclick="sendTune()">Tune</button>
      </div>

      <label for="bandSelect" class="form-label mt-3">Band Preset:</label>
      <select id="bandSelect" class="form-select" onchange="setBand()">
        <option value="88000000,108000000">FM Broadcast (88–108 MHz)</option>
        <option value="118000000,137000000">Airband (118–137 MHz)</option>
        <option value="144000000,146000000">2m Ham Band (144–146 MHz)</option>
      </select>
    </div>

    <!-- Waterfall Scale -->
    <div class="section">
      <h5>Waterfall Frequency Scale</h5>
      <canvas id="waterfall-scale" height="40"></canvas>
    </div>

    <!-- FFT Plot -->
    <div class="section">
      <h5>Spectrum FFT</h5>
      <canvas id="spectrum-plot" height="200"></canvas>
      <canvas id="waterfall" height="400"></canvas>
    </div>
    <!-- S-Meter -->
    <div class="section">
      <h5>S-Meter</h5>
      <div id="smeter-bar"><div id="smeter-fill"></div></div>
    </div>

    <!-- Qt Backend Placeholder -->
    <div class="section">
      <h5>📂 File/Status (from Qt)</h5>
      <div id="qt-status" class="text-warning">Waiting for backend update...</div>
    </div>
  </div>

  
</body>

<script src="webrx.js"></script>
</html>
