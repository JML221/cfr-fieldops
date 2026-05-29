# Actor Registry — Structured Armed Group Search

## Problem

Armed actor data is currently embedded inside per-challenge lesson files. The Philippines lesson defines four groups (MILF/BIAF, NPA, ASG, BIFF) under `armedGroups[]` in `data/lessons/philippines-armed-actors.json`. This structure has two problems:

1. **No cross-challenge queries.** There's no way to ask "which armed groups across all challenges have IS affiliations?" or "which groups have active IHL engagement programs?".
2. **Actors appear in multiple challenges.** IS-linked factions appear in the Philippines (BIFF), Sahel (GSIM/JNIM), and Myanmar (Arakan Army's opponents). Without a registry, this relationship is invisible.

An actor registry decouples armed group data from challenge-specific lesson files and makes groups queryable as a first-class entity.

## Approach

**Data model:** Extract `armedGroups[]` from all lesson files into a flat registry at `data/actors/`. One JSON file per group, named by actor ID.

**Suggested schema:**

```json
{
  "id": "biff",
  "name": "Bangsamoro Islamic Freedom Fighters",
  "aliases": ["BIFF", "Bangsamoro Freedom Fighters"],
  "regions": ["Mindanao", "Philippines"],
  "challenges": ["philippines-armed-actors"],
  "ideology": "Islamist-separatist",
  "status": "active-spoiler",
  "peaceProcessStatus": "rejected",
  "isAffiliated": true,
  "ihlEngagement": "limited",
  "preferredContactMethod": "none-direct",
  "riskLevel": "high",
  "engagementNotes": "Separate access negotiations required. Does not respect MILF ceasefire. Some factions declare IS allegiance.",
  "relatedActors": ["milf", "asq"]
}
```

**Query patterns:**
- `getActorsForChallenge(challengeId)` → replaces current embedded lookup
- `getActorsForRegion(region)` → cross-challenge geographic query
- `getActorById(id)` → direct lookup by ID
- `searchActors({ isAffiliated, status, region })` → filtered registry search

## Integration Point

New `data/actors/` folder with one JSON per actor. New utility in `app/api/chat/route.ts`:

```ts
// Hypothetical call
const actorContext = await getActorsForChallenge(challengeId);
// Returns markdown table of actors + engagement guidance
```

If the user's question is specifically about a named group, a tighter `getActorById()` call returns just that actor's full profile as context.

A separate UI possibility: an "Actor Index" tab in the challenge view that lets users browse groups before asking questions. This would involve a new page at `app/challenge/[id]/actors/page.tsx` and a client-side filter UI.

## Current Data to Migrate

Four actors are currently embedded in [data/lessons/philippines-armed-actors.json](../../data/lessons/philippines-armed-actors.json) under `armedGroups[]`. Each has: `name`, `description`, `keyFacts[]`, `engagementApproach`, `criticalWarnings[]`. These fields map cleanly onto the schema above.

## Open Questions

- **Normalization depth:** Should `engagementNotes` be a free-text string or a structured object with fields like `preferContactVia`, `avoidLanguage`, `requiredClearances`? Structured is queryable; free-text is more flexible.
- **Cross-challenge deduplication:** If the Sahel file also references an IS-linked group, how do we distinguish "same network, different theater" from "genuinely distinct organization"?
- **Relationship graph:** `relatedActors[]` is a flat list of IDs. A richer model would store relationship type (splinter-of, allied-with, rivals-with, successor-of). Useful for NPA/CPP/NDF or MILF/BIFF relationships.
- **Access control:** Some actor intelligence is sensitive. If the registry becomes a shared resource across organizations, role-based visibility may matter.
- **Storage:** For small scale (< 100 actors), JSON files in `data/actors/` are fine. At larger scale, SQLite or Postgres with a `tsquery` full-text index makes filtering faster.

## Related

- Current actor data: [data/lessons/philippines-armed-actors.json](../../data/lessons/philippines-armed-actors.json) → `armedGroups[]`
- Geographic overlay (which group controls which area): [geo-situational/README.md](../geo-situational/README.md)
- Semantic search over lesson text (separate from structured actor queries): [semantic/README.md](../semantic/README.md)
