import React, { useEffect, useState } from 'react';
import { GlassPanel } from '../ui/GlassPanel';
import { Clock, Trophy, ArrowRight, BookOpen } from '../ui/icons';

export interface TestCard {
  id: string;
  title: string;
  description: string;
  bandTarget: number | null;
  durationSeconds: number | null;
}

interface TestSelectorProps {
  skill: 'writing' | 'reading' | 'listening' | 'speaking';
  onSelect: (testId: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

// Reusable pool of tests as selectable cards. Shared by every practice section.
export const TestSelector: React.FC<TestSelectorProps> = ({
  skill,
  onSelect,
  emptyTitle = 'No tests available yet',
  emptyDescription = 'Tests for this section are being prepared. Please check back soon.',
}) => {
  const [tests, setTests] = useState<TestCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/tests?skill=${skill}`, { credentials: 'include' })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Could not load tests.');
        if (!cancelled) setTests(data.tests);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load tests.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [skill]);

  if (loading) {
    return (
      <GlassPanel className="p-8 text-center text-sm text-[var(--text-dim)]">
        Loading available tests…
      </GlassPanel>
    );
  }

  if (error) {
    return <GlassPanel className="p-6 text-sm text-[var(--danger)]">{error}</GlassPanel>;
  }

  if (tests.length === 0) {
    return (
      <GlassPanel className="p-10 text-center flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-[var(--panel-2)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-a)] mb-4">
          <BookOpen size={26} />
        </div>
        <h3 className="font-display text-xl font-bold text-[var(--text)] mb-2">{emptyTitle}</h3>
        <p className="text-xs text-[var(--text-dim)] max-w-sm leading-relaxed">{emptyDescription}</p>
      </GlassPanel>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 page-fade-in">
      {tests.map((t) => (
        <GlassPanel
          key={t.id}
          interactive
          onClick={() => onSelect(t.id)}
          className="p-5 flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-display font-bold text-base text-[var(--text)] group-hover:text-[var(--accent-a)] transition-colors">
                {t.title}
              </h3>
              {t.bandTarget !== null && (
                <span className="shrink-0 flex items-center gap-1 text-[11px] font-mono text-[var(--accent-a)] bg-[var(--accent-a)]/10 border border-[var(--accent-a)]/20 px-2 py-0.5 rounded-lg">
                  <Trophy size={11} /> Band {t.bandTarget.toFixed(1)}
                </span>
              )}
            </div>
            {t.description && (
              <p className="text-xs text-[var(--text-dim)] leading-relaxed line-clamp-3">
                {t.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]">
            <span className="text-[11px] font-mono text-[var(--text-faint)] flex items-center gap-1">
              {t.durationSeconds ? (
                <>
                  <Clock size={12} /> {Math.round(t.durationSeconds / 60)} min
                </>
              ) : (
                <span>Self-paced</span>
              )}
            </span>
            <span className="text-xs font-mono text-[var(--accent-a)] flex items-center gap-1 group-hover:gap-2 transition-all">
              Start <ArrowRight size={14} />
            </span>
          </div>
        </GlassPanel>
      ))}
    </div>
  );
};
