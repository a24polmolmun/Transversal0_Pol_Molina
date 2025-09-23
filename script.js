fetch("getPreguntes.php")
  .then(res => res.json())
  .then(data => {
      console.log(data);

      const contenidor = document.getElementById("partida");
      let htmlString = "";

      for (let i = 0; i < data.preguntes.length; i++) {
          htmlString += `<h3>${data.preguntes[i].pregunta}</h3>`;

          for (let j = 0; j < data.preguntes[i].respostes.length; j++) {
              htmlString += `
                  <button onclick="console.log('Pregunta ${i+1}, Resposta ${j+1}')">
                      <img src="${data.preguntes[i].respostes[j].etiqueta}" 
                           alt="Logo ${j+1}" width="100">
                  </button>
              `;
          }
      }

      contenidor.innerHTML = htmlString;
  })
  .catch(err => console.error("Error carregant preguntes:", err));
