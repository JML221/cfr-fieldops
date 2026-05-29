# Realtime Intel — Live News and Security Feed Aggregation

## Problem

Every lesson in this app describes what *was* true — historical patterns, past incidents, lessons drawn from field experience over years. A field operator deploying to Mindanao this week needs to know what is *happening now*:

- Did NPA issue a new "revolutionary taxation" demand in Bukidnon this month?
- Has AFP launched an offensive in a zone you planned to enter?
- Did ASG kidnap an NGO worker in Sulu last week?
- Has the BARMM government issued a humanitarian access advisory?

Historical lessons frame the context. Realtime intel makes the assessment operational.

## Approach

**Aggregation pipeline:**
1. Pull from multiple open sources on a schedule (every 6–24 hours depending on source)
2. Filter by challenge region and armed actor names from the actor registry
3. Score relevance (humanitarian access, security incidents, armed group activity)
4. Store top N items per challenge in a lightweight cache (JSON files in `data/cache/intel/`)
5. On user request, return the last 7 days of relevant items as a formatted markdown digest

**Relevance scoring heuristics:**
- Contains an actor name from the challenge's actor registry → high relevance
- Contains location terms from the challenge region → medium relevance
- Source is an NGO security bulletin or OCHA alert → high weight
- Source is general news → lower weight, require multiple corroborating items

## Data Sources

| Source | Coverage | Access | Update lag |
|---|---|---|---|
| OCHA ReliefWeb API | Global humanitarian situations | Open REST API | Hours–days |
| INSO (International NGO Safety Organisation) | NGO-focused security alerts, by country | Requires NGO registration | Near-real-time |
| The New Humanitarian RSS | In-depth humanitarian reporting | Open RSS feed | Daily |
| Benar News (Philippines/SE Asia) | Conflict reporting for SEA | Open RSS | Daily |
| Rappler (Philippines) | Philippines-specific conflict coverage | Open RSS | Daily |
| GDELT Project | Media-derived event data, global | Open; BigQuery or CSV download | 15-minute updates |
| ACLED Realtime Track | Conflict events (complements geo layer) | Free humanitarian tier | 2-week verified lag; realtime for subscribers |

OCHA ReliefWeb + regional RSS feeds cover the immediate need. GDELT adds breadth but requires noise filtering. INSO is the highest-signal source but requires organizational registration.

## Integration Point

New utility `getRecentIntel(challengeId, { days = 7 })` in the API layer:

```ts
// Hypothetical
const intel = await getRecentIntel('philippines-armed-actors', { days: 7 });
// Returns: "Recent developments (last 7 days):\n- AFP offensive reported in North Cotabato..."
```

Called from [app/api/chat/route.ts](../../app/api/chat/route.ts) and prepended to the system prompt with a clear timestamp header so the AI can reference it:

```
RECENT INTELLIGENCE (as of 2025-06-01):
[aggregated digest here]
```

The AI is already instructed to prioritize field safety and current conditions — feeding it a dated digest lets it naturally caveat answers with current context.

## Caching Strategy

Real-time fetching on every user request is too slow and would exhaust API rate limits. Options:

- **Scheduled background job:** Fetch and cache intel every 6 hours per active challenge. In Next.js, this could be a cron route (`/api/cron/fetch-intel`) triggered by Vercel Cron or a simple external scheduler.
- **On-demand with TTL:** Fetch on first request, cache for 6 hours in `data/cache/intel/[challengeId].json`. Stale-while-revalidate pattern.
- **Edge-cached:** If deploying on Vercel, use `revalidate` in Next.js route handlers to cache the aggregated feed at the edge.

Start with on-demand + TTL (simplest). Move to scheduled if cache misses become a user-visible latency problem.

## Open Questions

- **Credibility weighting:** Not all sources are equally reliable. A single Rappler article isn't the same signal as an OCHA Flash Update. The prompt injection should include source attribution so the AI can calibrate.
- **Conflicting reports:** Two sources may say opposite things about the same incident. Surface both with source labels rather than trying to resolve the conflict automatically — let the AI acknowledge uncertainty.
- **INSO access:** INSO is the gold standard for NGO security data but requires organizational registration. If this tool is deployed for a specific organization, getting INSO access is high priority.
- **Language:** Some regional sources (Bangsamoro-specific outlets, local government releases) publish in Filipino, Maranao, or Tausug. Whether to machine-translate these before injection is an open question.
- **User visibility:** Should the raw intel digest be visible to the user in the UI, or is it only fed to the model? Showing it in a collapsible "Current Situation" panel would help operators evaluate AI answers. Hiding it keeps the UI simpler.
- **Sensitive content:** Security incident reports can contain detailed casualty information. Define a content policy for what gets injected into prompts used by field workers who may be in active operations.

## Related

- Geographic incident layer (ACLED events, complements this feed): [geo-situational/README.md](../geo-situational/README.md)
- Document retrieval from cited field manuals: [document-retrieval/README.md](../document-retrieval/README.md)
- Challenge region data (used for geographic filtering): [data/challenges.json](../../data/challenges.json)
