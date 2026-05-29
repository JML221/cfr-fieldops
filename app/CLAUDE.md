# app/

Next.js App Router directory.

- `layout.tsx` — Root layout: imports globals.css, sets page metadata
- `page.tsx` — Home page: renders the challenge list
- `globals.css` — Tailwind v4 with `@theme` color tokens (`base`, `surface`, `edge`, `accent`, `muted`, `active`), Nunito font, and `prose-field` markdown styles
- [`api/`](api/CLAUDE.md) — API routes
- [`challenge/`](challenge/CLAUDE.md) — Dynamic challenge chat route
