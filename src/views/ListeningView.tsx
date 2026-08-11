import React, { useEffect, useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { TestSelector } from '../components/practice/TestSelector';
import { SkillTips } from '../components/practice/SkillTips';
import { PlayOnceAudio } from '../components/practice/PlayOnceAudio';
import { db, type ListeningTest, type ListeningResult } from '../lib/db';
import { Sparkles, Send, RefreshCw, Trophy, CheckCircle2, X } from '../components/ui/icons';

interface ListeningViewProps {
  id?: string;
}

export const ListeningView: React.FC<ListeningViewProps> = ({ id }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [test, setTest] = useState<ListeningTest | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ListeningResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    setTest(null);
    setLoadError(null);
    db.getListeningTest(selectedId)
      .then((t) => { if (!cancelled) setTest(t); })
      .catch((err) => { if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Could not load the test.'); });
    return () => { cancelled = true; };
  }, [selectedId]);

  const backToTests = () => {
    setSelectedId(null);
    setTest(null);
    setAnswers({});
    setResult(null);
    setErrorMessage(null);
  };

  const allQuestions = test ? test.sections.flatMap((s) => s.questions) : [];

  const handleSubmit = async () => {
    if (!test) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await db.submitListening(test.id, answers);
      setResult(res);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- BROWSE ----------
  if (!selectedId) {
    return (
      <div id={id} className="space-y-6">
        <GlassPanel className="p-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-mono mb-2">
            <Sparkles size={14} /> <span>Listening Practice</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-[var(--text)]">Listening Practice</h2>
          <p className="text-xs text-[var(--text-dim)] mt-1">Audio sections with question sets, auto-scored the moment you finish.</p>
        </GlassPanel>

        <TestSelector
          skill="listening"
          onSelect={(tid) => setSelectedId(tid)}
          emptyDescription="Listening tests are being prepared. In the meantime, review the tips below to get ready."
        />

        <SkillTips skill="listening" />
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
            <p className="text-sm text-[var(--text-dim)] mt-1">
              {result.rawScore} / {result.total} correct
            </p>
            <p className="text-[11px] text-[var(--text-faint)] mt-2 max-w-md mx-auto">
              Band estimated from this section, scaled to the standard IELTS listening curve.
            </p>
          </div>
        </GlassPanel>

        {/* Per-question review */}
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
                      <span className={correct ? 'text-[var(--success)]' : 'text-[var(--danger)]'}>
                        Your answer: {String(r?.your || '—')}
                      </span>
                      {!correct && (
                        <span className="text-[var(--text-dim)]"> · Accepted: {(r?.accepted || []).join(' / ')}</span>
                      )}
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

  // ---------- TAKE ----------
  return (
    <div id={id} className="max-w-3xl mx-auto space-y-6">
      <GlassPanel className="p-6">
        <button onClick={backToTests} className="text-xs font-mono text-[var(--text-faint)] hover:text-[var(--accent-a)] mb-2 cursor-pointer">← Back to tests</button>
        <h2 className="font-display text-2xl font-bold text-[var(--text)]">{test ? test.title : 'Listening Test'}</h2>
        <p className="text-xs text-[var(--text-dim)] mt-1">{test?.instructions}</p>
      </GlassPanel>

      {loadError && <GlassPanel className="p-6 text-sm text-[var(--danger)]">{loadError}</GlassPanel>}
      {!test && !loadError && <GlassPanel className="p-8 text-center text-sm text-[var(--text-dim)]">Loading test…</GlassPanel>}

      {test && test.sections.map((section) => (
        <GlassPanel key={section.id} className="p-6 space-y-4">
          <div>
            <h3 className="font-display font-bold text-base text-[var(--text)]">{section.title}</h3>
            {section.instructions && <p className="text-xs text-[var(--text-dim)] mt-1">{section.instructions}</p>}
          </div>

          {section.audioUrl && <PlayOnceAudio src={section.audioUrl} />}

          {section.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-[var(--border)] bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={section.imageUrl} alt="Section figure" className="w-full h-auto" />
            </div>
          )}

          <div className="space-y-2">
            {section.questions.map((q) => {
              // Split the note line around the blank so the input sits inline.
              const parts = (q.prompt || '').split('____');
              return (
                <div key={q.id} className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-sm text-[var(--text)]">
                  <span className="font-mono font-bold text-[var(--accent-a)]">{q.qnumber}.</span>
                  <span>{parts[0]}</span>
                  <input
                    type="text"
                    value={answers[String(q.qnumber)] || ''}
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
      ))}

      {test && (
        <GlassPanel className="p-5">
          {errorMessage && <div className="text-xs text-[var(--danger)] bg-[var(--danger)]/10 border border-[var(--danger)]/20 p-2.5 rounded-xl mb-3">{errorMessage}</div>}
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-faint)]">
              {Object.values(answers).filter((v) => v.trim()).length} / {allQuestions.length} answered
            </span>
            <Button
              variant="primary" size="md"
              icon={submitting ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
              disabled={submitting}
              onClick={handleSubmit}
            >
              {submitting ? 'Scoring...' : 'Submit & Score'}
            </Button>
          </div>
        </GlassPanel>
      )}
    </div>
  );
};
