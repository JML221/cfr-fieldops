# data/

Static content loaded at build/request time — no database.

## challenges.json

List of challenge cards shown on the home page. Each entry: `id`, `title`, `region`, `summary`, `status`, `tags`.
- `status: "active"` — enables the link and the chat session
- `status: "coming_soon"` — renders the card dimmed with no link

## lessons/

Per-challenge lesson files named `{challengeId}.json`. Loaded dynamically by `lib/lessons.ts`.

Each file shape (`LessonContent` in `types/index.ts`):
- `starter_prompts` — 3–6 question strings shown on the empty-state left panel
- `situation_overview` — paragraph context for the region/conflict
- `armed_groups` — array of actor profiles (name, type, geography, status, engagement_notes, risks)
- `lessons` — array of lesson categories, each with a list of bullet-point lessons
- `sources` — array of `{ title, url }` citations

To add a new challenge: add an entry to `challenges.json` (set `status: "active"`) and create a matching `lessons/{id}.json` file. No code changes needed.
