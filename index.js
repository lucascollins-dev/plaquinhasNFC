const fs = require("fs");
const shortid = require("shortid");

if (fs.existsSync("dados.json")) {
  // Arquivo já existe: só lê, sem gerar nem salvar de novo
  const dados = JSON.parse(fs.readFileSync("dados.json", "utf8"));
  console.log(dados);
} else {
  // Arquivo não existe: gera a lista e salva
  const lista = [];
  for (let i = 0; i < 20; i++) {
    lista.push({ uniqueLink: shortid.generate(), dynamicLink: null });
  }

  fs.writeFileSync("dados.json", JSON.stringify(lista));
  console.log(lista);
}

