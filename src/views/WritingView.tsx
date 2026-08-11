import React, { useEffect, useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  PenTool, Sparkles, Send, CheckCircle2, RefreshCw, Trophy, BookOpen, Clock,
} from '../components/ui/icons';

interface WritingViewProps {
  id?: string;
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
      <span className="text-xs font-mono font-semibold uppercase text-[var(--accent-a)]">{label}</span>
      <span className="font-display font-bold text-sm text-[var(--text)]">Band {evalData.overallBand.toFixed(1)}</span>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {[
        { label: 'Task', score: evalData.taskResponseScore, fb: evalData.taskResponseFeedback },
        { label: 'Coherence', score: evalData.coherenceScore, fb: evalData.coherenceFeedback },
        { label: 'Lexical', score: evalData.lexicalScore, fb: evalData.lexicalFeedback },
        { label: 'Grammar', score: evalData.grammarScore, fb: evalData.grammarFeedback },
      ].map((c, i) => (
        <div key={i} className="p-2.5 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)]">
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

export const WritingView: React.FC<WritingViewProps> = ({ id }) => {
  const [test, setTest] = useState<WritingTest | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [task1Text, setTask1Text] = useState('');
  const [task2Text, setTask2Text] = useState('');

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const task1Words = wordsOf(task1Text);
  const task2Words = wordsOf(task2Text);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/writing/test', { credentials: 'include' })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Could not load the writing test.');
        if (!cancelled) setTest(data.test);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Could not load the writing test.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleEvaluate = async () => {
    if (!test) return;
    if (task1Words < 20 || task2Words < 20) {
      setErrorMessage('Please write a full attempt for BOTH tasks before submitting.');
      return;
    }
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

  return (
    <div id={id} className="space-y-6">
      {/* Header */}
      <GlassPanel className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-mono mb-2">
              <Sparkles size={14} />
              <span>Official Cambridge Band Descriptor AI Engine</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text)]">
              {test ? test.title : 'IELTS Writing Test'}
            </h2>
            <p className="text-xs text-[var(--text-dim)] mt-1">
              Complete both tasks under real test conditions. Task 2 is weighted double, exactly like the official exam.
            </p>
          </div>
          {test?.durationSeconds && (
            <div className="flex items-center gap-2 bg-[var(--bg-elevated)] px-3 py-2 rounded-xl border border-[var(--border)] self-start md:self-auto">
              <Clock size={15} className="text-[var(--accent-a)]" />
              <span className="text-xs font-mono text-[var(--text-dim)]">
                Suggested: {Math.round(test.durationSeconds / 60)} min
              </span>
            </div>
          )}
        </div>
      </GlassPanel>

      {loadError && (
        <GlassPanel className="p-6 text-sm text-[var(--danger)]">{loadError}</GlassPanel>
      )}

      {!test && !loadError && (
        <GlassPanel className="p-8 text-center text-sm text-[var(--text-dim)]">Loading test…</GlassPanel>
      )}

      {test && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: both tasks */}
          <div className="lg:col-span-7 space-y-6">
            {/* TASK 1 */}
            <GlassPanel className="p-5 space-y-3">
              <span className="text-xs font-mono font-semibold uppercase text-[var(--accent-a)]">Task 1 (min 150 words)</span>
              <p className="text-xs text-[var(--text)] leading-relaxed bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-3">
                {test.task1.prompt}
              </p>
              {test.task1.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-[var(--border)] bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={test.task1.imageUrl} alt="Task 1 visual" className="w-full h-auto" />
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-[var(--text)] flex items-center gap-1.5">
                  <PenTool size={15} className="text-[var(--accent-a)]" /> Your Task 1 Response
                </span>
                <span className={`text-xs font-mono ${task1Words >= 150 ? 'text-[var(--success)] font-bold' : 'text-[var(--text-dim)]'}`}>
                  {task1Words} words <span className="text-[var(--text-faint)]">/ 150+</span>
                </span>
              </div>
              <textarea
                value={task1Text}
                onChange={(e) => setTask1Text(e.target.value)}
                placeholder="Describe the maps: give an overview, then report the key changes with comparisons..."
                rows={8}
                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] leading-relaxed resize-none"
              />
              <ProgressBar value={(task1Words / 150) * 100} showPercent={false} size="sm" />
            </GlassPanel>

            {/* TASK 2 */}
            <GlassPanel className="p-5 space-y-3">
              <span className="text-xs font-mono font-semibold uppercase text-[var(--accent-a)]">Task 2 (min 250 words)</span>
              <p className="text-xs text-[var(--text)] leading-relaxed bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-3">
                {test.task2.prompt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-[var(--text)] flex items-center gap-1.5">
                  <PenTool size={15} className="text-[var(--accent-a)]" /> Your Task 2 Response
                </span>
                <span className={`text-xs font-mono ${task2Words >= 250 ? 'text-[var(--success)] font-bold' : 'text-[var(--text-dim)]'}`}>
                  {task2Words} words <span className="text-[var(--text-faint)]">/ 250+</span>
                </span>
              </div>
              <textarea
                value={task2Text}
                onChange={(e) => setTask2Text(e.target.value)}
                placeholder="Write your full essay response here..."
                rows={14}
                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] leading-relaxed resize-none"
              />
              <ProgressBar value={(task2Words / 250) * 100} showPercent={false} size="sm" />

              {errorMessage && (
                <div className="text-xs text-[var(--danger)] bg-[var(--danger)]/10 border border-[var(--danger)]/20 p-2.5 rounded-xl">
                  {errorMessage}
                </div>
              )}
              {noticeMessage && (
                <div className="text-xs text-[var(--warning)] bg-[var(--warning)]/10 border border-[var(--warning)]/20 p-2.5 rounded-xl">
                  {noticeMessage}
                </div>
              )}

              <div className="flex justify-end pt-1">
                <Button
                  variant="primary"
                  size="md"
                  icon={isEvaluating ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                  disabled={isEvaluating || task1Words < 20 || task2Words < 20}
                  onClick={handleEvaluate}
                >
                  {isEvaluating ? 'Evaluating both tasks...' : 'Submit Full Test for AI Evaluation'}
                </Button>
              </div>
            </GlassPanel>
          </div>

          {/* Right: report */}
          <div className="lg:col-span-5 space-y-4">
            {result ? (
              <GlassPanel className="p-6 space-y-5 animate-fade-in">
                <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono uppercase text-[var(--text-faint)]">Overall Writing Band</div>
                    <div className="font-display font-extrabold text-4xl text-[var(--text)] mt-1">
                      Band {result.overallBand.toFixed(1)}
                    </div>
                    <div className="text-[11px] font-mono text-[var(--text-faint)] mt-1">
                      Task 1 {result.task1.overallBand.toFixed(1)} · Task 2 {result.task2.overallBand.toFixed(1)} (×2)
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center shadow-lg shadow-[var(--glow-a)]">
                    <Trophy size={28} />
                  </div>
                </div>

                <TaskReport label="Task 1 Breakdown" evalData={result.task1} />
                <div className="border-t border-[var(--border)]" />
                <TaskReport label="Task 2 Breakdown" evalData={result.task2} />
              </GlassPanel>
            ) : (
              <GlassPanel className="p-8 text-center flex flex-col items-center justify-center min-h-[420px]">
                <div className="w-14 h-14 rounded-2xl bg-[var(--panel-2)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-a)] mb-4">
                  <BookOpen size={28} />
                </div>
                <h3 className="font-display text-xl font-bold text-[var(--text)] mb-2">
                  Full-Test Evaluation Report
                </h3>
                <p className="text-xs text-[var(--text-dim)] max-w-xs leading-relaxed">
                  Complete both tasks and submit to receive a weighted overall Writing band with a full criterion breakdown for each task.
                </p>
              </GlassPanel>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
