# app/api/

Next.js API routes.

## chat/route.ts

`POST /api/chat` — accepts `{ messages, challengeId }`, streams a Claude Haiku response.

**Flow:**
1. Calls `getLessonContent(challengeId)` from `lib/lessons.ts` to load the lesson JSON
2. Passes it to `formatLessonAsContext()` to produce a markdown context string
3. Wraps it in `buildSystemPrompt()` with role instructions and format rules
4. Streams the response via `client.messages.stream()` as `text/plain` using a `ReadableStream`

Adding a new challenge only requires adding a new file under `data/lessons/` — no changes to this route needed.
