module.exports = async function handler(req, res) {
  const codigo = req.query.c;
  if (!codigo) {
    return res.status(400).json({ erro: "Código ausente" });
  }

  const base = process.env.SUPABASE_URL;
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !chave) {
    return res.status(500).json({ erro: "Configuração incompleta" });
  }

  const url = `${base}/rest/v1/plaquinhas?unique_link=eq.${encodeURIComponent(codigo)}&select=dynamic_link`;
  const resposta = await fetch(url, {
    headers: { apikey: chave, Authorization: `Bearer ${chave}` }
  });

  if (!resposta.ok) {
    return res.status(500).json({ erro: "Erro ao consultar o banco" });
  }

  const linhas = await resposta.json();
  const destino = linhas[0] ? linhas[0].dynamic_link : null;
  return res.status(200).json({ destino });
};