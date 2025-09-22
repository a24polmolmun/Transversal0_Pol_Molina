  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      console.log(data);

      const contenidor = document.getElementById("partida");
let htmlString="";

for (let i=0; i<data.preguntes.length;i++) {
    htmlString+= `<h3> ${data.preguntes[i].pregunta} </h3> `
    for (let j = 0; j < data.preguntes[i].respostes.length; j++) {
        htmlString+= `<button onclick="console.log('Has apretado la pregunta ${i+1} i respuestas ${j+1}')">
            <img src="${data.preguntes[i].respostes[j].etiqueta}" alt="${data.preguntes[i].respostes}" width="100">
            </button>`;
    }
}

contenidor.innerHTML = htmlString;
      
    })
    .catch(err => console.error("Error carregant JSON:", err));