import React, { useEffect, useRef, useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { TestSelector } from '../components/practice/TestSelector';
import { SpeakingTipsChapterList } from '../components/practice/tips/speakingtipschapterlist';
import { SpeakingTipsReader } from '../components/practice/tips/speakingtipsreader';
import {
  Sparkles, Mic, Square, ArrowRight, Clock, MessageCircle, Users, RotateCcw,
  Send, RefreshCw, Trophy, CheckCircle2, BookOpen,
} from '../components/ui/icons';

interface SpeakingViewProps {
  id?: string;
}

interface SpeakingTopic {
  topic: string;
  questions: string[];
}

interface SpeakingTest {
  id: string;
  title: string;
  instructions: string | null;
  durationSeconds: number | null;
  part1: { intro: string; topics: SpeakingTopic[] };
  part2: { cueCardTitle: string; points: string[]; roundingOff: string[] };
  part3: { topics: SpeakingTopic[] };
}

type SpeakingPart = 'part1' | 'part2' | 'part3';

interface SpeakingResult {
  overallBand: number;
  fluencyScore: number;
  lexicalScore: number;
  grammarScore: number;
  pronunciationScore: number;
  fluencyFeedback: string;
  lexicalFeedback: string;
  grammarFeedback: string;
  pronunciationFeedback: string;
  generalSummary: string;
  keyImprovements: string[];
  transcript: { part1: string; part2: string; part3: string };
  saved?: boolean;
}

const PREP_SECONDS = 60;

function buildPart1Context(test: SpeakingTest): string {
  const topics = test.part1.topics.map((t) => `${t.topic}: ${t.questions.join(' ')}`).join('\n');
  return `${test.part1.intro}\n\n${topics}`;
}
function buildPart2Context(test: SpeakingTest): string {
  return `${test.part2.cueCardTitle}\nYou should say: ${test.part2.points.join('; ')}`;
}
function buildPart3Context(test: SpeakingTest): string {
  return test.part3.topics.map((t) => `${t.topic}: ${t.questions.join(' ')}`).join('\n');
}

const PartTabs: React.FC<{ part: SpeakingPart; onChange: (p: SpeakingPart) => void; recorded: Record<SpeakingPart, boolean> }> = ({
  part, onChange, recorded,
}) => (
  <div className="flex items-center gap-1 bg-[var(--bg-elevated)] p-1.5 rounded-xl border border-[var(--border)]">
    {(['part1', 'part2', 'part3'] as SpeakingPart[]).map((p) => (
      <button
        key={p}
        onClick={() => onChange(p)}
        className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
          part === p ? 'bg-[image:var(--accent-gradient)] text-white' : 'text-[var(--text-dim)] hover:text-[var(--text)]'
        }`}
      >
        {p === 'part1' ? 'Part 1' : p === 'part2' ? 'Part 2' : 'Part 3'}
        {recorded[p] && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--success)] border border-[var(--bg)]" />
        )}
      </button>
    ))}
  </div>
);

// Prefer opus/webm, fall back to whatever the browser actually supports (e.g. Safari's mp4/aac).
function pickMimeType(): string {
  if (typeof window === 'undefined' || typeof window.MediaRecorder === 'undefined') return '';
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
  for (const c of candidates) {
    if (window.MediaRecorder.isTypeSupported?.(c)) return c;
  }
  return '';
}

interface AudioRecorderProps {
  label: string;
  onChange: (dataUrl: string | null) => void;
  maxSeconds?: number;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ label, onChange, maxSeconds = 180 }) => {
  const [status, setStatus] = useState<'idle' | 'recording' | 'recorded' | 'error'>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanupStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => () => {
    if (tickRef.current) clearInterval(tickRef.current);
    cleanupStream();
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRecording = async () => {
    setError(null);
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setStatus('error');
      setError('Recording is not supported in this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = pickMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setStatus('recorded');
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') onChange(reader.result);
        };
        reader.readAsDataURL(blob);
        cleanupStream();
      };

      recorderRef.current = recorder;
      recorder.start();
      setStatus('recording');
      setElapsed(0);
      tickRef.current = setInterval(() => {
        setElapsed((s) => {
          if (s + 1 >= maxSeconds) {
            recorder.stop();
            if (tickRef.current) clearInterval(tickRef.current);
            return maxSeconds;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      setStatus('error');
      setError('Microphone access was denied or unavailable.');
    }
  };

  const stopRecording = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    recorderRef.current?.stop();
  };

  const reRecord = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setStatus('idle');
    setElapsed(0);
    onChange(null);
  };

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  return (
    <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-semibold uppercase text-[var(--text-faint)]">{label}</span>
        {status === 'recording' && (
          <span className="text-xs font-mono font-bold text-[var(--danger)] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--danger)] animate-pulse" /> {mm}:{ss}
          </span>
        )}
      </div>

      {status === 'idle' && (
        <Button variant="primary" size="sm" icon={<Mic size={14} />} onClick={startRecording}>
          Start recording
        </Button>
      )}

      {status === 'recording' && (
        <Button variant="secondary" size="sm" icon={<Square size={13} />} onClick={stopRecording}>
          Stop
        </Button>
      )}

      {status === 'recorded' && audioUrl && (
        <div className="space-y-2">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio src={audioUrl} controls className="w-full h-9" />
          <Button variant="ghost" size="sm" icon={<RotateCcw size={13} />} onClick={reRecord}>
            Re-record
          </Button>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-2">
          <p className="text-xs text-[var(--danger)]">{error}</p>
          <Button variant="secondary" size="sm" icon={<Mic size={14} />} onClick={startRecording}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
};

const CriterionCard: React.FC<{ label: string; score: number; feedback: string }> = ({ label, score, feedback }) => (
  <div className="p-2.5 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)]">
    <div className="flex justify-between items-center mb-1">
      <span className="text-[11px] font-mono text-[var(--text-faint)]">{label}</span>
      <span className="font-display font-bold text-xs text-[var(--text)]">{score.toFixed(1)}</span>
    </div>
    <p className="text-[11px] text-[var(--text-dim)] leading-tight">{feedback}</p>
  </div>
);

export const SpeakingView: React.FC<SpeakingViewProps> = ({ id }) => {
  const [browseTab, setBrowseTab] = useState<'tests' | 'tips'>('tests');
  const [selectedTipsSlug, setSelectedTipsSlug] = useState<string | null>(null);

  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [test, setTest] = useState<SpeakingTest | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [part, setPart] = useState<SpeakingPart>('part1');

  // Part 2 prep timer
  const [prepSecondsLeft, setPrepSecondsLeft] = useState(PREP_SECONDS);
  const [prepRunning, setPrepRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Recordings (data URLs) per part
  const [recordings, setRecordings] = useState<Record<SpeakingPart, string | null>>({
    part1: null, part2: null, part3: null,
  });

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<SpeakingResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const recordedMap: Record<SpeakingPart, boolean> = {
    part1: !!recordings.part1,
    part2: !!recordings.part2,
    part3: !!recordings.part3,
  };
  const anyRecorded = recordedMap.part1 || recordedMap.part2 || recordedMap.part3;

  useEffect(() => {
    if (!selectedTestId) return;
    let cancelled = false;
    setTest(null);
    setLoadError(null);
    fetch(`/api/speaking/test?id=${selectedTestId}`, { credentials: 'include' })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Could not load the speaking test.');
        if (!cancelled) setTest(data.test);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Could not load the speaking test.');
      });
    return () => {
      cancelled = true;
    };
  }, [selectedTestId]);

  useEffect(() => {
    if (!prepRunning) return;
    timerRef.current = setInterval(() => {
      setPrepSecondsLeft((s) => {
        if (s <= 1) {
          setPrepRunning(false);
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [prepRunning]);

  const resetPrep = () => {
    setPrepRunning(false);
    setPrepSecondsLeft(PREP_SECONDS);
  };

  const backToTests = () => {
    setSelectedTestId(null);
    setTest(null);
    setLoadError(null);
    setPart('part1');
    resetPrep();
    setRecordings({ part1: null, part2: null, part3: null });
    setResult(null);
    setErrorMessage(null);
    setNoticeMessage(null);
  };

  const handleEvaluate = async () => {
    if (!test || !anyRecorded) return;
    setIsEvaluating(true);
    setErrorMessage(null);
    setNoticeMessage(null);

    const payload = {
      testId: test.id,
      testTitle: test.title,
      part1: recordings.part1
        ? { audio: { base64: recordings.part1 }, contextText: buildPart1Context(test) }
        : undefined,
      part2: recordings.part2
        ? { audio: { base64: recordings.part2 }, contextText: buildPart2Context(test) }
        : undefined,
      part3: recordings.part3
        ? { audio: { base64: recordings.part3 }, contextText: buildPart3Context(test) }
        : undefined,
    };

    try {
      const res = await fetch('/api/speaking/evaluate', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server evaluation error');

      setResult(data);
      if (data.saved === false) {
        setNoticeMessage('Your test was evaluated but could NOT be saved to your history. Make sure you are logged in.');
      }
    } catch (err: unknown) {
      console.error('Speaking evaluation failed:', err);
      const message = err instanceof Error ? err.message : 'Evaluation failed. Please try again.';
      setErrorMessage(
        message.includes('GEMINI_API_KEY')
          ? 'AI scoring is not configured on this server yet.'
          : message,
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  // ---------- TAKE MODE ----------
  if (selectedTestId) {
    return (
      <div id={id} className="space-y-6">
        <GlassPanel className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <button
                onClick={backToTests}
                className="text-xs font-mono text-[var(--text-faint)] hover:text-[var(--accent-a)] flex items-center gap-1 mb-2 cursor-pointer"
              >
                ← Back to tests
              </button>
              <h2 className="font-display text-2xl font-bold text-[var(--text)]">
                {test ? test.title : 'IELTS Speaking Test'}
              </h2>
              <p className="text-sm text-[var(--text-dim)] mt-1 max-w-xl">
                {test?.instructions || 'Work through all three parts, recording your answer for each. Submit whenever you\'re ready for AI band feedback.'}
              </p>
            </div>
            {test && <PartTabs part={part} onChange={setPart} recorded={recordedMap} />}
          </div>
        </GlassPanel>

        {loadError && <GlassPanel className="p-6 text-sm text-[var(--danger)]">{loadError}</GlassPanel>}
        {!test && !loadError && <GlassPanel className="p-8 text-center text-sm text-[var(--text-dim)]">Loading test…</GlassPanel>}

        {test && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              {part === 'part1' && (
                <GlassPanel className="p-5 space-y-4">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase text-[var(--accent-a)]">
                    <Users size={14} /> Part 1 — Introduction &amp; Interview
                  </div>
                  <p className="text-base text-[var(--text)] leading-relaxed bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-4 italic">
                    {test.part1.intro}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {test.part1.topics.map((t, i) => (
                      <div key={i} className="p-4 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)] space-y-2.5">
                        <div className="text-sm font-mono font-semibold text-[var(--text)]">{t.topic}</div>
                        <ul className="space-y-2">
                          {t.questions.map((q, qi) => (
                            <li key={qi} className="text-sm text-[var(--text-dim)] leading-relaxed flex gap-2">
                              <span className="text-[var(--accent-a)]">•</span>
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <AudioRecorder
                    label="Your Part 1 response"
                    onChange={(dataUrl) => setRecordings((r) => ({ ...r, part1: dataUrl }))}
                    maxSeconds={240}
                  />

                  <div className="flex justify-end pt-1">
                    <Button variant="primary" size="md" icon={<ArrowRight size={16} />} onClick={() => setPart('part2')}>
                      Next: Part 2
                    </Button>
                  </div>
                </GlassPanel>
              )}

              {part === 'part2' && (
                <GlassPanel className="p-5 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase text-[var(--accent-a)]">
                      <Mic size={14} /> Part 2 — Individual Long Turn
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-sm font-bold ${prepSecondsLeft === 0 ? 'text-[var(--success)]' : 'text-[var(--text)]'}`}>
                        <Clock size={13} className="inline mr-1 -mt-0.5" />
                        {String(Math.floor(prepSecondsLeft / 60)).padStart(2, '0')}:{String(prepSecondsLeft % 60).padStart(2, '0')}
                      </span>
                      <Button variant="secondary" size="sm" onClick={() => setPrepRunning((r) => !r)} disabled={prepSecondsLeft === 0}>
                        {prepRunning ? 'Pause' : 'Start 1-min prep'}
                      </Button>
                      <Button variant="ghost" size="sm" icon={<RotateCcw size={13} />} onClick={resetPrep}>
                        Reset
                      </Button>
                    </div>
                  </div>

                  <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-5 space-y-4">
                    <p className="text-lg font-semibold text-[var(--text)] leading-relaxed">{test.part2.cueCardTitle}</p>
                    <div>
                      <span className="text-xs font-mono font-semibold text-[var(--text-faint)] uppercase tracking-wide">You should say:</span>
                      <ul className="mt-2 space-y-2">
                        {test.part2.points.map((p, i) => (
                          <li key={i} className="text-base text-[var(--text-dim)] leading-relaxed flex gap-2">
                            <span className="text-[var(--accent-a)]">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-faint)] italic">
                    You will have to talk about the topic for one to two minutes. You have one minute to think about what you are going to say.
                  </p>

                  {test.part2.roundingOff.length > 0 && (
                    <div className="p-4 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)]">
                      <span className="text-xs font-mono font-semibold text-[var(--text-faint)] uppercase tracking-wide">Rounding-off questions</span>
                      <ul className="mt-2 space-y-1.5">
                        {test.part2.roundingOff.map((q, i) => (
                          <li key={i} className="text-sm text-[var(--text-dim)] leading-relaxed flex gap-2">
                            <span className="text-[var(--accent-a)]">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <AudioRecorder
                    label="Your Part 2 long turn"
                    onChange={(dataUrl) => setRecordings((r) => ({ ...r, part2: dataUrl }))}
                    maxSeconds={150}
                  />

                  <div className="flex items-center justify-between pt-1">
                    <Button variant="secondary" size="md" onClick={() => setPart('part1')}>
                      ← Back to Part 1
                    </Button>
                    <Button variant="primary" size="md" icon={<ArrowRight size={16} />} onClick={() => setPart('part3')}>
                      Next: Part 3
                    </Button>
                  </div>
                </GlassPanel>
              )}

              {part === 'part3' && (
                <GlassPanel className="p-5 space-y-4">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase text-[var(--accent-a)]">
                    <MessageCircle size={14} /> Part 3 — Two-Way Discussion
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {test.part3.topics.map((t, i) => (
                      <div key={i} className="p-4 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)] space-y-2.5">
                        <div className="text-sm font-mono font-semibold text-[var(--text)]">{t.topic}</div>
                        <ul className="space-y-2">
                          {t.questions.map((q, qi) => (
                            <li key={qi} className="text-sm text-[var(--text-dim)] leading-relaxed flex gap-2">
                              <span className="text-[var(--accent-a)]">•</span>
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <AudioRecorder
                    label="Your Part 3 discussion"
                    onChange={(dataUrl) => setRecordings((r) => ({ ...r, part3: dataUrl }))}
                    maxSeconds={240}
                  />

                  {errorMessage && (
                    <div className="text-xs text-[var(--danger)] bg-[var(--danger)]/10 border border-[var(--danger)]/20 p-2.5 rounded-xl">{errorMessage}</div>
                  )}
                  {noticeMessage && (
                    <div className="text-xs text-[var(--warning)] bg-[var(--warning)]/10 border border-[var(--warning)]/20 p-2.5 rounded-xl">{noticeMessage}</div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <Button variant="secondary" size="md" onClick={() => setPart('part2')}>
                      ← Back to Part 2
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      icon={isEvaluating ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                      disabled={isEvaluating || !anyRecorded}
                      onClick={handleEvaluate}
                    >
                      {isEvaluating ? 'Evaluating…' : 'Submit for AI Scoring'}
                    </Button>
                  </div>
                </GlassPanel>
              )}

              <ProgressBar
                value={part === 'part1' ? 33 : part === 'part2' ? 66 : 100}
                showPercent={false}
                size="sm"
                label="Test progress"
              />
            </div>

            <div className="lg:col-span-5 space-y-4">
              {result ? (
                <GlassPanel className="p-6 space-y-5 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono uppercase text-[var(--text-faint)]">Overall Speaking Band</div>
                      <div className="font-display font-extrabold text-4xl text-[var(--text)] mt-1">Band {result.overallBand.toFixed(1)}</div>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center shadow-lg shadow-[var(--glow-a)]">
                      <Trophy size={28} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <CriterionCard label="Fluency & Coherence" score={result.fluencyScore} feedback={result.fluencyFeedback} />
                    <CriterionCard label="Lexical Resource" score={result.lexicalScore} feedback={result.lexicalFeedback} />
                    <CriterionCard label="Grammar" score={result.grammarScore} feedback={result.grammarFeedback} />
                    <CriterionCard label="Pronunciation" score={result.pronunciationScore} feedback={result.pronunciationFeedback} />
                  </div>

                  <div className="p-2.5 rounded-xl bg-[var(--panel-2)] border border-[var(--border)]">
                    <p className="text-[11px] text-[var(--text-dim)] leading-relaxed">{result.generalSummary}</p>
                  </div>

                  {result.keyImprovements?.length > 0 && (
                    <div className="space-y-1.5">
                      {result.keyImprovements.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-[var(--text-dim)]">
                          <CheckCircle2 size={13} className="text-[var(--success)] shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassPanel>
              ) : (
                <GlassPanel className="p-6 space-y-4">
                  <h3 className="font-display text-lg font-bold text-[var(--text)]">Your recordings</h3>
                  <div className="space-y-2">
                    {(['part1', 'part2', 'part3'] as SpeakingPart[]).map((p) => (
                      <div key={p} className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)]">
                        <span className="text-xs font-mono text-[var(--text)]">
                          {p === 'part1' ? 'Part 1' : p === 'part2' ? 'Part 2' : 'Part 3'}
                        </span>
                        {recordedMap[p] ? (
                          <span className="text-[11px] font-mono text-[var(--success)] flex items-center gap-1">
                            <CheckCircle2 size={13} /> Recorded
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono text-[var(--text-faint)]">Not recorded</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="p-8 text-center flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--panel-2)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-a)] mb-4">
                      <BookOpen size={28} />
                    </div>
                    <p className="text-xs text-[var(--text-dim)] max-w-xs leading-relaxed">
                      Record at least one part, then submit from Part 3 to get an AI band score across Fluency, Lexical Resource, Grammar and Pronunciation.
                    </p>
                  </div>
                </GlassPanel>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------- BROWSE MODE ----------
  return (
    <div id={id} className="space-y-6">
      <GlassPanel className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-mono mb-2">
              <Sparkles size={14} />
              <span>Speaking Practice</span>
            </div>

            <h2 className="font-display text-2xl font-bold text-[var(--text)]">
              Speaking Practice
            </h2>

            <p className="text-xs text-[var(--text-dim)] mt-1">
              {browseTab === 'tests'
                ? 'AI-examined speaking parts with band feedback across all four criteria.'
                : 'Learn the Speaking mindset, Part 1 extension, Part 2 cue cards, Part 3 reasoning, recovery, and pronunciation strategy needed to reach Band 9.'}
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
        <TestSelector
          skill="speaking"
          onSelect={(testId) => setSelectedTestId(testId)}
          emptyDescription="Speaking tests are being prepared. In the meantime, review the tips below to get ready."
        />
      ) : selectedTipsSlug ? (
        <SpeakingTipsReader
          slug={selectedTipsSlug}
          onNavigate={(slug) => setSelectedTipsSlug(slug)}
          onBack={() => setSelectedTipsSlug(null)}
        />
      ) : (
        <SpeakingTipsChapterList
          onSelectChapter={(slug) => setSelectedTipsSlug(slug)}
        />
      )}
    </div>
  );
};
