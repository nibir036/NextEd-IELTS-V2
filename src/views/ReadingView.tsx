import React, { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import ReadingTipsList from '../components/reading/ReadingTipsList';
import { ReadingTestView } from './ReadingTestView';
import { BookOpen, ChevronRight, Clock } from '../components/ui/icons';

interface ReadingViewProps {
  id?: string;
}

// আপাতত একটাই sample test. পরে DB/API থেকে এনে .map() করা যাবে।
const readingTests = [
  {
    id: 'sample-1',
    title: 'Deep-Water Coral Ecosystems',
    category: 'Academic Reading',
    durationMinutes: 20,
    questionCount: 3,
  },
];

type Tab = 'tests' | 'tips';

export const ReadingView: React.FC<ReadingViewProps> = ({ id }) => {
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('tests');

  // Test খোলা থাকলে passage+questions view দেখাও
  if (activeTestId) {
    return (
      <div id={id} className="space-y-4">
        <button
          onClick={() => setActiveTestId(null)}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-dim)] hover:text-[var(--text)] transition"
        >
          <ChevronRight size={16} className="rotate-180" />
          Back to Reading Tests
        </button>
        <ReadingTestView />
      </div>
    );
  }

  // নাহলে hub/list view দেখাও
  return (
    <div id={id} className="space-y-6">
      {/* Header Banner — ভিতরে ডান পাশে Tests/Tips button */}
      <GlassPanel className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* বাম পাশ — title */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-mono mb-2">
              <BookOpen size={14} />
              <span>Reading Practice</span>
            </div>

            <h2 className="font-display text-2xl font-bold text-[var(--text)]">
              IELTS Reading Simulator
            </h2>

            <p className="text-xs text-[var(--text-dim)] mt-1">
              Passage paragraph analysis with AI-examined evidence justification & band feedback.
            </p>
          </div>

          {/* ডান পাশ — Tests / Tips button */}
          <div className="flex flex-row gap-2 shrink-0">
            <button
              onClick={() => setTab('tests')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                tab === 'tests'
                  ? 'bg-[var(--accent-a)]/15 text-[var(--accent-a)] border border-[var(--accent-a)]/30'
                  : 'border border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--accent-a)]/40'
              }`}
            >
              <BookOpen size={16} />
              Tests
            </button>

            <button
              onClick={() => setTab('tips')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                tab === 'tips'
                  ? 'bg-[var(--accent-a)]/15 text-[var(--accent-a)] border border-[var(--accent-a)]/30'
                  : 'border border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--accent-a)]/40'
              }`}
            >
              <BookOpen size={16} />
              Tips
            </button>
          </div>
        </div>
      </GlassPanel>

      {/* List — Tests বা Tips */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-[var(--text)] px-1">
          {tab === 'tests' ? 'Reading Tests' : 'Reading Tips'}
        </h3>

        {tab === 'tests' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {readingTests.map((test) => (
              <div
                key={test.id}
                className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--accent-a)]/40 transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-medium">
                    {test.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-[var(--text-dim)] font-mono">
                    <Clock size={12} />
                    {test.durationMinutes} min
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-[var(--text)] leading-snug">
                  {test.title}
                </h3>
                <p className="text-sm text-[var(--text-dim)] mt-1">
                  {test.questionCount} questions · Passage analysis
                </p>

                <button
                  onClick={() => setActiveTestId(test.id)}
                  className="mt-auto pt-5 flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] py-2.5 text-sm font-medium text-[var(--text)] hover:border-[var(--accent-a)]/40 hover:bg-[var(--accent-a)]/5 transition"
                >
                  Start Test
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <ReadingTipsList />
        )}
      </div>
    </div>
  );
};