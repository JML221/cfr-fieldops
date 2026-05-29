# app/

Next.js App Router directory.

- `layout.tsx` — Root layout: imports globals.css, sets page title/description
- `page.tsx` — Home page: reads `data/challenges.json`, renders `<ChallengeCard>` list (imported from `components/`)
- `globals.css` — Tailwind v4 with `@theme` color tokens and `prose-field` markdown styles

## Color tokens (use these Tailwind classes throughout)

| Token | Class examples | Value | Use |
|-------|---------------|-------|-----|
| `canvas` | `bg-canvas` | `#0f1117` | Page background |
| `surface` | `bg-surface` | `#1a1d27` | Panels, cards |
| `edge` | `border-edge` | `#2a2d3a` | Borders, dividers |
| `brand` | `bg-brand`, `text-brand`, `border-brand` | `#f59e0b` | Amber — buttons, highlights, labels |
| `brand-dim` | `bg-brand-dim` | `#92400e` | Muted amber |
| `muted` | `text-muted`, `bg-muted` | `#8896a7` | Secondary text, inactive dots |
| `active` | `bg-active` | `#22c55e` | Green status indicator |
| `danger` | `text-danger` | `#ef4444` | Warnings |

## Subdirectories

- [`api/`](api/CLAUDE.md) — API routes
- [`challenge/`](challenge/CLAUDE.md) — Dynamic challenge chat route
