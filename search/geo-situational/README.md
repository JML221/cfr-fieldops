# Geo-Situational — Geographic and Incident-Layer Queries

## Problem

The app has zero geospatial awareness. Lesson content describes armed group behavior and engagement principles in text, but a field operator moving through Mindanao today needs to answer questions like:

- "Is the road from Cotabato City to Maguindanao controlled by MILF or BIFF right now?"
- "What's the current incident rate in this municipality?"
- "Where are active AFP checkpoints that could compromise perceived neutrality?"
- "Which barangays have NPA presence vs. AFP-controlled territory?"

These are operational questions with geographic answers. No amount of historical lesson text substitutes for a live incident layer.

## Approach

Two data layers:

**Static geographic context (build time):**
- Administrative boundaries (province, municipality, barangay) from OCHA CODs
- Known armed group territorial presence from the actor registry (rough polygons, not precise lines — conflict zones resist precise boundary claims)
- Key infrastructure: hospitals, UN compounds, border crossings

**Dynamic incident layer (per-request or cached at short TTL):**
- Recent conflict events from ACLED API (event type, date, actor, coordinates, fatalities)
- OCHA ReliefWeb humanitarian alerts filtered by country/region
- Optional: GDELT Project event feed for broad conflict signal

**Query flow:**
1. User asks a location-related question
2. Extract location entities from user message (NLP or simple regex over known place names)
3. Query ACLED for events within N km of extracted coordinates in last 30 days
4. Cross-reference with actor registry for known group presence in that admin area
5. Return a text summary: "Recent activity near [location]: 3 armed clashes in last 14 days, attributed to BIFF. No MILF activity logged."

## Data Sources

| Source | What it provides | Access |
|---|---|---|
| ACLED API | Conflict events (type, date, actor, coordinates, fatality count) | Free for humanitarian use; requires free account + API key |
| OCHA CODs | Admin boundaries, populated places, key infrastructure (GeoJSON) | Fully open, no auth required |
| UNOSAT | Humanitarian footprints, damage assessment polygons | Open; registration for some datasets |
| OCHA ReliefWeb API | Situation reports, flash alerts by country | Fully open REST API, no auth |
| GDELT Project | Near-real-time media-derived conflict event data | Fully open; BigQuery or direct CSV downloads |

ACLED is the primary source for incident data. It has strong coverage in the Philippines and Sahel, and a dedicated humanitarian access track.

## Integration Point

Two possible shapes:

**Text-only (lower effort):** New utility `getGeoSummary(region, location?)` that calls ACLED API and returns a plain-text summary. Injected into the system prompt like other context. No UI changes required.

**Map panel (higher effort):** New API route at `app/api/geo/route.ts` returning GeoJSON. New panel in [app/challenge/[id]/ChatPage.tsx](../../app/challenge/[id]/ChatPage.tsx) renders a map (Leaflet or MapLibre GL). User clicks a location → question is pre-populated. Requires adding a mapping library dependency.

Start with text-only. Add the map panel if user testing shows spatial orientation is a recurring pain point.

## Open Questions

- **Coordinate extraction:** How to reliably extract location names from user questions and geocode them to coordinates? A lookup table of known place names per challenge region is a simple starting point. spaCy-style NER is more robust but overkill for initial implementation.
- **Territorial control:** ACLED tracks events, not territorial control. Inferring "BIFF controls this area" from event patterns is an approximation. Make this limitation explicit in any UI.
- **Update frequency:** Conflict incidents can change fast. ACLED data has a 2-week lag for full verification, though they offer near-real-time data for subscribers. GDELT is faster but noisier.
- **Map UI vs. text:** A map requires a mapping library (~200–400 KB bundle addition) and spatial UX design. Evaluate whether the current two-panel chat layout can absorb a third panel or whether this needs a separate page.
- **Offline use:** Field operators in low-connectivity environments need some of this data cached. A "download region pack" feature that pre-fetches and stores incident data would significantly increase app value.

## Related

- Actor geographic presence: [actor-registry/README.md](../actor-registry/README.md)
- Real-time news (complements ACLED incident data): [realtime-intel/README.md](../realtime-intel/README.md)
- Challenge data (region field used for geographic scoping): [data/challenges.json](../../data/challenges.json)
