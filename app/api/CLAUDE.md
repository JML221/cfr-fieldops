# app/api/

Next.js API routes.

## chat/route.ts

POST `/api/chat` — accepts `{ messages, challengeId }`, builds a system prompt from the lesson data for that challenge, and streams a response from Claude Haiku using the Anthropic SDK. Returns plain text via a `ReadableStream`.
