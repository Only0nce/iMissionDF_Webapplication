'use strict';

// WebRx Phase J: off-main-thread DSP presentation helpers.
//
// The worker intentionally operates only on browser presentation data. It does
// not own receiver state, tuning, WebSocket control, or audio. Phase J moves
// full waterfall history re-projection here; Phase J.2 adds dense spectrum
// envelope reduction and waterfall percentile statistics.

function nowMs() {
  return (typeof performance !== 'undefined' && typeof performance.now === 'function')
    ? performance.now()
    : Date.now();
}

function finiteOr(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

function projectWaterfall(message) {
  const startMs = nowMs();
  const width = Math.max(1, message.width | 0);
  const height = Math.max(1, message.height | 0);
  const sourceBins = Math.max(1, message.sourceBins | 0);
  const capacityRows = Math.max(1, message.capacityRows | 0);
  const rowsWritten = Math.max(0, Math.min(capacityRows, message.rowsWritten | 0));
  const headRow = ((message.headRow | 0) % capacityRows + capacityRows) % capacityRows;
  const visibleStart = Math.max(0, Math.min(sourceBins - 1, message.visibleStart | 0));
  const visibleEnd = Math.max(
    visibleStart + 1,
    Math.min(sourceBins, message.visibleEnd | 0)
  );
  const visibleBins = visibleEnd - visibleStart;
  const dbLutMin = Number(message.dbLutMin);
  const dbLutStep = Math.max(1e-9, Number(message.dbLutStep) || 0.25);
  const fallbackDb = finiteOr(Number(message.fallbackDb), dbLutMin);

  const source = new Float32Array(message.sourceHistory);
  const colorLut = new Uint8ClampedArray(message.colorLut);
  const dbToColor = new Uint8Array(message.dbToColorIndexLut);
  const rgba = new Uint8ClampedArray(width * height * 4);

  // Empty rows are opaque black. Populated rows below overwrite RGBA fully.
  for (let i = 3; i < rgba.length; i += 4) rgba[i] = 255;

  function sourceValue(rowOffset, x) {
    if (visibleBins <= 1 || width <= 1) {
      return finiteOr(source[rowOffset + visibleStart], fallbackDb);
    }

    if (visibleBins <= width) {
      const src = visibleStart + Math.min(
        visibleBins - 1,
        Math.max(0, Math.round((x / (width - 1)) * (visibleBins - 1)))
      );
      return finiteOr(source[rowOffset + src], fallbackDb);
    }

    const binsPerPixel = visibleBins / width;
    const localStart = Math.floor(x * binsPerPixel);
    const localEnd = Math.max(
      localStart + 1,
      Math.min(visibleBins, Math.floor((x + 1) * binsPerPixel))
    );
    let peak = -Infinity;
    for (let local = localStart; local < localEnd; local++) {
      const value = source[rowOffset + visibleStart + local];
      if (Number.isFinite(value) && value > peak) peak = value;
    }
    return Number.isFinite(peak) ? peak : fallbackDb;
  }

  for (let logicalRow = 0; logicalRow < rowsWritten; logicalRow++) {
    const physicalRow = (headRow + logicalRow) % capacityRows;
    const rowOffset = physicalRow * sourceBins;
    let dst = physicalRow * width * 4;

    for (let x = 0; x < width; x++, dst += 4) {
      const rawDb = sourceValue(rowOffset, x);
      const dbIndex = Math.max(
        0,
        Math.min(dbToColor.length - 1, Math.round((rawDb - dbLutMin) / dbLutStep))
      );
      const paletteIndex = dbToColor[dbIndex] * 4;
      rgba[dst] = colorLut[paletteIndex];
      rgba[dst + 1] = colorLut[paletteIndex + 1];
      rgba[dst + 2] = colorLut[paletteIndex + 2];
      rgba[dst + 3] = 255;
    }
  }

  return {
    type: 'waterfall-projected',
    requestId: message.requestId,
    projectionRevision: message.projectionRevision,
    sourceRevision: message.sourceRevision,
    acquisitionEpoch: message.acquisitionEpoch,
    acquisitionKey: message.acquisitionKey,
    width,
    height,
    sourceBins,
    capacityRows,
    headRow,
    rowsWritten,
    elapsedMs: nowMs() - startMs,
    rgba: rgba.buffer
  };
}


function reduceSpectrum(message) {
  const startMs = nowMs();
  const width = Math.max(1, message.width | 0);
  const trace = new Float32Array(message.trace);
  const bins = trace.length;
  const envelope = new Float32Array(width * 2);

  function fillEnvelope(input, output) {
    if (!input || input.length <= 0) {
      output.fill(NaN);
      return;
    }
    const count = input.length;
    const binsPerPixel = count / width;
    for (let x = 0; x < width; x++) {
      const localStart = Math.max(0, Math.min(count - 1, Math.floor(x * binsPerPixel)));
      const localEnd = Math.max(
        localStart + 1,
        Math.min(count, Math.floor((x + 1) * binsPerPixel))
      );
      let minDb = Infinity;
      let maxDb = -Infinity;
      for (let i = localStart; i < localEnd; i++) {
        const value = input[i];
        if (!Number.isFinite(value)) continue;
        if (value < minDb) minDb = value;
        if (value > maxDb) maxDb = value;
      }
      if (!Number.isFinite(minDb) || !Number.isFinite(maxDb)) {
        minDb = NaN;
        maxDb = NaN;
      }
      output[x * 2] = minDb;
      output[x * 2 + 1] = maxDb;
    }
  }

  fillEnvelope(trace, envelope);
  let maxHoldEnvelope = null;
  if (message.maxHold) {
    const maxHold = new Float32Array(message.maxHold);
    maxHoldEnvelope = new Float32Array(width * 2);
    fillEnvelope(maxHold, maxHoldEnvelope);
  }

  return {
    type: 'spectrum-reduced',
    requestId: message.requestId,
    sourceRevision: message.sourceRevision,
    viewKey: message.viewKey,
    width,
    inputBins: bins,
    elapsedMs: nowMs() - startMs,
    envelope: envelope.buffer,
    maxHoldEnvelope: maxHoldEnvelope ? maxHoldEnvelope.buffer : null
  };
}

function waterfallStatistics(message) {
  const startMs = nowMs();
  const line = new Float32Array(message.line);
  const histMinDb = Math.round(finiteOr(Number(message.histMinDb), -180));
  const histMaxDb = Math.max(histMinDb + 1, Math.round(finiteOr(Number(message.histMaxDb), 40)));
  const histBins = histMaxDb - histMinDb + 1;
  const histogram = new Uint32Array(histBins);
  const budget = Math.max(128, Math.floor(finiteOr(Number(message.sampleBudget), 4096)));
  const stride = Math.max(1, Math.ceil(line.length / budget));
  let total = 0;

  for (let i = 0; i < line.length; i += stride) {
    const value = line[i];
    if (!Number.isFinite(value)) continue;
    const bucket = Math.max(0, Math.min(histBins - 1, Math.round(value) - histMinDb));
    histogram[bucket]++;
    total++;
  }

  function percentile(percent) {
    if (total <= 0) return NaN;
    const p = Math.max(0, Math.min(1, finiteOr(Number(percent), 0)));
    const threshold = Math.max(1, Math.ceil(p * total));
    let cumulative = 0;
    for (let i = 0; i < histBins; i++) {
      cumulative += histogram[i];
      if (cumulative >= threshold) return histMinDb + i;
    }
    return histMaxDb;
  }

  return {
    type: 'waterfall-stats',
    requestId: message.requestId,
    stateRevision: message.stateRevision,
    total,
    stride,
    noiseDb: percentile(message.noisePercentile),
    signalDb: percentile(message.signalPercentile),
    elapsedMs: nowMs() - startMs
  };
}

self.onmessage = function onMessage(event) {
  const message = event && event.data ? event.data : {};
  try {
    if (message.type === 'waterfall-project') {
      const result = projectWaterfall(message);
      self.postMessage(result, [result.rgba]);
      return;
    }
    if (message.type === 'spectrum-reduce') {
      const result = reduceSpectrum(message);
      const transfer = [result.envelope];
      if (result.maxHoldEnvelope) transfer.push(result.maxHoldEnvelope);
      self.postMessage(result, transfer);
      return;
    }
    if (message.type === 'waterfall-stats') {
      const result = waterfallStatistics(message);
      self.postMessage(result);
      return;
    }
    self.postMessage({
      type: 'worker-error',
      requestId: message.requestId,
      error: `Unsupported worker task: ${String(message.type || '')}`
    });
  } catch (error) {
    self.postMessage({
      type: 'worker-error',
      requestId: message.requestId,
      error: error && error.message ? error.message : String(error)
    });
  }
};
