import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8787);
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const MAX_TOKENS = Number(process.env.MAX_TOKENS || 50000);
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = Number(process.env.RATE_MAX || 20);
const hits = new Map();

function rateLimit(ip) {
  const now = Date.now();
  const row = hits.get(ip) || [];
  const fresh = row.filter(t => now - t < RATE_WINDOW_MS);
  fresh.push(now);
  hits.set(ip, fresh);
  return fresh.length <= RATE_MAX;
}

function send(res, status, body, headers = {}) {
  const data = typeof body === "string" ? body : JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": headers["Content-Type"] || "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers
  });
  res.end(data);
}

function mime(file) {
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (file.endsWith(".css")) return "text/css; charset=utf-8";
  if (file.endsWith(".json")) return "application/json; charset=utf-8";
  if (file.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

async function proxyChat(req, res) {
  const ip = req.socket.remoteAddress || "unknown";
  if (!rateLimit(ip)) {
    send(res, 429, { error: "Too many requests. Try again in a minute." });
    return;
  }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  let payload;
  try {
    payload = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    send(res, 400, { error: "Invalid JSON" });
    return;
  }
  payload.stream = true;
  if (payload.max_tokens) payload.max_tokens = Math.min(Number(payload.max_tokens) || MAX_TOKENS, MAX_TOKENS);

  const visitorKey = (req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  const key = visitorKey || process.env.DEEPSEEK_API_KEY;
  if (!key) {
    send(res, 500, { error: "Server is missing DEEPSEEK_API_KEY. Set it as an environment variable or GitHub secret." });
    return;
  }

  const upstream = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + key
    },
    body: JSON.stringify(payload)
  });

  res.writeHead(upstream.status, {
    "Content-Type": upstream.headers.get("content-type") || "text/event-stream",
    "Cache-Control": "no-store"
  });
  if (!upstream.body) {
    res.end();
    return;
  }
  const reader = upstream.body.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    res.write(value);
  }
  res.end();
}

const server = http.createServer(async (req, res) => {
  const parsed = new URL(req.url, "http://localhost");
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
    });
    res.end();
    return;
  }
  if (parsed.pathname === "/api/chat" && req.method === "POST") {
    try {
      await proxyChat(req, res);
    } catch (err) {
      if (!res.headersSent) send(res, 502, { error: String(err.message || err) });
      else res.end();
    }
    return;
  }
  if (parsed.pathname === "/api/health") {
    send(res, 200, { ok: true, configured: Boolean(process.env.DEEPSEEK_API_KEY) });
    return;
  }

  let file = parsed.pathname === "/" ? "/index.html" : parsed.pathname;
  file = path.normalize(file).replace(/^(\.\.[/\\])+/, "");
  const full = path.join(__dirname, file);
  if (!full.startsWith(__dirname)) {
    send(res, 403, { error: "Forbidden" });
    return;
  }
  fs.readFile(full, (err, data) => {
    if (err) {
      send(res, 404, { error: "Not found" });
      return;
    }
    send(res, 200, data, { "Content-Type": mime(full) });
  });
});

server.listen(PORT, () => {
  console.log("Forge coding agent on http://localhost:" + PORT);
  console.log("DEEPSEEK_API_KEY", process.env.DEEPSEEK_API_KEY ? "set" : "MISSING");
});
