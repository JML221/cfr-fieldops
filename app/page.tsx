import Link from 'next/link';
import challenges from '@/data/challenges.json';
import type { Challenge } from '@/types';

export default function Home() {
  const typedChallenges = challenges as Challenge[];

  return (
    <div className="min-h-screen flex flex-col bg-base">
      <header className="border-b border-edge px-6 py-4 flex items-center gap-3 bg-surface">
        <div className="w-2 h-6 rounded-sm bg-accent" />
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase text-accent">
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

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const isActive = challenge.status === 'active';

  const card = (
    <div
      className={`rounded-lg border border-edge p-5 flex items-start gap-4 transition-all bg-surface ${
        isActive ? 'opacity-100 cursor-pointer' : 'opacity-50 cursor-default'
      }`}
    >
      <div className="mt-1 flex-shrink-0">
        <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-active' : 'bg-muted'}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-white">{challenge.title}</span>
          <span className="text-xs px-2 py-0.5 rounded-full border border-edge text-muted">
            {challenge.region}
          </span>
          {!isActive && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e2130] text-muted">
              Coming soon
            </span>
          )}
        </div>
        <p className="text-sm mt-1.5 leading-relaxed text-muted">
          {challenge.summary}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {challenge.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded bg-[#1a1f2e] text-slate-500">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {isActive && (
        <div className="flex-shrink-0 mt-1 text-accent">→</div>
      )}
    </div>
  );

  if (!isActive) return card;

  return (
    <Link href={`/challenge/${challenge.id}`} className="block hover:scale-[1.01] transition-transform">
      {card}
    </Link>
  );
}
