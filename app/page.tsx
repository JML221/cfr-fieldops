import Link from 'next/link';
import challenges from '@/data/challenges.json';
import type { Challenge } from '@/types';

export default function Home() {
  const typedChallenges = challenges as Challenge[];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header
        className="border-b px-6 py-4 flex items-center gap-3"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <div
          className="w-2 h-6 rounded-sm"
          style={{ background: 'var(--amber)' }}
        />
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--amber)' }}>
            CFR Field Operations
          </div>
          <div className="text-lg font-bold text-white leading-tight">
            Field Advisor
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
        <p className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>
          Select a challenge to begin a guided session. The advisor draws on published lessons learned and best practices to provide short, practical decision support.
        </p>

        <div className="flex flex-col gap-4">
          {typedChallenges.map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </div>
      </main>

      <footer className="px-6 py-4 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
        For internal use. Not for distribution. Sources cited in each challenge module.
      </footer>
    </div>
  );
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const isActive = challenge.status === 'active';

  const card = (
    <div
      className="rounded-lg border p-5 flex items-start gap-4 transition-all"
      style={{
        borderColor: isActive ? 'var(--border)' : 'var(--border)',
        background: 'var(--surface)',
        opacity: isActive ? 1 : 0.5,
        cursor: isActive ? 'pointer' : 'default',
      }}
    >
      {/* Status dot */}
      <div className="mt-1 flex-shrink-0">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: isActive ? 'var(--green)' : 'var(--text-muted)' }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-white">{challenge.title}</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full border"
            style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
          >
            {challenge.region}
          </span>
          {!isActive && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: '#1e2130', color: 'var(--text-muted)' }}
            >
              Coming soon
            </span>
          )}
        </div>
        <p className="text-sm mt-1.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {challenge.summary}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {challenge.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded"
              style={{ background: '#1a1f2e', color: '#64748b' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Arrow */}
      {isActive && (
        <div className="flex-shrink-0 mt-1" style={{ color: 'var(--amber)' }}>
          →
        </div>
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
