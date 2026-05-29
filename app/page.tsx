import challenges from '@/data/challenges.json';
import type { Challenge } from '@/types';
import ChallengeCard from '@/components/ChallengeCard';

export default function Home() {
  const typedChallenges = challenges as Challenge[];

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <header className="border-b border-edge px-6 py-4 flex items-center gap-3 bg-surface">
        <div className="w-2 h-6 rounded-sm bg-brand" />
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase text-brand">
            CFR Field Operations
          </div>
          <div className="text-lg font-bold text-white leading-tight">
            Field Advisor
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
        <p className="text-sm mb-10 text-muted">
          Select a challenge to begin a guided session. The advisor draws on published lessons learned and best practices to provide short, practical decision support.
        </p>

        <div className="flex flex-col gap-4">
          {typedChallenges.map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </div>
      </main>

      <footer className="px-6 py-4 text-center text-xs text-muted">
        For internal use. Not for distribution. Sources cited in each challenge module.
      </footer>
    </div>
  );
}
