import React, { useEffect, useState } from 'react';
import { GlassPanel } from '../ui/GlassPanel';
import { Clock, Trophy, ArrowRight, BookOpen, Lock, CheckCircle2, History } from '../ui/icons';
import { db, type SubmissionDetail } from '../../lib/db';
import { SubmissionDetailModal } from './SubmissionDetailModal';

export interface TestCard {
  id: string;
  title: string;
  description: string;
  bandTarget: number | null;
  durationSeconds: number | null;
  // Present for every skill when the viewer is logged in (see
  // src/lib/paywall.ts: annotateTestLocks for writing/speaking,
  // annotateUngatedAttempted for reading/listening). Absent (undefined)
  // for a logged-out visitor, or if the request otherwise skipped
  // annotation.
  attempted?: boolean;
  // Only ever set for writing/speaking -- each of those tests is one-shot
  // (see src/lib/paywall.ts), so `attempted` there also disables the card.
  // Reading/listening are unlimited retakes, so `attempted` there is
  // purely informational -- see isDisabled below.
  locked?: boolean;
  // Id of the most recent submission (writing/speaking) or test_attempts
  // (reading/listening) row for this test, whichever this skill uses --
  // set alongside `attempted` by the same paywall.ts annotators. Feeds the
  // history-clock button: writing/speaking only ever have one attempt per
  // test (so "last" and "only" are the same thing), while reading/listening
  // can be retaken, so this always points at the newest one.
  lastAttemptId?: string | null;
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
  const [freeQuota, setFreeQuota] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // History popup -- shows the last (writing/speaking: only) attempt's full
  // result for one card, via the same modal the Submissions history page
  // uses. Keyed by which card's button is currently loading, so a click on
  // one card can't be mistaken for a different card's in-flight request.
  const [historyDetail, setHistoryDetail] = useState<SubmissionDetail | null>(null);
  const [historyLoadingId, setHistoryLoadingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/tests?skill=${skill}`, { credentials: 'include' })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Could not load tests.');
        if (!cancelled) {
          setTests(data.tests);
          setFreeQuota(typeof data.freeQuota === 'number' ? data.freeQuota : null);
        }
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

  // Writing/speaking submissions are graded and stored via `submissions`;
  // reading/listening are auto-scored via `test_attempts` -- see
  // src/lib/paywall.ts. GET /api/submissions/[id]?origin=... needs to know
  // which table to look in.
  const origin: 'submission' | 'attempt' = skill === 'writing' || skill === 'speaking'
    ? 'submission'
    : 'attempt';

  const openHistory = async (e: React.MouseEvent, testId: string, lastAttemptId: string) => {
    e.stopPropagation(); // don't also trigger the card's onSelect/retake click
    setHistoryLoadingId(testId);
    try {
      const detail = await db.getSubmission(lastAttemptId, origin);
      setHistoryDetail(detail);
    } catch {
      // The card's own error state is for the test list; a failed history
      // fetch just quietly doesn't open anything rather than derailing the
      // whole browse page.
    } finally {
      setHistoryLoadingId(null);
    }
  };

  if (loading) {
    return (
      <GlassPanel className="p-8 text-center text-sm text-[var(--text-dim)] border border-[var(--border)] shadow-lg">
        Loading available tests…
      </GlassPanel>
    );
  }

  if (error) {
    return (
      <GlassPanel className="p-6 border border-[var(--border)] shadow-lg">
        <p className="text-sm text-[var(--text)] bg-[var(--panel-2)] border border-[var(--border)] rounded-xl p-3">
          {error}
        </p>
      </GlassPanel>
    );
  }

  if (tests.length === 0) {
    return (
      <GlassPanel className="p-10 text-center flex flex-col items-center border border-[var(--border)] shadow-lg">
        <div className="w-14 h-14 rounded-2xl bg-[var(--panel-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text)] mb-4">
          <BookOpen size={26} />
        </div>
        <h3 className="font-display text-xl font-bold text-[var(--text)] mb-2">{emptyTitle}</h3>
        <p className="text-xs text-[var(--text-dim)] max-w-sm leading-relaxed">{emptyDescription}</p>
      </GlassPanel>
    );
  }

  return (
    <div className="page-fade-in">
      {freeQuota !== null && (
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--accent-a)]/10 border border-[var(--accent-a)]/25 mb-4">
          <p className="text-sm font-mono font-semibold text-[var(--accent-a)]">
            Free beta: {freeQuota} {skill} test{freeQuota === 1 ? '' : 's'} included. Each test can be
            taken once.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tests.map((t, index) => {
          const isLocked = Boolean(t.locked);
          const isAttempted = Boolean(t.attempted);
          // Writing/speaking tests are one-shot, so having attempted one
          // disables it exactly like being locked. Reading/listening are
          // unlimited retakes (see paywall.ts), so `attempted` there is
          // just the "Completed" badge -- the card stays clickable.
          const isRetakeable = skill === 'reading' || skill === 'listening';
          const isDisabled = isLocked || (isAttempted && !isRetakeable);
          const canShowHistory = isAttempted && !isLocked && Boolean(t.lastAttemptId);

          return (
            <GlassPanel
              key={t.id}
              onClick={isDisabled ? undefined : () => onSelect(t.id)}
              style={{ animationDelay: `${Math.min(index, 14) * 35}ms` }}
              className={`animate-tileDropIn shadow-lg p-5 flex flex-col justify-between border relative overflow-hidden transition-transform duration-300 ${
                isLocked
                  ? 'border-[var(--border)] pointer-events-none select-none'
                  : isDisabled
                    ? 'border-[var(--border)] opacity-70'
                    : 'border-[var(--border)] group cursor-pointer hover:-translate-y-1 hover:shadow-xl'
              }`}
            >
              <div className={isLocked ? 'blur-[3px]' : ''}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-display font-bold text-base text-[var(--text)] transition-colors">
                    {t.title}
                  </h3>
                  {t.bandTarget !== null && (
                    <span className="shrink-0 flex items-center gap-1 text-[11px] font-mono text-[var(--text)] bg-[var(--panel-2)] border border-[var(--border)] px-2 py-0.5 rounded-lg">
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

              <div className={`flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)] ${isLocked ? 'blur-[3px]' : ''}`}>
                <span className="text-[11px] font-mono text-[var(--text-faint)] flex items-center gap-1">
                  {t.durationSeconds ? (
                    <>
                      <Clock size={12} /> {Math.round(t.durationSeconds / 60)} min
                    </>
                  ) : (
                    <span>Self-paced</span>
                  )}
                </span>
                {!isDisabled && (
                  <span className="text-xs font-mono text-[var(--text)] flex items-center gap-1 group-hover:gap-2 transition-all">
                    Start <ArrowRight size={14} />
                  </span>
                )}
              </div>

              {isAttempted && !isLocked && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                    <CheckCircle2 size={12} /> Completed
                  </span>
                  {canShowHistory && (
                    <button
                      type="button"
                      onClick={(e) => openHistory(e, t.id, t.lastAttemptId as string)}
                      disabled={historyLoadingId === t.id}
                      title={isRetakeable ? "View last attempt's result" : 'View your result'}
                      className="w-6 h-6 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--accent-a)] hover:border-[var(--accent-a)]/40 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <History size={12} />
                    </button>
                  )}
                </div>
              )}

              {isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[var(--bg)]/40">
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--text-dim)] shadow-lg">
                    <Lock size={18} />
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-[var(--text)] bg-[var(--bg-elevated)] border border-[var(--border)] px-2.5 py-1 rounded-lg">
                    You Quota is Finished
                  </span>
                </div>
              )}
            </GlassPanel>
          );
        })}
      </div>

      <SubmissionDetailModal
        selected={historyDetail}
        loading={historyLoadingId !== null}
        onClose={() => setHistoryDetail(null)}
      />
    </div>
  );
};
