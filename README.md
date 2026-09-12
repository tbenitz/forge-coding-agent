# Forge — GitHub-only coding agent

You only use GitHub. That is fine. The secret you added is for **GitHub Actions**, not for a webpage.

GitHub cannot keep a Node server running. GitHub Pages cannot hide a key. So the key is used the only way GitHub allows:

1. Someone asks for code (issue form, or you click Run workflow).
2. Actions starts Node for a few minutes.
3. Node reads `secrets.DEEPSEEK_API_KEY` and calls DeepSeek.
4. The files land in `generated/latest` and, for issues, as a comment.
5. The machine shuts off.

That is why the secret lives on GitHub. It is not wasted. It just cannot be used by a live chat page hosted on Pages.

## For other people (public)

Anyone can open an issue:

https://github.com/tbenitz/forge-coding-agent/issues/new?template=generate.yml

Pick a code type, describe the code, submit. The **generate** label starts the Action.

## For you (owner)

1. Actions → **Generate code** → Run workflow
2. Type the prompt
3. Wait for the green check
4. Open `generated/latest`

## Check the secret

Actions → **Check DeepSeek key** → Run workflow

## Pages (optional)

Settings → Pages → Deploy from branch `main` → `/` (root).
The landing page is `index.html`. It only links to the issue form and Actions. It does not contain the key.
