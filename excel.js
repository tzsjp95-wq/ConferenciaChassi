// =========================
// BANCO DE CHASSIS
// =========================

const banco = new Map();

let total = 0;
let encontrados = 0;

// =========================
// ELEMENTOS DA TELA
// =========================

const excelInput = document.getElementById("excel");

const totalLabel = document.getElementById("total");
const encontradosLabel = document.getElementById("encontrados");
const faltandoLabel = document.getElementById("faltando");
const barra = document.getElementById("barra");
const status = document.getElementById("status");
const lista = document.getElementById("lista");

// =========================
// IMPORTAR PLANILHA
// =========================

document
.getElementById("importar")
.addEventListener("click", () => {

    if (excelInput.files.length === 0) {

        alert("Selecione a planilha.");

        return;

    }

    importarExcel(excelInput.files[0]);

});

// =========================

function importarExcel(file){

    const reader = new FileReader();

    reader.onload = function(e){

        const data = new Uint8Array(e.target.result);

        const workbook = XLSX.read(data,{type:"array"});

        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const dados = XLSX.utils.sheet_to_json(sheet);

        banco.clear();

        encontrados = 0;

        dados.forEach(linha=>{

            const chassi = String(linha["Chassi"] || "").trim();

            if(chassi.length>0){

                banco.set(chassi,false);

            }

        });

        total = banco.size;

        atualizarPainel();

        status.className="ok";

        status.innerHTML="✅ Planilha carregada.";

        lista.innerHTML="";

    }

    reader.readAsArrayBuffer(file);

}

// =========================

function atualizarPainel(){

    totalLabel.innerHTML = total;

    encontradosLabel.innerHTML = encontrados;

    faltandoLabel.innerHTML = total - encontrados;

    barra.max = total;

    barra.value = encontrados;

}

// =========================

function conferir(chassi){

    chassi = chassi.trim();

    if(!banco.has(chassi)){

        status.className="erro";

        status.innerHTML="🔴 Chassi não encontrado.";

        return;

    }

    if(banco.get(chassi)){

        status.className="alerta";

        status.innerHTML="🟡 Veículo já conferido.";

        return;

    }

    banco.set(chassi,true);

    encontrados++;

    atualizarPainel();

    status.className="ok";

    status.innerHTML="🟢 Veículo encontrado.";

}

// =========================

document
.getElementById("faltantes")
.addEventListener("click",()=>{

    lista.innerHTML="";

    banco.forEach((valor,chassi)=>{

        if(!valor){

            const li=document.createElement("li");

            li.textContent=chassi;

            lista.appendChild(li);

        }

    });

});
