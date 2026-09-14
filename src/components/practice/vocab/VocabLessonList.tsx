'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '../../ui/Button';
import { GlassPanel } from '../../ui/GlassPanel';
import { Clock, X, ArrowRight, PenTool, Bookmark, List, LayoutGrid, Grid3x3 } from '../../ui/icons';
import { LessonMarkdown } from '../tips/LessonMarkdown';
import { useSavedLessons } from '../tips/useSavedLessons';

interface Collection {
  slug: string;
  label: string;
}

interface VocabLesson {
  id: string;
  slug: string;
  title: string;
  sourceLabel: string | null;
  collection: Collection | null;
  bite: string;
  detailMd: string;
  estimatedMin: number | null;
  chapterNumber: number;
  anchorBlockId: string | null;
  exerciseAnchorBlockId: string | null;
}

// Zero to Band 9's own collection palette -- kept separate from Tips'
// and Grammar's COLLECTION_COLOR maps since all three are different
// taxonomies, same rule those two already follow.
const COLLECTION_COLOR: Record<string, string> = {
  'l1-error-fixing': 'var(--accent-a)',
  'lexical-upgrade': 'var(--accent-c)',
  'grammar-cohesion': 'var(--warning)',
  'topic-vocabulary': 'var(--success)',
  'idioms-register': 'var(--accent-d)',
  'exam-practice': 'var(--danger)',
};

const COLLECTION_ORDER = [
  'l1-error-fixing',
  'lexical-upgrade',
  'grammar-cohesion',
  'topic-vocabulary',
  'idioms-register',
  'exam-practice',
];

function collectionColor(slug: string): string {
  return COLLECTION_COLOR[slug] ?? 'var(--text-faint)';
}

type LessonLayout = 'list' | 'grid2' | 'grid3';
const LAYOUT_STORAGE_KEY = 'nexted:vocab-lesson-layout';
const LAYOUT_OPTIONS: { value: LessonLayout; label: string; icon: typeof List }[] = [
  { value: 'list', label: 'List view', icon: List },
  { value: 'grid2', label: '2 per row', icon: LayoutGrid },
  { value: 'grid3', label: '3 per row', icon: Grid3x3 },
];

function gridClassName(layout: LessonLayout): string {
  if (layout === 'list') return 'flex flex-col gap-3';
  if (layout === 'grid2') return 'grid grid-cols-1 sm:grid-cols-2 gap-3';
  return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3';
}

const LessonLayoutSwitcher: React.FC<{ layout: LessonLayout; onChange: (l: LessonLayout) => void }> = ({
  layout,
  onChange,
}) => (
  <div className="inline-flex items-center gap-0.5 p-1 rounded-full bg-[var(--panel-2)] border border-[var(--border)] shrink-0">
    {LAYOUT_OPTIONS.map(({ value, label, icon: Icon }) => (
      <button
        key={value}
        type="button"
        onClick={() => onChange(value)}
        aria-label={label}
        aria-pressed={layout === value}
        title={label}
        className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
          layout === value
            ? 'bg-[var(--text)] text-[var(--bg)]'
            : 'text-[var(--text-faint)] hover:text-[var(--text)] hover:bg-[var(--bg)]'
        }`}
      >
        <Icon size={14} />
      </button>
    ))}
  </div>
);

// One lesson card -- compact row (list) or tile (2/3-up grid), same
// staggered load-in as the Tips/Grammar bite cards.
const LessonCard: React.FC<{
  lesson: VocabLesson;
  layout: LessonLayout;
  index: number;
  isSaved: boolean;
  onOpen: () => void;
}> = ({ lesson, layout, index, isSaved, onOpen }) => {
  const color = lesson.collection ? collectionColor(lesson.collection.slug) : null;
  const style = { animationDelay: `${Math.min(index, 14) * 35}ms` };

  if (layout === 'list') {
    return (
      <button
        onClick={onOpen}
        style={style}
        className="animate-tileDropIn relative w-full flex items-center gap-4 text-left overflow-hidden rounded-2xl shadow-lg pl-5 pr-4 py-4 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-xl group cursor-pointer bg-[var(--panel-2)] border border-[var(--border)]"
      >
        {color && <span className="absolute left-0 top-0 bottom-0 w-1 z-10" style={{ backgroundColor: color }} />}
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-[var(--text)] truncate">
            {lesson.title}
          </h4>
          <p className="text-xs text-[var(--text-dim)] mt-1 leading-relaxed line-clamp-2">{lesson.bite}</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 shrink-0 text-[10px] text-[var(--text-faint)]">
          {isSaved && <Bookmark size={11} filled />}
          {lesson.exerciseAnchorBlockId && <PenTool size={11} className="text-[var(--text-dim)]" />}
          {lesson.estimatedMin && (
            <div className="flex items-center gap-1">
              <Clock size={10} />
              <span>{lesson.estimatedMin} min</span>
            </div>
          )}
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onOpen}
      style={style}
      className="animate-tileDropIn relative text-left overflow-hidden rounded-2xl shadow-lg p-4 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-xl group cursor-pointer bg-[var(--panel-2)] border border-[var(--border)]"
    >
      {color && <span className="absolute left-0 top-0 bottom-0 w-1 z-10" style={{ backgroundColor: color }} />}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div />
        {lesson.estimatedMin && (
          <div className="flex items-center gap-1 text-[10px] text-[var(--text-faint)]">
            <Clock size={10} />
            <span>{lesson.estimatedMin} min</span>
          </div>
        )}
      </div>
      <h4 className="text-sm font-semibold text-[var(--text)]">
        {lesson.title}
      </h4>
      <p className="text-xs text-[var(--text-dim)] mt-1.5 leading-relaxed line-clamp-3">{lesson.bite}</p>
      <div className="flex items-center gap-2 mt-2">
        {isSaved && (
          <div className="flex items-center gap-1 text-[10px] text-[var(--text-dim)] bg-[var(--bg)] border border-[var(--border)] rounded-full px-1.5 py-0.5">
            <Bookmark size={10} filled />
            <span>Saved</span>
          </div>
        )}
        {lesson.exerciseAnchorBlockId && (
          <div className="flex items-center gap-1 text-[10px] text-[var(--text-dim)] bg-[var(--bg)] border border-[var(--border)] rounded-full px-1.5 py-0.5">
            <PenTool size={10} />
            <span>Exercise</span>
          </div>
        )}
      </div>
    </button>
  );
};

/**
 * The bite-sized browsing layer for the "Zero to Band 9" vocab
 * chapters -- same architecture as GrammarLessonList/TipsLessonList: a
 * chip-filterable grid of short, quick-read lessons that sit in front
 * of the full 7-chapter grid. Zero to Band 9 has no separate exercises
 * table (each chapter embeds its own exercise blocks), so "Go to
 * Exercises" scrolls to a block inside the same chapter rather than
 * navigating to a different entity, and only appears when a lesson
 * actually has one.
 */
export const VocabLessonList: React.FC<{
  onOpenChapter: (chapterNumber: number, anchorBlockId: string | null) => void;
  onGoToExercise: (chapterNumber: number, exerciseAnchorBlockId: string) => void;
  onNoLessons: () => void;
}> = ({ onOpenChapter, onGoToExercise, onNoLessons }) => {
  const [lessons, setLessons] = useState<VocabLesson[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<VocabLesson | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [layout, setLayout] = useState<LessonLayout>('grid3');
  const { saved, toggle: toggleSaved } = useSavedLessons('vocab-zero-to-band9');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
      if (stored === 'list' || stored === 'grid2' || stored === 'grid3') setLayout(stored);
    } catch {
      // localStorage unavailable -- fall back to the default.
    }
  }, []);

  const changeLayout = useCallback((next: LessonLayout) => {
    setLayout(next);
    try {
      window.localStorage.setItem(LAYOUT_STORAGE_KEY, next);
    } catch {
      // Non-fatal -- the choice just won't persist across visits.
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/vocab/lessons')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const list: VocabLesson[] = data.lessons ?? [];
        setLessons(list);
        // No bite-sized content prepared yet -- fall back to the
        // chapter grid rather than showing an empty layer.
        if (list.length === 0) onNoLessons();
      })
      .catch(() => {
        if (!cancelled) setError('Could not load quick tips. Please try again.');
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const collections = useMemo(() => {
    if (!lessons) return [];
    const counts = new Map<string, { collection: Collection; count: number }>();
    for (const l of lessons) {
      if (!l.collection) continue;
      const existing = counts.get(l.collection.slug);
      if (existing) existing.count += 1;
      else counts.set(l.collection.slug, { collection: l.collection, count: 1 });
    }
    return Array.from(counts.values()).sort(
      (a, b) => COLLECTION_ORDER.indexOf(a.collection.slug) - COLLECTION_ORDER.indexOf(b.collection.slug),
    );
  }, [lessons]);

  const filteredLessons = useMemo(() => {
    if (!lessons) return [];
    let list = lessons;
    if (showSavedOnly) list = list.filter((l) => saved.has(l.slug));
    if (selectedCollection) list = list.filter((l) => l.collection?.slug === selectedCollection);
    return list;
  }, [lessons, selectedCollection, showSavedOnly, saved]);

  if (error) {
    return <GlassPanel className="text-sm text-[var(--danger)]">{error}</GlassPanel>;
  }

  if (!lessons) {
    return (
      <GlassPanel className="text-center text-sm text-[var(--text-dim)]">Loading quick tips...</GlassPanel>
    );
  }

  if (lessons.length === 0) {
    // onNoLessons already fired above; render nothing while the parent
    // swaps to the chapter grid.
    return null;
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        {collections.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCollection(null)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-colors cursor-pointer border ${
                selectedCollection === null
                  ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                  : 'bg-[var(--panel-2)] text-[var(--text-dim)] border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--border-strong)]'
              }`}
            >
              <span>All</span>
              <span
                className={`px-1.5 rounded-full text-[10px] ${
                  selectedCollection === null ? 'bg-black/10' : 'bg-[var(--bg)]'
                }`}
              >
                {lessons.length}
              </span>
            </button>
            {collections.map(({ collection, count }) => {
              const isActive = selectedCollection === collection.slug;
              const color = collectionColor(collection.slug);
              return (
                <button
                  key={collection.slug}
                  onClick={() => setSelectedCollection(isActive ? null : collection.slug)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-colors cursor-pointer border ${
                    isActive
                      ? 'text-white border-transparent'
                      : 'bg-[var(--panel-2)] text-[var(--text-dim)] border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--border-strong)]'
                  }`}
                  style={isActive ? { backgroundColor: color } : undefined}
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: isActive ? 'white' : color }} />
                  <span>{collection.label}</span>
                  <span className={`px-1.5 rounded-full text-[10px] ${isActive ? 'bg-white/20' : 'bg-[var(--bg)]'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
            <button
              onClick={() => setShowSavedOnly((s) => !s)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 ml-1 rounded-full text-xs font-mono font-medium transition-colors cursor-pointer border ${
                showSavedOnly
                  ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                  : 'bg-[var(--panel-2)] text-[var(--text-dim)] border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--border-strong)]'
              }`}
            >
              <Bookmark size={12} filled={showSavedOnly} />
              <span>Saved</span>
              <span className={`px-1.5 rounded-full text-[10px] ${showSavedOnly ? 'bg-black/10' : 'bg-[var(--bg)]'}`}>
                {saved.size}
              </span>
            </button>
          </div>
        ) : (
          <div />
        )}
        <LessonLayoutSwitcher layout={layout} onChange={changeLayout} />
      </div>

      {filteredLessons.length === 0 ? (
        <GlassPanel className="text-center">
          {showSavedOnly ? (
            <>
              <h4 className="font-display font-bold text-[var(--text)] mb-1">No saved lessons yet</h4>
              <p className="text-sm text-[var(--text-dim)]">Open any lesson and tap the bookmark button to save it here.</p>
            </>
          ) : (
            <p className="text-sm text-[var(--text-dim)]">No lessons in this category.</p>
          )}
        </GlassPanel>
      ) : (
        <div className={gridClassName(layout)}>
          {filteredLessons.map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              layout={layout}
              index={index}
              isSaved={saved.has(lesson.slug)}
              onOpen={() => setActive(lesson)}
            />
          ))}
        </div>
      )}

      {/* Bite detail modal -- "Read More" opens the full chapter at the
          lesson's anchor; "Go to Exercises" (only when the lesson has
          one) jumps to that chapter's embedded exercise block instead. */}
      {active && (
        <div
          className="animate-fadeIn fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="animate-pouchPopIn relative w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-[var(--bg-elevated)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header chrome */}
            <div className="px-6 py-4 shrink-0 border-b border-[var(--border)] bg-[var(--panel-2)]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    {active.sourceLabel && (
                      <span className="text-[10px] font-mono uppercase text-[var(--text-faint)] tracking-wide">
                        {active.sourceLabel}
                      </span>
                    )}
                    {active.collection && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[10px] font-mono uppercase tracking-wide text-[var(--text-dim)]">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: collectionColor(active.collection.slug) }} />
                        {active.collection.label}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-lg text-[var(--text)]">{active.title}</h3>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleSaved(active.slug)}
                    aria-label={saved.has(active.slug) ? 'Remove from saved' : 'Save this lesson'}
                    aria-pressed={saved.has(active.slug)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                      saved.has(active.slug)
                        ? 'text-[var(--text)]'
                        : 'text-[var(--text-faint)] hover:text-[var(--text)] hover:bg-[var(--bg)]'
                    }`}
                  >
                    <Bookmark size={16} filled={saved.has(active.slug)} />
                  </button>
                  <button
                    onClick={() => setActive(null)}
                    aria-label="Close"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <LessonMarkdown md={active.detailMd} />
            </div>

            <div className="px-6 py-4 border-t border-[var(--border)] shrink-0 flex flex-col sm:flex-row gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={<ArrowRight size={14} />}
                onClick={() => {
                  const chapterNumber = active.chapterNumber;
                  const anchorBlockId = active.anchorBlockId;
                  setActive(null);
                  onOpenChapter(chapterNumber, anchorBlockId);
                }}
                className="flex-1 justify-center"
              >
                Read More
              </Button>
              {active.exerciseAnchorBlockId && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<PenTool size={14} />}
                  onClick={() => {
                    const chapterNumber = active.chapterNumber;
                    const exerciseAnchorBlockId = active.exerciseAnchorBlockId!;
                    setActive(null);
                    onGoToExercise(chapterNumber, exerciseAnchorBlockId);
                  }}
                  className="flex-1 justify-center"
                >
                  Go to Exercises
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
