import Anthropic from '@anthropic-ai/sdk';
import challenges from '@/data/challenges.json';
import philippinesLessons from '@/data/lessons/philippines-armed-actors.json';

const MODEL_ID = 'claude-haiku-4-5-20251001';

function getLessonsForChallenge(challengeId: string): string {
  if (challengeId === 'philippines-armed-actors') {
    const d = philippinesLessons;

    const groupsBlock = d.armed_groups
      .map(
        (g) =>
          `### ${g.name}\n**Type:** ${g.type}\n**Geography:** ${g.geography}\n**Status:** ${g.status}\n**Engagement notes:** ${g.engagement_notes}\n**Risks:** ${g.risks}`
      )
      .join('\n\n');

    const lessonsBlock = d.lessons
      .map(
        (cat) =>
          `### ${cat.category}\n${cat.lessons.map((l) => `- ${l}`).join('\n')}`
      )
      .join('\n\n');

    const sourcesBlock = d.sources
      .map((s) => `- [${s.title}](${s.url})`)
      .join('\n');

    return `## Situation Overview\n${d.situation_overview}\n\n## Armed Groups Reference\n${groupsBlock}\n\n## Lessons Learned (from published literature)\n${lessonsBlock}\n\n## Sources\n${sourcesBlock}`;
  }
  return 'No content loaded for this challenge.';
}

function buildSystemPrompt(challengeId: string): string {
  const challenge = challenges.find((c) => c.id === challengeId);
  const challengeTitle = challenge?.title ?? challengeId;
  const content = getLessonsForChallenge(challengeId);

  return `You are a field operations advisor supporting practitioners working in active conflict environments. Your role is practical decision support — not academic analysis.

## How to respond

**For every new question, use this exact two-part format and nothing else:**

⚡ **Critical:** [One sentence — the single most important thing the operator must know about this topic. Flag with ⚠️ if it is a safety risk.]

**Sections:**
1. [Section name]
2. [Section name]
3. [Section name]
4. [Section name]

Section names must be short labels only — 2–4 words, no punctuation, no descriptions. No extra text after the list. Stop immediately after the last section.

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
  const system = buildSystemPrompt(challengeId ?? 'philippines-armed-actors');

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
