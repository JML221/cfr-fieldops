# hooks/

React hooks.

## useChat.ts

`useChat(challengeId: string)` — manages chat message state for a given challenge.

Returns: `{ messages: Message[], isLoading: boolean, sendMessage, reset }`

- `sendMessage(content)` — appends a user `Message`, creates an empty assistant placeholder, POSTs `{ messages, challengeId }` to `/api/chat`, then streams the response token-by-token into the placeholder via `ReadableStream` + `TextDecoder`
- `reset()` — clears all messages (used by the "+ New Session" button)
- Message IDs use `crypto.randomUUID()` — no import needed (global in Node 19+ and all modern browsers)
- No persistence — chat history is lost on page refresh
