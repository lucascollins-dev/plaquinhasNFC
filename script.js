const mensagem = document.getElementById("mensagem");
const codigo = new URLSearchParams(window.location.search).get("c");

async function redirecionar() {
  try {
    const resposta = await fetch(`/api/resolver?c=${encodeURIComponent(codigo)}`);
    const dados = await resposta.json();

    if (dados.destino) {
      window.location.replace(dados.destino);
    } else {
      mensagem.textContent = "Link indisponível no momento.";
    }
  } catch (erro) {
    mensagem.textContent = "Não foi possível abrir o link. Tente novamente.";
  }
}

if (codigo) {
  redirecionar();
} else {
  mensagem.textContent = "Aproxime o celular ou escaneie o QR code.";
}