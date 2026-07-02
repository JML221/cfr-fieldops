import type { LessonContent } from '@/types';

export async function getLessonContent(challengeId: string): Promise<LessonContent | null> {
  try {
    const mod = await import(`@/data/lessons/${challengeId}.json`);
    return mod.default as LessonContent;
  } catch {
    return null;
  }
}

export function formatLessonAsContext(d: LessonContent): string {
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
    .map((s, i) => `[${i + 1}] ${s.title}`)
    .join('\n');

  return `## Situation Overview\n${d.situation_overview}\n\n## Armed Groups Reference\n${groupsBlock}\n\n## Lessons Learned (from published literature)\n${lessonsBlock}\n\n## Sources\n${sourcesBlock}`;
}
