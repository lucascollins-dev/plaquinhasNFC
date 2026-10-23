module.exports = async function handler(req, res) {
  const url = process.env.SUPABASE_URL;
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !chave) {
    return res.status(500).json({ ok: false });
  }

  const r = await fetch(`${url}/rest/v1/plaquinhas?select=id&limit=1`, {
    headers: { apikey: chave, Authorization: `Bearer ${chave}` }
  });

  return res.status(r.ok ? 200 : 500).json({ ok: r.ok });
};