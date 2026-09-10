import React, { useEffect, useRef, useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { BackLink } from '../components/ui/BackLink';
import { TestSelector } from '../components/practice/TestSelector';
// import { SkillTips } from '../components/practice/SkillTips';
import { ListeningTipsChapterList } from '../components/practice/tips/listeningtipschapterlist';
import { ListeningTipsReader } from '../components/practice/tips/listeningtipsreader';
import { PlayOnceAudio } from '../components/practice/PlayOnceAudio';
import { db, type ListeningTest, type ListeningResult } from '../lib/db';
import { Sparkles, Send, RefreshCw, Trophy, CheckCircle2, X, Clock } from '../components/ui/icons';

interface ListeningExamViewProps {
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

export const ListeningExamView: React.FC<ListeningExamViewProps> = ({ id, initialBrowseTab }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [test, setTest] = useState<ListeningTest | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [browseTab, setBrowseTab] = useState<'tests' | 'tips'>(initialBrowseTab ?? 'tests');

  // See ReadingExamView for why this effect is needed -- the sidebar
  // dropdown changes the prop without remounting this view.
  useEffect(() => {
    if (initialBrowseTab) setBrowseTab(initialBrowseTab);
  }, [initialBrowseTab]);
  const [selectedTipsSlug, setSelectedTipsSlug] = useState<string | null>(null);

  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ListeningResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submitRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    setTest(null);
    setLoadError(null);
    db.getListeningTest(selectedId)
      .then((t) => {
        if (!cancelled) {
          setTest(t);
          setTimeLeft(t.durationSeconds ?? null);
        }
      })
      .catch((err) => { if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Could not load the test.'); });
    return () => { cancelled = true; };
  }, [selectedId]);

  useEffect(() => {
    if (!timerRunning) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return prev;
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimerRunning(false);
          submitRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerRunning]);

  const allQuestions = test ? test.sections.flatMap((s) => s.questions) : [];
  const audioUrl = test?.sections.find((s) => s.audioUrl)?.audioUrl;
  const answeredCount = Object.values(answers).filter(isAnswered).length;

  const doSubmit = async () => {
    if (!test || submitting || result) return;
    setSubmitting(true);
    setErrorMessage(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerRunning(false);
    try {
      const res = await db.submitListening(test.id, answers);
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
    setTimerRunning(false);
  };

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const setSingleAnswer = (qnumber: number, letter: string) => {
    setAnswers((a) => ({ ...a, [String(qnumber)]: letter }));
  };

  const toggleMultiAnswer = (qnumber: number, letter: string) => {
    setAnswers((a) => {
      const key = String(qnumber);
      const current = Array.isArray(a[key]) ? (a[key] as string[]) : [];
      const has = current.includes(letter);
      const next = has ? current.filter((l) => l !== letter) : [...current, letter];
      return { ...a, [key]: next };
    });
  };

  // ---------- BROWSE ----------
  if (!selectedId) {
    return (
      <div id={id} className="space-y-6">
        <GlassPanel className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-mono mb-2">
                <Sparkles size={14} /> <span>Listening Practice</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-[var(--text)]">Listening Practice</h2>
              <p className="text-xs text-[var(--text-dim)] mt-1">
                {browseTab === 'tests'
                  ? 'Timed audio tests, auto-scored the moment you finish or the clock runs out.'
                  : 'Learn the Listening strategies, question types, traps, and recovery techniques needed to reach Band 9.'}
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
          <>
            <TestSelector
              skill="listening"
              onSelect={(tid) => setSelectedId(tid)}
              emptyDescription="Listening tests are being prepared. In the meantime, review the tips below to get ready."
            />

            {/* <SkillTips skill="listening" /> */}
          </>
        ) : selectedTipsSlug ? (
          <ListeningTipsReader
            slug={selectedTipsSlug}
            onNavigate={(slug) => setSelectedTipsSlug(slug)}
            onBack={() => setSelectedTipsSlug(null)}
          />
        ) : (
          <ListeningTipsChapterList
            onSelectChapter={(slug) => setSelectedTipsSlug(slug)}
          />
        )}
      </div>
    );
  }

  // ---------- RESULT ----------
  if (result) {
    return (
      <div id={id} className="max-w-3xl mx-auto space-y-6">
        <GlassPanel className="p-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center shadow-lg shadow-[var(--glow-a)]">
            <Trophy size={30} />
          </div>
          <div>
            <div className="text-xs font-mono uppercase text-[var(--text-faint)]">Estimated Listening Band</div>
            <div className="font-display font-extrabold text-5xl text-[var(--text)] mt-1">Band {result.band.toFixed(1)}</div>
            <p className="text-sm text-[var(--text-dim)] mt-1">{result.rawScore} / {result.total} correct</p>
            <p className="text-[11px] text-[var(--text-faint)] mt-2 max-w-md mx-auto">
              Band estimated from this test, scaled to the standard IELTS listening curve.
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
          <div className="text-right pt-2">
            <Button variant="secondary" size="md" onClick={backToTests}>Back to tests</Button>
          </div>
        </GlassPanel>
      </div>
    );
  }

  // ---------- EXAM (two-panel) ----------
  const timeIsLow = timeLeft !== null && timeLeft <= 60;

  return (
    <div id={id} className="space-y-4">
      <BackLink onClick={backToTests}>Back to tests</BackLink>

      {loadError && <GlassPanel className="p-6 text-sm text-[var(--danger)]">{loadError}</GlassPanel>}
      {!test && !loadError && <GlassPanel className="p-8 text-center text-sm text-[var(--text-dim)]">Loading test…</GlassPanel>}

      {test && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: sticky audio + timer + instructions */}
          <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-4">
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
              {!timerRunning && timeLeft !== null && timeLeft > 0 && (
                <p className="text-[11px] text-[var(--text-faint)] -mt-2">The timer starts when you start the audio.</p>
              )}

              {audioUrl && (
                <PlayOnceAudio
                  src={audioUrl}
                  onStart={() => setTimerRunning(true)}
                />
              )}

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
          </div>

          {/* RIGHT: scrollable questions, no visible scrollbar */}
          <div className="lg:col-span-8 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto no-scrollbar space-y-6 pr-1">
            {test.sections.map((section) => {
              // If this section has `matching` questions, they all share the
              // same option list — show that box ONCE, then render each
              // question as a compact letter-pick (not the full list again).
              const matchingOptions = section.questions.find((q) => q.type === 'matching')?.options as
                | { letter: string; text?: string }[]
                | undefined;

              return (
                <GlassPanel key={section.id} className="p-6 space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-[var(--text)]">{section.title}</h3>
                    {section.instructions && <p className="text-xs text-[var(--text-dim)] mt-1">{section.instructions}</p>}
                  </div>

                  {section.imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-[var(--border)] bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={section.imageUrl} alt="Section figure" className="w-full h-auto" />
                    </div>
                  )}

                  {/* Shared reference box for matching questions — shown once
                      per section, above the individual question rows. */}
                  {matchingOptions && matchingOptions.length > 0 && (
                    <div className="rounded-xl bg-[var(--panel-2)] border border-[var(--border)] p-3 space-y-1.5">
                      <div className="text-[11px] font-mono uppercase text-[var(--text-faint)] mb-1">Options</div>
                      {matchingOptions.map((o) => (
                        <div key={o.letter} className="flex items-start gap-2 text-xs text-[var(--text-dim)]">
                          <span className="font-mono font-bold text-[var(--accent-a)] shrink-0">{o.letter}</span>
                          <span>{o.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    {section.questions.map((q) => {
                      // Compact letter-grid: matching (shares the box above)
                      // and map_label (bare room letters, no descriptions).
                      if (q.type === 'matching' || q.type === 'map_label') {
                        const opts = Array.isArray(q.options)
                          ? (q.options as { letter: string; text?: string }[])
                          : [];
                        const selected = (answers[String(q.qnumber)] as string) || '';
                        return (
                          <div key={q.id} className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] space-y-2">
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
                                    className={`w-9 h-9 rounded-lg border flex items-center justify-center text-xs font-bold cursor-pointer transition-colors ${
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
                        );
                      }

                      // single_choice — full inline list (each question's
                      // options describe that specific scenario, so repeating
                      // them per question is correct here, unlike matching).
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
                                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
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

                      // multi_choice — checkboxes, array of chosen letters.
                      if (q.type === 'multi_choice') {
                        const opts = Array.isArray(q.options)
                          ? (q.options as { letter: string; text: string }[])
                          : [];
                        const selected = Array.isArray(answers[String(q.qnumber)])
                          ? (answers[String(q.qnumber)] as string[])
                          : [];
                        return (
                          <div key={q.id} className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] space-y-2">
                            <div className="text-sm text-[var(--text)]">
                              <span className="font-mono font-bold text-[var(--accent-a)]">{q.qnumber}.</span> {q.prompt}
                            </div>
                            <div className="space-y-1.5">
                              {opts.map((o) => {
                                const isSel = selected.some((l) => l.toLowerCase() === o.letter.toLowerCase());
                                return (
                                  <button
                                    key={o.letter}
                                    onClick={() => toggleMultiAnswer(q.qnumber, o.letter)}
                                    className={`w-full flex items-start gap-2.5 text-left p-2.5 rounded-lg border transition-colors cursor-pointer ${
                                      isSel
                                        ? 'border-[var(--accent-a)] bg-[var(--accent-a)]/10'
                                        : 'border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--panel-2)]'
                                    }`}
                                  >
                                    <span className={`w-5 h-5 rounded-md border flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                                      isSel ? 'border-[var(--accent-a)] bg-[var(--accent-a)] text-white' : 'border-[var(--border-strong)] text-[var(--text-faint)]'
                                    }`}>
                                      {isSel ? <CheckCircle2 size={12} /> : o.letter}
                                    </span>
                                    <span className="text-xs text-[var(--text)] leading-snug">{o.text}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      // Default: text_input completion — inline blank.
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
                            className="inline-block w-32 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-2 py-1 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)]"
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
