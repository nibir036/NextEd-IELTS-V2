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

export const SpeakingTipsChapterList: React.FC<{ onSelectChapter: (slug: string) => void }> = ({ onSelectChapter }) => {
  const [modules, setModules] = useState<TipsModuleSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/tips/speaking/modules')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setModules(data.modules ?? []);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load Speaking Tips & Tricks. Please try again.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <GlassPanel className="p-6 text-sm text-[var(--danger)]">{error}</GlassPanel>;
  }

  if (!modules) {
    return <GlassPanel className="p-8 text-center text-sm text-[var(--text-dim)]">Loading tips…</GlassPanel>;
  }

  if (modules.length === 0) {
    return (
      <GlassPanel className="p-8 text-center text-sm text-[var(--text-dim)]">
        Speaking Tips & Tricks content is being prepared. Please check back soon.
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
            {mod.chapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => onSelectChapter(ch.slug)}
                className="text-left rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 p-4 hover:border-[var(--accent-a)]/40 hover:bg-[var(--panel-2)] transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent-a)] transition-colors">
                    {ch.title}
                  </span>
                  {ch.status === 'completed' ? (
                    <CheckCircle2 size={16} className="text-[var(--success,#22c55e)] shrink-0 mt-0.5" />
                  ) : (
                    <ChevronRight size={16} className="text-[var(--text-dim)] shrink-0 mt-0.5 group-hover:text-[var(--accent-a)] transition-colors" />
                  )}
                </div>
                {ch.summary && <p className="text-xs text-[var(--text-dim)] mt-1.5 leading-relaxed">{ch.summary}</p>}
                {ch.estimatedMin && (
                  <div className="flex items-center gap-1 text-[11px] text-[var(--text-dim)] mt-2">
                    <Clock size={11} />
                    <span>{ch.estimatedMin} min</span>
                    {ch.status === 'in_progress' && <span className="ml-2 text-[var(--accent-a)]">In progress</span>}
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
