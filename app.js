// =========================
// app.js
// =========================

window.addEventListener("load", iniciarSistema);

function iniciarSistema() {

    status.className = "";

    status.innerHTML =
        "📄 Importe uma planilha para iniciar.";

    barra.value = 0;

}

// Botão Nova Conferência
const btnNova = document.createElement("button");

btnNova.id = "nova";

btnNova.innerHTML = "🔄 Nova Conferência";

document.body.appendChild(btnNova);

btnNova.addEventListener("click", () => {

    if (confirm("Deseja iniciar uma nova conferência?")) {

        novaConferencia();

    }

});
