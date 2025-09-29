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
        if (idRespuesta === undefined) {
            html += `Pregunta ${i + 1}: <span class='badge text-bg-primary'>No marcada</span><br>`;
        } else {
            // Mostrar la opción marcada (1..4)
            const botones = document.querySelectorAll(`.pregunta[data-index='${i}'] button`);
            let opcion = 0;
            botones.forEach((btn, j) => {
                if (parseInt(btn.dataset.resposta) === idRespuesta) opcion = j + 1;
            });
            html += `Pregunta ${i + 1}: <span class='badge text-bg-success'>Opción ${opcion}</span><br>`;
        }
    });

    marcador.innerHTML = html;
}

// Marcar respuesta seleccionada
function marcarRespuesta(numPregunta, idRespuesta) {
    if (estatDeLaPartida.respostesUsuari[numPregunta] === undefined) {
        estatDeLaPartida.contadorPreguntes++;
        if (estatDeLaPartida.contadorPreguntes === NPREGUNTAS) {
            document.getElementById("btnEnviar").classList.remove("hidden");
        }
    }
    estatDeLaPartida.respostesUsuari[numPregunta] = idRespuesta;

    // Marcar visualmente el botón seleccionado
    const botones = document.querySelectorAll(`.pregunta[data-index='${numPregunta}'] button`);
    botones.forEach(btn => btn.classList.remove("btn-success"));
    const botonSeleccionado = document.querySelector(`.pregunta[data-index='${numPregunta}'] button[data-resposta='${idRespuesta}']`);
    if (botonSeleccionado) botonSeleccionado.classList.add("btn-success");

    renderitzarMarcador();
}

// Generar preguntas
function generarPreguntas(data) {
    const contenidor = document.getElementById("partida");
    let html = "";

    data.preguntes.forEach((pregunta, i) => {
        html += `<div class="pregunta" data-index="${i}"><h3>${pregunta.pregunta}</h3><br>`;

        // Quitamos onclick y añadimos clase + data-pregunta y data-resposta
        pregunta.respostes.forEach((resposta, j) => {
            html += `
                <button class="btn btn-primary btn-resposta" 
                        data-pregunta="${i}" 
                        data-resposta="${resposta.id}" 
                        style="margin:5px">
                    <img src="${resposta.etiqueta}" alt="Logo ${j + 1}" width="80">
                </button>
            `;
        });

        html += `</div><br>`;
    });

    // Botón sin onclick
    html += `<button id="btnEnviar" class="btn btn-danger hidden">Enviar Resultats</button>`;
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

//Delegación de eventos en #partida
document.getElementById("partida").addEventListener("click", (event) => {
    const btn = event.target.closest(".btn-resposta");
    if (!btn) return; // si no se clicó un botón de respuesta, ignoramos

    const numPregunta = parseInt(btn.dataset.pregunta);
    const idResposta = parseInt(btn.dataset.resposta);

    marcarRespuesta(numPregunta, idResposta);
});

//Evento para el botón de enviar
document.addEventListener("click", (event) => {
    if (event.target.id === "btnEnviar") {
        enviarResultats();
    }
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
// LocalStorage para el nombre de usuario
window.addEventListener("DOMContentLoaded", () => {
    const formulari = document.getElementById("formulari");
    const benvinguda = document.getElementById("benvinguda");
    const missatge = document.getElementById("missatge");
    const btnEsborrar = document.getElementById("btnEsborrar");

    // Comprobar si ya hay nombre guardado
    const nomGuardat = localStorage.getItem("nomUsuari");
    if (nomGuardat) {
        formulari.classList.add("hidden");
        benvinguda.classList.remove("hidden");
        missatge.textContent = `Hola de nou, ${nomGuardat}! 👋`;    
    }

    // Enviar formulario
    formulari.addEventListener("submit", (e) => {
        e.preventDefault();
        const nom = document.getElementById("nomUsuari").value.trim();
        if (nom) {
            localStorage.setItem("nomUsuari", nom);
            formulari.classList.add("hidden");
            benvinguda.classList.remove("hidden");
            missatge.textContent = `Hola, ${nom}! 👋`;
        }
    });

    // Botón para borrar nombre
    btnEsborrar.addEventListener("click", () => {
        localStorage.removeItem("nomUsuari");
        formulari.classList.remove("hidden");
        benvinguda.classList.add("hidden");
        document.getElementById("nomUsuari").value = "";
        missatge.textContent = ""; 
    });
});