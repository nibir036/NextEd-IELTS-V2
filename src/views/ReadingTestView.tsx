import React, { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { readingPassageSample } from '../lib/data';
import { BookOpen, Sparkles, CheckCircle2, X, RefreshCw, Trophy } from '../components/ui/icons';

interface ReadingTestViewProps {
  id?: string;
}

export const ReadingTestView: React.FC<ReadingTestViewProps> = ({ id }) => {
  const passage = readingPassageSample;
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelectOption = (qId: number, option: string) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const correctCount = passage.questions.reduce((acc, q) => {
    return userAnswers[q.id] === q.correctAnswer ? acc + 1 : acc;
  }, 0);

  const calculatedBand = (correctCount / passage.questions.length) >= 0.8
    ? 8.0
    : (correctCount / passage.questions.length) >= 0.5
    ? 7.0
    : 6.0;

  const handleReset = () => {
    setUserAnswers({});
    setSubmitted(false);
  };

  return (
    <div id={id} className="space-y-6">
      {/* Header Banner */}
      <GlassPanel className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-mono mb-2">
              <BookOpen size={14} />
              <span>{passage.category}</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text)]">
              {passage.title}
            </h2>
            <p className="text-xs text-[var(--text-dim)] mt-1">
              Time Allowed: {passage.durationMinutes} Mins · Passage Paragraph Analysis & Evidence Justification
            </p>
          </div>

          {submitted && (
            <div className="flex items-center gap-3 bg-[var(--bg-elevated)] p-3 rounded-2xl border border-[var(--border)]">
              <div className="text-right">
                <div className="text-[10px] font-mono text-[var(--text-faint)] uppercase">Score Outcome</div>
                <div className="font-display font-bold text-lg text-[var(--text)]">
                  {correctCount} / {passage.questions.length} Correct
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[image:var(--accent-gradient)] text-white font-bold text-lg flex items-center justify-center">
                {calculatedBand}
              </div>
            </div>
          )}
        </div>
      </GlassPanel>

      {/* Split Screen Grid: Passage Text vs Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Passage Panel */}
        <div className="lg:col-span-7">
          <GlassPanel className="p-6 max-h-[600px] overflow-y-auto space-y-5 border-l-4 border-l-[var(--accent-a)]">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <span className="text-xs font-mono font-semibold uppercase text-[var(--text-faint)]">
                Reading Passage Text
              </span>
              <span className="text-xs font-mono text-[var(--text-dim)]">
                4 Paragraphs
              </span>
            </div>

            {passage.paragraphs.map((p, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="inline-block px-2 py-0.5 rounded bg-[var(--accent-a)]/15 text-[var(--accent-a)] text-[11px] font-mono font-bold">
                  {p.label}
                </span>
                <p className="text-xs text-[var(--text)] leading-relaxed font-sans">
                  {p.text}
                </p>
              </div>
            ))}
          </GlassPanel>
        </div>

        {/* Right Questions Pane */}
        <div className="lg:col-span-5 space-y-4">
          <GlassPanel className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="font-display font-bold text-base text-[var(--text)]">
                Questions 1–3
              </h3>
              <span className="text-xs font-mono text-[var(--text-dim)]">
                {Object.keys(userAnswers).length} / {passage.questions.length} Answered
              </span>
            </div>

            {passage.questions.map((q) => {
              const selected = userAnswers[q.id];
              const isCorrect = selected === q.correctAnswer;

              return (
                <div key={q.id} className="p-4 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)] space-y-3">
                  <div className="text-xs font-semibold text-[var(--text)]">
                    <span className="font-mono text-[var(--accent-a)] mr-1.5">Q{q.id}.</span>
                    {q.question}
                  </div>

                  {/* Options List */}
                  <div className="space-y-1.5">
                    {(q.options || ['TRUE', 'FALSE', 'NOT GIVEN']).map((opt) => {
                      const isOptionSelected = selected === opt;
                      let optionClasses = 'bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--border-strong)]';

                      if (submitted) {
                        if (opt === q.correctAnswer) {
                          optionClasses = 'bg-[var(--success)]/15 border-[var(--success)] text-[var(--success)] font-semibold';
                        } else if (isOptionSelected) {
                          optionClasses = 'bg-[var(--danger)]/15 border-[var(--danger)] text-[var(--danger)]';
                        }
                      } else if (isOptionSelected) {
                        optionClasses = 'bg-[var(--accent-a)]/20 border-[var(--accent-a)] text-[var(--text)] font-semibold';
                      }

                      return (
                        <button
                          key={opt}
                          onClick={() => handleSelectOption(q.id, opt)}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-between ${optionClasses}`}
                        >
                          <span>{opt}</span>
                          {submitted && opt === q.correctAnswer && <CheckCircle2 size={14} className="text-[var(--success)] shrink-0" />}
                          {submitted && isOptionSelected && opt !== q.correctAnswer && <X size={14} className="text-[var(--danger)] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* AI Explanation Banner when submitted */}
                  {submitted && (
                    <div className="p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--accent-a)]/30 text-xs space-y-1">
                      <div className="font-mono font-semibold text-[var(--accent-a)] flex items-center gap-1">
                        <Sparkles size={13} />
                        <span>AI Evidence Justification</span>
                      </div>
                      <p className="text-[var(--text-dim)] leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-2 flex items-center justify-between">
              {submitted ? (
                <Button variant="secondary" size="md" icon={<RefreshCw size={16} />} onClick={handleReset}>
                  Try Again
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  icon={<Trophy size={16} />}
                  disabled={Object.keys(userAnswers).length < passage.questions.length}
                  onClick={() => setSubmitted(true)}
                >
                  Check Answers & AI Evidence
                </Button>
              )}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};