import React, { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { Headphones, Play, Pause, Volume2, RotateCcw, CheckCircle2, Sparkles, BookOpen } from '../components/ui/icons';

interface ListeningViewProps {
  id?: string;
}

export const ListeningView: React.FC<ListeningViewProps> = ({ id }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({
    q1: '',
    q2: '',
    q3: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const correctAnswers: Record<string, string> = {
    q1: 'Greenwich',
    q2: '14.50',
    q3: 'membership',
  };

  const handleInputChange = (key: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleCheck = () => {
    setSubmitted(true);
  };

  return (
    <div id={id} className="space-y-6">
      {/* Header Banner */}
      <GlassPanel className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-mono mb-2">
              <Headphones size={14} />
              <span>Section 1: Campus Sports Centre Inquiry</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text)]">
              IELTS Listening Practice
            </h2>
            <p className="text-xs text-[var(--text-dim)] mt-1">
              Native British Accent · Form Completion & Signpost Recognition
            </p>
          </div>

          {/* Audio Controls Toolbar */}
          <div className="flex items-center gap-3 bg-[var(--bg-elevated)] p-2 rounded-2xl border border-[var(--border)]">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>

            <div className="flex items-center gap-1.5 px-2">
              <Volume2 size={16} className="text-[var(--text-faint)]" />
              <span className="text-xs font-mono text-[var(--text)]">02:45 / 05:12</span>
            </div>

            <div className="flex items-center gap-1 border-l border-[var(--border)] pl-2">
              {[1.0, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded text-[11px] font-mono cursor-pointer ${
                    playbackSpeed === speed
                      ? 'bg-[var(--panel-2)] text-[var(--accent-a)] font-bold'
                      : 'text-[var(--text-faint)]'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassPanel>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Questions Pane */}
        <div className="lg:col-span-7 space-y-4">
          <GlassPanel className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="font-display font-bold text-base text-[var(--text)]">
                Questions 1–3: Complete the Notes Below
              </h3>
              <span className="text-xs font-mono text-[var(--text-faint)]">
                NO MORE THAN TWO WORDS AND/OR A NUMBER
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)] space-y-4 text-xs leading-relaxed">
              <div className="font-semibold text-[var(--text)] uppercase tracking-wider font-mono">
                Campus Sports Complex Membership Form
              </div>

              <div className="space-y-3 text-[var(--text-dim)]">
                <div>
                  <label className="block mb-1">
                    1. Street Address: 14 <span className="font-mono text-[var(--accent-a)]">Q1.</span> ______ Lane
                  </label>
                  <input
                    type="text"
                    value={answers.q1}
                    onChange={(e) => handleInputChange('q1', e.target.value)}
                    placeholder="Enter answer for Q1..."
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg p-2 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)]"
                  />
                  {submitted && (
                    <div className="text-[11px] mt-1 font-mono text-[var(--success)]">
                      Correct Answer: {correctAnswers.q1}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block mb-1">
                    2. Peak Student Monthly Rate: £ <span className="font-mono text-[var(--accent-a)]">Q2.</span> ______
                  </label>
                  <input
                    type="text"
                    value={answers.q2}
                    onChange={(e) => handleInputChange('q2', e.target.value)}
                    placeholder="Enter answer for Q2..."
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg p-2 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)]"
                  />
                  {submitted && (
                    <div className="text-[11px] mt-1 font-mono text-[var(--success)]">
                      Correct Answer: {correctAnswers.q2}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block mb-1">
                    3. Required Document for Discount: Student ID or <span className="font-mono text-[var(--accent-a)]">Q3.</span> ______ card
                  </label>
                  <input
                    type="text"
                    value={answers.q3}
                    onChange={(e) => handleInputChange('q3', e.target.value)}
                    placeholder="Enter answer for Q3..."
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg p-2 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)]"
                  />
                  {submitted && (
                    <div className="text-[11px] mt-1 font-mono text-[var(--success)]">
                      Correct Answer: {correctAnswers.q3}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                icon={<BookOpen size={14} />}
                onClick={() => setShowTranscript(!showTranscript)}
              >
                {showTranscript ? 'Hide Audio Transcript' : 'Show Audio Transcript'}
              </Button>

              <Button variant="primary" size="md" icon={<CheckCircle2 size={16} />} onClick={handleCheck}>
                Check Answers
              </Button>
            </div>
          </GlassPanel>
        </div>

        {/* Transcript & Signposts */}
        <div className="lg:col-span-5">
          {showTranscript ? (
            <GlassPanel className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              <div className="text-xs font-mono font-semibold text-[var(--accent-a)] uppercase flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>Synchronized Audio Transcript</span>
              </div>
              <div className="text-xs text-[var(--text-dim)] space-y-3 leading-relaxed font-sans">
                <p>
                  <strong>Receptionist:</strong> Good morning, University Sports Centre. How can I help you today?
                </p>
                <p>
                  <strong>Student:</strong> Hi, I’d like to inquire about joining the gym. I live over on 14 <span className="text-[var(--accent-a)] font-bold">Greenwich</span> Lane [Q1], so it’s right down the road.
                </p>
                <p>
                  <strong>Receptionist:</strong> Perfect! Our standard student peak rate comes to exactly £<span className="text-[var(--accent-a)] font-bold">14.50</span> [Q2] per month.
                </p>
                <p>
                  <strong>Student:</strong> Great! Do I need to bring my student ID or my alumni <span className="text-[var(--accent-a)] font-bold">membership</span> [Q3] card when signing up?
                </p>
              </div>
            </GlassPanel>
          ) : (
            <GlassPanel className="p-8 text-center flex flex-col items-center justify-center min-h-[360px]">
              <Headphones size={32} className="text-[var(--accent-a)] mb-3" />
              <h4 className="font-display font-bold text-lg text-[var(--text)] mb-1">
                Audio Transcript Hidden
              </h4>
              <p className="text-xs text-[var(--text-dim)] max-w-xs">
                To simulate exam conditions, listen to the audio stream first before revealing the full transcript.
              </p>
            </GlassPanel>
          )}
        </div>
      </div>
    </div>
  );
};
