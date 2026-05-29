# Semantic Search — Lesson Content Retrieval

## Problem

The current data model injects an entire lesson file into the Claude system prompt for every request. The Philippines lesson file is already ~4 KB of dense structured content. As challenges grow (Sahel, Myanmar, Sudan, Ukraine…), this approach hits two walls:

1. **Prompt size:** Injecting all lessons for all challenges bloats the prompt beyond useful limits.
2. **Cross-challenge relevance:** A question about IS-linked splinter groups may have relevant lessons in both the Philippines file (BIFF) and a future Sahel file (JNIM/GSIM). Static per-challenge injection misses cross-challenge patterns.

Semantic search replaces the static inject with a retrieval step: find the most relevant lesson chunks for the user's specific question, regardless of which challenge they originate from.

## Approach

**Offline (build time or admin script):**
1. Chunk each lesson file into ~200–300 token segments (individual lesson items are natural chunk boundaries — see `data/lessons/philippines-armed-actors.json` → `lessonsLearned[].lessons[]`)
2. Embed each chunk using the Anthropic embeddings API or OpenAI `text-embedding-3-small`
3. Store vectors alongside chunk metadata (challengeId, category, lessonIndex) in a vector store

**Online (per request):**
1. Embed the user's incoming message
2. Query vector store for top-K similar chunks (K = 5–8)
3. Return chunks as a formatted markdown string → injected into system prompt

## Candidate Vector Stores

| Option | When to use |
|---|---|
| `hnswlib-node` (in-process) | Smallest path — no extra infra, vectors in a flat file at `data/vectors/`. Works for up to ~10k chunks. |
| SQLite + `sqlite-vec` extension | If a SQLite DB is already being added for actor-registry. Keeps everything in one file. |
| Pinecone (managed) | If the app needs to scale to many challenges and lessons (100k+ chunks). Requires API key + account. |
| pgvector + Postgres | If the app moves to a proper DB backend. Best long-term option but largest setup cost. |

For the current scale (3 challenges, ~30 total lesson items each), `hnswlib-node` with a local index file is the right starting point.

## Integration Point

Replaces `getLessonsForChallenge()` in [app/api/chat/route.ts](../../app/api/chat/route.ts):

```ts
// Current
const lessonContent = getLessonsForChallenge(challengeId);

// Future
const lessonContent = await getRelevantLessons(userMessage, { challengeId, topK: 6 });
```

A fallback to the current static inject makes sense during the transition — if the vector index is missing or stale, fall back to injecting the full lesson file.

## Open Questions

- **Chunk boundaries:** Should chunks follow the existing JSON structure (one lesson item per chunk), or be split by token count regardless of structure? The current JSON has natural paragraph-sized lessons which are good chunk candidates.
- **Embed what:** Full lesson text only, or also include the category name and challenge title as prefix to improve retrieval signal?
- **Index freshness:** The index needs to be rebuilt when lesson files change. A CI step or a pre-commit hook is the right trigger.
- **Hybrid search:** Pure semantic search can miss exact keyword matches (e.g., "NPA" as an acronym). A BM25 hybrid pass may improve precision.

## Related

- Current lesson data model: [data/lessons/philippines-armed-actors.json](../../data/lessons/philippines-armed-actors.json)
- Current static inject: `getLessonsForChallenge()` in [app/api/chat/route.ts](../../app/api/chat/route.ts)
- Actor-level search (separate concern): [actor-registry/README.md](../actor-registry/README.md)
