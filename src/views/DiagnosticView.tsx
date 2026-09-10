import React, { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { db } from '../lib/db';
import { DIAGNOSTIC_PROMPT, DIAGNOSTIC_MIN_WORDS, DIAGNOSTIC_TARGET_WORDS } from '../lib/diagnostic';
import { Sparkles, PenTool, Send, RefreshCw, Trophy, CheckCircle2, ArrowRight } from '../components/ui/icons';

interface DiagnosticViewProps {
  id?: string;
  onNavigateAction: (route: string) => void;
}

interface DiagnosticResult {
  estimatedBand: number;
  taskResponseScore: number;
  coherenceScore: number;
  lexicalScore: number;
  grammarScore: number;
  generalSummary: string;
  keyImprovements: string[];
}

const wordsOf = (t: string) => (t.trim() ? t.trim().split(/\s+/).length : 0);

export const DiagnosticView: React.FC<DiagnosticViewProps> = ({ id, onNavigateAction }) => {
  const [started, setStarted] = useState(false);
  const [essayText, setEssayText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const words = wordsOf(essayText);

  const handleSubmit = async () => {
    if (words < DIAGNOSTIC_MIN_WORDS) {
      setErrorMessage(`Please write at least ${DIAGNOSTIC_MIN_WORDS} words.`);
      return;
    }
    setIsEvaluating(true);
    setErrorMessage(null);
    try {
      const data = await db.submitDiagnostic(essayText);
      setResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setErrorMessage(
        message.includes('GEMINI_API_KEY')
          ? 'The AI examiner is not configured on the server. Please contact support.'
          : message,
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  // ---------- RESULT ----------
  if (result) {
    return (
      <div id={id} className="max-w-2xl mx-auto space-y-6">
        <GlassPanel className="p-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-mono">
            <Sparkles size={14} /> <span>Provisional Placement Estimate</span>
          </div>
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center shadow-lg shadow-[var(--glow-a)]">
            <Trophy size={30} />
          </div>
          <div>
            <div className="text-xs font-mono uppercase text-[var(--text-faint)]">Estimated Starting Band</div>
            <div className="font-display font-extrabold text-5xl text-[var(--text)] mt-1">
              Band {result.estimatedBand.toFixed(1)}
            </div>
            <p className="text-[11px] text-[var(--text-faint)] mt-2 max-w-md mx-auto">
              This is a provisional estimate from a short writing sample — not an official IELTS score.
              It gives us a starting point to personalise your practice.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {[
              { label: 'Task', score: result.taskResponseScore },
              { label: 'Coherence', score: result.coherenceScore },
              { label: 'Lexical', score: result.lexicalScore },
              { label: 'Grammar', score: result.grammarScore },
            ].map((c, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-[var(--panel-2)] border border-[var(--border)]">
                <div className="text-[11px] font-mono text-[var(--text-faint)] uppercase">{c.label}</div>
                <div className="font-display font-bold text-lg text-[var(--accent-a)]">{c.score.toFixed(1)}</div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] text-left">
            <div className="text-xs font-mono font-semibold text-[var(--accent-a)] mb-1">Examiner Summary</div>
            <p className="text-xs text-[var(--text-dim)] leading-relaxed">{result.generalSummary}</p>
          </div>

          {result.keyImprovements?.length > 0 && (
            <div className="space-y-1.5 text-left">
              {result.keyImprovements.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[var(--text-dim)]">
                  <CheckCircle2 size={14} className="text-[var(--success)] shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          )}

          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight size={16} />}
            onClick={() => onNavigateAction('dashboard')}
            className="mt-2"
          >
            Go to Dashboard
          </Button>
        </GlassPanel>
      </div>
    );
  }

  // ---------- INTRO ----------
  if (!started) {
    return (
      <div id={id} className="max-w-2xl mx-auto space-y-6">
        <GlassPanel className="p-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-mono">
            <Sparkles size={14} /> <span>2-Minute Placement Diagnostic</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-[var(--text)]">Let&apos;s find your starting level</h2>
          <p className="text-sm text-[var(--text-dim)] max-w-md mx-auto leading-relaxed">
            Write a short response ({DIAGNOSTIC_MIN_WORDS}–{DIAGNOSTIC_TARGET_WORDS} words) to one question.
            We&apos;ll estimate your starting band and use it to personalise your practice. You can skip this and do it later.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button variant="primary" size="md" icon={<PenTool size={16} />} onClick={() => setStarted(true)}>
              Start Diagnostic
            </Button>
            <Button variant="secondary" size="md" onClick={() => onNavigateAction('dashboard')}>
              Skip for now
            </Button>
          </div>
        </GlassPanel>
      </div>
    );
  }

  // ---------- WRITING ----------
  return (
    <div id={id} className="max-w-2xl mx-auto space-y-6">
      <GlassPanel className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[var(--accent-a)]" />
          <h2 className="font-display text-xl font-bold text-[var(--text)]">Placement Diagnostic</h2>
        </div>

        <p className="text-sm text-[var(--text)] leading-relaxed bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-4">
          {DIAGNOSTIC_PROMPT}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-[var(--text)] flex items-center gap-1.5">
            <PenTool size={15} className="text-[var(--accent-a)]" /> Your Response
          </span>
          <span className={`text-xs font-mono ${words >= DIAGNOSTIC_MIN_WORDS ? 'text-[var(--success)] font-bold' : 'text-[var(--text-dim)]'}`}>
            {words} words <span className="text-[var(--text-faint)]">/ {DIAGNOSTIC_MIN_WORDS}+</span>
          </span>
        </div>

        <textarea
          value={essayText}
          onChange={(e) => setEssayText(e.target.value)}
          placeholder="Write your response here..."
          rows={12}
          className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] leading-relaxed resize-none"
        />
        <ProgressBar value={(words / DIAGNOSTIC_TARGET_WORDS) * 100} showPercent={false} size="sm" />

        {errorMessage && (
          <div className="text-xs text-[var(--danger)] bg-[var(--danger)]/10 border border-[var(--danger)]/20 p-2.5 rounded-xl">
            {errorMessage}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <Button variant="secondary" size="md" onClick={() => onNavigateAction('dashboard')}>
            Skip for now
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={isEvaluating ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
            disabled={isEvaluating || words < DIAGNOSTIC_MIN_WORDS}
            onClick={handleSubmit}
          >
            {isEvaluating ? 'Estimating your level...' : 'Submit Diagnostic'}
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
};
