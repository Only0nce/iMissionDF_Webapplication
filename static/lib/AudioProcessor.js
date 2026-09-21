/*
 * AstraRX / WebRx Phase H low-latency audio processor.
 * Bounded FIFO with prebuffering and live-edge recovery.
 */
class OpenWebRxLowLatencyAudioProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();

    const cfg = (options && options.processorOptions) || {};
    this.targetQueueMs = this._finite(cfg.targetQueueMs, 40);
    this.startQueueMs = this._finite(cfg.startQueueMs, 40);
    this.hardMaxQueueMs = this._finite(cfg.hardMaxQueueMs, 120);

    this.targetSamples = this._msToSamples(this.targetQueueMs);
    this.startSamples = this._msToSamples(this.startQueueMs);
    this.hardMaxSamples = this._msToSamples(this.hardMaxQueueMs);

    this.queue = [];
    this.queueOffset = 0;
    this.queuedSamples = 0;
    this.prebuffering = true;

    this.underruns = 0;
    this.overruns = 0;
    this.droppedSamples = 0;
    this.playedSamples = 0;
    this.reportedPlayedSamples = 0;
    this.silenceSamples = 0;
    this.callbacks = 0;

    this.port.onmessage = (event) => {
      const msg = event.data;
      if (!msg) return;

      if (typeof msg === 'string') {
        try {
          const parsed = JSON.parse(msg);
          this._handleMessage(parsed);
        } catch (_) {}
        return;
      }
      this._handleMessage(msg);
    };
  }

  _finite(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  }

  _msToSamples(ms) {
    return Math.max(1, Math.round(sampleRate * ms / 1000));
  }

  _handleMessage(msg) {
    switch (msg.cmd) {
      case 'push':
        this._push(msg.samples);
        break;
      case 'getStats':
        this._postStats();
        break;
      case 'flush':
        this._flush();
        break;
      case 'resetStats':
        this.underruns = 0;
        this.overruns = 0;
        this.droppedSamples = 0;
        this.playedSamples = 0;
        this.reportedPlayedSamples = 0;
        this.silenceSamples = 0;
        this.callbacks = 0;
        break;
      case 'configure':
        this._configure(msg);
        break;
    }
  }

  _configure(msg) {
    this.targetQueueMs = this._finite(msg.targetQueueMs, this.targetQueueMs);
    this.startQueueMs = this._finite(msg.startQueueMs, this.startQueueMs);
    this.hardMaxQueueMs = this._finite(msg.hardMaxQueueMs, this.hardMaxQueueMs);
    this.targetSamples = this._msToSamples(this.targetQueueMs);
    this.startSamples = this._msToSamples(this.startQueueMs);
    this.hardMaxSamples = this._msToSamples(this.hardMaxQueueMs);

    if (this.queuedSamples > this.hardMaxSamples) {
      this._trimToTarget();
    }
  }

  _push(samples) {
    if (!samples) return;

    let block;
    if (samples instanceof Float32Array) block = samples;
    else if (samples.buffer instanceof ArrayBuffer) {
      block = new Float32Array(samples.buffer, samples.byteOffset || 0, samples.byteLength / 4);
    } else if (samples instanceof ArrayBuffer) {
      block = new Float32Array(samples);
    } else {
      return;
    }

    if (!block.length) return;
    this.queue.push(block);
    this.queuedSamples += block.length;

    if (this.queuedSamples > this.hardMaxSamples) {
      this._trimToTarget();
    }

    if (this.prebuffering && this.queuedSamples >= this.startSamples) {
      this.prebuffering = false;
    }
  }

  _trimToTarget() {
    let toDrop = Math.max(0, this.queuedSamples - this.targetSamples);
    let dropped = 0;

    while (toDrop > 0 && this.queue.length) {
      const block = this.queue[0];
      const available = block.length - this.queueOffset;
      const take = Math.min(toDrop, available);
      this.queueOffset += take;
      this.queuedSamples -= take;
      dropped += take;
      toDrop -= take;

      if (this.queueOffset >= block.length) {
        this.queue.shift();
        this.queueOffset = 0;
      }
    }

    if (dropped > 0) {
      this.overruns++;
      this.droppedSamples += dropped;
    }
  }

  _consumeInto(out) {
    let written = 0;

    while (written < out.length && this.queue.length) {
      const block = this.queue[0];
      const available = block.length - this.queueOffset;
      const take = Math.min(available, out.length - written);
      out.set(block.subarray(this.queueOffset, this.queueOffset + take), written);
      this.queueOffset += take;
      this.queuedSamples -= take;
      written += take;

      if (this.queueOffset >= block.length) {
        this.queue.shift();
        this.queueOffset = 0;
      }
    }

    return written;
  }

  _flush() {
    this.queue.length = 0;
    this.queueOffset = 0;
    this.queuedSamples = 0;
    this.prebuffering = true;
  }

  _postStats() {
    const processedSinceLastReport = Math.max(0, this.playedSamples - this.reportedPlayedSamples);
    this.reportedPlayedSamples = this.playedSamples;
    this.port.postMessage({
      type: 'stats',
      queueSamples: this.queuedSamples,
      queueMs: this.queuedSamples * 1000 / sampleRate,
      targetQueueMs: this.targetQueueMs,
      startQueueMs: this.startQueueMs,
      hardMaxQueueMs: this.hardMaxQueueMs,
      prebuffering: this.prebuffering,
      underruns: this.underruns,
      overruns: this.overruns,
      droppedSamples: this.droppedSamples,
      playedSamples: this.playedSamples,
      samplesProcessed: processedSinceLastReport,
      silenceSamples: this.silenceSamples,
      callbacks: this.callbacks
    });
  }

  process(inputs, outputs) {
    const output = outputs[0] && outputs[0][0];
    if (!output) return true;

    output.fill(0);
    this.callbacks++;

    if (this.prebuffering) {
      if (this.queuedSamples >= this.startSamples) {
        this.prebuffering = false;
      } else {
        this.silenceSamples += output.length;
        return true;
      }
    }

    const written = this._consumeInto(output);
    this.playedSamples += written;

    if (written < output.length) {
      this.underruns++;
      this.silenceSamples += output.length - written;
      this.prebuffering = true;
    }

    return true;
  }
}

registerProcessor('openwebrx-audio-processor', OpenWebRxLowLatencyAudioProcessor);
