import Link from 'next/link';
import type { Challenge } from '@/types';

export default function ChallengeCard({ challenge }: { challenge: Challenge }) {
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
        <div className="flex-shrink-0 mt-1 text-brand">→</div>
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
