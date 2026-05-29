# Document Retrieval — Live External Source Fetching

## Problem

The Philippines lesson file cites 12 external sources:

- CCHN Field Manual on Humanitarian Negotiation
- OCHA Negotiating Access manual
- Mercy Corps playbook
- USIP reports on Bangsamoro
- FDD/MWI assessments
- Harvard Humanitarian Initiative conflict mapping
- Nonviolent Peaceforce protection studies
- Asia Foundation reports
- FPRI analysis

These URLs live in `data/lessons/philippines-armed-actors.json` under `sources[]`. The AI's answers are based on hand-curated summaries of this content, not the source documents themselves. If a user asks "what does the CCHN manual say about neutrality in negotiations with non-state actors?", the AI is working from a paraphrase, not the actual text.

Document retrieval closes this gap: fetch the source on demand, extract the relevant text, and surface it as additional context.

## Approach

**Per request (lazy fetch):**
1. Detect when a user question references a source (keyword match or AI-assisted intent detection)
2. Fetch the URL(s) with a reasonable timeout (5–10s)
3. Extract main body text (strip nav, ads, boilerplate)
4. Chunk and return the most relevant passage to the system prompt

**Caching:**
- Cache by URL + content hash (ETags or Last-Modified headers)
- Store cached extracts in `data/cache/documents/` as plain text files named by URL hash
- TTL: 7 days for static PDFs, 24 hours for web pages

## Candidate Libraries

| Library | Use case |
|---|---|
| Node built-in `fetch` | Simple HTML pages, JSON APIs |
| `pdf-parse` or `pdfjs-dist` | PDF documents (most field manuals are PDFs) |
| `@extractus/article-extractor` | Web articles — strips nav/sidebar, returns main body |
| Playwright | JS-rendered pages (some UN/NGO portals require JS) |
| Apify SDK | If scale demands a managed crawling pipeline |

Most sources in the current citation list are static PDFs or simple HTML — `fetch` + `pdf-parse` covers the majority.

## Integration Point

New utility in the API layer, called from [app/api/chat/route.ts](../../app/api/chat/route.ts):

```ts
// Hypothetical call
const sourceContext = await fetchSourceContext([
  'https://www.cchn.ch/wp-content/uploads/2020/03/CCHN-Field-Manual-2020.pdf',
  // ... other cited URLs
]);
```

The result is a markdown-formatted string of excerpts, each labelled with the source title and page/section. Injected into the system prompt before the Anthropic call.

## Challenges and Open Questions

- **PDF parsing:** Many field manuals are multi-hundred-page PDFs. Fetching and parsing the full document for each request is expensive. Need either a pre-indexed version (see [semantic/README.md](../semantic/README.md)) or a page-range heuristic based on the question.
- **Rate limiting / robots.txt:** Some NGO sites block scrapers. Need to check `robots.txt` per domain and respect crawl delays.
- **Authentication-gated sources:** INSO reports and some USIP publications require login. These can't be retrieved automatically — flag them in the UI as "requires manual access".
- **Excerpt quality:** Extracting the *relevant* passage from a 200-page PDF requires either keyword search within the document or an additional embedding pass over the document's chunks.
- **Legal:** Public humanitarian reports are generally open-access, but check per-source licensing before caching and serving excerpts.

## Sources Already Defined

All 12 sources for the Philippines challenge are in:
[data/lessons/philippines-armed-actors.json](../../data/lessons/philippines-armed-actors.json) → `sources[]`

Each has `title`, `url`, `type` (report/manual/article), and `organization`. The `type` field drives which parsing strategy to use.

## Related

- Semantic search over pre-indexed document chunks: [semantic/README.md](../semantic/README.md)
- Current lesson data (where source URLs live): [data/lessons/philippines-armed-actors.json](../../data/lessons/philippines-armed-actors.json)
