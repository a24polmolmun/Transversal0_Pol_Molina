const NPREGUNTAS = 10; // Número de preguntas a mostrar

// Estado del juego
let estatDeLaPartida = {
    contadorPreguntes: 0,
    respostesUsuari: [] // IDs de las respuestas seleccionadas
};

// Actualizar el marcador
function renderitzarMarcador() {
    const marcador = document.getElementById("marcador");
    let html = `Preguntes respostes: ${estatDeLaPartida.contadorPreguntes} de ${NPREGUNTAS}<br>`;

    estatDeLaPartida.respostesUsuari.forEach((idRespuesta, i) => {
        if(idRespuesta === undefined){
            html += `Pregunta ${i+1}: <span class='badge text-bg-primary'>No marcada</span><br>`;
        } else {
            // Mostrar la opción marcada (1..4)
            const botones = document.querySelectorAll(`.pregunta[data-index='${i}'] button`);
            let opcion = 0;
            botones.forEach((btn,j)=>{
                if(parseInt(btn.dataset.id) === idRespuesta) opcion = j+1;
            });
            html += `Pregunta ${i+1}: <span class='badge text-bg-success'>Opción ${opcion}</span><br>`;
        }
    });

    marcador.innerHTML = html;
}

// Marcar respuesta seleccionada
function marcarRespuesta(numPregunta, idRespuesta) {
    // Guardar la respuesta
    if(estatDeLaPartida.respostesUsuari[numPregunta] === undefined){
        estatDeLaPartida.contadorPreguntes++;
        if(estatDeLaPartida.contadorPreguntes === NPREGUNTAS){
            document.getElementById("btnEnviar").classList.remove("hidden");
        }
    }
    estatDeLaPartida.respostesUsuari[numPregunta] = idRespuesta;

    // Marcar visualmente el botón seleccionado
    const botones = document.querySelectorAll(`.pregunta[data-index='${numPregunta}'] button`);
    botones.forEach(btn => btn.classList.remove("btn-success"));
    const botonSeleccionado = document.querySelector(`.pregunta[data-index='${numPregunta}'] button[data-id='${idRespuesta}']`);
    if(botonSeleccionado) botonSeleccionado.classList.add("btn-success");

    renderitzarMarcador();
}

// Generar preguntas
function generarPreguntas(data) {
    const contenidor = document.getElementById("partida");
    let html = "";

    data.preguntes.forEach((pregunta, i) => {
        html += `<div class="pregunta" data-index="${i}"><h3>${pregunta.pregunta}</h3><br>`;

        pregunta.respostes.forEach((resposta, j) => {
            html += `
                <button class="btn btn-primary" data-id="${resposta.id}" onclick="marcarRespuesta(${i}, ${resposta.id})" style="margin:5px">
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
        body: JSON.stringify({ respostesUsuari: estatDeLaPartida.respostesUsuari })
    })
    .then(res => res.json())
    .then(data => {
        const divResultat = document.getElementById('resultat');
        divResultat.textContent = `Has encertat ${data.correctes} de ${NPREGUNTAS} preguntes!`;
    })
    .catch(err => console.error("Error enviando resultados:", err));
}
