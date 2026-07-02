import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message, Source } from '@/types';

function parseSections(content: string): string[] {
  const lines = content.split('\n');
  const sections: string[] = [];
  for (const line of lines) {
    const match = line.match(/^\s*(\d+)\.\s+(.+)/);
    if (match) sections.push(match[2].trim());
  }
  return sections;
}

function extractCitations(content: string): { body: string; indices: number[] } {
  const idx = content.lastIndexOf('\n📚');
  if (idx === -1) return { body: content, indices: [] };
  const citeLine = content.slice(idx);
  const nums = [...citeLine.matchAll(/\[(\d+)\]/g)].map((m) => parseInt(m[1]) - 1);
  return { body: content.slice(0, idx).trim(), indices: nums };
}

export default function ResponseBlock({
  message,
  questionText,
  isLatest,
  sources,
  onSectionClick,
}: {
  message: Message;
  questionText?: string;
  isLatest: boolean;
  sources?: Source[];
  onSectionClick?: (section: string) => void;
}) {
  const { body, indices } = extractCitations(message.content);
  const sections = isLatest ? parseSections(body) : [];
  const citedSources = sources
    ? indices.filter((i) => i >= 0 && i < sources.length).map((i) => sources[i])
    : [];

  return (
    <div className={`rounded-lg border overflow-hidden bg-surface ${isLatest ? 'border-brand' : 'border-edge opacity-70'}`}>
      {questionText && (
        <div className="px-4 py-2 border-b border-edge text-xs text-muted bg-canvas">
          <span className="text-brand">Q: </span>{questionText}
        </div>
      )}
      <div className="px-4 py-4 prose-field">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {body || '…'}
        </ReactMarkdown>
      </div>

      {sections.length > 0 && onSectionClick && (
        <div className="px-4 pb-4 flex flex-wrap gap-2 border-t border-edge pt-3">
          {sections.map((s, i) => (
            <button
              key={i}
              onClick={() => onSectionClick(s)}
              className="text-base px-4 py-2 rounded-full border border-brand font-semibold transition-colors hover:bg-brand/10 text-brand bg-transparent"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {citedSources.length > 0 && (
        <div className="px-4 pb-4 border-t border-edge pt-3">
          <p className="text-xs font-bold uppercase tracking-widest mb-2 text-muted">Sources for this response</p>
          <ul className="flex flex-col gap-1.5">
            {citedSources.map((s, i) => (
              <li key={i}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm leading-snug hover:underline"
                  style={{ color: 'var(--amber)' }}
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
