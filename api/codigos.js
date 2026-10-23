module.exports = async function handler(req, res) {
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = `${process.env.SUPABASE_URL}/rest/v1/plaquinhas?select=unique_link&order=id`;
  const resposta = await fetch(url, {
    headers: { apikey: chave, Authorization: `Bearer ${chave}` }
  });

  if (!resposta.ok) {
    return res.status(500).json({ erro: "Erro ao buscar códigos" });
  }

  const linhas = await resposta.json();
  return res.status(200).json(linhas.map((l) => ({ uniqueLink: l.unique_link })));
};