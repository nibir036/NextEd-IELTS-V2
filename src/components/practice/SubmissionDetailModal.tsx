import React from 'react';
import { SkillTag } from '../ui/SkillTag';
import type { SubmissionDetail } from '../../lib/db';
import type { SkillType } from '../../types';
import { Sparkles, X } from '../ui/icons';

// Shared by SubmissionsView (the full history list) and TestSelector (the
// per-card "last attempt" history button) -- extracted here so both call
// sites render a submission/attempt identically instead of maintaining two
// copies of this logic that can silently drift apart (which is exactly
// what happened before: the speaking-detail rendering was fixed in one
// place and the two-task-writing rendering in another, in separate passes).

// The stored `skill` string maps 1:1 onto SkillTag's SkillType union.
export function asSkill(skill: string): SkillType {
  const allowed: SkillType[] = ['reading', 'listening', 'writing', 'speaking', 'mock'];
  return (allowed as string[]).includes(skill) ? (skill as SkillType) : 'writing';
}

export function formatDate(iso: string): string {
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

// Pull the four speaking criteria out of stored feedback JSON. Distinct from
// writingCriteria: speaking uses fluencyScore/pronunciationScore instead of
// taskResponseScore/coherenceScore, so reusing writingCriteria silently
// dropped 2 of the 4 criteria (only lexicalScore/grammarScore happen to
// share a key name) and rendered a "summarised" 2-tile grid instead of 4.
function speakingCriteria(feedback: Record<string, unknown>) {
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
  push('Fluency & Coherence', 'fluencyScore', 'fluencyFeedback');
  push('Lexical Resource', 'lexicalScore', 'lexicalFeedback');
  push('Grammatical Range', 'grammarScore', 'grammarFeedback');
  push('Pronunciation', 'pronunciationScore', 'pronunciationFeedback');
  return rows;
}

function isSpeakingSubmission(detail: SubmissionDetail): boolean {
  return detail.origin === 'submission' && detail.skill === 'speaking';
}

// Two-task writing tests (from /api/writing/evaluate's testId path) store
// answers/feedback nested per task (task1/task2) instead of flat at the top
// level like the legacy single-task shape. Detect that shape so the modal
// knows which renderer to use.
function isTwoTaskWriting(detail: SubmissionDetail): boolean {
  const answers = detail.answers as Record<string, unknown> | undefined;
  return Boolean(
    answers &&
      typeof answers.task1 === 'object' &&
      answers.task1 !== null &&
      typeof answers.task2 === 'object' &&
      answers.task2 !== null,
  );
}

interface SubmissionDetailModalProps {
  // Rendered whenever either is truthy -- `loading` alone shows a spinner
  // state before `selected` arrives.
  selected: SubmissionDetail | null;
  loading: boolean;
  onClose: () => void;
}

export const SubmissionDetailModal: React.FC<SubmissionDetailModalProps> = ({
  selected,
  loading,
  onClose,
}) => {
  if (!selected && !loading) return null;

  return (
    <div className="animate-fadeIn fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="animate-pouchPopIn relative max-w-2xl w-full max-h-[85vh] rounded-3xl shadow-2xl bg-white overflow-hidden flex flex-col">
        {/* Always-visible close button -- sits on the outer shell (not the
            scrolling inner div below), so it stays put regardless of scroll
            position. Previously the only way to close was the "Close Log"
            button at the very bottom of the content, which meant scrolling
            through the whole submission just to dismiss it. */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 border border-slate-200 shadow-sm text-slate-500 hover:text-slate-800 hover:border-slate-300 flex items-center justify-center cursor-pointer transition-colors"
        >
          <X size={16} />
        </button>

        {/* Scrolling lives on this inner div, not the rounded outer shell --
            overflow-y-auto on a rounded-3xl container lets the browser's
            native scrollbar track render past the corner radius (it isn't
            clipped the way content is). The outer shell instead clips with
            overflow-hidden, and only this inner div scrolls. */}
        <div className="overflow-y-auto">
          {loading || !selected ? (
            <p className="text-sm text-slate-500 py-16 text-center">Loading audit log…</p>
          ) : (
            <>
              <div className="p-6 pr-14 border-b border-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <SkillTag skill={asSkill(selected.skill)} />
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-lg text-slate-800 truncate">
                        {selected.origin === 'attempt'
                          ? (selected.title ?? 'Test Attempt')
                          : typeof selected.answers?.taskType === 'string'
                            ? `Writing — ${selected.answers.taskType}`
                            : selected.answers?.task1 && selected.answers?.task2
                              ? 'Writing — Task 1 & Task 2'
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
                ) : isSpeakingSubmission(selected) ? (
                  <>
                    {/* ================= SPEAKING SUBMISSION ================= */}
                    {(() => {
                      const feedback = (selected.feedback ?? {}) as Record<string, unknown>;
                      const answers = (selected.answers ?? {}) as Record<string, unknown>;
                      const criteria = speakingCriteria(feedback);
                      const transcript = (answers.transcript ?? {}) as Record<string, string>;
                      const keyImprovements = Array.isArray(feedback.keyImprovements)
                        ? (feedback.keyImprovements as string[])
                        : [];
                      const grammarErrors = Array.isArray(feedback.grammarErrors)
                        ? (feedback.grammarErrors as { quote: string; issue: string; correction: string }[])
                        : [];
                      const grammarStrengths = Array.isArray(feedback.grammarStrengths)
                        ? (feedback.grammarStrengths as { quote: string; note: string }[])
                        : [];
                      const vocabularyStrengths = Array.isArray(feedback.vocabularyStrengths)
                        ? (feedback.vocabularyStrengths as { quote: string; note: string }[])
                        : [];
                      const vocabularyIssues = Array.isArray(feedback.vocabularyIssues)
                        ? (feedback.vocabularyIssues as { quote: string; issue: string }[])
                        : [];
                      const pronunciationGenuineIssues = Array.isArray(feedback.pronunciationGenuineIssues)
                        ? (feedback.pronunciationGenuineIssues as { phoneme: string; totalOccurrencesFlagged: number; note: string }[])
                        : [];

                      return (
                        <>
                          {criteria.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {criteria.map((e, idx) => (
                                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
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

                          {Object.keys(transcript).length > 0 && (
                            <div className="space-y-2">
                              <div className="text-[11px] font-mono uppercase text-slate-400">Transcript</div>
                              {Object.entries(transcript).map(([label, text]) => (
                                text ? (
                                  <div key={label} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                                    <div className="text-[11px] font-mono font-semibold text-slate-500 mb-1">{label}</div>
                                    <p className="text-xs text-slate-700 italic leading-relaxed whitespace-pre-wrap">{text}</p>
                                  </div>
                                ) : null
                              ))}
                            </div>
                          )}

                          {(grammarStrengths.length > 0 || grammarErrors.length > 0) && (
                            <div className="space-y-2">
                              <div className="text-[11px] font-mono uppercase text-slate-400">Grammar Detail</div>
                              {grammarErrors.map((g, idx) => (
                                <div key={`ge-${idx}`} className="p-3 rounded-xl bg-red-50 border border-red-200">
                                  <p className="text-xs text-slate-700 italic">&ldquo;{g.quote}&rdquo;</p>
                                  <p className="text-[11px] text-red-700 mt-1">{g.issue}</p>
                                  {g.correction && (
                                    <p className="text-[11px] text-emerald-700 mt-0.5">→ {g.correction}</p>
                                  )}
                                </div>
                              ))}
                              {grammarStrengths.map((g, idx) => (
                                <div key={`gs-${idx}`} className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                                  <p className="text-xs text-slate-700 italic">&ldquo;{g.quote}&rdquo;</p>
                                  <p className="text-[11px] text-emerald-700 mt-1">{g.note}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {(vocabularyStrengths.length > 0 || vocabularyIssues.length > 0) && (
                            <div className="space-y-2">
                              <div className="text-[11px] font-mono uppercase text-slate-400">Vocabulary Detail</div>
                              {vocabularyIssues.map((v, idx) => (
                                <div key={`vi-${idx}`} className="p-3 rounded-xl bg-red-50 border border-red-200">
                                  <p className="text-xs text-slate-700 italic">&ldquo;{v.quote}&rdquo;</p>
                                  <p className="text-[11px] text-red-700 mt-1">{v.issue}</p>
                                </div>
                              ))}
                              {vocabularyStrengths.map((v, idx) => (
                                <div key={`vs-${idx}`} className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                                  <p className="text-xs text-slate-700 italic">&ldquo;{v.quote}&rdquo;</p>
                                  <p className="text-[11px] text-emerald-700 mt-1">{v.note}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {pronunciationGenuineIssues.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-[11px] font-mono uppercase text-slate-400">Pronunciation Detail</div>
                              {pronunciationGenuineIssues.map((p, idx) => (
                                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                  <div className="flex justify-between items-center">
                                    <span className="font-mono text-xs font-bold text-slate-700">/{p.phoneme}/</span>
                                    <span className="text-[11px] text-slate-500">
                                      flagged {p.totalOccurrencesFlagged}×
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 leading-tight mt-1">{p.note}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {keyImprovements.length > 0 && (
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                              <div className="text-[11px] font-mono uppercase text-slate-400 mb-1.5">
                                Key Improvements
                              </div>
                              <ul className="list-disc list-inside space-y-1">
                                {keyImprovements.map((k, idx) => (
                                  <li key={idx} className="text-xs text-slate-600 leading-relaxed">{k}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {typeof feedback.generalSummary === 'string' && (
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                              <div className="text-xs font-mono font-semibold text-indigo-600 mb-1 flex items-center gap-1.5">
                                <Sparkles size={14} />
                                <span>Examiner Summary</span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {feedback.generalSummary as string}
                              </p>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </>
                ) : isTwoTaskWriting(selected) ? (
                  <>
                    {/* ================= TWO-TASK WRITING TEST (Task 1 + Task 2) ================= */}
                    {(['task1', 'task2'] as const).map((key, idx) => {
                      const taskAnswers = (selected.answers?.[key] ?? {}) as Record<string, unknown>;
                      const taskFeedback = (selected.feedback?.[key] ?? {}) as Record<string, unknown>;
                      const criteria = writingCriteria(taskFeedback);
                      return (
                        <div key={key} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-mono font-bold uppercase text-slate-500">
                              Task {idx + 1}
                            </h4>
                            {typeof taskFeedback.overallBand === 'number' && (
                              <span className="text-[11px] font-mono font-bold text-indigo-600">
                                Band {(taskFeedback.overallBand as number).toFixed(1)}
                              </span>
                            )}
                          </div>

                          {typeof taskAnswers.prompt === 'string' && taskAnswers.prompt && (
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                              <div className="text-[11px] font-mono uppercase text-slate-400 mb-1">
                                Task Prompt
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {taskAnswers.prompt as string}
                              </p>
                            </div>
                          )}

                          {typeof taskAnswers.imageUrl === 'string' && taskAnswers.imageUrl && (
                            <img
                              src={taskAnswers.imageUrl as string}
                              alt="Task 1 visual"
                              className="rounded-xl border border-slate-200 max-h-56 object-contain"
                            />
                          )}

                          {typeof taskAnswers.essayText === 'string' && (
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                              <div className="text-[11px] font-mono uppercase text-slate-400 mb-1">
                                Your Response
                              </div>
                              <p className="text-xs text-slate-700 italic leading-relaxed whitespace-pre-wrap">
                                {taskAnswers.essayText as string}
                              </p>
                            </div>
                          )}

                          {criteria.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {criteria.map((e, i) => (
                                <div
                                  key={i}
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

                          {typeof taskFeedback.generalSummary === 'string' && (
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                              <div className="text-xs font-mono font-semibold text-indigo-600 mb-1 flex items-center gap-1.5">
                                <Sparkles size={14} />
                                <span>Examiner Summary</span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {taskFeedback.generalSummary as string}
                              </p>
                            </div>
                          )}

                          {idx === 0 && <div className="border-t border-slate-200 pt-2" />}
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {/* ================= AI-GRADED SUBMISSION (writing/diagnostic) ================= */}
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
                    onClick={onClose}
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
    </div>
  );
};
