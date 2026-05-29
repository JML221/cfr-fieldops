# lib/

Server-side utilities. These run only in server components and API routes — do not import from client components.

## lessons.ts

`getLessonContent(challengeId: string): Promise<LessonContent | null>`
— Dynamically imports `data/lessons/{challengeId}.json`. Returns `null` if no file exists for that ID (safe fallback — the challenge page already blocks invalid IDs via `notFound()`).

`formatLessonAsContext(d: LessonContent): string`
— Formats a loaded lesson into a markdown string used in the Claude system prompt: situation overview, armed group profiles, categorized lessons, and source citations.

Both functions are used by `app/api/chat/route.ts` on every chat request, and `getLessonContent` is also called by `app/challenge/[id]/page.tsx` at render time to extract `starter_prompts`.
