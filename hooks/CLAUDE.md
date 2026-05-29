# hooks/

React hooks.

- `useChat.ts` — Manages chat message state for a given `challengeId`. Streams responses from `/api/chat` token-by-token and appends them to the assistant message in place. Exposes `messages`, `isLoading`, `sendMessage`, and `reset`.
