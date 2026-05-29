# Search Tools — Future Infrastructure

This folder documents planned search and retrieval capabilities for the CFR Field Ops Advisor. None of these are implemented yet. Each subfolder contains a design brief for one search domain.

## Why This Exists

The app currently works by loading a single lesson file and injecting its full text into the Claude system prompt (`app/api/chat/route.ts` → `getLessonsForChallenge()`). This works when there are 1–3 challenges, each with a manageable lesson file. It breaks down when:

- The number of challenges grows past ~5 (prompts become too large)
- Users ask cross-challenge questions (e.g., IS-linked actors in both Philippines and Sahel)
- Answers need to cite the actual text of external source documents, not hand-curated summaries
- Field operators need current situational data, not historical lessons

The sub-tools below all feed into the same integration point: they produce additional context that gets prepended to the system prompt before the Anthropic API call. The architecture stays the same; what changes is how that context is assembled.

## Decision Tree

| User's question type | Tool to reach for |
|---|---|
| "What do lessons say about X?" across multiple challenges | [Semantic search](semantic/README.md) |
| "What does the CCHN manual actually say about Y?" | [Document retrieval](document-retrieval/README.md) |
| "How do I engage with Group Z?" / "Who controls this area?" | [Actor registry](actor-registry/README.md) |
| "Is Route X safe right now?" / "Which group controls Village Y?" | [Geo-situational](geo-situational/README.md) |
| "What's happened in Mindanao in the last two weeks?" | [Realtime intel](realtime-intel/README.md) |

## Integration Architecture

All search tools plug into `app/api/chat/route.ts`. Today that file has:

```
buildSystemPrompt(challengeId)
  └─ getLessonsForChallenge(challengeId)   ← static JSON inject
```

Future shape:

```
buildSystemPrompt(challengeId, userMessage)
  ├─ getRelevantLessons(userMessage)       ← semantic search
  ├─ fetchSourceContext(citedUrls)         ← document retrieval
  ├─ getActorsForRegion(region)            ← actor registry
  ├─ getGeoSummary(region)                 ← geo-situational
  └─ getRecentIntel(challengeId)           ← realtime intel
```

Each returns a markdown string. They're concatenated and passed as the system prompt. Token budget discipline matters — search tools should return the most relevant ~500–800 tokens each, not full dumps.

## Subfolders

- [semantic/](semantic/README.md) — vector/embedding search over lesson content
- [document-retrieval/](document-retrieval/README.md) — fetching live external source documents
- [actor-registry/](actor-registry/README.md) — structured search of armed groups database
- [geo-situational/](geo-situational/README.md) — geographic and incident-layer queries
- [realtime-intel/](realtime-intel/README.md) — live news, NGO alerts, and security feeds
