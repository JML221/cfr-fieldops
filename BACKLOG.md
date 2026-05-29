# Feature Backlog — CFR Field Ops Advisor

Ideas and requests from the team. Claude Code can add to this file — just say "log this to the backlog."

**Format for new entries:**
```
## [Short title]
**From:** [Jason / Greg / etc]
**Date:** [Month Year]
**Area:** [UI/UX | AI behavior | Data | Infrastructure | New feature]

[Description]
```

---

## Entries

## Source documents: AI should read full text, not summaries
**From:** Jason
**Date:** May 2026
**Area:** Data / AI behavior

**Problem:** The AI currently draws on hand-summarized lesson content in `data/lessons/philippines-armed-actors.json`, not the actual source documents. The sources listed in the app (USIP reports, CCHN Field Manual, OCHA manuals, etc.) are there for transparency, but the AI hasn't read them — only summaries of them. This caps the depth and accuracy of responses.

**Recommended fix: Anthropic Files API**

This is the cleanest path since we're already on the Anthropic SDK. The workflow:
1. Download each source document (most are freely available PDFs)
2. Upload each to Anthropic's Files API once using `client.beta.files.upload()`
3. Store the returned `file_id` alongside each source entry in the challenge JSON
4. When building the API call, pass the file_ids as document blocks in the `messages` array

The model will then read the actual document text rather than a summary. No vector database or embedding pipeline needed — Anthropic handles the document context natively.

**Anthropic Files API docs:** https://docs.anthropic.com/en/docs/build-with-claude/files

**Fallback for web pages (not PDFs):** Use Jina AI's free reader endpoint — prefix any URL with `https://r.jina.ai/` and it returns clean markdown. Example: `https://r.jina.ai/https://www.usip.org/publications/2022/02/...` — no API key required for basic use.

**Priority:** High — directly affects quality of AI guidance in the field.
