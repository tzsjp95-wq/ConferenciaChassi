// scanner.js

let scanner = null;
let lendo = false;

const scanBtn = document.getElementById("scan");

scanBtn.addEventListener("click", iniciarScanner);

async function iniciarScanner() {

    if (lendo) return;

    if (banco.size === 0) {
        alert("Importe a planilha primeiro.");
        return;
    }

    lendo = true;

    scanBtn.disabled = true;
    scanBtn.innerText = "Abrindo câmera...";

    scanner = new ZXingBrowser.BrowserMultiFormatReader();

    try {

        const devices =
            await ZXingBrowser.BrowserCodeReader.listVideoInputDevices();

        if (devices.length === 0) {
            alert("Nenhuma câmera encontrada.");
            pararScanner();
            return;
        }

        // Procura automaticamente pela câmera traseira
        let cameraId = devices[0].deviceId;

        for (const d of devices) {

            const nome = d.label.toLowerCase();

            if (
                nome.includes("back") ||
                nome.includes("rear") ||
                nome.includes("traseira")
            ) {
                cameraId = d.deviceId;
                break;
            }
        }

        await scanner.decodeFromVideoDevice(
            cameraId,
            "reader",
            (result, error) => {

                if (result) {

                    const chassi = result.getText().trim();

                    conferir(chassi);

                    // Vibração
                    if (navigator.vibrate)
                        navigator.vibrate(150);

                    // Bip simples
                    try {
                        new Audio(
                            "https://actions.google.com/sounds/v1/cartoon/pop.ogg"
                        ).play();
                    } catch(e){}

                    // Continua lendo automaticamente
                }

            }
        );

        scanBtn.innerText = "📷 Escaneando...";

    }
    catch (e) {

        console.error(e);

        alert("Erro ao abrir a câmera.");

        pararScanner();

    }

}

function pararScanner(){

    if(scanner){

        scanner.reset();

        scanner=null;

    }

    lendo=false;

    scanBtn.disabled=false;

    scanBtn.innerText="📷 Escanear";

}
