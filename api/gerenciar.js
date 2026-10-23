module.exports = async function handler(req, res) {
  const senha = req.headers["x-senha"];
  if (!senha || senha !== process.env.CADASTRO_SENHA) {
    return res.status(401).json({ erro: "Senha incorreta" });
  }

  const url = process.env.SUPABASE_URL;
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const headers = {
    apikey: chave,
    Authorization: `Bearer ${chave}`,
    "Content-Type": "application/json"
  };

  try {
    if (req.method === "GET") {
      const r = await fetch(
        `${url}/rest/v1/plaquinhas?select=unique_link,store_name,dynamic_link&order=id`,
        { headers }
      );
      if (!r.ok) return res.status(500).json({ erro: "Erro ao listar" });
      return res.status(200).json(await r.json());
    }

    if (req.method === "POST") {
      const { codigo, acao, storeName, link } = req.body || {};
      if (!codigo) return res.status(400).json({ erro: "Código ausente" });

      const filtro = `${url}/rest/v1/plaquinhas?unique_link=eq.${encodeURIComponent(codigo)}`;

      if (acao === "liberar") {
        const r = await fetch(filtro, {
          method: "PATCH",
          headers: { ...headers, Prefer: "return=minimal" },
          body: JSON.stringify({ dynamic_link: null, store_name: null, assigned_at: null })
        });
        return r.ok
          ? res.status(200).json({ ok: true })
          : res.status(500).json({ erro: "Erro ao liberar" });
      }

      if (acao === "editar") {
        if (!storeName || !linkValido(link)) {
          return res.status(400).json({
            erro: "Preencha o nome e use um link https do Google ou do Instagram"
          });
        }
        const r = await fetch(filtro, {
          method: "PATCH",
          headers: { ...headers, Prefer: "return=minimal" },
          body: JSON.stringify({
            dynamic_link: String(link).trim(),
            store_name: String(storeName).trim().slice(0, 80),
            assigned_at: new Date().toISOString()
          })
        });
        return r.ok
          ? res.status(200).json({ ok: true })
          : res.status(500).json({ erro: "Erro ao salvar" });
      }

      return res.status(400).json({ erro: "Ação inválida" });
    }

    return res.status(405).json({ erro: "Método não permitido" });
  } catch (erro) {
    return res.status(500).json({ erro: "Erro interno" });
  }
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