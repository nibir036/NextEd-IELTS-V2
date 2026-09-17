import React, { useEffect, useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { SkillTag } from '../components/ui/SkillTag';
import { db, type SubmissionSummary, type SubmissionDetail } from '../lib/db';
import { SubmissionDetailModal, asSkill, formatDate } from '../components/practice/SubmissionDetailModal';
import { History, ArrowUpRight } from '../components/ui/icons';

interface SubmissionsViewProps {
  id?: string;
}

export const SubmissionsView: React.FC<SubmissionsViewProps> = ({ id }) => {
  const [submissions, setSubmissions] = useState<SubmissionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<SubmissionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    db.getSubmissions()
      .then((rows) => {
        if (!cancelled) setSubmissions(rows);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load history.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openDetail = async (item: SubmissionSummary) => {
    setDetailLoading(true);
    try {
      const detail = await db.getSubmission(item.id, item.origin);
      setSelected(detail);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load submission.');
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div id={id} className="space-y-6">
      {/* Header Banner */}
      <GlassPanel className="p-6 border border-[var(--border)] shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-elevated)] text-[var(--text)] border border-[var(--border)] text-xs font-mono mb-2">
              <History size={14} className="text-[var(--accent-a)]" />
              <span>Archive & Performance Log</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text)]">
              Practice Submissions History
            </h2>
            <p className="text-xs text-[var(--text-dim)] mt-1">
              Review your past essays and tests with full criterion and answer audit logs.
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* States */}
      {loading && (
        <GlassPanel className="p-8 border border-[var(--border)] shadow-lg text-center text-sm text-[var(--text-dim)]">
          Loading your submission history…
        </GlassPanel>
      )}

      {!loading && error && (
        <GlassPanel className="p-6 border border-[var(--border)] shadow-lg text-sm text-rose-300">
          {error}
        </GlassPanel>
      )}

      {!loading && !error && submissions.length === 0 && (
        <GlassPanel className="p-8 border border-[var(--border)] shadow-lg text-center space-y-2">
          <p className="text-sm font-semibold text-[var(--text)]">No submissions yet</p>
          <p className="text-xs text-[var(--text-dim)]">
            Complete a writing, listening, or diagnostic test and it will appear here with full feedback.
          </p>
        </GlassPanel>
      )}

      {/* List */}
      {!loading && !error && submissions.length > 0 && (
        <div className="space-y-4">
          {submissions.map((item) => (
            <GlassPanel
              key={`${item.origin}-${item.id}`}
              onClick={() => openDetail(item)}
              interactive
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group border border-[var(--border)] shadow-lg transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center font-display font-extrabold text-lg text-[var(--accent-a)] shrink-0">
                  {item.bandScore !== null ? item.bandScore.toFixed(1) : '—'}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <SkillTag skill={asSkill(item.skill)} size="sm" />
                    <span className="text-[11px] font-mono text-[var(--text-faint)]">
                      {formatDate(item.submittedAt)}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-[var(--text)]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--text-dim)] line-clamp-1 mt-0.5">
                    {item.summary}
                  </p>
                </div>
              </div>

              <button className="self-end md:self-auto text-xs font-mono text-[var(--accent-a)] flex items-center gap-1 hover:underline cursor-pointer shrink-0">
                <span>View Audit Log</span>
                <ArrowUpRight size={14} />
              </button>
            </GlassPanel>
          ))}
        </div>
      )}

      <SubmissionDetailModal
        selected={selected}
        loading={detailLoading}
        onClose={() => setSelected(null)}
      />
    </div>
  );
};
