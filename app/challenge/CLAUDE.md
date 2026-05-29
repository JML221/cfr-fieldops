# app/challenge/

Dynamic route `[id]` renders a two-panel chat session for a specific challenge.

- `page.tsx` — Server component: looks up the challenge by ID from `data/challenges.json`, 404s if not found or not active
- `ChatPage.tsx` — Client component: left panel for question input and history, right panel for streamed advisor responses with clickable section buttons
