let port;

async function connect() {
    try {
        port = await navigator.serial.requestPort();
        await port.open({
            baudRate: 9600
        });
        document.getElementById('PortStatus').value = "Connected";
        while (port.readable) {
            const reader = port.readable.getReader();
            try {
                while (true) {
                    const {value, done} = await reader.read();
                    if (done) {
                        addSerial("Canceled\n");
                        break;
                    }
                    const inputValue = new TextDecoder().decode(value);
                    addSerial(inputValue);
                }
            } catch (error) {
                addSerial("Error: Read" + error + "\n");
            } finally {
                reader.releaseLock();
            }
        }
    } catch (error) {
        addSerial("Error: Open" + error + "\n");
    }
}
function addSerial(msg) {
    let textarea = document.getElementById('outputArea');
    textarea.value += msg;
    textarea.schrollTop = textarea.scrollHeight;
}
async function send() {
    var text = document.getElementById('sendInput').value;
    document.getElementById('sendInput').value = "";
    const encoder = new TextEncoder();
    const writer = port.writable.getWriter();
    await writer.write(encoder.encode(text + "\n"));
    writer.releaseLock();
}
