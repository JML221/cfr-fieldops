# Deploying to Netlify

## One-time setup

### 1. Connect the repo

1. Go to [netlify.com](https://netlify.com) and log in (or create a free account)
2. Click **Add new site → Import an existing project**
3. Choose **GitHub** and authorize Netlify to access the repo
4. Select the **cfr-fieldops** repository
5. Set the **branch to deploy** to `main`
6. Netlify will auto-detect the build settings from `netlify.toml` — no changes needed

### 2. Set environment variables

Go to **Site settings → Environment variables** and add the following three variables before deploying:

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | API key from [console.anthropic.com](https://console.anthropic.com) — powers the Claude chat |
| `SITE_PASSWORD` | The password users enter to access the site |
| `SITE_AUTH_TOKEN` | A secret token stored in the auth cookie — any long random string works (e.g. generate one at [1password.com/password-generator](https://1password.com/password-generator)) |

> **Important:** Without these three variables set, the site will build but the chat will fail and the password gate will not work.

### 3. Deploy

Click **Deploy site**. The first deploy takes 2–3 minutes.

---

## Ongoing deploys

Every push to `main` triggers an automatic redeploy. No manual action needed.

---

## Custom domain (optional)

The domain is managed in **Squarespace**.

1. In the Netlify dashboard go to **Domain management → Add a domain** and enter your subdomain (e.g. `fieldops.yourorg.org`) — Netlify will show you a CNAME target URL
2. Log into Squarespace → **Domains → your domain → DNS Settings**
3. Add a `CNAME` record:
   - **Host:** your subdomain prefix (e.g. `fieldops`)
   - **Value:** the Netlify CNAME target from step 1 (e.g. `yoursite.netlify.app`)
4. Save — Netlify will detect the record and provision an SSL certificate automatically within a few minutes
