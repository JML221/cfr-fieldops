import { notFound } from 'next/navigation';
import challenges from '@/data/challenges.json';
import type { Challenge } from '@/types';
import { getLessonContent } from '@/lib/lessons';
import ChatPage from './ChatPage';

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challenge = (challenges as Challenge[]).find((c) => c.id === id);

  if (!challenge || challenge.status !== 'active') {
    notFound();
  }

  const lesson = await getLessonContent(id);

  return <ChatPage challenge={challenge} starterPrompts={lesson?.starter_prompts ?? []} />;
}
