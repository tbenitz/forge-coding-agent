# Forge — public DeepSeek coding agent

Visitors describe code. The site writes or patches files. They do not need a DeepSeek key.

## You cannot run this site *on* GitHub

GitHub does two different things people mix up:

| Thing | What it actually is | Can visitors use the agent? |
|---|---|---|
| **GitHub secret** `DEEPSEEK_API_KEY` | Hidden value stored on the repo | Not by itself |
| **GitHub Actions + Node** | A throwaway computer that runs a script, then shuts off | No. It is not a website. |
| **GitHub Pages** | Static files only | No. It cannot hide the key or run `/api/chat`. |

Adding the secret was correct. “Doing Node on GitHub” only proves the key works. It does not host the app.

The live site has to run on a host that stays online and can keep the key on the server: **Vercel** (easiest), Render, Railway, Fly, or a VPS.

```
visitor  →  your live URL /api/chat  →  DeepSeek
                    ↑
            DEEPSEEK_API_KEY on that host
```

## Fastest way to put it online (no Node on your laptop)

1. Open [vercel.com](https://vercel.com) and sign in with GitHub.
2. **Add New → Project → Import** `tbenitz/forge-coding-agent`.
3. In the project: **Settings → Environment Variables**
   - Name: `DEEPSEEK_API_KEY`
   - Value: the same DeepSeek key you put in GitHub Secrets
   - Environment: Production (and Preview if you want)
4. Deploy.

Vercel runs `api/chat.js` as the Node backend. Visitors open the Vercel URL and generate code. Your key never goes to the browser.

The GitHub secret is **not copied to Vercel automatically**. Paste it once in Vercel too.

## Prove the GitHub secret works (this *is* Node on GitHub)

1. Repo → **Actions**
2. Workflow **Check DeepSeek key**
3. **Run workflow**

That job starts Node on a GitHub machine, calls DeepSeek with `${{ secrets.DEEPSEEK_API_KEY }}`, prints a short reply, and exits. That is all GitHub Actions can do with Node.

## Run on your own computer (optional)

```bash
export DEEPSEEK_API_KEY=sk-...
node server.mjs
```

Open http://localhost:8787

## Files

- `index.html` — visitor UI (upload this file to the repo if it is missing)
- `api/chat.js` — Vercel/serverless proxy
- `server.mjs` — local Node server
- `.github/workflows/check-key.yml` — secret smoke test
- `.github/workflows/deploy-vercel.yml` — optional deploy if you add Vercel tokens
