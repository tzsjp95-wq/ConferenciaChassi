// =========================
// excel.js
// =========================

// Banco de chassis
const banco = new Map();
const ordem = [];

let total = 0;
let encontrados = 0;

// Elementos da tela
const excelInput = document.getElementById("excel");
const totalLabel = document.getElementById("total");
const encontradosLabel = document.getElementById("encontrados");
const faltandoLabel = document.getElementById("faltando");
const barra = document.getElementById("barra");
const status = document.getElementById("status");
const lista = document.getElementById("lista");

// Importar planilha
document.getElementById("importar").addEventListener("click", () => {

    if (!excelInput.files.length) {
        alert("Selecione uma planilha.");
        return;
    }

    importarExcel(excelInput.files[0]);

});

function importarExcel(file) {

    const reader = new FileReader();

    reader.onload = function (e) {

        banco.clear();
        ordem.length = 0;
        encontrados = 0;

        const data = new Uint8Array(e.target.result);

        const workbook = XLSX.read(data, { type: "array" });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const dados = XLSX.utils.sheet_to_json(sheet);

        dados.forEach(linha => {

            let chassi = String(linha["Chassi"] || "")
                .trim()
                .toUpperCase();

            if (!chassi) return;

            banco.set(chassi, false);
            ordem.push(chassi);

        });

        total = banco.size;

        atualizarPainel();

        status.className = "ok";
        status.textContent = "✅ Planilha carregada.";

        lista.innerHTML = "";

    };

    reader.readAsArrayBuffer(file);

}

function atualizarPainel() {

    totalLabel.textContent = total;
    encontradosLabel.textContent = encontrados;
    faltandoLabel.textContent = total - encontrados;

    barra.max = total;
    barra.value = encontrados;

}

function conferir(chassi) {

    chassi = chassi.trim().toUpperCase();

    // Remove espaços invisíveis
    chassi = chassi.replace(/\s+/g, "");

    if (!banco.has(chassi)) {

        status.className = "erro";
        status.textContent = "🔴 Chassi não encontrado.";

        return false;

    }

    if (banco.get(chassi)) {

        status.className = "alerta";
        status.textContent = "🟡 Veículo já conferido.";

        return false;

    }

    banco.set(chassi, true);

    encontrados++;

    atualizarPainel();

    status.className = "ok";
    status.textContent = "🟢 Veículo encontrado.";

    return true;

}

// Lista de faltantes
document.getElementById("faltantes").addEventListener("click", () => {

    lista.innerHTML = "";

    ordem.forEach(chassi => {

        if (!banco.get(chassi)) {

            const li = document.createElement("li");
            li.textContent = chassi;
            lista.appendChild(li);

        }

    });

});

// Nova conferência
function novaConferencia() {

    banco.forEach((v, chave) => {
        banco.set(chave, false);
    });

    encontrados = 0;

    atualizarPainel();

    lista.innerHTML = "";

    status.textContent = "Nova conferência iniciada.";

}
