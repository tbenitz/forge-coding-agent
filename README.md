# Forge — public DeepSeek coding agent

A site where **visitors** describe what they want and the agent writes or patches code. They do not need a DeepSeek key.

The key stays on the server as `DEEPSEEK_API_KEY` (GitHub Actions secret, Vercel env, or local `.env`). The browser only talks to `/api/chat`.

## Why not GitHub Pages alone?

GitHub Pages is static. A static page cannot hide an API key. If you put the DeepSeek key in the HTML, every visitor can steal it.

Use Pages only for the UI if you also deploy `/api/chat` somewhere else. Easier: run the included server (or Vercel) so one host serves both.

## Local

```bash
export DEEPSEEK_API_KEY=sk-...
node server.mjs
```

Open http://localhost:8787

## GitHub secret (you add this — tools cannot write secret values)

1. Repo → **Settings → Secrets and variables → Actions → New repository secret**
2. Name: `DEEPSEEK_API_KEY`
3. Value: your DeepSeek key from https://platform.deepseek.com

CLI:

```bash
gh secret set DEEPSEEK_API_KEY --repo tbenitz/forge-coding-agent
```

That secret is for deploy/CI. Visitors still never see it.

## Vercel

- Import this repo
- Add env var `DEEPSEEK_API_KEY`
- Deploy. `api/chat.js` becomes `https://your-app.vercel.app/api/chat`

## What visitors get

- Chat agent that writes full files or edits one section
- File tree, Monaco editor, copy, export zip
- Website preview opens in a **new tab**
- Snippet / JS checks run in the same tab
- Collapsible files, agent, and top menus
