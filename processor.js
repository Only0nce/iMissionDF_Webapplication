class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = new Float32Array(0);
    this.pos = 0;

    this.port.onmessage = (event) => {
      const newData = new Float32Array(event.data);
      const tmp = new Float32Array(this.buffer.length + newData.length);
      tmp.set(this.buffer);
      tmp.set(newData, this.buffer.length);
      this.buffer = tmp;
    };
  }

  process(inputs, outputs) {
    const output = outputs[0][0];
    const len = output.length;

    if (this.buffer.length >= len) {
      output.set(this.buffer.subarray(0, len));
      this.buffer = this.buffer.subarray(len);
    } else {
      output.fill(0); // underrun
    }

    return true;
  }
}

registerProcessor("pcm-processor", PCMProcessor);
