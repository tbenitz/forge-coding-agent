#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const API_URL = "https://api.deepseek.com/chat/completions";
const MODEL = process.env.DEEPSEEK_MODEL || "deepseek-flash";
const API_KEY = process.env.DEEPSEEK_API_KEY;
const idea = String(process.env.PROMPT || process.argv.slice(2).join(" ")).trim();
const codeType = process.env.CODE_TYPE || "any";
const maxTokens = Math.min(Number(process.env.MAX_TOKENS || 8000), 50000);

if (!API_KEY) {
  console.error("Missing DEEPSEEK_API_KEY GitHub secret.");
  process.exit(1);
}
if (!idea) {
  console.error("Missing PROMPT.");
  process.exit(1);
}

const system = `You are Forge, a coding agent. Write complete, formatted code.
Code type: ${codeType}.
Return one or more files using this exact format:

*** CREATE: relative/path.ext ***
<<<<<<< CONTENT
full file contents
>>>>>>> CONTENT

No markdown fences around those markers. Keep explanations short.`;

async function chat(messages) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + API_KEY
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: maxTokens,
      temperature: 0.2,
      thinking: { type: "disabled" },
      stream: false
    })
  });
  const text = await res.text();
  if (!res.ok) throw new Error("DeepSeek HTTP " + res.status + ": " + text.slice(0, 500));
  const data = JSON.parse(text);
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty model response");
  return content;
}

function parseFiles(text) {
  const files = [];
  const re = /\*\*\* (CREATE|WRITE): ([^\n*]+) \*\*\*\s*<<<<<<< CONTENT\n([\s\S]*?)\n?>>>>>>> CONTENT/g;
  let m;
  while ((m = re.exec(text))) files.push({ path: m[2].trim(), content: m[3] });
  if (!files.length) {
    const fence = /```(?:\w+)?[ \t]*([^\n`]*)\n([\s\S]*?)```/;
    const fm = text.match(fence);
    if (fm) files.push({ path: (fm[1].trim() && fm[1].includes(".")) ? fm[1].trim() : "output.txt", content: fm[2] });
    else files.push({ path: "output.md", content: text });
  }
  return files;
}

const reply = await chat([
  { role: "system", content: system },
  { role: "user", content: idea }
]);

const outDir = path.join(root, "generated", "latest");
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
const files = parseFiles(reply);
for (const f of files) {
  const dest = path.join(outDir, f.path);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, f.content.endsWith("\n") ? f.content : f.content + "\n");
}
fs.writeFileSync(path.join(outDir, "PROMPT.md"), idea + "\n");
fs.writeFileSync(path.join(root, "generated", "last-reply.md"), reply.endsWith("\n") ? reply : reply + "\n");
fs.writeFileSync(path.join(root, "generated", "last-run.json"), JSON.stringify({
  idea, codeType, model: MODEL, files: files.map(f => f.path), createdAt: new Date().toISOString()
}, null, 2));
console.log("Wrote", files.length, "file(s) to generated/latest");
files.forEach(f => console.log(" -", f.path));
