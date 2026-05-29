# types/

Shared TypeScript interfaces (`types/index.ts`).

## Chat / UI

- `Message` — `{ id: string, role: 'user' | 'assistant', content: string }`
- `Challenge` — shape of entries in `data/challenges.json`

## Lesson content (mirrors `data/lessons/*.json`)

- `LessonContent` — top-level lesson file shape; includes `starter_prompts`, `situation_overview`, `armed_groups`, `lessons`, `sources`
- `ArmedGroup` — `{ name, type, geography, status, engagement_notes, risks }`
- `LessonCategory` — `{ category: string, lessons: string[] }`
- `Source` — `{ title: string, url: string }`

`LessonContent` is used in `lib/lessons.ts` (loader/formatter) and `app/challenge/[id]/page.tsx` (to read `starter_prompts`).
