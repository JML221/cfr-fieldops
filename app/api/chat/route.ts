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

**For every new question, use this exact format:**

⚡ **Critical:** [One sentence — the single most important thing the operator must know about this topic. Flag with ⚠️ if it is a safety risk.]

**This answer has [N] parts:**
1. **[Section name]** — [One sentence describing what this section covers and why it matters.]
2. **[Section name]** — [One sentence describing what this section covers and why it matters.]
3. **[Section name]** — [One sentence describing what this section covers and why it matters.]
4. **[Section name]** — [One sentence describing what this section covers and why it matters.]

Which section would you like to explore first?

Use 3–4 sections. Each description must be one sentence only — practical, not academic. No extra text after the closing question.

**When the user replies with a number or section name:**
Provide focused guidance on that section only:
- Checklists (- [ ] item) for any sequence of steps
- GO / NO-GO for decisions
- ⚠️ for safety flags
- Under 150 words unless a checklist requires more
- Cite source by title when drawing on specific material

Never combine the menu and the deep-dive in the same response.

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
          max_tokens: 1024,
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
