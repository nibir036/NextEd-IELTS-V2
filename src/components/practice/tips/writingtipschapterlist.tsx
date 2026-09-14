import React, { useEffect, useState } from 'react';
import { GlassPanel } from '../../ui/GlassPanel';
import { Clock, CheckCircle2, ChevronRight } from '../../ui/icons';

interface TipsChapterSummary {
  id: string;
  slug: string;
  title: string;
  position: number;
  estimatedMin: number | null;
  summary: string | null;
  status: 'not_started' | 'in_progress' | 'completed';
}

interface TipsModuleSummary {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  position: number;
  chapters: TipsChapterSummary[];
}

export const WritingTipsChapterList: React.FC<{ onSelectChapter: (slug: string) => void }> = ({ onSelectChapter }) => {
  const [modules, setModules] = useState<TipsModuleSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/tips/writing/modules')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setModules(data.modules ?? []);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load Writing Tips & Tricks. Please try again.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <GlassPanel className="p-6 text-sm text-[var(--danger)]">{error}</GlassPanel>
    );
  }

  if (!modules) {
    return (
      <GlassPanel className="p-8 text-center text-sm text-[var(--text-dim)]">
        Loading tips…
      </GlassPanel>
    );
  }

  if (modules.length === 0) {
    return (
      <GlassPanel className="p-8 text-center text-sm text-[var(--text-dim)]">
        Writing Tips & Tricks content is being prepared. Please check back soon.
      </GlassPanel>
    );
  }

  return (
    <div className="space-y-6">
      {modules.map((mod) => (
        <div key={mod.id}>
          <div className="mb-3">
            <h3 className="font-display text-lg font-bold text-[var(--text)]">{mod.title}</h3>
            {mod.subtitle && <p className="text-xs text-[var(--text-dim)] mt-0.5">{mod.subtitle}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mod.chapters.map((ch, index) => (
              <button
                key={ch.id}
                onClick={() => onSelectChapter(ch.slug)}
                style={{ animationDelay: `${Math.min(index, 14) * 35}ms` }}
                className="animate-tileDropIn text-left rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] p-4 transition-colors hover:border-[var(--border-strong)] group"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-[var(--text)]">
                    {ch.title}
                  </span>
                  {ch.status === 'completed' ? (
                    <CheckCircle2 size={16} className="text-[var(--success)] shrink-0 mt-0.5" />
                  ) : (
                    <ChevronRight size={16} className="text-[var(--text-faint)] shrink-0 mt-0.5 group-hover:text-[var(--text-dim)] transition-colors" />
                  )}
                </div>
                {ch.summary && <p className="text-xs text-[var(--text-dim)] mt-1.5 leading-relaxed">{ch.summary}</p>}
                {ch.estimatedMin && (
                  <div className="flex items-center gap-1 text-[11px] text-[var(--text-faint)] mt-2">
                    <Clock size={11} />
                    <span>{ch.estimatedMin} min</span>
                    {ch.status === 'in_progress' && <span className="ml-2 text-[var(--accent-a)] font-semibold">In progress</span>}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
