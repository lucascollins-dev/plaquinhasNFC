// Endereço base: a própria página, seguida de ?c=
// Ex.: http://127.0.0.1:5500/index.html?c=
const BASE_URL = window.location.origin + window.location.pathname + "?c=";

async function carregarDados() {
  const resposta = await fetch("dados.json");
  return await resposta.json();
}

async function iniciar() {
  const dados = await carregarDados();
  const codigo = new URLSearchParams(window.location.search).get("c");

  // 1) Se veio um código na URL, faz o redirecionamento
  if (codigo) {
    let destino = null;

    for (let i = 0; i < dados.length; i++) {
      if (dados[i].uniqueLink === codigo) {
        destino = dados[i].dynamicLink;
        break;
      }
    }

    if (destino) {
      window.location.replace(destino);
    } else {
      alert("Link não encontrado ou sem destino configurado.");
    }
    return;
  }

  // 2) Sem código: monta a tabela
  const corpo = document.getElementById("corpo");
  let html = "";

  for (let i = 0; i < dados.length; i++) {
    const uniqueLink = dados[i].uniqueLink;
    const dynamicLink = dados[i].dynamicLink;

    // O uniqueLink aponta para BASE_URL + uniqueLink
    const celulaUnique = `<a href="${BASE_URL}${uniqueLink}">${uniqueLink}</a>`;

    html += `
      <tr>
        <td>${celulaUnique}</td>
        <td>${dynamicLink ?? "-"}</td>
      </tr>`;
  }

  corpo.innerHTML = html;
}

iniciar();