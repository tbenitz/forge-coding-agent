const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const MAX_TOKENS = Number(process.env.MAX_TOKENS || 50000);

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    return res.status(204).end();
  }
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const payload = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  payload.stream = true;
  if (payload.max_tokens) payload.max_tokens = Math.min(Number(payload.max_tokens) || MAX_TOKENS, MAX_TOKENS);

  const headerAuth = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  const key = headerAuth || process.env.DEEPSEEK_API_KEY;
  if (!key) return res.status(500).json({ error: "DEEPSEEK_API_KEY is not configured on the server." });

  const upstream = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
    body: JSON.stringify(payload)
  });

  res.status(upstream.status);
  res.setHeader("Content-Type", upstream.headers.get("content-type") || "text/event-stream");
  res.setHeader("Cache-Control", "no-store");
  if (!upstream.body) return res.end();
  const reader = upstream.body.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    res.write(value);
  }
  res.end();
}
