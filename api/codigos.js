module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  const senha = req.headers["x-senha"];
  if (!senha || senha !== process.env.CADASTRO_SENHA) {
    return res.status(401).json({ erro: "Senha incorreta" });
  }

  const url = process.env.SUPABASE_URL;
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !chave) {
    return res.status(500).json({ erro: "Configuração incompleta" });
  }

  try {
    const resposta = await fetch(`${url}/rest/v1/plaquinhas?select=unique_link,store_name&order=id`, {
      headers: { apikey: chave, Authorization: `Bearer ${chave}` }
    });

    if (!resposta.ok) {
      return res.status(500).json({ erro: "Erro ao buscar códigos" });
    }

    const linhas = await resposta.json();
    return res.status(200).json(
      linhas.map((l) => ({ uniqueLink: l.unique_link, storeName: l.store_name }))
    );
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao buscar códigos" });
  }
};