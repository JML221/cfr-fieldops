# CFR Field Ops Advisor

AI-powered decision-support tool for humanitarian field operators working in active conflict zones. Users select a conflict scenario and get a structured chat session with an advisor grounded in published field manuals and lessons learned.

## What it does

- **Home page** — lists available conflict challenges (Philippines, Sahel, Myanmar). Active challenges link to a chat session; upcoming ones are shown as coming soon.
- **Chat session** — two-panel layout: question input and history on the left, streamed advisor response on the right. The advisor draws on per-challenge lesson files covering situation overviews, armed group profiles, and categorized lessons learned with source citations.
- **API** — `POST /api/chat` accepts `{ messages, challengeId }`, builds a system prompt from the challenge's lesson data, and streams a response from Claude via the Anthropic SDK.

## Stack

- [Next.js 15](https://nextjs.org/) (App Router) + React 19
- [Tailwind CSS v4](https://tailwindcss.com/) with custom `@theme` color tokens
- [Anthropic SDK](https://github.com/anthropic-ai/anthropic-sdk-python) — Claude Haiku, streaming
- TypeScript

## Getting started

```bash
npm install
```

Create a `.env.local` file with the following required variables:

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key — get one at console.anthropic.com |
| `SITE_PASSWORD` | Yes | Password users enter at the `/login` gate |
| `SITE_AUTH_TOKEN` | Yes | Secret stored in the auth cookie after login — use a long random string, keep it private |

Example:

```
ANTHROPIC_API_KEY=sk-ant-...
SITE_PASSWORD=your_password_here
SITE_AUTH_TOKEN=some_long_random_string_change_this
```

The app will not start correctly if `ANTHROPIC_API_KEY` is missing, and the password gate will block all access if `SITE_PASSWORD` or `SITE_AUTH_TOKEN` are missing. Change all three values before deploying.

```bash
npm run dev   # http://localhost:3001
```

## Project structure

```
middleware.ts             # Password gate — redirects unauthenticated requests to /login
app/
  layout.tsx              # Root layout, fonts, metadata
  page.tsx                # Home page — challenge list
  globals.css             # Tailwind v4 theme tokens and prose styles
  login/page.tsx          # Password login page
  api/auth/route.ts       # Auth endpoint — verifies password, sets cookie
  api/chat/route.ts       # Streaming chat endpoint
  challenge/[id]/
    page.tsx              # Server component — challenge lookup
    ChatPage.tsx          # Client component — chat UI
data/
  challenges.json         # Challenge metadata (id, title, region, status, tags)
  lessons/                # Per-challenge lesson files (system prompt source)
hooks/
  useChat.ts              # Chat state and streaming logic
types/
  index.ts                # Shared TypeScript interfaces
```

## Adding a challenge

1. Add an entry to [data/challenges.json](data/challenges.json) with `"status": "coming_soon"`.
2. Create a lesson file at `data/lessons/<id>.json` with situation overview, armed group profiles, and lessons learned.
3. Change status to `"active"` when the lesson file is ready.

## Notes

- For internal use. Not for distribution.
- Sources are cited within each challenge's lesson file.
