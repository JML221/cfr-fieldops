import Anthropic from '@anthropic-ai/sdk';
import challenges from '@/data/challenges.json';
import { getLessonContent, formatLessonAsContext } from '@/lib/lessons';

const MODEL_ID = 'claude-haiku-4-5-20251001';

async function buildSystemPrompt(challengeId: string): Promise<string> {
  const challenge = challenges.find((c) => c.id === challengeId);
  const challengeTitle = challenge?.title ?? challengeId;
  const lesson = await getLessonContent(challengeId);
  const content = lesson ? formatLessonAsContext(lesson) : 'No content loaded for this challenge.';

  return `You are a field operations advisor supporting practitioners working in active conflict environments. Your role is practical decision support — not academic analysis.

## How to respond

## STRICT TWO-STEP FORMAT — NO EXCEPTIONS

### STEP 1 — Menu only (for every new question)
Produce ONLY these three things. Nothing else. No explanations, no context, no prose.

⚡ **Critical:** [One sentence. ⚠️ if safety risk.]

**This answer has [N] parts:**
1. **[Name]** — [One phrase: what this covers.]
2. **[Name]** — [One phrase: what this covers.]
3. **[Name]** — [One phrase: what this covers.]

Which section do you want first?

Use 3 sections. Stop immediately after the question. Do NOT write anything else.

### STEP 2 — Section deep-dive (only when user picks a number or name)
Give the first 2–3 points on that section only. Stop. Then ask one short follow-up question to let them pull the next chunk — e.g. "Want the next points, or move to another section?"

Rules for each chunk:
- 2–3 bullet points maximum per response
- No paragraphs. No intro sentence. No summary.
- ⚠️ for safety flags, GO / NO-GO for decisions
- Cite source title if drawing on a specific document

When the user asks to continue, give the next 2–3 points and pause again.
When the section is fully covered, say so and offer the remaining sections.

Do NOT dump all points at once. Do NOT re-show the full menu unprompted.

## Active Challenge: ${challengeTitle}

${content}`;
}

export async function POST(req: Request) {
  const { messages, challengeId }: { messages: { role: string; content: string }[]; challengeId: string } =
    await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response('ANTHROPIC_API_KEY not configured', { status: 500 });
  }

  const client = new Anthropic({ apiKey });
  const system = await buildSystemPrompt(challengeId ?? 'philippines-armed-actors');

  const anthropicMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: MODEL_ID,
          max_tokens: 400,
          system,
          messages: anthropicMessages,
        });

        stream.on('text', (text) => {
          controller.enqueue(encoder.encode(text));
        });

        await stream.finalMessage();
      } catch (err) {
        console.error('Stream error:', err);
        controller.enqueue(encoder.encode('\n\n[Error: could not reach AI service]'));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
