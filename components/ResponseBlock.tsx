import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '@/types';

function parseSections(content: string): string[] {
  const lines = content.split('\n');
  const sections: string[] = [];
  for (const line of lines) {
    const match = line.match(/^\s*(\d+)\.\s+(.+)/);
    if (match) sections.push(match[2].trim());
  }
  return sections;
}

export default function ResponseBlock({
  message,
  questionText,
  isLatest,
  onSectionClick,
}: {
  message: Message;
  questionText?: string;
  isLatest: boolean;
  onSectionClick?: (section: string) => void;
}) {
  const sections = isLatest ? parseSections(message.content) : [];

  return (
    <div className={`rounded-lg border overflow-hidden bg-surface ${isLatest ? 'border-brand' : 'border-edge opacity-70'}`}>
      {questionText && (
        <div className="px-4 py-2 border-b border-edge text-xs text-muted bg-canvas">
          <span className="text-brand">Q: </span>{questionText}
        </div>
      )}
      <div className="px-4 py-4 prose-field text-sm">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content || '…'}
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
    </div>
  );
}
