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

      {/* Detail Modal — a fixed light, neutral surface for the body so the
          essay text, per-question review, and criteria notes stay easy
          to read; only the header strip carries the vivid skill color. */}
      {(selected || detailLoading) && (
        <div className="animate-fadeIn fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="animate-pouchPopIn max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl bg-white">
            {detailLoading || !selected ? (
              <p className="text-sm text-slate-500 py-16 text-center">Loading audit log…</p>
            ) : (
              <>
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <SkillTag skill={asSkill(selected.skill)} />
                      <div className="min-w-0">
                        <h3 className="font-display font-bold text-lg text-slate-800 truncate">
                          {selected.origin === 'attempt'
                            ? (selected.title ?? 'Test Attempt')
                            : typeof selected.answers?.taskType === 'string'
                              ? `Writing — ${selected.answers.taskType}`
                              : 'Practice Submission'}
                        </h3>
                        <span className="text-xs font-mono text-slate-500">
                          Submitted: {formatDate(selected.submittedAt)}
                        </span>
                      </div>
                    </div>

                    <div className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-display font-bold text-base shrink-0">
                      Band {selected.bandScore !== null ? selected.bandScore.toFixed(1) : '—'}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* ================= STRUCTURED TEST ATTEMPT (listening/reading) ================= */}
                  {selected.origin === 'attempt' ? (
                    <>
                      {selected.rawScore !== null && selected.rawScore !== undefined && (
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
                          Scored{' '}
                          <span className="font-bold text-indigo-600">
                            {selected.rawScore} / {selected.total}
                          </span>{' '}
                          correct.
                        </div>
                      )}
                      <div className="space-y-2">
                        {(selected.questions ?? []).map((q) => {
                          const yourStr = String(q.your ?? '').trim();
                          const correct = q.accepted.some(
                            (a) => a.toLowerCase() === yourStr.toLowerCase(),
                          );
                          return (
                            <div
                              key={q.qnumber}
                              className="p-3 rounded-xl bg-slate-50 border border-slate-200"
                            >
                              <div className="text-xs text-slate-700">
                                <span className="font-mono font-bold">{q.qnumber}.</span>{' '}
                                {q.prompt?.replace('____', '______')}
                              </div>
                              <div className="text-[11px] font-mono mt-1">
                                <span className={correct ? 'text-emerald-600' : 'text-red-600'}>
                                  Your answer: {yourStr || '—'}
                                </span>
                                {!correct && (
                                  <span className="text-slate-500">
                                    {' '}
                                    · Accepted: {q.accepted.join(' / ')}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* ================= AI-GRADED SUBMISSION (writing/diagnostic) ================= */}
                      {/* Prompt */}
                      {typeof selected.answers?.prompt === 'string' && selected.answers.prompt && (
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="text-[11px] font-mono uppercase text-slate-400 mb-1">
                            Task Prompt
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {selected.answers.prompt as string}
                          </p>
                        </div>
                      )}

                      {/* Candidate response */}
                      {typeof selected.answers?.essayText === 'string' && (
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="text-[11px] font-mono uppercase text-slate-400 mb-1">
                            Your Response
                          </div>
                          <p className="text-xs text-slate-700 italic leading-relaxed whitespace-pre-wrap">
                            {selected.answers.essayText as string}
                          </p>
                        </div>
                      )}

                      {/* Criteria grid */}
                      {selected.feedback && writingCriteria(selected.feedback).length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {writingCriteria(selected.feedback).map((e, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-slate-50 border border-slate-200"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-semibold text-slate-700">{e.label}</span>
                                <span className="font-mono text-xs font-bold text-indigo-600">
                                  {e.score.toFixed(1)}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-tight">{e.notes}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Summary */}
                      {typeof selected.feedback?.generalSummary === 'string' && (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="text-xs font-mono font-semibold text-indigo-600 mb-1 flex items-center gap-1.5">
                            <Sparkles size={14} />
                            <span>Examiner Summary</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {selected.feedback.generalSummary as string}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  <div className="text-right">
                    <button
                      onClick={() => setSelected(null)}
                      className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 hover:border-slate-300 text-xs font-mono text-slate-700 cursor-pointer"
                    >
                      Close Log
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
