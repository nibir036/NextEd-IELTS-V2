import React, { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { TestSelector } from '../components/practice/TestSelector';
import { ReadingTipsChapterList } from '../components/practice/tips/readingtipschapterlist';
import { ReadingTipsReader } from '../components/practice/tips/readingtipsreader';
import { Sparkles } from '../components/ui/icons';

interface ReadingViewProps {
  id?: string;
}

export const ReadingView: React.FC<ReadingViewProps> = ({ id }) => {
  const [browseTab, setBrowseTab] = useState<'tests' | 'tips'>('tests');
  const [selectedTipsSlug, setSelectedTipsSlug] = useState<string | null>(null);

  return (
    <div id={id} className="space-y-6">
      <GlassPanel className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-mono mb-2">
              <Sparkles size={14} />
              <span>Reading Practice</span>
            </div>

            <h2 className="font-display text-2xl font-bold text-[var(--text)]">
              Reading Practice
            </h2>

            <p className="text-xs text-[var(--text-dim)] mt-1">
              {browseTab === 'tests'
                ? 'Timed passages with comprehension questions, auto-scored on completion.'
                : 'Learn the Reading strategies, question types, traps, and time-management techniques needed to reach Band 9.'}
            </p>
          </div>

          <div className="inline-flex items-center rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-1 shrink-0">
            <button
              onClick={() => {
                setBrowseTab('tests');
                setSelectedTipsSlug(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                browseTab === 'tests'
                  ? 'bg-[image:var(--accent-gradient)] text-white shadow'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              Tests
            </button>

            <button
              onClick={() => setBrowseTab('tips')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                browseTab === 'tips'
                  ? 'bg-[image:var(--accent-gradient)] text-white shadow'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              Tips &amp; Tricks
            </button>
          </div>
        </div>
      </GlassPanel>

      {browseTab === 'tests' ? (
        <TestSelector
          skill="reading"
          onSelect={() => {
            /* Wired when reading tests are added. */
          }}
          emptyDescription="Reading tests are being prepared. In the meantime, review the tips below to get ready."
        />
      ) : selectedTipsSlug ? (
        <ReadingTipsReader
          slug={selectedTipsSlug}
          onNavigate={(slug) => setSelectedTipsSlug(slug)}
          onBack={() => setSelectedTipsSlug(null)}
        />
      ) : (
        <ReadingTipsChapterList
          onSelectChapter={(slug) => setSelectedTipsSlug(slug)}
        />
      )}
    </div>
  );
};
