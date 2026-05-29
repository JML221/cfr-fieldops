# CFR Field Ops Advisor

AI-powered decision-support tool for humanitarian field operators working in active conflict zones. Users select a conflict scenario and get a structured chat session with an advisor grounded in published field manuals and lessons learned.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind v4 · Anthropic SDK (Claude Haiku streaming)

Dev server runs on port 3001 (`npm run dev`).

## Subfolders

- [`app/`](app/CLAUDE.md) — Next.js App Router: pages, layout, API route, global styles
- [`components/`](components/CLAUDE.md) — Shared UI components (extracted from pages)
- [`lib/`](lib/CLAUDE.md) — Server-side utilities (lesson loading, formatting)
- [`data/`](data/CLAUDE.md) — Challenge metadata and lesson content (JSON)
- [`hooks/`](hooks/CLAUDE.md) — React hooks
- [`types/`](types/CLAUDE.md) — Shared TypeScript interfaces

## Key data flow

1. Home (`app/page.tsx`) reads `data/challenges.json` → renders `<ChallengeCard>` list
2. Challenge page (`app/challenge/[id]/page.tsx`) validates the challenge, loads the lesson file via `lib/lessons.ts`, passes `starterPrompts` to `<ChatPage>`
3. `<ChatPage>` (`'use client'`) manages message state via `useChat`, streams from `POST /api/chat`
4. API route builds a system prompt from lesson data (via `lib/lessons.ts`) and streams Claude Haiku response
