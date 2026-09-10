import React, { useEffect, useRef, useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { BackLink } from '../components/ui/BackLink';
import { ProgressBar } from '../components/ui/ProgressBar';
import { TestSelector } from '../components/practice/TestSelector';
import { SpeakingTipsChapterList } from '../components/practice/tips/speakingtipschapterlist';
import { SpeakingTipsReader } from '../components/practice/tips/speakingtipsreader';
import {
  Sparkles, Mic, Square, ArrowRight, Clock, MessageCircle, Users,
  Send, RefreshCw, Trophy, CheckCircle2, BookOpen, ChevronRight,
} from '../components/ui/icons';

interface SpeakingViewProps {
  id?: string;
  initialBrowseTab?: 'tests' | 'tips';
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
  saved?: boolean;
}

// ---------- Segment model ----------
// Each Part 1/3 sub-question and the Part 2 long turn is now its own
// separately-recorded segment, rather than one audio clip covering an
// entire part. This keeps each recording focused on one question (so the
// LLM doesn't have to guess which sentence answers which question) and
// keeps individual audio files short (faster/more reliable through
// VAD + pronunciation scoring on the backend).

type SegmentKind = 'intro' | 'topic' | 'part2';

interface RecordableSegment {
  kind: SegmentKind;
  id: string;
  partNumber: 1 | 2 | 3;
  partLabel: string;
  heading: string;
  questionText: string;
  displayQuestions?: string[]; // for bullet rendering when available
  durationSec: number;
  autoStart: boolean;
  advanceMode: 'auto' | 'manual-continue';
  prepSec?: number; // part2 only
}

interface InstructionSegment {
  kind: 'instruction';
  id: string;
  partLabel: string;
  heading: string;
  body: string;
}

type Segment = RecordableSegment | InstructionSegment;

function buildSegments(test: SpeakingTest): Segment[] {
  const segments: Segment[] = [];

  segments.push({
    kind: 'intro',
    id: 'p1_intro',
    partNumber: 1,
    partLabel: 'Part 1',
    heading: 'Introduction',
    questionText: test.part1.intro,
    durationSec: 30,
    autoStart: false,
    advanceMode: 'manual-continue',
  });

  segments.push({
    kind: 'instruction',
    id: 'p1_instructions',
    partLabel: 'Part 1',
    heading: 'Before you continue',
    body:
      'In the upcoming 3 cards you will see 1 question with multiple sub-questions each. ' +
      'You will have 1 minute to answer all. After 1 minute the cards will swipe to the next one. ' +
      'The timer and recorder will start running the moment the questions are shown.',
  });

  test.part1.topics.forEach((t, i) => {
    segments.push({
      kind: 'topic',
      id: `p1_topic${i + 1}`,
      partNumber: 1,
      partLabel: 'Part 1',
      heading: t.topic,
      questionText: `${t.topic}: ${t.questions.join(' ')}`,
      displayQuestions: t.questions,
      durationSec: 60,
      autoStart: true,
      advanceMode: 'auto',
    });
  });

  segments.push({
    kind: 'instruction',
    id: 'p2_instructions',
    partLabel: 'Part 2',
    heading: 'Before you continue',
    body:
      'You will have 1 minute to prepare, followed by up to 2 minutes to speak. ' +
      'Preparation time starts automatically as soon as you continue, and recording will ' +
      'begin automatically the moment preparation ends.',
  });

  segments.push({
    kind: 'part2',
    id: 'p2_main',
    partNumber: 2,
    partLabel: 'Part 2',
    heading: test.part2.cueCardTitle,
    questionText: `${test.part2.cueCardTitle}\nYou should say: ${test.part2.points.join('; ')}`,
    displayQuestions: test.part2.points,
    durationSec: 120,
    prepSec: 60,
    autoStart: true,
    advanceMode: 'manual-continue',
  });

  segments.push({
    kind: 'instruction',
    id: 'p3_instructions',
    partLabel: 'Part 3',
    heading: 'Before you continue',
    body:
      'You will now discuss 2 broader topics related to Part 2. Each card gives you 1.5 minutes ' +
      'to answer. The timer and recorder will start the moment each card is shown.',
  });

  test.part3.topics.forEach((t, i) => {
    segments.push({
      kind: 'topic',
      id: `p3_topic${i + 1}`,
      partNumber: 3,
      partLabel: 'Part 3',
      heading: t.topic,
      questionText: `${t.topic}: ${t.questions.join(' ')}`,
      displayQuestions: t.questions,
      durationSec: 90,
      autoStart: true,
      advanceMode: 'auto',
    });
  });

  return segments;
}

function isRecordable(s: Segment): s is RecordableSegment {
  return s.kind !== 'instruction';
}

// Prefer opus/webm, fall back to whatever the browser actually supports (e.g. Safari's mp4/aac).
function pickMimeType(): string {
  if (typeof window === 'undefined' || typeof window.MediaRecorder === 'undefined') return '';
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
  for (const c of candidates) {
    if (window.MediaRecorder.isTypeSupported?.(c)) return c;
  }
  return '';
}

function fmtClock(totalSec: number): string {
  const s = Math.max(0, Math.round(totalSec));
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

const CriterionCard: React.FC<{ label: string; score: number; feedback: string }> = ({ label, score, feedback }) => (
  <div className="p-2.5 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)]">
    <div className="flex justify-between items-center mb-1">
      <span className="text-[11px] font-mono text-[var(--text-faint)]">{label}</span>
      <span className="font-display font-bold text-xs text-[var(--text)]">{score.toFixed(1)}</span>
    </div>
    <p className="text-[11px] text-[var(--text-dim)] leading-tight">{feedback}</p>
  </div>
);

// ---------- Recorder ----------
// Handles mic capture for exactly one segment: idle (only when !autoStart) ->
// recording (countdown from durationSec, auto-stops at 0 or on manual
// finish) -> either immediately reports done (advanceMode 'auto') or shows
// a review player + Continue button (advanceMode 'manual-continue').

interface RecorderCardProps {
  segment: RecordableSegment;
  onRecorded: (dataUrl: string) => void;
  onAdvance: () => void;
}

const RecorderCard: React.FC<RecorderCardProps> = ({ segment, onRecorded, onAdvance }) => {
  const [status, setStatus] = useState<'idle' | 'recording' | 'recorded' | 'error'>('idle');
  const [remaining, setRemaining] = useState(segment.durationSec);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);

  const cleanupStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(
    () => () => {
      if (tickRef.current) clearInterval(tickRef.current);
      cleanupStream();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const finishRecording = (recorder: MediaRecorder) => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (recorder.state !== 'inactive') recorder.stop();
  };

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
        cleanupStream();

        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result !== 'string') return;
          onRecorded(reader.result);
          if (segment.advanceMode === 'auto') {
            onAdvance();
          } else {
            setAudioUrl(url);
            setStatus('recorded');
          }
        };
        reader.readAsDataURL(blob);
      };

      recorderRef.current = recorder;
      recorder.start();
      setStatus('recording');
      setRemaining(segment.durationSec);
      tickRef.current = setInterval(() => {
        setRemaining((s) => {
          if (s <= 1) {
            finishRecording(recorder);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } catch {
      setStatus('error');
      setError('Microphone access was denied or unavailable.');
    }
  };

  // Auto-start the moment this card mounts, for topic/part2 segments.
  useEffect(() => {
    if (segment.autoStart && !startedRef.current) {
      startedRef.current = true;
      startRecording();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const manualFinish = () => {
    if (recorderRef.current) finishRecording(recorderRef.current);
  };

  return (
    <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-semibold uppercase text-[var(--text-faint)]">Your response</span>
        {status === 'recording' && (
          <span className="text-sm font-mono font-bold text-[var(--danger)] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--danger)] animate-pulse" /> {fmtClock(remaining)}
          </span>
        )}
      </div>

      {status === 'idle' && (
        <Button variant="primary" size="sm" icon={<Mic size={14} />} onClick={startRecording}>
          Start recording
        </Button>
      )}

      {status === 'recording' && (
        <Button variant="secondary" size="sm" icon={<Square size={13} />} onClick={manualFinish}>
          {segment.advanceMode === 'auto' ? "I'm finished — Next" : 'Stop'}
        </Button>
      )}

      {status === 'recorded' && audioUrl && (
        <div className="space-y-3">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio src={audioUrl} controls className="w-full h-9" />
          <Button variant="primary" size="md" icon={<ArrowRight size={16} />} onClick={onAdvance}>
            Continue
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

// ---------- Part 2: prep countdown, then hands off to RecorderCard ----------

const Part2Card: React.FC<{
  segment: RecordableSegment;
  onRecorded: (dataUrl: string) => void;
  onAdvance: () => void;
}> = ({ segment, onRecorded, onAdvance }) => {
  const prepSec = segment.prepSec ?? 60;
  const [phase, setPhase] = useState<'prep' | 'record'>('prep');
  const [prepLeft, setPrepLeft] = useState(prepSec);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    tickRef.current = setInterval(() => {
      setPrepLeft((s) => {
        if (s <= 1) {
          if (tickRef.current) clearInterval(tickRef.current);
          setPhase('record');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  if (phase === 'prep') {
    const isFinalStretch = prepLeft <= 5;
    return (
      <div className="p-8 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] flex flex-col items-center justify-center gap-3 text-center">
        <span className="text-xs font-mono font-semibold uppercase text-[var(--text-faint)]">Preparation time</span>
        <span
          className={
            isFinalStretch
              ? 'font-display font-extrabold text-8xl text-[var(--danger)] animate-pulse tabular-nums'
              : 'font-display font-extrabold text-5xl text-[var(--text)] tabular-nums'
          }
        >
          {isFinalStretch ? prepLeft : fmtClock(prepLeft)}
        </span>
        <p className="text-xs text-[var(--text-dim)] max-w-xs">
          Recording will start automatically when preparation ends.
        </p>
      </div>
    );
  }

  return <RecorderCard segment={segment} onRecorded={onRecorded} onAdvance={onAdvance} />;
};

// ---------- Instruction interstitial ----------

const InstructionCard: React.FC<{ segment: InstructionSegment; onContinue: () => void }> = ({ segment, onContinue }) => (
  <GlassPanel className="p-6 space-y-5">
    <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase text-[var(--accent-a)]">
      <Sparkles size={14} /> {segment.partLabel}
    </div>
    <p className="text-base text-[var(--text)] leading-relaxed bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-5">
      {segment.body}
    </p>
    <div className="flex justify-end">
      <Button variant="primary" size="md" icon={<ChevronRight size={16} />} onClick={onContinue}>
        Continue
      </Button>
    </div>
  </GlassPanel>
);

export const SpeakingView: React.FC<SpeakingViewProps> = ({ id, initialBrowseTab }) => {
  const [browseTab, setBrowseTab] = useState<'tests' | 'tips'>(initialBrowseTab ?? 'tests');
  const [selectedTipsSlug, setSelectedTipsSlug] = useState<string | null>(null);

  // See ReadingExamView for why this effect is needed -- the sidebar
  // dropdown changes the prop without remounting this view. This is now
  // the only way to switch tabs -- the in-page switcher was removed.
  useEffect(() => {
    if (initialBrowseTab) {
      setBrowseTab(initialBrowseTab);
      if (initialBrowseTab === 'tests') setSelectedTipsSlug(null);
    }
  }, [initialBrowseTab]);

  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [test, setTest] = useState<SpeakingTest | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [segments, setSegments] = useState<Segment[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [recordings, setRecordings] = useState<Record<string, string | null>>({});

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<SpeakingResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedTestId) return;
    let cancelled = false;
    setTest(null);
    setLoadError(null);
    fetch(`/api/speaking/test?id=${selectedTestId}`, { credentials: 'include' })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Could not load the speaking test.');
        if (!cancelled) {
          setTest(data.test);
          setSegments(buildSegments(data.test));
          setStepIndex(0);
          setRecordings({});
        }
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Could not load the speaking test.');
      });
    return () => {
      cancelled = true;
    };
  }, [selectedTestId]);

  const backToTests = () => {
    setSelectedTestId(null);
    setTest(null);
    setLoadError(null);
    setSegments([]);
    setStepIndex(0);
    setRecordings({});
    setResult(null);
    setErrorMessage(null);
    setNoticeMessage(null);
  };

  const recordableSegments = segments.filter(isRecordable);
  const anyRecorded = recordableSegments.some((s) => !!recordings[s.id]);
  const onLastStep = stepIndex >= segments.length; // true once we're past the final segment -> submit screen

  const advance = () => setStepIndex((i) => i + 1);

  const handleEvaluate = async () => {
    if (!test || !anyRecorded) return;
    setIsEvaluating(true);
    setErrorMessage(null);
    setNoticeMessage(null);

    const payloadSegments = recordableSegments
      .filter((s) => !!recordings[s.id])
      .map((s) => ({
        id: s.id,
        partNumber: s.partNumber,
        label: s.heading,
        questionText: s.questionText,
        audio: { base64: recordings[s.id] as string },
      }));

    try {
      const res = await fetch('/api/speaking/evaluate', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId: test.id, testTitle: test.title, segments: payloadSegments }),
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
        /not configured|missing/i.test(message) && /key/i.test(message)
          ? 'AI scoring is not configured on this server yet.'
          : `Something went wrong scoring your test: ${message}`,
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  const currentSegment = segments[stepIndex];

  // ---------- TAKE MODE ----------
  if (selectedTestId) {
    return (
      <div id={id} className="space-y-6">
        <BackLink onClick={backToTests}>Back to tests</BackLink>
        <GlassPanel className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-[var(--text)]">
                {test ? test.title : 'IELTS Speaking Test'}
              </h2>
              <p className="text-sm text-[var(--text-dim)] mt-1 max-w-xl">
                {test?.instructions
                  || 'Each question is timed and recorded individually. Once a card\'s timer starts, keep speaking until it advances automatically.'}
              </p>
            </div>
            {currentSegment && !onLastStep && (
              <span className="text-xs font-mono font-semibold uppercase text-[var(--accent-a)] bg-[var(--accent-a)]/10 border border-[var(--accent-a)]/20 px-3 py-1.5 rounded-lg">
                {currentSegment.partLabel}
              </span>
            )}
          </div>
        </GlassPanel>

        {loadError && <GlassPanel className="p-6 text-sm text-[var(--danger)]">{loadError}</GlassPanel>}
        {!test && !loadError && <GlassPanel className="p-8 text-center text-sm text-[var(--text-dim)]">Loading test…</GlassPanel>}

        {test && segments.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              {!onLastStep && currentSegment.kind === 'instruction' && (
                <InstructionCard segment={currentSegment} onContinue={advance} />
              )}

              {!onLastStep && currentSegment.kind !== 'instruction' && (
                <GlassPanel className="p-5 space-y-4">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase text-[var(--accent-a)]">
                    {currentSegment.partNumber === 1 ? <Users size={14} /> : currentSegment.partNumber === 2 ? <Mic size={14} /> : <MessageCircle size={14} />}
                    {currentSegment.partLabel} — {currentSegment.heading}
                  </div>

                  {currentSegment.kind === 'intro' && (
                    <p className="text-base text-[var(--text)] leading-relaxed bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-4 italic">
                      {currentSegment.questionText}
                    </p>
                  )}

                  {(currentSegment.kind === 'topic' || currentSegment.kind === 'part2') && currentSegment.displayQuestions && (
                    <div className="p-4 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)]">
                      <ul className="space-y-2">
                        {currentSegment.displayQuestions.map((q, qi) => (
                          <li key={qi} className="text-base text-[var(--text-dim)] leading-relaxed flex gap-2">
                            <span className="text-[var(--accent-a)]">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentSegment.kind === 'part2' ? (
                    <Part2Card
                      key={currentSegment.id}
                      segment={currentSegment}
                      onRecorded={(dataUrl) => setRecordings((r) => ({ ...r, [currentSegment.id]: dataUrl }))}
                      onAdvance={advance}
                    />
                  ) : (
                    <RecorderCard
                      key={currentSegment.id}
                      segment={currentSegment}
                      onRecorded={(dataUrl) => setRecordings((r) => ({ ...r, [currentSegment.id]: dataUrl }))}
                      onAdvance={advance}
                    />
                  )}
                </GlassPanel>
              )}

              {onLastStep && (
                <GlassPanel className="p-5 space-y-4">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase text-[var(--accent-a)]">
                    <Trophy size={14} /> Ready to submit
                  </div>
                  <p className="text-sm text-[var(--text-dim)]">
                    You've reached the end of the test. Review what was recorded below, then submit for AI scoring.
                  </p>

                  {errorMessage && (
                    <div className="text-xs text-[var(--danger)] bg-[var(--danger)]/10 border border-[var(--danger)]/20 p-2.5 rounded-xl">{errorMessage}</div>
                  )}
                  {noticeMessage && (
                    <div className="text-xs text-[var(--warning)] bg-[var(--warning)]/10 border border-[var(--warning)]/20 p-2.5 rounded-xl">{noticeMessage}</div>
                  )}

                  <div className="flex justify-end pt-1">
                    <Button
                      variant="primary"
                      size="md"
                      icon={isEvaluating ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                      disabled={isEvaluating || !anyRecorded}
                      onClick={handleEvaluate}
                    >
                      {isEvaluating ? 'Evaluating… this can take a few minutes' : 'Submit for AI Scoring'}
                    </Button>
                  </div>
                </GlassPanel>
              )}

              <ProgressBar
                value={(Math.min(stepIndex, segments.length) / segments.length) * 100}
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
                    {recordableSegments.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)]">
                        <span className="text-xs font-mono text-[var(--text)]">{s.partLabel} — {s.heading}</span>
                        {recordings[s.id] ? (
                          <span className="text-[11px] font-mono text-[var(--success)] flex items-center gap-1">
                            <CheckCircle2 size={13} /> Recorded
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono text-[var(--text-faint)]">Not yet</span>
                        )}
                      </div>
                    ))}
                  </div>
                  {isEvaluating && (
                    <div className="p-4 rounded-xl bg-[var(--accent-a)]/10 border border-[var(--accent-a)]/20 text-center">
                      <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-[var(--accent-a)]" />
                      <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                        Scoring your test — checking pronunciation, fluency and grammar. This can take a few minutes, please don't close this page.
                      </p>
                    </div>
                  )}
                  {!isEvaluating && (
                    <div className="p-8 text-center flex flex-col items-center justify-center">
                      <div className="w-14 h-14 rounded-2xl bg-[var(--panel-2)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-a)] mb-4">
                        <BookOpen size={28} />
                      </div>
                      <p className="text-xs text-[var(--text-dim)] max-w-xs leading-relaxed">
                        Work through each card — timers and recording run automatically for most questions. Submit at the end for an AI band score across Fluency, Lexical Resource, Grammar and Pronunciation.
                      </p>
                    </div>
                  )}
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
