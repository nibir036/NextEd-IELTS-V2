import React, { useEffect, useRef, useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { BackLink } from '../components/ui/BackLink';
import { TestSelector } from '../components/practice/TestSelector';
import { ReadingTipsChapterList } from '../components/practice/tips/readingtipschapterlist';
import { TipsReaderOverlay } from '../components/practice/tips/TipsReaderOverlay';
import { TipsLessonList } from '../components/practice/tips/TipsLessonList';
import { db, type ReadingTest, type ReadingResult } from '../lib/db';
import { Sparkles, Send, RefreshCw, Trophy, CheckCircle2, X, Clock, BookOpen } from '../components/ui/icons';

interface ReadingExamViewProps {
  id?: string;
  initialBrowseTab?: 'tests' | 'tips';
}

type AnswerValue = string | string[];

function isAnswered(v: AnswerValue | undefined): boolean {
  if (Array.isArray(v)) return v.length > 0;
  return !!v && v.trim().length > 0;
}

function formatAnswerForReview(v: unknown): string {
  if (Array.isArray(v)) return v.length ? v.join(', ').toUpperCase() : '—';
  return v ? String(v) : '—';
}

export const ReadingExamView: React.FC<ReadingExamViewProps> = ({ id, initialBrowseTab }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [test, setTest] = useState<ReadingTest | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [browseTab, setBrowseTab] = useState<'tests' | 'tips'>(initialBrowseTab ?? 'tests');
  const [selectedTipsSlug, setSelectedTipsSlug] = useState<string | null>(null);
  const [selectedTipsAnchor, setSelectedTipsAnchor] = useState<string | null>(null);
  const [noBiteLessons, setNoBiteLessons] = useState(false);

  // Sidebar dropdown navigation (e.g. Tests -> Tips & Tricks) changes
  // this prop without remounting the view -- useState's initial value
  // only applies on first mount, so without this effect the tab never
  // actually switches, only the URL does. This is now the only way to
  // switch tabs -- the in-page Tests/Tips switcher was removed.
  useEffect(() => {
    if (initialBrowseTab) {
      setBrowseTab(initialBrowseTab);
      if (initialBrowseTab === 'tests') setSelectedTipsSlug(null);
    }
  }, [initialBrowseTab]);

  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submitRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    setTest(null);
    setLoadError(null);
    db.getReadingTest(selectedId)
      .then((t) => {
        if (!cancelled) {
          setTest(t);
          setTimeLeft(t.durationSeconds ?? null);
        }
      })
      .catch((err) => { if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Could not load the test.'); });
    return () => { cancelled = true; };
  }, [selectedId]);

  // Reading has no audio gate — the clock starts as soon as the test loads.
  useEffect(() => {
    if (timeLeft === null) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return prev;
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          submitRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test?.id]);

  const allQuestions = test ? test.sections.flatMap((s) => s.questions) : [];
  const answeredCount = Object.values(answers).filter(isAnswered).length;

  const doSubmit = async () => {
    if (!test || submitting || result) return;
    setSubmitting(true);
    setErrorMessage(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
    try {
      const res = await db.submitReading(test.id, answers);
      setResult(res);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };
  submitRef.current = doSubmit;

  const backToTests = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSelectedId(null);
    setTest(null);
    setAnswers({});
    setResult(null);
    setErrorMessage(null);
    setTimeLeft(null);
  };

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const setSingleAnswer = (qnumber: number, letter: string) => {
    setAnswers((a) => ({ ...a, [String(qnumber)]: letter }));
  };

  // ---------- BROWSE ----------
  if (!selectedId) {
    return (
      <div id={id} className="space-y-6">
        <GlassPanel className="p-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-mono mb-2">
            <Sparkles size={14} /> <span>Reading Practice</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-[var(--text)]">Reading Practice</h2>
          <p className="text-xs text-[var(--text-dim)] mt-1">
            {browseTab === 'tests'
              ? 'Timed passages with comprehension questions, auto-scored the moment you finish or the clock runs out.'
              : 'Learn the Reading strategies, question types, traps, and time-management techniques needed to reach Band 9.'}
          </p>
        </GlassPanel>

        {browseTab === 'tests' ? (
          <TestSelector
            skill="reading"
            onSelect={(tid) => setSelectedId(tid)}
            emptyDescription="Reading tests are being prepared. In the meantime, review the tips below to get ready."
          />
        ) : selectedTipsSlug ? (
          <TipsReaderOverlay
            skill="reading"
            slug={selectedTipsSlug}
            anchorBlockId={selectedTipsAnchor}
            onNavigate={(slug) => {
              setSelectedTipsSlug(slug);
              setSelectedTipsAnchor(null);
            }}
            onClose={() => {
              setSelectedTipsSlug(null);
              setSelectedTipsAnchor(null);
            }}
          />
        ) : noBiteLessons ? (
          <ReadingTipsChapterList
            onSelectChapter={(slug) => setSelectedTipsSlug(slug)}
          />
        ) : (
          <TipsLessonList
            skill="reading"
            onOpenChapter={(slug, anchorBlockId) => {
              setSelectedTipsSlug(slug);
              setSelectedTipsAnchor(anchorBlockId);
            }}
            onNoLessons={() => setNoBiteLessons(true)}
          />
        )}
      </div>
    );
  }

  // ---------- RESULT ----------
  if (result) {
    return (
      <div id={id} className="max-w-3xl mx-auto space-y-6">
        <BackLink onClick={backToTests}>Back to tests</BackLink>
        <GlassPanel className="p-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center shadow-lg shadow-[var(--glow-a)]">
            <Trophy size={30} />
          </div>
          <div>
            <div className="text-xs font-mono uppercase text-[var(--text-faint)]">Estimated Reading Band</div>
            <div className="font-display font-extrabold text-5xl text-[var(--text)] mt-1">Band {result.band.toFixed(1)}</div>
            <p className="text-sm text-[var(--text-dim)] mt-1">{result.rawScore} / {result.total} correct</p>
            <p className="text-[11px] text-[var(--text-faint)] mt-2 max-w-md mx-auto">
              Band estimated from this test, scaled to the standard IELTS reading curve.
            </p>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 space-y-3">
          <h3 className="font-display font-bold text-base text-[var(--text)]">Answer Review</h3>
          <div className="space-y-2">
            {allQuestions.map((q) => {
              const r = result.review[String(q.qnumber)];
              const correct = r?.correct;
              return (
                <div key={q.id} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--border)]">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${correct ? 'bg-[var(--success)]/20 text-[var(--success)]' : 'bg-[var(--danger)]/20 text-[var(--danger)]'}`}>
                    {correct ? <CheckCircle2 size={14} /> : <X size={14} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-[var(--text)]">
                      <span className="font-mono font-bold">{q.qnumber}.</span> {q.prompt?.replace('____', '______')}
                    </div>
                    <div className="text-[11px] font-mono mt-1">
                      <span className={correct ? 'text-[var(--success)]' : 'text-[var(--danger)]'}>Your answer: {formatAnswerForReview(r?.your)}</span>
                      {!correct && <span className="text-[var(--text-dim)]"> · Accepted: {(r?.accepted || []).join(' / ')}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassPanel>
      </div>
    );
  }

  // ---------- EXAM (two-panel: passage left, questions right) ----------
  const timeIsLow = timeLeft !== null && timeLeft <= 60;

  return (
    <div id={id} className="space-y-4">
      <BackLink onClick={backToTests}>Back to tests</BackLink>

      {loadError && <GlassPanel className="p-6 text-sm text-[var(--danger)]">{loadError}</GlassPanel>}
      {!test && !loadError && <GlassPanel className="p-8 text-center text-sm text-[var(--text-dim)]">Loading test…</GlassPanel>}

      {test && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: sticky timer + scrollable passage(s) */}
          <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
            <GlassPanel className="p-5 space-y-4">
              <h2 className="font-display text-xl font-bold text-[var(--text)]">{test.title}</h2>

              <div className={`rounded-2xl border p-4 flex items-center justify-between ${timeIsLow ? 'border-[var(--danger)]/40 bg-[var(--danger)]/10' : 'border-[var(--border)] bg-[var(--bg-elevated)]'}`}>
                <div className="flex items-center gap-2">
                  <Clock size={18} className={timeIsLow ? 'text-[var(--danger)]' : 'text-[var(--accent-a)]'} />
                  <span className="text-xs font-mono text-[var(--text-dim)]">Time remaining</span>
                </div>
                <span className={`font-display font-extrabold text-2xl ${timeIsLow ? 'text-[var(--danger)]' : 'text-[var(--text)]'}`}>
                  {timeLeft !== null ? fmtTime(timeLeft) : '--:--'}
                </span>
              </div>

              {test.instructions && (
                <div className="rounded-xl bg-[var(--panel-2)] border border-[var(--border)] p-3">
                  <div className="text-[11px] font-mono uppercase text-[var(--text-faint)] mb-1">Instructions</div>
                  <p className="text-xs text-[var(--text-dim)] leading-relaxed">{test.instructions}</p>
                </div>
              )}

              {errorMessage && <div className="text-xs text-[var(--danger)] bg-[var(--danger)]/10 border border-[var(--danger)]/20 p-2.5 rounded-xl">{errorMessage}</div>}

              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-faint)]">
                  {answeredCount} / {allQuestions.length} answered
                </span>
                <Button
                  variant="primary" size="md"
                  icon={submitting ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                  disabled={submitting}
                  onClick={doSubmit}
                >
                  {submitting ? 'Scoring...' : 'Submit & Score'}
                </Button>
              </div>
            </GlassPanel>

            {/* Passage text(s) — scrollable reading pane */}
            <GlassPanel className="p-5 lg:max-h-[calc(100vh-20rem)] lg:overflow-y-auto no-scrollbar space-y-5">
              {test.sections.filter((s) => s.passageText).map((section) => (
                <div key={section.id} className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase text-[var(--text-faint)]">
                    <BookOpen size={14} className="text-[var(--accent-a)]" />
                    {section.title}
                  </div>
                  <p className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-line">{section.passageText}</p>
                </div>
              ))}
            </GlassPanel>
          </div>

          {/* RIGHT: scrollable question sets */}
          <div className="lg:col-span-7 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto no-scrollbar space-y-6 pr-1">
            {test.sections.map((section) => {
              // If this section has `matching` questions, they all share the
              // same option list. Find which question is the FIRST one of
              // type 'matching' so the shared options box can be rendered
              // immediately before it (not always at the top of the
              // section) -- e.g. if matching questions are numbered 37-40
              // after MCQ/T-F-NG questions 27-36, the box now appears
              // right before 37, not above 27.
              const firstMatchingIdx = section.questions.findIndex((q) => q.type === 'matching');
              const matchingOptions = section.questions[firstMatchingIdx]?.options as
                | { letter: string; text?: string }[]
                | undefined;

              return (
                <GlassPanel key={section.id} className="p-6 space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-[var(--text)]">{section.title}</h3>
                    {section.instructions && <p className="text-xs text-[var(--text-dim)] mt-1">{section.instructions}</p>}
                  </div>

                  <div className="space-y-2">
                    {section.questions.map((q, qIdx) => {
                      const optionsBoxBeforeThis =
                        qIdx === firstMatchingIdx && matchingOptions && matchingOptions.length > 0 ? (
                          <div
                            key={`${section.id}-options-box`}
                            className="rounded-xl bg-[var(--panel-2)] border border-[var(--border)] p-3 space-y-1.5"
                          >
                            <div className="text-[11px] font-mono uppercase text-[var(--text-faint)] mb-1">Options</div>
                            {matchingOptions.map((o) => (
                              <div key={o.letter} className="flex items-start gap-2 text-xs text-[var(--text-dim)]">
                                <span className="font-mono font-bold text-[var(--accent-a)] shrink-0">{o.letter}</span>
                                <span>{o.text}</span>
                              </div>
                            ))}
                          </div>
                        ) : null;

                      // Compact letter/word-grid: matching questions share the
                      // reference box above and just need a pick.
                      if (q.type === 'matching') {
                        const opts = Array.isArray(q.options)
                          ? (q.options as { letter: string; text?: string }[])
                          : [];
                        const selected = (answers[String(q.qnumber)] as string) || '';
                        return (
                          <React.Fragment key={q.id}>
                            {optionsBoxBeforeThis}
                            <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] space-y-2">
                              <div className="text-sm text-[var(--text)]">
                                <span className="font-mono font-bold text-[var(--accent-a)]">{q.qnumber}.</span> {q.prompt}
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {opts.map((o) => {
                                  const isSel = selected.toLowerCase() === o.letter.toLowerCase();
                                  return (
                                    <button
                                      key={o.letter}
                                      onClick={() => setSingleAnswer(q.qnumber, o.letter)}
                                      className={`min-w-9 h-9 px-2 rounded-lg border flex items-center justify-center text-xs font-bold cursor-pointer transition-colors ${
                                        isSel
                                          ? 'border-[var(--accent-a)] bg-[var(--accent-a)] text-white'
                                          : 'border-[var(--border-strong)] text-[var(--text)] hover:border-[var(--accent-a)]'
                                      }`}
                                    >
                                      {o.letter}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      }

                      // single_choice — full inline list. Used for both MCQ
                      // (A-D) and True/False/Not Given questions.
                      if (q.type === 'single_choice') {
                        const opts = Array.isArray(q.options)
                          ? (q.options as { letter: string; text: string }[])
                          : [];
                        const selected = (answers[String(q.qnumber)] as string) || '';
                        return (
                          <div key={q.id} className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] space-y-2">
                            <div className="text-sm text-[var(--text)]">
                              <span className="font-mono font-bold text-[var(--accent-a)]">{q.qnumber}.</span> {q.prompt}
                            </div>
                            <div className="space-y-1.5">
                              {opts.map((o) => {
                                const isSel = selected.toLowerCase() === o.letter.toLowerCase();
                                return (
                                  <button
                                    key={o.letter}
                                    onClick={() => setSingleAnswer(q.qnumber, o.letter)}
                                    className={`w-full flex items-start gap-2.5 text-left p-2.5 rounded-lg border transition-colors cursor-pointer ${
                                      isSel
                                        ? 'border-[var(--accent-a)] bg-[var(--accent-a)]/10'
                                        : 'border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--panel-2)]'
                                    }`}
                                  >
                                    <span className={`shrink-0 mt-0.5 px-1.5 h-5 min-w-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                                      isSel ? 'border-[var(--accent-a)] bg-[var(--accent-a)] text-white' : 'border-[var(--border-strong)] text-[var(--text-faint)]'
                                    }`}>
                                      {o.letter}
                                    </span>
                                    <span className="text-xs text-[var(--text)] leading-snug">{o.text}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      // Default: text_input completion — inline blank, or a
                      // standalone short-answer question if there's no blank.
                      const parts = (q.prompt || '').split('____');
                      return (
                        <div key={q.id} className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-sm text-[var(--text)]">
                          <span className="font-mono font-bold text-[var(--accent-a)]">{q.qnumber}.</span>
                          <span>{parts[0]}</span>
                          <input
                            type="text"
                            value={(answers[String(q.qnumber)] as string) || ''}
                            onChange={(e) => setAnswers((a) => ({ ...a, [String(q.qnumber)]: e.target.value }))}
                            placeholder="answer"
                            className="inline-block w-40 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-2 py-1 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)]"
                          />
                          {parts[1] && <span>{parts[1]}</span>}
                        </div>
                      );
                    })}
                  </div>
                </GlassPanel>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
