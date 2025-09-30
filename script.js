const NPREGUNTAS = 10; // Número de preguntes a mostrar

// Estat de la partida
let estatDeLaPartida = {
    contadorPreguntes: 0,
    respostesUsuari: [] // IDs de les respostes seleccionades
};

// Variables del temporitzador
let tempsInici = null;
let intervalTemporitzador = null;

// Actualitzar el marcador
function renderitzarMarcador() {
    const marcador = document.getElementById("marcador");
    let html = `Preguntes respostes: ${estatDeLaPartida.contadorPreguntes} de ${NPREGUNTAS}<br>`;

    estatDeLaPartida.respostesUsuari.forEach((idResposta, i) => {
        if (idResposta === undefined) {
            html += `Pregunta ${i + 1}: <span class='badge text-bg-primary'>No marcada</span><br>`;
        } else {
            // Mostrar la opció marcada (1..4)
            const botones = document.querySelectorAll(`.pregunta[data-index='${i}'] button`);
            let opcion = 0;
            botones.forEach((btn, j) => {
                if (parseInt(btn.dataset.resposta) === idResposta) opcion = j + 1;
            });
            html += `Pregunta ${i + 1}: <span class='badge text-bg-success'>Opción ${opcion}</span><br>`;
        }
    });

    marcador.innerHTML = html;
}

// Marcar resposta seleccionada
function marcarResposta(numPregunta, idResposta) {
    if (estatDeLaPartida.respostesUsuari[numPregunta] === undefined) {
        estatDeLaPartida.contadorPreguntes++;
        if (estatDeLaPartida.contadorPreguntes === NPREGUNTAS) {
            document.getElementById("btnEnviar").classList.remove("hidden");
            pararTemporitzador(); // Parar el temporitzador quan acabem totes les preguntes
        }
    }
    estatDeLaPartida.respostesUsuari[numPregunta] = idResposta;

    // Marcar visualment el botó seleccionat
    const botones = document.querySelectorAll(`.pregunta[data-index='${numPregunta}'] button`);
    botones.forEach(btn => btn.classList.remove("btn-success"));
    const botonSeleccionado = document.querySelector(`.pregunta[data-index='${numPregunta}'] button[data-resposta='${idResposta}']`);
    if (botonSeleccionado) botonSeleccionado.classList.add("btn-success");

    renderitzarMarcador();
}

// Generar preguntes
function generarPreguntas(data) {
    const contenidor = document.getElementById("partida");
    let html = "";

    data.preguntes.forEach((pregunta, i) => {
        html += `<div class="pregunta" data-index="${i}"><h3>${pregunta.pregunta}</h3><br>`;

        // Botons sense onclick, amb classe i data
        pregunta.respostes.forEach((resposta, j) => {
            html += `
            <div class="btn-resposta-container">
                <button class="btn btn-primary btn-resposta" 
                        data-pregunta="${i}" 
                        data-resposta="${resposta.id}">
                    <img src="${resposta.etiqueta}" alt="Logo ${j + 1}">
                </button>
            </div>
            `;
        });

        html += `</div><br>`;
    });

    // Botó per enviar resultats
    html += `<button id="btnEnviar" class="btn btn-danger hidden">Enviar Resultats</button>`;
    contenidor.innerHTML = html;

    renderitzarMarcador();
    iniciarTemporitzador(); // Iniciem el temporitzador quan es mostren les preguntes
}

// Cargar preguntes al iniciar
window.addEventListener('DOMContentLoaded', () => {
    fetch(`getPreguntes.php?n=${NPREGUNTAS}`)
        .then(res => res.json())
        .then(data => generarPreguntas(data))
        .catch(err => console.error("Error carregant preguntes:", err));
});

// Delegació d'esdeveniments en #partida
document.getElementById("partida").addEventListener("click", (event) => {
    const btn = event.target.closest(".btn-resposta");
    if (!btn) return;

    const numPregunta = parseInt(btn.dataset.pregunta);
    const idResposta = parseInt(btn.dataset.resposta);

    marcarResposta(numPregunta, idResposta);
});

// Esdeveniment per al botó d'enviar
document.addEventListener("click", (event) => {
    if (event.target.id === "btnEnviar") {
        enviarResultats();
    }
});

// Enviar resultats a finalitza.php
function enviarResultats() {
    pararTemporitzador();
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
    .catch(err => console.error("Error enviant resultats:", err));
}

// Funcions del temporitzador
function iniciarTemporitzador() {
    tempsInici = Date.now();
    const divTemps = document.getElementById("temporitzador");

    intervalTemporitzador = setInterval(() => {
        const segons = Math.floor((Date.now() - tempsInici) / 1000);
        const minuts = Math.floor(segons / 60);
        const segonsRestants = segons % 60;
        divTemps.textContent = `Temps: ${minuts.toString().padStart(2,'0')}:${segonsRestants.toString().padStart(2,'0')}`;
    }, 1000);
}

function pararTemporitzador() {
    clearInterval(intervalTemporitzador);
}

// LocalStorage per al nom d'usuari
window.addEventListener("DOMContentLoaded", () => {
    const formulari = document.getElementById("formulari");
    const benvinguda = document.getElementById("benvinguda");
    const missatge = document.getElementById("missatge");
    const btnEsborrar = document.getElementById("btnEsborrar");

    // Comprovar si ja hi ha nom guardat
    const nomGuardat = localStorage.getItem("nomUsuari");
    if (nomGuardat) {
        formulari.classList.add("hidden");
        benvinguda.classList.remove("hidden");
        missatge.textContent = `Hola de nou, ${nomGuardat}! 👋`;    
    }

    // Enviar formulari
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

    // Botó per esborrar nom
    btnEsborrar.addEventListener("click", () => {
        localStorage.removeItem("nomUsuari");
        formulari.classList.remove("hidden");
        benvinguda.classList.add("hidden");
        document.getElementById("nomUsuari").value = "";
        missatge.textContent = ""; 
    });
});
