const NPREGUNTAS = 10; // Número de preguntas a mostrar

// Estado del juego
let estatDeLaPartida = {
    contadorPreguntes: 0,
    respostesUsuari: [] // Aquí guardamos las respuestas del usuario
};

// Actualizar el marcador
function renderitzarMarcador() {
    const marcador = document.getElementById("marcador");
    let html = `Preguntes respostes: ${estatDeLaPartida.contadorPreguntes} de ${NPREGUNTAS}<br>`;

    estatDeLaPartida.respostesUsuari.forEach((resposta, i) => {
        html += `Pregunta ${i+1}: <span class='badge text-bg-primary'>${resposta === undefined ? "O" : "X"}</span><br>`;
    });

    marcador.innerHTML = html;
}

// Marcar respuesta seleccionada
function marcarRespuesta(numPregunta, numResposta) {
    if (estatDeLaPartida.respostesUsuari[numPregunta] === undefined) {
        estatDeLaPartida.contadorPreguntes++;
        if (estatDeLaPartida.contadorPreguntes === NPREGUNTAS) {
            document.getElementById("btnEnviar").classList.remove("hidden");
        }
    }
    estatDeLaPartida.respostesUsuari[numPregunta] = numResposta;
    renderitzarMarcador();
}

// Generar preguntas desde getpreguntes.php
function generarPreguntas(data) {
    const contenidor = document.getElementById("partida");
    let html = "";

    data.preguntes.forEach((pregunta, i) => {
        html += `<div class="pregunta"><h3>${pregunta.pregunta}</h3><br>`;

        pregunta.respostes.forEach((resposta, j) => {
            html += `
                <button class="btn btn-primary" onclick="marcarRespuesta(${i}, ${j})" style="margin:5px">
                    <img src="${resposta.etiqueta}" alt="Logo ${j+1}" width="40">
                </button>
            `;
        });

        html += `</div><br>`;
    });

    html += `<button id="btnEnviar" class="btn btn-danger hidden" onclick="enviarResultats()">Enviar Resultats</button>`;
    contenidor.innerHTML = html;

    renderitzarMarcador();
}

// Cargar preguntas al iniciar
window.addEventListener('DOMContentLoaded', () => {
    fetch(`getPreguntes.php?n=${NPREGUNTAS}`)
        .then(res => res.json())
        .then(data => generarPreguntas(data))
        .catch(err => console.error("Error cargando preguntas:", err));
});

// Enviar resultados a finalitza.php
function enviarResultats() {
    fetch('finalitza.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            respostesUsuari: estatDeLaPartida.respostesUsuari
        })
    })
    .then(res => res.json())
    .then(data => {
        // Mostrar resultado en un div en lugar de alert
        const divResultat = document.getElementById('resultat');
        divResultat.textContent = `Has encertat ${data.correctes} de ${data.total} preguntes!`;
    })
    .catch(err => console.error("Error enviando resultados:", err));
}