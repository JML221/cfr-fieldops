# data/

Static content loaded at build/request time — no database.

- `challenges.json` — List of challenge cards shown on the home page (id, title, region, summary, status, tags). Status `active` enables the link; `coming_soon` renders it dimmed.
- `lessons/` — Per-challenge lesson files. Each file contains situation overview, armed group profiles, categorized lessons learned, and source citations. The API route in `app/api/chat/` reads these to build the system prompt.
