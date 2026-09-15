import React, { useEffect, useRef, useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { BackLink } from '../components/ui/BackLink';
import { ProgressBar } from '../components/ui/ProgressBar';
import { TestSelector } from '../components/practice/TestSelector';
import { WritingTipsChapterList } from '../components/practice/tips/writingtipschapterlist';
import { TipsReaderOverlay } from '../components/practice/tips/TipsReaderOverlay';
import { TipsLessonList } from '../components/practice/tips/TipsLessonList';
import {
  PenTool, Sparkles, Send, CheckCircle2, RefreshCw, Trophy, BookOpen,
  ArrowRight, Clock,
} from '../components/ui/icons';

interface WritingViewProps {
  id?: string;
  initialBrowseTab?: 'tests' | 'tips';
  // "Forced" mode: a parent (the full-mock-test runner) hands us a specific
  // testId to load directly, skipping the browse/select-a-test screen, and
  // gets notified with the resulting band once this skill is scored so it
  // can move on to the next one.
  forcedTestId?: string;
  onExamComplete?: (band: number) => void;
}

interface WritingTest {
  id: string;
  title: string;
  instructions: string | null;
  durationSeconds: number | null;
  task1: { prompt: string; imageUrl: string | null };
  task2: { prompt: string; imageUrl: string | null };
}

interface TaskEval {
  overallBand: number;
  taskResponseScore: number;
  coherenceScore: number;
  lexicalScore: number;
  grammarScore: number;
  taskResponseFeedback: string;
  coherenceFeedback: string;
  lexicalFeedback: string;
  grammarFeedback: string;
  generalSummary: string;
  keyImprovements: string[];
  enhancedVersionSnippet?: string;
}

interface TestResult {
  overallBand: number;
  task1: TaskEval;
  task2: TaskEval;
  saved?: boolean;
}

const wordsOf = (t: string) => (t.trim() ? t.trim().split(/\s+/).length : 0);

const TaskReport: React.FC<{ label: string; evalData: TaskEval }> = ({ label, evalData }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[var(--panel-2)] border border-[var(--border)] text-[11px] font-mono font-semibold uppercase text-[var(--text)]">{label}</span>
      <span className="font-display font-bold text-sm text-[var(--text)]">Band {evalData.overallBand.toFixed(1)}</span>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {[
        { label: 'Task', score: evalData.taskResponseScore, fb: evalData.taskResponseFeedback },
        { label: 'Coherence', score: evalData.coherenceScore, fb: evalData.coherenceFeedback },
        { label: 'Lexical', score: evalData.lexicalScore, fb: evalData.lexicalFeedback },
        { label: 'Grammar', score: evalData.grammarScore, fb: evalData.grammarFeedback },
      ].map((c, i) => (
        <div key={i} className="p-2.5 rounded-xl bg-[var(--panel-2)] border border-[var(--border)]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-mono text-[var(--text-faint)]">{c.label}</span>
            <span className="font-display font-bold text-xs text-[var(--text)]">{c.score.toFixed(1)}</span>
          </div>
          <p className="text-[11px] text-[var(--text-dim)] line-clamp-3 leading-tight">{c.fb}</p>
        </div>
      ))}
    </div>
    <div className="p-2.5 rounded-xl bg-[var(--panel-2)] border border-[var(--border)]">
      <p className="text-[11px] text-[var(--text-dim)] leading-relaxed">{evalData.generalSummary}</p>
    </div>
    {evalData.keyImprovements?.length > 0 && (
      <div className="space-y-1.5">
        {evalData.keyImprovements.map((tip, i) => (
          <div key={i} className="flex items-start gap-2 text-[11px] text-[var(--text-dim)]">
            <CheckCircle2 size={13} className="text-[var(--success)] shrink-0 mt-0.5" />
            <span>{tip}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

export const WritingView: React.FC<WritingViewProps> = ({ id, initialBrowseTab, forcedTestId, onExamComplete }) => {
  const [selectedTestId, setSelectedTestId] = useState<string | null>(forcedTestId ?? null);

  // Forced mode: the runner may hand us forcedTestId slightly after mount.
  useEffect(() => {
    if (forcedTestId) setSelectedTestId(forcedTestId);
  }, [forcedTestId]);
  const [browseTab, setBrowseTab] = useState<'tests' | 'tips'>(initialBrowseTab ?? 'tests');

  const [selectedTipsSlug, setSelectedTipsSlug] = useState<string | null>(null);
  const [selectedTipsAnchor, setSelectedTipsAnchor] = useState<string | null>(null);
  const [noBiteLessons, setNoBiteLessons] = useState(false);

  // See ReadingExamView for why this effect is needed -- the sidebar
  // dropdown changes the prop without remounting this view. The in-page
  // Tests/Tips switcher was removed (sidebar dropdown is now the only
  // way to switch), so this is also the only thing driving browseTab.
  useEffect(() => {
    if (initialBrowseTab) {
      setBrowseTab(initialBrowseTab);
      if (initialBrowseTab === 'tests') setSelectedTipsSlug(null);
    }
  }, [initialBrowseTab]);

  const [test, setTest] = useState<WritingTest | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [step, setStep] = useState<'task1' | 'task2'>('task1');
  const [task1Text, setTask1Text] = useState('');
  const [task2Text, setTask2Text] = useState('');

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Overall countdown for the whole test (both tasks share one clock,
  // exactly like the real IELTS Writing paper — 60 minutes total, with
  // Task 1/Task 2 just being a view toggle, not a separate timer).
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submitRef = useRef<() => void>(() => {});

  const task1Words = wordsOf(task1Text);
  const task2Words = wordsOf(task2Text);

  useEffect(() => {
    if (!selectedTestId) return;
    let cancelled = false;
    setTest(null);
    setLoadError(null);
    fetch(`/api/writing/test?id=${selectedTestId}`, { credentials: 'include' })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Could not load the writing test.');
        if (!cancelled) {
          setTest(data.test);
          setTimeLeft(data.test.durationSeconds ?? null);
        }
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Could not load the writing test.');
      });
    return () => {
      cancelled = true;
    };
  }, [selectedTestId]);

  // No audio gate for Writing either — the clock starts as soon as the
  // test loads, same as Reading/Listening.
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

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const backToTests = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSelectedTestId(null);
    setTest(null);
    setStep('task1');
    setTask1Text('');
    setTask2Text('');
    setResult(null);
    setErrorMessage(null);
    setNoticeMessage(null);
    setTimeLeft(null);
  };

  const handleEvaluate = async () => {
    if (!test) return;
    if (task1Words < 20 || task2Words < 20) {
      setErrorMessage('Please write a full attempt for BOTH tasks before submitting.');
      return;
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsEvaluating(true);
    setErrorMessage(null);
    setNoticeMessage(null);

    try {
      const res = await fetch('/api/writing/evaluate', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId: test.id,
          task1: { prompt: test.task1.prompt, imageUrl: test.task1.imageUrl, essayText: task1Text },
          task2: { prompt: test.task2.prompt, essayText: task2Text },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server evaluation error');

      setResult(data);
      onExamComplete?.(data.overallBand);
      if (data.saved === false) {
        setNoticeMessage('Your test was evaluated but could NOT be saved to your history. Make sure you are logged in.');
      }
    } catch (err: unknown) {
      console.error('Writing evaluation failed:', err);
      const message = err instanceof Error ? err.message : 'Evaluation failed. Please try again.';
      setErrorMessage(
        message.includes('GEMINI_API_KEY')
          ? 'The AI examiner is not configured on the server (missing API key). Please contact support.'
          : `Could not evaluate: ${message}`,
      );
      setResult(null);
    } finally {
      setIsEvaluating(false);
    }
  };
  submitRef.current = handleEvaluate;

  // ---------- BROWSE MODE ----------
  if (!selectedTestId) {
    return (
      <div id={id} className="space-y-6">
        <GlassPanel className="border border-[var(--border)] shadow-lg overflow-hidden">
          <div className="flex flex-col-reverse md:flex-row items-center gap-6">
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--panel-2)] border border-[var(--border)] text-[var(--text)] text-xs font-mono mb-2">
                <Sparkles size={14} />
                <span>AI-Graded Writing Practice</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-[var(--text)]">Writing Practice</h2>
              <p className="text-xs text-[var(--text-dim)] mt-1">
                {browseTab === 'tests'
                  ? 'Choose a test below. Each includes Task 1 and Task 2, graded against the official band descriptors.'
                  : 'The Writing module from Zero to Band 9: how the test really works, chart reading, idea development, and the 60-minute plan.'}
              </p>
            </div>
            {/* Muted, looping preview clip -- the same module video used on
                the Dashboard/Landing practice cards, framed to match. */}
            <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-[var(--border)] shadow-xl bg-[image:var(--accent-gradient)]">
                <video
                  className="w-full h-full object-cover"
                  src="/videos/modules/writing.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </GlassPanel>

        {browseTab === 'tests' ? (
          <>
            <TestSelector
              skill="writing"
              onSelect={(tid) => setSelectedTestId(tid)}
              emptyDescription="Writing tests are being prepared. Please check back soon."
            />
          </>
        ) : selectedTipsSlug ? (
          <TipsReaderOverlay
            skill="writing"
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
          <WritingTipsChapterList onSelectChapter={(slug) => setSelectedTipsSlug(slug)} />
        ) : (
          <TipsLessonList
            skill="writing"
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

  // ---------- TAKE MODE ----------
  const timeIsLow = timeLeft !== null && timeLeft <= 60;
  const progressPct = test?.durationSeconds && timeLeft !== null
    ? Math.max(0, Math.min(100, (timeLeft / test.durationSeconds) * 100))
    : 100;

  return (
    <div id={id} className="space-y-6">
      {!forcedTestId && <BackLink onClick={backToTests}>Back to tests</BackLink>}
      <GlassPanel className="overflow-hidden shadow-xl space-y-3 border border-[var(--border)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-[var(--text)]">
              {test ? test.title : 'IELTS Writing Test'}
            </h2>
            <p className="text-xs text-[var(--text-dim)] mt-1">
              Complete both tasks. Task 2 is weighted double, exactly like the official exam.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="flex items-center gap-1.5">
              <Clock size={16} className={timeIsLow ? 'text-[var(--danger)] animate-pulse' : 'text-[var(--text)]'} />
              <span className={`font-display font-extrabold text-xl tabular-nums ${timeIsLow ? 'text-[var(--danger)]' : 'text-[var(--text)]'}`}>
                {timeLeft !== null ? fmtTime(timeLeft) : '--:--'}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-[var(--panel-2)] border border-[var(--border)] p-1.5 rounded-xl">
              <button
                onClick={() => setStep('task1')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  step === 'task1' ? 'bg-[image:var(--accent-gradient)] text-white shadow' : 'text-[var(--text-dim)] hover:text-[var(--text)]'
                }`}
              >
                Task 1
              </button>
              <button
                onClick={() => setStep('task2')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  step === 'task2' ? 'bg-[image:var(--accent-gradient)] text-white shadow' : 'text-[var(--text-dim)] hover:text-[var(--text)]'
                }`}
              >
                Task 2
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal timer bar — one 60-minute clock shared by both
            tasks, just like the real exam. Depletes as time runs out. */}
        <div className={`-mx-5 md:-mx-6 h-2 overflow-hidden ${timeIsLow ? 'bg-[var(--danger)]/20' : 'bg-[var(--panel-2)]'}`}>
          <div
            className={`h-full transition-[width] duration-1000 ease-linear ${timeIsLow ? 'bg-[var(--danger)] animate-pulse' : 'bg-[image:var(--accent-gradient)]'}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </GlassPanel>

      {loadError && (
        <div className="rounded-3xl p-6 text-sm text-red-200 bg-red-950/40 border border-red-400/30 backdrop-blur-sm">
          {loadError}
        </div>
      )}
      {!test && !loadError && (
        <GlassPanel className="p-8 text-center text-sm text-[var(--text-dim)] shadow-lg border border-[var(--border)]">
          Loading test…
        </GlassPanel>
      )}

      {test && step === 'task1' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-3">
            <GlassPanel className="space-y-3 h-full shadow-lg border border-[var(--border)]">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--panel-2)] border border-[var(--border)] text-xs font-mono font-semibold uppercase text-[var(--text)]">
                Task 1 (min 150 words)
              </span>
              {/* Prompt text stays on its own neutral, always-legible surface
                  (theme-driven bg/text) -- this is the copy the candidate
                  has to read carefully while writing. */}
              <p className="text-xs text-[var(--text)] leading-relaxed bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-3">
                {test.task1.prompt}
              </p>
              {test.task1.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-[var(--border)] bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={test.task1.imageUrl} alt="Task 1 visual" className="w-full h-auto" />
                </div>
              )}
            </GlassPanel>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <GlassPanel className="space-y-3 h-full flex flex-col shadow-lg border border-[var(--border)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-[var(--text)] flex items-center gap-1.5">
                  <PenTool size={15} className="text-[var(--text-dim)]" /> Your Task 1 Response
                </span>
                <span className={`text-xs font-mono ${task1Words >= 150 ? 'text-[var(--text)] font-bold' : 'text-[var(--text-faint)]'}`}>
                  {task1Words} words <span className="text-[var(--text-faint)]">/ 150+</span>
                </span>
              </div>
              {/* Writing surface stays on its normal light/neutral theme
                  background -- comfort and legibility for typing come
                  first here. */}
              <textarea
                value={task1Text}
                onChange={(e) => setTask1Text(e.target.value)}
                placeholder="Describe the visual: give an overview, then report the key features with comparisons..."
                rows={18}
                className="w-full flex-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] leading-relaxed resize-none"
              />
              <div>
                <ProgressBar value={(task1Words / 150) * 100} showPercent={false} size="sm" />
              </div>
              <div className="flex justify-end pt-1">
                <Button variant="primary" size="md" icon={<ArrowRight size={16} />} onClick={() => setStep('task2')}>
                  Next: Task 2
                </Button>
              </div>
            </GlassPanel>
          </div>
        </div>
      )}

      {test && step === 'task2' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <GlassPanel className="space-y-3 shadow-lg border border-[var(--border)]">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--panel-2)] border border-[var(--border)] text-xs font-mono font-semibold uppercase text-[var(--text)]">
                Task 2 (min 250 words)
              </span>
              {/* Prompt text stays on its own neutral, always-legible surface. */}
              <p className="text-xs text-[var(--text)] leading-relaxed bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-3">
                {test.task2.prompt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-[var(--text)] flex items-center gap-1.5">
                  <PenTool size={15} className="text-[var(--text-dim)]" /> Your Task 2 Response
                </span>
                <span className={`text-xs font-mono ${task2Words >= 250 ? 'text-[var(--text)] font-bold' : 'text-[var(--text-faint)]'}`}>
                  {task2Words} words <span className="text-[var(--text-faint)]">/ 250+</span>
                </span>
              </div>
              {/* Writing surface stays on its normal light/neutral theme
                  background -- comfort and legibility for typing come
                  first here. */}
              <textarea
                value={task2Text}
                onChange={(e) => setTask2Text(e.target.value)}
                placeholder="Write your full essay response here..."
                rows={16}
                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] leading-relaxed resize-none"
              />
              <div>
                <ProgressBar value={(task2Words / 250) * 100} showPercent={false} size="sm" />
              </div>

              {errorMessage && (
                <div className="text-xs text-[var(--danger)] bg-[var(--danger)]/15 border border-[var(--danger)]/30 p-2.5 rounded-xl">{errorMessage}</div>
              )}
              {noticeMessage && (
                <div className="text-xs text-[var(--warning)] bg-[var(--warning)]/15 border border-[var(--warning)]/30 p-2.5 rounded-xl">{noticeMessage}</div>
              )}

              <div className="flex items-center justify-between pt-1">
                <Button variant="secondary" size="md" onClick={() => setStep('task1')}>
                  ← Back to Task 1
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  icon={isEvaluating ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                  disabled={isEvaluating || task1Words < 20 || task2Words < 20}
                  onClick={handleEvaluate}
                >
                  {isEvaluating ? 'Evaluating both tasks...' : 'Submit Full Test'}
                </Button>
              </div>
            </GlassPanel>
          </div>

          <div className="lg:col-span-5 space-y-4">
            {result ? (
              <GlassPanel className="space-y-5 shadow-xl animate-fade-in border border-[var(--border)]">
                <div className="p-4 rounded-2xl bg-[var(--panel-2)] border border-[var(--border)] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono uppercase text-[var(--text-faint)]">Overall Writing Band</div>
                    <div className="font-display font-extrabold text-4xl text-[var(--text)] mt-1">Band {result.overallBand.toFixed(1)}</div>
                    <div className="text-[11px] font-mono text-[var(--text-faint)] mt-1">
                      Task 1 {result.task1.overallBand.toFixed(1)} · Task 2 {result.task2.overallBand.toFixed(1)} (×2)
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center shadow-lg shadow-[var(--glow-a)]">
                    <Trophy size={28} />
                  </div>
                </div>
                <div>
                  <TaskReport label="Task 1 Breakdown" evalData={result.task1} />
                </div>
                <div className="border-t border-[var(--border)]" />
                <div>
                  <TaskReport label="Task 2 Breakdown" evalData={result.task2} />
                </div>
              </GlassPanel>
            ) : (
              <GlassPanel className="p-8 text-center flex flex-col items-center justify-center min-h-[420px] shadow-xl border border-[var(--border)]">
                <div className="w-14 h-14 rounded-2xl bg-[var(--panel-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text)] mb-4">
                  <BookOpen size={28} />
                </div>
                <h3 className="font-display text-xl font-bold text-[var(--text)] mb-2">Full-Test Evaluation Report</h3>
                <p className="text-xs text-[var(--text-dim)] max-w-xs leading-relaxed">
                  Complete both tasks and submit to receive a weighted overall Writing band with a full criterion breakdown.
                </p>
              </GlassPanel>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
