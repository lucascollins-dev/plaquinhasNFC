module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  const senha = req.headers["x-senha"];
  if (!senha || senha !== process.env.CADASTRO_SENHA) {
    return res.status(401).json({ erro: "Senha incorreta" });
  }

  const { storeName, link } = req.body || {};
  if (!storeName || !link) {
    return res.status(400).json({ erro: "Preencha o nome e o link" });
  }
  if (!linkValido(link)) {
    return res.status(400).json({ erro: "Link inválido. Use um link https do Google ou do Instagram." });
  }

  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resposta = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/atribuir_proximo`, {
    method: "POST",
    headers: {
      apikey: chave,
      Authorization: `Bearer ${chave}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      p_store: String(storeName).trim().slice(0, 80),
      p_link: String(link).trim()
    })
  });

  if (!resposta.ok) {
    return res.status(500).json({ erro: "Erro ao gravar no banco" });
  }

  const codigo = await resposta.json();
  if (!codigo) {
    return res.status(409).json({ erro: "Não há plaquinhas livres" });
  }

  return res.status(200).json({ codigo });
};

function linkValido(link) {
  try {
    const url = new URL(String(link).trim());
    const host = url.hostname.toLowerCase();
    const permitidos = ["google.com", "g.page", "goo.gl", "instagram.com"];
    return url.protocol === "https:" &&
      permitidos.some((d) => host === d || host.endsWith("." + d));
  } catch {
    return false;
  }
}