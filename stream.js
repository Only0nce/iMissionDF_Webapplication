const canvas = document.getElementById('scope');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = 150;

const sampleRate = 8000;
const scopeDuration = 1;
const bufferSize = sampleRate * scopeDuration;

let scopeBuffer = new Float32Array(bufferSize);
let writeIndex = 0;
let paused = false;

document.getElementById('toggleBtn').onclick = () => {
    paused = !paused;
    document.getElementById('toggleBtn').textContent = paused ? "Play" : "Pause";
};

let audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate });
wsUri = "ws://" + location.host + ":8765";	   
const socket = new WebSocket(wsUri);
socket.binaryType = "arraybuffer";

socket.onmessage = (event) => {
    if (paused) return;

    const int16 = new Int16Array(event.data);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768;
        scopeBuffer[writeIndex] = float32[i];
        writeIndex = (writeIndex + 1) % bufferSize;
    }

    // play audio with low-latency source
    const buffer = audioCtx.createBuffer(1, float32.length, sampleRate);
    buffer.copyToChannel(float32, 0);
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();
};

function drawLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    const step = Math.floor(bufferSize / canvas.width);
    for (let i = 0; i < canvas.width; i++) {
        const idx = (writeIndex + i * step) % bufferSize;
        const val = scopeBuffer[idx];
        const y = (1 - val) * canvas.height / 2;
        ctx.lineTo(i, y);
    }

    ctx.strokeStyle = "lime";
    ctx.lineWidth = 1;
    ctx.stroke();

    requestAnimationFrame(drawLoop);
}

requestAnimationFrame(drawLoop);
