function alertConnection()
{
    let name = "ModalAlert";
    let modal = null;

    if (!modal) {
      var modalElement = document.getElementById(name);
      modal = new bootstrap.Modal(modalElement);
    }
    modal.show();
}

document.addEventListener("DOMContentLoaded", function () {
    // Create WebSocket connection
     wsUri = "ws://" + location.host + ":8009";

    const socket = new WebSocket(wsUri);

    socket.onopen = function () {
        console.log("Connected to WebSocket server");
    };

    socket.onerror = function (error) {
        console.error("WebSocket Error:", error);
    };

    socket.onclose = function () {
        console.log("WebSocket connection closed");
    };

    // Listen for messages from the WebSocket server
    socket.onmessage = function (event) {
        const jsonMessage = event.data;  // The message from the WebSocket server

        // Parse the JSON message
        const data = JSON.parse(jsonMessage);

        // Set initial values from the received JSON message
        document.querySelectorAll(".rangeSlider").forEach(slider => {
            const sliderName = slider.dataset.name;

            let initialValue;
            switch (sliderName) {
                case "master_start_relay_offset_usec":
                    initialValue = data.master_start_relay_offset_usec;
                    break;
                case "slave_start_relay_offset_usec":
                    initialValue = data.slave_start_relay_offset_usec;
                    break;
                case "adc_write_offset_usec":
                    initialValue = data.adc_write_offset_usec;
                    break;
                case "pulse_relay_period_offset_usec":
                    initialValue = data.pulse_relay_period_offset_usec;
                    break;
                case "surgeA_threshold":
                    initialValue = data.surgeA_threshold;
                    break;
                case "surgeB_threshold":
                    initialValue = data.surgeB_threshold;
                    break;
                case "surgeC_threshold":
                    initialValue = data.surgeC_threshold;
                    break;
                case "plc_input_1":
                    initialValue = data.plc_input_1;
                    break;                
                case "plc_input_2":
                    initialValue = data.plc_input_2;
                    break;
                case "plc_input_3":
                    initialValue = data.plc_input_3;
                    break;                
                case "plc_input_4":
                    initialValue = data.plc_input_4;
                    break;
                case "plc_input_5":
                    initialValue = data.plc_input_5;
                    break;                
                case "plc_input_6":
                    initialValue = data.plc_input_6;
                    break;
                case "plc_input_7":
                    initialValue = data.plc_input_7;
                    break;                
                case "plc_input_8":
                    initialValue = data.plc_input_8;
                    break;
            }

            // Set the slider's value to the corresponding initial value
            if (initialValue !== undefined) {
                slider.value = initialValue;
                const output = document.getElementById(slider.dataset.output);
                output.textContent = initialValue;
            }

            // Listen for input changes
            slider.addEventListener("input", function () {
                const output = document.getElementById(slider.dataset.output);
                output.textContent = this.value;

                // Send updated data to WebSocket server
                if (socket.readyState === WebSocket.OPEN) {
                    const dataToSend = {
                        objectName: slider.dataset.name,
                        value: parseInt(this.value)
                    };
                    socket.send(JSON.stringify(dataToSend));
                    console.log("Sent:", dataToSend);
                }
            });
        });
    };
});
