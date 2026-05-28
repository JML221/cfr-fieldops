'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChat } from '@/hooks/useChat';
import type { Challenge, Message } from '@/types';

const STARTER_PROMPTS = [
  'How do I request access from an armed group in this area?',
  'What should I know before moving through NPA-controlled territory?',
  'What are the biggest safety risks for foreign staff here?',
  'How do I tell the difference between MILF and BIFF areas?',
  'What does GO / NO-GO look like for operating in Sulu?',
];

export default function ChatPage({ challenge }: { challenge: Challenge }) {
  const { messages, isLoading, sendMessage, reset } = useChat(challenge.id);
  const [input, setInput] = useState('');
  const responsesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll responses panel to bottom when new content arrives
  useEffect(() => {
    responsesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    await sendMessage(text);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const userMessages = messages.filter((m) => m.role === 'user');
  const assistantMessages = messages.filter((m) => m.role === 'assistant');

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--bg)' }}>

      {/* Header */}
      <header
        className="flex-shrink-0 border-b px-5 py-4 flex items-center gap-4"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <Link
          href="/"
          className="text-base px-3 py-1.5 rounded hover:bg-white/5 transition-colors font-medium"
          style={{ color: 'var(--text-muted)' }}
        >
          ← Challenges
        </Link>
        <div className="w-px h-5" style={{ background: 'var(--border)' }} />
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: 'var(--green)' }} />
        <div className="flex-1 min-w-0">
          <span className="font-extrabold text-white text-xl">{challenge.title}</span>
          <span className="ml-3 text-base" style={{ color: 'var(--text-muted)' }}>{challenge.region}</span>
        </div>
        <button
          onClick={reset}
          className="text-lg px-5 py-2.5 rounded-lg font-bold transition-all hover:brightness-110 active:scale-95"
          style={{ background: 'var(--amber)', color: '#000' }}
        >
          + New Session
        </button>
      </header>

      {/* Two-column body */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — Question panel */}
        <div
          className="flex flex-col w-2/5 border-r flex-shrink-0"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
        >
          <div className="px-5 pt-5 pb-2 flex-shrink-0">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--amber)' }}>
              Your Question
            </p>
          </div>

          {/* Textarea */}
          <div className="px-5 flex-shrink-0">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Describe your situation or ask a question…"
              className="w-full resize-none rounded-lg border outline-none p-4"
              style={{
                background: 'var(--bg)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
                fontSize: '1.25rem',
                lineHeight: '1.6',
                minHeight: '130px',
                maxHeight: '240px',
              }}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = 'auto';
                t.style.height = `${Math.min(t.scrollHeight, 240)}px`;
              }}
            />
          </div>

          {/* Send button */}
          <div className="px-5 pt-3 pb-5 flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="px-5 py-2.5 rounded-lg font-semibold transition-all disabled:opacity-40 flex-1 hover:brightness-110 active:scale-95"
              style={{ background: 'var(--amber)', color: '#000' }}
            >
              {isLoading ? 'Thinking…' : 'Send'}
            </button>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>↵ Enter</p>
          </div>

          {/* Divider */}
          <div className="mx-5 border-t flex-shrink-0" style={{ borderColor: 'var(--border)' }} />

          {/* Starter prompts or question history */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {userMessages.length === 0 ? (
              <div>
                <p className="text-sm mb-3 font-medium" style={{ color: 'var(--text-muted)' }}>
                  Try a starting point:
                </p>
                <div className="flex flex-col gap-2">
                  {STARTER_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => sendMessage(p)}
                      disabled={isLoading}
                      className="text-left px-4 py-3 rounded-lg border transition-colors hover:border-amber-500/40 disabled:opacity-50"
                      style={{
                        borderColor: 'var(--border)',
                        background: 'var(--bg)',
                        color: 'var(--text)',
                        fontSize: '1.2rem',
                        lineHeight: '1.5',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm mb-3 font-medium" style={{ color: 'var(--text-muted)' }}>
                  Previous questions:
                </p>
                <div className="flex flex-col gap-2">
                  {userMessages.map((m) => (
                    <PreviousQuestion key={m.id} message={m} onClick={() => setInput(m.content)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Response panel */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="px-5 pt-5 pb-2 flex-shrink-0">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--amber)' }}>
              Advisor Response
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-6">
            {assistantMessages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-4"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  🗺️
                </div>
                <p className="text-sm" style={{ color: 'var(--text-muted)', maxWidth: 280 }}>
                  Responses will appear here. Ask a question on the left to get started.
                </p>
              </div>
            )}

            {assistantMessages.map((m, i) => (
              <ResponseBlock
                key={m.id}
                message={m}
                questionText={userMessages[i]?.content}
                isLatest={i === assistantMessages.length - 1}
                onSectionClick={(section) => sendMessage(section)}
              />
            ))}

            {isLoading && (
              <div
                className="rounded-lg border p-4"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <LoadingDots />
              </div>
            )}

            <div ref={responsesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Extract numbered list items from AI response, e.g. "1. Access negotiation" */
function parseSections(content: string): string[] {
  const lines = content.split('\n');
  const sections: string[] = [];
  for (const line of lines) {
    const match = line.match(/^\s*(\d+)\.\s+(.+)/);
    if (match) sections.push(match[2].trim());
  }
  return sections;
}

function ResponseBlock({
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
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        borderColor: isLatest ? 'var(--amber)' : 'var(--border)',
        background: 'var(--surface)',
        opacity: isLatest ? 1 : 0.7,
      }}
    >
      {questionText && (
        <div
          className="px-4 py-2 border-b text-xs"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-muted)',
            background: 'var(--bg)',
          }}
        >
          <span style={{ color: 'var(--amber)' }}>Q: </span>{questionText}
        </div>
      )}
      <div className="px-4 py-4 prose-field text-sm">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content || '…'}
        </ReactMarkdown>
      </div>

      {/* Clickable section buttons */}
      {sections.length > 0 && onSectionClick && (
        <div
          className="px-4 pb-4 flex flex-wrap gap-2 border-t pt-3"
          style={{ borderColor: 'var(--border)' }}
        >
          {sections.map((s, i) => (
            <button
              key={i}
              onClick={() => onSectionClick(s)}
              className="text-base px-4 py-2 rounded-full border font-semibold transition-colors hover:bg-amber-500/10"
              style={{
                borderColor: 'var(--amber)',
                color: 'var(--amber)',
                background: 'transparent',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PreviousQuestion({ message, onClick }: { message: Message; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Click to re-use this question"
      className="text-left px-4 py-2.5 rounded-lg border transition-colors hover:border-amber-500/40 w-full"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--bg)',
        color: 'var(--text-muted)',
        fontSize: '1.1rem',
        lineHeight: '1.5',
      }}
    >
      <span className="line-clamp-2">{message.content}</span>
    </button>
  );
}

function LoadingDots() {
  return (
    <span className="flex gap-1 items-center h-5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full animate-bounce"
          style={{ background: 'var(--text-muted)', animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}
