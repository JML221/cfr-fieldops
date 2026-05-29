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

Create a `.env.local` file:

```
ANTHROPIC_API_KEY=your_key_here
```

```bash
npm run dev   # http://localhost:3001
```

## Project structure

```
app/
  layout.tsx              # Root layout, fonts, metadata
  page.tsx                # Home page — challenge list
  globals.css             # Tailwind v4 theme tokens and prose styles
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
