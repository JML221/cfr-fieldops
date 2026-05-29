import type { Message } from '@/types';

export default function PreviousQuestion({ message, onClick }: { message: Message; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Click to re-use this question"
      className="text-left px-4 py-2.5 rounded-lg border border-edge transition-colors hover:border-brand/40 w-full bg-canvas text-muted text-lg leading-snug"
    >
      <span className="line-clamp-2">{message.content}</span>
    </button>
  );
}
