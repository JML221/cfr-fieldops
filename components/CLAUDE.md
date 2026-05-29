# components/

Shared UI components. All are pure presentational — no data fetching, no hooks (except what's passed via props).

- `ChallengeCard.tsx` — Card for the home page challenge list. Active challenges render as a `<Link>`; coming-soon challenges render as a dimmed non-interactive `<div>`. Props: `{ challenge: Challenge }`.

- `ResponseBlock.tsx` — Renders a single assistant response. Shows the triggering question at the top, markdown content via `react-markdown` + `remark-gfm`, and clickable section buttons parsed from numbered lists in the response. Props: `{ message, questionText?, isLatest, onSectionClick? }`.

- `PreviousQuestion.tsx` — Clickable button showing a past user question (truncated to 2 lines). Clicking it restores the text to the input. Props: `{ message: Message, onClick }`.

- `LoadingDots.tsx` — Animated three-dot bounce indicator shown while a response is streaming. No props.
