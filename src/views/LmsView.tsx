import React, { useCallback, useEffect, useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import {
  GraduationCap,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
} from '../components/ui/icons';

interface LmsViewProps {
  initialTab?: string;
  id?: string;
}

type ChapterSummary = {
  id: string;
  slug: string;
  title: string;
  position: number;
  estimatedMin: number | null;
  difficulty: number | null;
  bandTarget: string | null;
  summary: string | null;
  status: string;
};

type GrammarModule = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  bandUnlock: string | null;
  description: string | null;
  position: number;
  chapters: ChapterSummary[];
};

type ContentBlock = {
  id: string;
  type: string;
  level?: number;
  text?: string;
  title?: string;
  body?: string;
  variant?: string;
  headers?: string[];
  rows?: string[][];
  incorrect?: string;
  correct?: string;
  why?: string;
  skills?: string[];
  examples?: Record<string, string>;
  error_types?: Array<{ label: string; incorrect: string; correct: string }>;
  exercise_slug?: string;
  label?: string;
};

type ChapterDetail = {
  id: string;
  slug: string;
  title: string;
  estimatedMin: number | null;
  bandTarget: string | null;
  summary: string | null;
  content: { version: number; blocks: ContentBlock[] };
  status: string;
  module: { id: string; slug: string; title: string };
  exercises: Array<{
    id: string;
    slug: string;
    title: string;
    kind: string;
    instructions: string | null;
    position: number;
  }>;
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
};

type ExerciseItem = {
  id: string;
  prompt: string;
  options?: unknown;
};

type ExerciseDetail = {
  id: string;
  slug: string;
  title: string;
  kind: string;
  instructions: string | null;
  itemCount: number;
  items: ExerciseItem[];
  chapter: { id: string; slug: string; title: string };
  lastAttempt: { id: string; score: number | null; max_score: number | null } | null;
};

type AttemptFeedback = {
  id: string;
  correct: boolean;
  yourAnswer: string;
  expected: string | null;
  reason: string | null;
  bnNote: string | null;
};

function BlockRenderer({
  block,
  onStartExercise,
}: {
  block: ContentBlock;
  onStartExercise: (slug: string) => void;
}) {
  switch (block.type) {
    case 'heading': {
      const isH3 = block.level === 3;
      return isH3 ? (
        <h3 className="font-display text-base font-bold text-[var(--text)] mt-6 mb-2">
          {block.text}
        </h3>
      ) : (
        <h2 className="font-display text-xl font-bold text-[var(--text)] mt-8 mb-3">
          {block.text}
        </h2>
      );
    }
    case 'paragraph':
      return (
        <p className="text-sm text-[var(--text-dim)] leading-relaxed mb-3">{block.text}</p>
      );
    case 'table':
      return (
        <div className="overflow-x-auto mb-4 rounded-lg border border-[var(--border)]">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[var(--panel-2)]">
                {(block.headers ?? []).map((h, i) => (
                  <th
                    key={i}
                    className="text-left px-3 py-2 font-mono font-semibold text-[var(--text)] border-b border-[var(--border)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(block.rows ?? []).map((row, ri) => (
                <tr key={ri} className="border-b border-[var(--border)]/50 last:border-0">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 text-[var(--text-dim)]">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'callout':
      return (
        <div className="mb-4 p-4 rounded-xl border border-[var(--accent-a)]/30 bg-[var(--accent-a)]/8">
          {block.title && (
            <div className="text-[11px] font-mono font-semibold uppercase text-[var(--accent-a)] mb-1.5 tracking-wide">
              {block.title}
            </div>
          )}
          <p className="text-sm text-[var(--text)] leading-relaxed">{block.text}</p>
        </div>
      );
    case 'example_pair':
      return (
        <div className="mb-4 space-y-1.5 p-3 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)]">
          <div className="text-xs text-red-400/90">
            <span className="font-mono font-semibold mr-1.5">X</span>
            {block.incorrect}
          </div>
          <div className="text-xs text-emerald-400/90">
            <span className="font-mono font-semibold mr-1.5">OK</span>
            {block.correct}
          </div>
          {block.why && (
            <div className="text-[11px] text-[var(--text-faint)] pt-1 border-t border-[var(--border)]/50">
              Why: {block.why}
            </div>
          )}
        </div>
      );
    case 'l1_error_fixer':
      return (
        <div className="mb-4 p-4 rounded-xl border border-amber-500/30 bg-amber-500/8 space-y-3">
          <div className="text-[11px] font-mono font-semibold uppercase text-amber-400 tracking-wide">
            L1 Error Fixer · {block.title}
          </div>
          <p className="text-sm text-[var(--text)] leading-relaxed">{block.body}</p>
          {(block.error_types ?? []).map((et, i) => (
            <div key={i} className="text-xs space-y-1 pl-3 border-l-2 border-amber-500/40">
              <div className="font-semibold text-[var(--text)]">{et.label}</div>
              <div className="text-red-400/80">X {et.incorrect}</div>
              <div className="text-emerald-400/80">OK {et.correct}</div>
            </div>
          ))}
        </div>
      );
    case 'ielts_impact':
      return (
        <div className="mb-4 p-4 rounded-xl border border-[var(--accent-a)]/25 bg-[var(--panel-2)]/80 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono font-semibold uppercase text-[var(--accent-a)] tracking-wide">
              IELTS Impact
            </span>
            {(block.skills ?? []).map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[10px] uppercase"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="font-display font-bold text-[var(--text)] text-sm">{block.title}</div>
          <p className="text-sm text-[var(--text-dim)] leading-relaxed">{block.body}</p>
          {block.examples && (
            <div className="space-y-1.5 pt-1">
              {Object.entries(block.examples).map(([k, v]) => (
                <div key={k} className="text-xs text-[var(--text-dim)]">
                  <span className="font-mono text-[var(--accent-a)] uppercase mr-1.5">{k}:</span>
                  <span className="italic">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    case 'exercise_ref':
      // Listed once in the chapter Exercises panel — skip inline duplicates.
      return null;
    default:
      return null;
  }
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: 'bg-emerald-500/15 text-emerald-400',
    in_progress: 'bg-amber-500/15 text-amber-400',
    not_started: 'bg-[var(--panel-2)] text-[var(--text-faint)]',
  };
  const label: Record<string, string> = {
    completed: 'Completed',
    in_progress: 'In progress',
    not_started: 'Not started',
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold uppercase ${map[status] ?? map.not_started}`}
    >
      {label[status] ?? status}
    </span>
  );
}

export const LmsView: React.FC<LmsViewProps> = ({ initialTab = 'grammar', id }) => {
  const [activeTab, setActiveTab] = useState<'grammar' | 'vocab'>(
    initialTab.includes('vocab') ? 'vocab' : 'grammar',
  );

  const [modules, setModules] = useState<GrammarModule[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);
  const [modulesError, setModulesError] = useState<string | null>(null);

  // Drill-down: modules list → module chapters → chapter content → exercise
  const [selectedModule, setSelectedModule] = useState<GrammarModule | null>(null);
  const [chapter, setChapter] = useState<ChapterDetail | null>(null);
  const [loadingChapter, setLoadingChapter] = useState(false);

  const [exercise, setExercise] = useState<ExerciseDetail | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    maxScore: number;
    items: AttemptFeedback[];
  } | null>(null);

  useEffect(() => {
    const next = initialTab.includes('vocab') ? 'vocab' : 'grammar';
    setActiveTab(next);
    // Reset drill-down when switching LMS tabs via sidebar
    setSelectedModule(null);
    setChapter(null);
    setExercise(null);
    setFeedback(null);
  }, [initialTab]);

  useEffect(() => {
    if (activeTab !== 'grammar') return;
    let cancelled = false;
    (async () => {
      setLoadingModules(true);
      setModulesError(null);
      try {
        const res = await fetch('/api/grammar/modules');
        if (!res.ok) throw new Error('Failed to load grammar modules');
        const data = await res.json();
        if (!cancelled) setModules(data.modules ?? []);
      } catch (e) {
        if (!cancelled) setModulesError(e instanceof Error ? e.message : 'Load failed');
      } finally {
        if (!cancelled) setLoadingModules(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const scrollMainToTop = useCallback(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTo({ top: 0, behavior: 'auto' });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const openChapter = useCallback(async (slug: string) => {
    setLoadingChapter(true);
    setExercise(null);
    setFeedback(null);
    scrollMainToTop();
    try {
      const res = await fetch(`/api/grammar/chapters/${slug}`);
      if (!res.ok) throw new Error('Chapter not found');
      const data = await res.json();
      setChapter(data.chapter);
      scrollMainToTop();
      fetch(`/api/grammar/chapters/${slug}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'in_progress' }),
      }).catch(() => {});
    } catch {
      setChapter(null);
    } finally {
      setLoadingChapter(false);
    }
  }, [scrollMainToTop]);

  const startExercise = useCallback(
    async (exerciseSlug: string) => {
      if (!chapter) return;
      const meta = chapter.exercises.find((e) => e.slug === exerciseSlug);
      if (!meta) return;
      setFeedback(null);
      setAnswers({});
      scrollMainToTop();
      try {
        const res = await fetch(`/api/grammar/exercises/${meta.id}`);
        if (!res.ok) throw new Error('Exercise not found');
        const data = await res.json();
        setExercise(data.exercise);
        scrollMainToTop();
      } catch {
        setExercise(null);
      }
    },
    [chapter, scrollMainToTop],
  );

  const submitExercise = useCallback(async () => {
    if (!exercise) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/grammar/exercises/${exercise.id}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      if (res.status === 401) {
        alert('Please log in to submit exercises and track your score.');
        return;
      }
      if (!res.ok) throw new Error('Submit failed');
      const data = await res.json();
      setFeedback({
        score: data.attempt.score,
        maxScore: data.attempt.maxScore,
        items: data.attempt.feedback,
      });
    } catch {
      alert('Could not submit. Try again.');
    } finally {
      setSubmitting(false);
    }
  }, [exercise, answers]);

  const markComplete = useCallback(async () => {
    if (!chapter) return;
    await fetch(`/api/grammar/chapters/${chapter.slug}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    }).catch(() => {});
    setChapter((c) => (c ? { ...c, status: 'completed' } : c));
    setModules((prev) =>
      prev.map((m) => ({
        ...m,
        chapters: m.chapters.map((ch) =>
          ch.slug === chapter.slug ? { ...ch, status: 'completed' } : ch,
        ),
      })),
    );
  }, [chapter]);

  const vocabCategories = [
    {
      category: 'Topic: Environment & Sustainability',
      bandScore: 'Band 8.0 Level',
      words: [
        { word: 'Mitigate', POS: 'verb', def: 'Make less severe or serious.', collocation: 'mitigate climate risks' },
        { word: 'Precipitous', POS: 'adj', def: 'Dangerously high or steep / sudden.', collocation: 'precipitous decline in biodiversity' },
        { word: 'Detrimental', POS: 'adj', def: 'Tending to cause harm.', collocation: 'detrimental impacts on ecosystem' },
      ],
    },
    {
      category: 'Topic: Education & Technology',
      bandScore: 'Band 8.0 Level',
      words: [
        { word: 'Ubiquitous', POS: 'adj', def: 'Present, appearing, or found everywhere.', collocation: 'ubiquitous smartphone adoption' },
        { word: 'Impediment', POS: 'noun', def: 'A hindrance or obstruction in doing something.', collocation: 'major impediment to learning' },
        { word: 'Foster', POS: 'verb', def: 'Encourage or promote the development of.', collocation: 'foster critical thinking skills' },
      ],
    },
  ];

  if (exercise) {
    return (
      <div id={id} className="space-y-6 w-full">
        <button
          type="button"
          onClick={() => {
            setExercise(null);
            setFeedback(null);
            scrollMainToTop();
          }}
          className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-faint)] hover:text-[var(--accent-a)] transition-colors"
        >
          <ChevronLeft size={14} />
          Back to chapter
        </button>

        <GlassPanel className="p-6 border border-[var(--border)] space-y-4">
          <div>
            <div className="text-[11px] font-mono uppercase text-[var(--accent-a)] mb-1">
              {exercise.kind}
            </div>
            <h2 className="font-display text-xl font-bold text-[var(--text)]">{exercise.title}</h2>
            {exercise.instructions && (
              <p className="text-sm text-[var(--text-dim)] mt-2">{exercise.instructions}</p>
            )}
          </div>

          {!feedback ? (
            <>
              <div className="space-y-4">
                {exercise.items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)] space-y-2"
                  >
                    <div className="text-[11px] font-mono text-[var(--text-faint)]">
                      Question {idx + 1}
                    </div>
                    <p className="text-sm text-[var(--text)]">{item.prompt}</p>
                    <textarea
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)]/50 min-h-[60px] resize-y"
                      placeholder="Rewrite the sentence correctly (or type Correct)..."
                      value={answers[item.id] ?? ''}
                      onChange={(e) =>
                        setAnswers((prev) => ({ ...prev, [item.id]: e.target.value }))
                      }
                    />
                  </div>
                ))}
              </div>
              <Button
                variant="primary"
                size="sm"
                className="w-full sm:w-auto"
                disabled={submitting}
                onClick={submitExercise}
              >
                {submitting ? 'Scoring...' : 'Submit answers'}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--accent-a)]/10 border border-[var(--accent-a)]/25">
                <CheckCircle2 size={22} className="text-[var(--accent-a)]" />
                <div>
                  <div className="font-display font-bold text-[var(--text)]">
                    Score: {feedback.score} / {feedback.maxScore}
                  </div>
                  <div className="text-xs text-[var(--text-dim)]">
                    {Math.round((feedback.score / Math.max(feedback.maxScore, 1)) * 100)}% correct
                  </div>
                </div>
              </div>
              {feedback.items.map((fb, idx) => (
                <div
                  key={fb.id}
                  className={`p-4 rounded-xl border space-y-1.5 ${
                    fb.correct
                      ? 'border-emerald-500/30 bg-emerald-500/8'
                      : 'border-red-500/30 bg-red-500/8'
                  }`}
                >
                  <div className="text-[11px] font-mono text-[var(--text-faint)]">
                    Q{idx + 1} · {fb.correct ? 'Correct' : 'Incorrect'}
                  </div>
                  <div className="text-xs text-[var(--text-dim)]">
                    Your answer:{' '}
                    <span className="text-[var(--text)]">{fb.yourAnswer || '(empty)'}</span>
                  </div>
                  {!fb.correct && fb.expected && (
                    <div className="text-xs text-emerald-400/90">Expected: {fb.expected}</div>
                  )}
                  {fb.reason && (
                    <div className="text-[11px] text-[var(--text-faint)] pt-1">{fb.reason}</div>
                  )}
                </div>
              ))}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setFeedback(null);
                    setAnswers({});
                  }}
                >
                  Try again
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setExercise(null);
                    setFeedback(null);
                  }}
                >
                  Back to chapter
                </Button>
              </div>
            </div>
          )}
        </GlassPanel>
      </div>
    );
  }

  if (chapter || loadingChapter) {
    return (
      <div id={id} className="space-y-6 w-full">
        <button
          type="button"
          onClick={() => {
            setChapter(null);
            scrollMainToTop();
          }}
          className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-faint)] hover:text-[var(--accent-a)] transition-colors"
        >
          <ChevronLeft size={14} />
          Back to chapters
        </button>

        {loadingChapter && (
          <div className="text-sm text-[var(--text-dim)] font-mono py-12 text-center">
            Loading chapter...
          </div>
        )}

        {chapter && (
          <>
            <GlassPanel className="p-6 md:p-8 border border-[var(--border)]">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-[11px] font-mono uppercase text-[var(--accent-a)]">
                  {chapter.module.title}
                </span>
                {chapter.bandTarget && (
                  <span className="px-2 py-0.5 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[10px] font-semibold">
                    {chapter.bandTarget}
                  </span>
                )}
                <StatusChip status={chapter.status} />
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--text)]">
                {chapter.title}
              </h1>
              {chapter.summary && (
                <p className="text-sm text-[var(--text-dim)] mt-2">{chapter.summary}</p>
              )}
              {chapter.estimatedMin && (
                <div className="text-[11px] font-mono text-[var(--text-faint)] mt-2">
                  ~{chapter.estimatedMin} min read
                </div>
              )}
            </GlassPanel>

            <GlassPanel className="p-6 md:p-8 border border-[var(--border)]">
              {(chapter.content?.blocks ?? []).map((block) => (
                <BlockRenderer
                  key={block.id}
                  block={block}
                  onStartExercise={startExercise}
                />
              ))}
            </GlassPanel>

            {chapter.exercises.length > 0 && (
              <GlassPanel className="p-6 border border-[var(--border)] space-y-3">
                <h3 className="font-display font-bold text-[var(--text)]">Exercises</h3>
                {chapter.exercises.map((ex) => (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => startExercise(ex.slug)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)] hover:border-[var(--accent-a)]/40 transition-colors text-left"
                  >
                    <div>
                      <div className="text-sm font-semibold text-[var(--text)]">{ex.title}</div>
                      <div className="text-[11px] font-mono text-[var(--text-faint)] capitalize">
                        {ex.kind}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-[var(--text-faint)]" />
                  </button>
                ))}
              </GlassPanel>
            )}

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex gap-2">
                {chapter.prev && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openChapter(chapter.prev!.slug)}
                  >
                    <ChevronLeft size={14} /> Prev
                  </Button>
                )}
                {chapter.next && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openChapter(chapter.next!.slug)}
                  >
                    Next <ChevronRight size={14} />
                  </Button>
                )}
              </div>
              {chapter.status !== 'completed' && (
                <Button variant="primary" size="sm" onClick={markComplete}>
                  Mark complete
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div id={id} className="space-y-6">
      <GlassPanel className="p-6 md:p-8 relative overflow-hidden border border-[var(--border)]">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[var(--accent-a)] tracking-wider mb-2">
            <GraduationCap size={18} />
            <span>LMS · Learning Management System</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--text)]">
            {activeTab === 'grammar' ? 'Grammar Masterclass' : 'IELTS Vocabulary Bank'}
          </h1>
          <p className="text-sm text-[var(--text-dim)] mt-1 max-w-2xl">
            {activeTab === 'grammar'
              ? 'Curated grammar rules designed specifically to elevate your Grammatical Range & Accuracy score.'
              : 'Band 8.0+ vocabulary banks organized by topic, with collocations examiners look for.'}
          </p>
        </div>
      </GlassPanel>

      {activeTab === 'grammar' && (
        <div className="space-y-6">
          {loadingModules && (
            <div className="text-sm text-[var(--text-dim)] font-mono py-8 text-center">
              Loading modules...
            </div>
          )}
          {modulesError && (
            <GlassPanel className="p-4 border border-red-500/30 text-sm text-red-400">
              {modulesError}
            </GlassPanel>
          )}
          {!loadingModules && !modulesError && modules.length === 0 && (
            <GlassPanel className="p-6 border border-[var(--border)] text-sm text-[var(--text-dim)]">
              No grammar modules published yet. Run the seed migration if you have not already.
            </GlassPanel>
          )}

          {/* Level 2: chapters inside a selected module */}
          {!loadingModules && selectedModule && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedModule(null);
                  scrollMainToTop();
                }}
                className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-faint)] hover:text-[var(--accent-a)] transition-colors"
              >
                <ChevronLeft size={14} />
                All modules
              </button>

              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="font-display text-xl font-bold text-[var(--text)]">
                    {selectedModule.title}
                  </h2>
                  {selectedModule.subtitle && (
                    <p className="text-sm text-[var(--text-dim)] mt-1">{selectedModule.subtitle}</p>
                  )}
                </div>
                {selectedModule.bandUnlock && (
                  <span className="px-2.5 py-1 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[11px] font-semibold">
                    {selectedModule.bandUnlock}
                  </span>
                )}
              </div>
              {selectedModule.description && (
                <p className="text-sm text-[var(--text-faint)] max-w-3xl">
                  {selectedModule.description}
                </p>
              )}

              {selectedModule.chapters.length === 0 ? (
                <GlassPanel className="p-6 border border-[var(--border)] text-sm text-[var(--text-dim)]">
                  No chapters published in this module yet.
                </GlassPanel>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedModule.chapters.map((ch) => (
                    <GlassPanel
                      key={ch.id}
                      className="p-5 flex flex-col justify-between border border-[var(--border)] hover:border-[var(--accent-a)]/40 transition-colors cursor-pointer"
                      onClick={() => openChapter(ch.slug)}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3 gap-2">
                          {ch.bandTarget ? (
                            <span className="px-2.5 py-1 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[11px] font-semibold">
                              {ch.bandTarget}
                            </span>
                          ) : (
                            <span />
                          )}
                          <StatusChip status={ch.status} />
                        </div>
                        <h3 className="font-display text-base font-bold text-[var(--text)] mb-2">
                          {ch.title}
                        </h3>
                        {ch.summary && (
                          <p className="text-xs text-[var(--text-dim)] mb-3 line-clamp-3">
                            {ch.summary}
                          </p>
                        )}
                        {ch.estimatedMin && (
                          <div className="text-[11px] font-mono text-[var(--text-faint)] mb-3">
                            ~{ch.estimatedMin} min
                          </div>
                        )}
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full flex items-center justify-center gap-1.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          openChapter(ch.slug);
                        }}
                      >
                        <span>Open chapter</span>
                        <ChevronRight size={16} />
                      </Button>
                    </GlassPanel>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Level 1: module cards */}
          {!loadingModules && !selectedModule && modules.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {modules.map((mod) => {
                const total = mod.chapters.length;
                const done = mod.chapters.filter((c) => c.status === 'completed').length;
                return (
                  <GlassPanel
                    key={mod.id}
                    className="p-6 flex flex-col justify-between border border-[var(--border)] hover:border-[var(--accent-a)]/40 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedModule(mod);
                      scrollMainToTop();
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3 gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-[var(--panel-2)] text-[var(--text-faint)] font-mono text-[11px] font-semibold">
                          Module {mod.position}
                        </span>
                        {mod.bandUnlock && (
                          <span className="px-2.5 py-1 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[11px] font-semibold">
                            {mod.bandUnlock}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-lg font-bold text-[var(--text)] mb-1">
                        {mod.title}
                      </h3>
                      {mod.subtitle && (
                        <p className="text-xs text-[var(--text-dim)] mb-3">{mod.subtitle}</p>
                      )}
                      {mod.description && (
                        <p className="text-xs text-[var(--text-faint)] mb-4 line-clamp-3">
                          {mod.description}
                        </p>
                      )}
                      <div className="text-[11px] font-mono text-[var(--text-faint)] mb-4">
                        {total} chapter{total === 1 ? '' : 's'}
                        {total > 0 && ` · ${done}/${total} completed`}
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full flex items-center justify-center gap-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedModule(mod);
                        scrollMainToTop();
                      }}
                    >
                      <span>View chapters</span>
                      <ChevronRight size={16} />
                    </Button>
                  </GlassPanel>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'vocab' && (
        <div className="space-y-6">
          {vocabCategories.map((cat, catIdx) => (
            <GlassPanel key={catIdx} className="p-6 border border-[var(--border)]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
                <h3 className="font-display text-lg font-bold text-[var(--text)] flex items-center gap-2">
                  <BookOpen size={18} className="text-[var(--accent-a)]" />
                  <span>{cat.category}</span>
                </h3>
                <span className="px-2.5 py-1 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[11px] font-semibold">
                  {cat.bandScore}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cat.words.map((w, wIdx) => (
                  <div
                    key={wIdx}
                    className="p-4 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)] space-y-2"
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="font-display font-bold text-base text-[var(--text)]">
                        {w.word}
                      </span>
                      <span className="text-[11px] font-mono text-[var(--text-faint)] italic">
                        {w.POS}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-dim)]">{w.def}</p>
                    <div className="pt-2 border-t border-[var(--border)]/60 text-[11px] font-mono text-[var(--accent-a)]">
                      Collocation: &quot;{w.collocation}&quot;
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  );
};
