'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useChat } from '@/hooks/useChat';
import type { Challenge } from '@/types';
import LoadingDots from '@/components/LoadingDots';
import PreviousQuestion from '@/components/PreviousQuestion';
import ResponseBlock from '@/components/ResponseBlock';

export default function ChatPage({
  challenge,
  starterPrompts,
}: {
  challenge: Challenge;
  starterPrompts: string[];
}) {
  const { messages, isLoading, sendMessage, reset } = useChat(challenge.id);
  const [input, setInput] = useState('');
  const responsesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    <div className="flex flex-col min-h-screen lg:h-screen bg-canvas">

      {/* Header */}
      <header className="flex-shrink-0 border-b border-edge px-4 py-3 flex items-center gap-2 bg-surface">
        <Link
          href="/"
          className="text-sm px-2 py-1.5 rounded hover:bg-white/5 transition-colors font-medium text-muted whitespace-nowrap"
        >
          ← Challenges
        </Link>
        <div className="w-px h-5 bg-edge hidden sm:block" />
        <div className="w-2 h-2 rounded-full flex-shrink-0 bg-active hidden sm:block" />
        <div className="flex-1 min-w-0">
          <span className="font-extrabold text-white text-base sm:text-xl truncate block">{challenge.title}</span>
          <span className="text-xs text-muted hidden sm:block">{challenge.region}</span>
        </div>
        <button
          onClick={reset}
          className="text-sm sm:text-base px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg font-bold transition-all hover:brightness-110 active:scale-95 bg-brand text-black whitespace-nowrap flex-shrink-0"
        >
          + New Session
        </button>
      </header>

      {/* Two-column body */}
      <div className="flex flex-1 flex-col lg:flex-row lg:overflow-hidden">

        {/* LEFT — Question panel */}
        <div className="flex flex-col lg:w-2/5 border-b lg:border-b-0 lg:border-r border-edge bg-surface">
          <div className="px-5 pt-5 pb-2 flex-shrink-0">
            <p className="text-sm font-bold uppercase tracking-widest text-brand">
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
              className="w-full resize-none rounded-lg border border-edge outline-none p-4 bg-canvas text-slate-200 text-xl leading-relaxed"
              style={{ minHeight: '130px', maxHeight: '240px' }}
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
              className="px-5 py-2.5 rounded-lg font-semibold transition-all disabled:opacity-40 flex-1 hover:brightness-110 active:scale-95 bg-brand text-black"
            >
              {isLoading ? 'Thinking…' : 'Send'}
            </button>
            <p className="text-sm text-muted">↵ Enter</p>
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-edge flex-shrink-0" />

          {/* Starter prompts or question history */}
          <div className="lg:flex-1 lg:overflow-y-auto px-5 py-4">
            {userMessages.length === 0 ? (
              <div>
                <p className="text-sm mb-3 font-medium text-muted">
                  Try a starting point:
                </p>
                <div className="flex flex-col gap-2">
                  {starterPrompts.map((p) => (
                    <button
                      key={p}
                      onClick={() => sendMessage(p)}
                      disabled={isLoading}
                      className="text-left px-4 py-3 rounded-lg border border-edge transition-colors hover:border-brand/40 disabled:opacity-50 bg-canvas text-slate-200 text-xl leading-snug"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm mb-3 font-medium text-muted">
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
        <div className="flex flex-col flex-1 lg:overflow-hidden">
          <div className="px-5 pt-5 pb-2 flex-shrink-0">
            <p className="text-sm font-bold uppercase tracking-widest text-brand">
              Advisor Response
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-6">
            {assistantMessages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-4 bg-surface border border-edge">
                  🗺️
                </div>
                <p className="text-sm text-muted max-w-[280px]">
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
              <div className="rounded-lg border border-edge p-4 bg-surface">
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
