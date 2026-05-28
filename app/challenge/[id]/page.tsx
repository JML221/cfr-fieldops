import { notFound } from 'next/navigation';
import challenges from '@/data/challenges.json';
import type { Challenge } from '@/types';
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

  return <ChatPage challenge={challenge} />;
}
