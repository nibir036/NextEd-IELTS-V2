import React, { useEffect, useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { SkillTag } from '../components/ui/SkillTag';
import { db, type SubmissionSummary, type SubmissionDetail } from '../lib/db';
import type { SkillType } from '../types';
import { History, ArrowUpRight, Sparkles } from '../components/ui/icons';

interface SubmissionsViewProps {
  id?: string;
}

// The stored `skill` string maps 1:1 onto SkillTag's SkillType union.
function asSkill(skill: string): SkillType {
  const allowed: SkillType[] = ['reading', 'listening', 'writing', 'speaking', 'mock'];
  return (allowed as string[]).includes(skill) ? (skill as SkillType) : 'writing';
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

// Pull the four writing criteria out of stored feedback JSON for the audit log.
function writingCriteria(feedback: Record<string, unknown>) {
  const rows: { label: string; score: number; notes: string }[] = [];
  const push = (label: string, scoreKey: string, notesKey: string) => {
    const score = feedback[scoreKey];
    if (typeof score === 'number') {
      rows.push({
        label,
        score,
        notes: typeof feedback[notesKey] === 'string' ? (feedback[notesKey] as string) : '',
      });
    }
  };
  push('Task Response', 'taskResponseScore', 'taskResponseFeedback');
  push('Coherence & Cohesion', 'coherenceScore', 'coherenceFeedback');
  push('Lexical Resource', 'lexicalScore', 'lexicalFeedback');
  push('Grammatical Range', 'grammarScore', 'grammarFeedback');
  return rows;
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

  const openDetail = async (submissionId: string) => {
    setDetailLoading(true);
    try {
      const detail = await db.getSubmission(submissionId);
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
      <GlassPanel className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-mono mb-2">
              <History size={14} />
              <span>Archive & Performance Log</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text)]">
              Practice Submissions History
            </h2>
            <p className="text-xs text-[var(--text-dim)] mt-1">
              Review your past essays and evaluations with full criterion audit logs.
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* States */}
      {loading && (
        <GlassPanel className="p-8 text-center text-sm text-[var(--text-dim)]">
          Loading your submission history…
        </GlassPanel>
      )}

      {!loading && error && (
        <GlassPanel className="p-6 text-sm text-[var(--danger)]">{error}</GlassPanel>
      )}

      {!loading && !error && submissions.length === 0 && (
        <GlassPanel className="p-8 text-center space-y-2">
          <p className="text-sm font-semibold text-[var(--text)]">No submissions yet</p>
          <p className="text-xs text-[var(--text-dim)]">
            Complete a writing evaluation and it will appear here with its full feedback.
          </p>
        </GlassPanel>
      )}

      {/* List */}
      {!loading && !error && submissions.length > 0 && (
        <div className="space-y-4">
          {submissions.map((item) => (
            <GlassPanel
              key={item.id}
              interactive
              onClick={() => openDetail(item.id)}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] flex items-center justify-center font-display font-bold text-lg text-[var(--text)] group-hover:border-[var(--accent-a)] transition-colors">
                  {item.bandScore !== null ? item.bandScore.toFixed(1) : '—'}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <SkillTag skill={asSkill(item.skill)} size="sm" />
                    <span className="text-[11px] font-mono text-[var(--text-faint)]">
                      {formatDate(item.submittedAt)}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-[var(--text)] group-hover:text-[var(--accent-a)] transition-colors">
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

      {/* Detail Modal */}
      {(selected || detailLoading) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <GlassPanel className="max-w-2xl w-full p-6 space-y-5 max-h-[85vh] overflow-y-auto animate-scale-in">
            {detailLoading || !selected ? (
              <p className="text-sm text-[var(--text-dim)] py-8 text-center">Loading audit log…</p>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div className="flex items-center gap-3">
                    <SkillTag skill={asSkill(selected.skill)} />
                    <div>
                      <h3 className="font-display font-bold text-lg text-[var(--text)]">
                        {typeof selected.answers.taskType === 'string'
                          ? `Writing — ${selected.answers.taskType}`
                          : 'Practice Submission'}
                      </h3>
                      <span className="text-xs font-mono text-[var(--text-faint)]">
                        Submitted: {formatDate(selected.submittedAt)}
                      </span>
                    </div>
                  </div>

                  <div className="px-3 py-1 rounded-xl bg-[image:var(--accent-gradient)] text-white font-display font-bold text-base">
                    Band {selected.bandScore !== null ? selected.bandScore.toFixed(1) : '—'}
                  </div>
                </div>

                {/* Prompt */}
                {typeof selected.answers.prompt === 'string' && selected.answers.prompt && (
                  <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
                    <div className="text-[11px] font-mono uppercase text-[var(--text-faint)] mb-1">
                      Task Prompt
                    </div>
                    <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                      {selected.answers.prompt as string}
                    </p>
                  </div>
                )}

                {/* Candidate response */}
                {typeof selected.answers.essayText === 'string' && (
                  <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
                    <div className="text-[11px] font-mono uppercase text-[var(--text-faint)] mb-1">
                      Your Response
                    </div>
                    <p className="text-xs text-[var(--text)] italic leading-relaxed whitespace-pre-wrap">
                      {selected.answers.essayText as string}
                    </p>
                  </div>
                )}

                {/* Criteria grid */}
                {writingCriteria(selected.feedback).length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {writingCriteria(selected.feedback).map((e, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--border)]">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-[var(--text)]">{e.label}</span>
                          <span className="font-mono text-xs font-bold text-[var(--accent-a)]">
                            {e.score.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-dim)] leading-tight">{e.notes}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Summary */}
                {typeof selected.feedback.generalSummary === 'string' && (
                  <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--border)]">
                    <div className="text-xs font-mono font-semibold text-[var(--accent-a)] mb-1 flex items-center gap-1.5">
                      <Sparkles size={14} />
                      <span>Examiner Summary</span>
                    </div>
                    <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                      {selected.feedback.generalSummary as string}
                    </p>
                  </div>
                )}

                <div className="text-right">
                  <button
                    onClick={() => setSelected(null)}
                    className="px-4 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-strong)] text-xs font-mono text-[var(--text)] cursor-pointer"
                  >
                    Close Log
                  </button>
                </div>
              </>
            )}
          </GlassPanel>
        </div>
      )}
    </div>
  );
};
