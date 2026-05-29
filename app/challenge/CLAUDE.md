# app/challenge/

Dynamic route `[id]` renders a two-panel chat session for a specific challenge.

## page.tsx (server component)

1. Awaits `params.id` (Next.js 15 async params)
2. Looks up the challenge in `data/challenges.json` — calls `notFound()` if missing or not `active`
3. Calls `getLessonContent(id)` from `lib/lessons.ts` to read the lesson file
4. Renders `<ChatPage challenge={challenge} starterPrompts={lesson?.starter_prompts ?? []} />`

Only `starter_prompts` is passed from the lesson (not the full object) to keep the serialized client payload small.

## ChatPage.tsx (client component)

Two-panel layout:
- **Left panel** — textarea input, Send button, and either starter prompt buttons (empty state) or previous question history
- **Right panel** — scrollable response area; `<ResponseBlock>` per assistant message with clickable section buttons

Imports UI pieces from `components/`: `ResponseBlock`, `PreviousQuestion`, `LoadingDots`.
Uses `useChat(challenge.id)` hook for all message state and streaming logic.
