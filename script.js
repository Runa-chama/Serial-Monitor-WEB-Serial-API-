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
                        add_message("Canceled\n");
                        break;
                    }
                    const inputValue = new TextDecoder().decode(value);
                    add_message(inputValue);
                }
            } catch (error) {
                add_message("[Error] Read" + error + "\n");
            } finally {
                reader.releaseLock();
            }
        }
    } catch (error) {
        add_message("[Error]Open" + error + "\n");
    }
}

function add_message(message) {
    let monitor = document.getElementById('monitor');
    monitor.value += message;
    monitor.schrollTop = monitor.scrollHeight;
}

async function send() {
    let text = document.getElementById('sendBox').value;
    document.getElementById('sendBox').value = "";
    const encoder = new TextEncoder();
    const writer = port.writable.getWriter();
    await writer.write(encoder.encode(text + "\n"));
    writer.releaseLock();
}
