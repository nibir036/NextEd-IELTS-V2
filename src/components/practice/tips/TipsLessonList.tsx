'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '../../ui/Button';
import { Clock, X, ArrowRight, Bookmark, List, LayoutGrid, Grid3x3 } from '../../ui/icons';
import { LessonMarkdown } from './LessonMarkdown';
import { useSavedLessons } from './useSavedLessons';

interface Collection {
  slug: string;
  label: string;
}

interface Lesson {
  id: string;
  slug: string;
  title: string;
  sourceLabel: string | null;
  collection: Collection | null;
  bite: string;
  detailMd: string;
  estimatedMin: number | null;
  chapterSlug: string | null;
  anchorBlockId: string | null;
}

// Collection colors reuse the app's existing palette tokens only --
// no new hues introduced. Traps/test-day map onto the existing
// semantic warning/success tokens, which already fit their meaning.
const COLLECTION_COLOR: Record<string, string> = {
  'before-the-audio': 'var(--accent-a)',
  foundations: 'var(--accent-a)',
  'question-types': 'var(--accent-c)',
  traps: 'var(--warning)',
  'test-day-skills': 'var(--success)',
};

// Stable display order across every skill's chip bar, regardless of
// which slug variant a given skill's "foundations" tier uses.
const COLLECTION_ORDER = ['before-the-audio', 'foundations', 'question-types', 'traps', 'test-day-skills'];

function collectionColor(slug: string): string {
  return COLLECTION_COLOR[slug] ?? 'var(--text-faint)';
}

// Card layout is a user preference, not per-skill -- one choice
// follows the reader across all 4 skills' tips tabs.
type LessonLayout = 'list' | 'grid2' | 'grid3';
const LAYOUT_STORAGE_KEY = 'nexted:tips-lesson-layout';
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

// Segmented control for switching between list / 2-up / 3-up. Kept as
// its own component since it's identical regardless of layout mode.
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
            ? 'bg-[var(--accent-a)]/20 text-[var(--accent-a)]'
            : 'text-[var(--text-faint)] hover:text-[var(--text)] hover:bg-[var(--bg)]'
        }`}
      >
        <Icon size={14} />
      </button>
    ))}
  </div>
);

// One lesson card, rendered either as a compact row (list layout) or a
// tile (2/3-up grid layouts). Every card gets a staggered load-in via
// .animate-tileDropIn + an index-based delay, capped so a long list
// doesn't leave later cards waiting nearly a second to appear.
const LessonCard: React.FC<{
  lesson: Lesson;
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
        className="animate-tileDropIn relative w-full flex items-center gap-4 text-left overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] pl-5 pr-4 py-4 transition-colors duration-300 hover:-translate-y-0.5 hover:border-[var(--border-strong)] group cursor-pointer"
      >
        {color && <span className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: color }} />}
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-[var(--text)] transition-colors truncate">
            {lesson.title}
          </h4>
          <p className="text-xs text-[var(--text-dim)] mt-1 leading-relaxed line-clamp-2">{lesson.bite}</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 shrink-0 text-[10px] text-[var(--text-faint)]">
          {isSaved && <Bookmark size={11} filled />}
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
      className="animate-tileDropIn relative text-left overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] p-4 transition-colors duration-300 hover:-translate-y-0.5 hover:border-[var(--border-strong)] group cursor-pointer"
    >
      {color && <span className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: color }} />}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div />
        {lesson.estimatedMin && (
          <div className="flex items-center gap-1 text-[10px] text-[var(--text-faint)]">
            <Clock size={10} />
            <span>{lesson.estimatedMin} min</span>
          </div>
        )}
      </div>
      <h4 className="text-sm font-semibold text-[var(--text)] transition-colors">
        {lesson.title}
      </h4>
      <p className="text-xs text-[var(--text-dim)] mt-1.5 leading-relaxed line-clamp-3">{lesson.bite}</p>
      {isSaved && (
        <div className="flex items-center gap-1 text-[10px] text-[var(--text-faint)] mt-2">
          <Bookmark size={10} filled />
          <span>Saved</span>
        </div>
      )}
    </button>
  );
};

/**
 * The bite-sized browsing layer: a grid of short, quick-read lessons
 * (not full chapters), with an optional filter-chip bar when lessons
 * carry a "collection" tag (a crosscutting category independent of
 * which file/chapter they came from -- e.g. "Traps" pulls the trap
 * lesson from every file at once).
 */
export const TipsLessonList: React.FC<{
  skill: 'listening' | 'reading' | 'writing' | 'speaking';
  onOpenChapter: (chapterSlug: string, anchorBlockId: string | null) => void;
  onNoLessons: () => void;
}> = ({ skill, onOpenChapter, onNoLessons }) => {
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<Lesson | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [layout, setLayout] = useState<LessonLayout>('grid3');
  const { saved, toggle: toggleSaved } = useSavedLessons(skill);

  // Read the saved layout preference after mount only -- reading
  // localStorage during initial render would return a different value
  // on the server (none) vs the client, causing a hydration mismatch.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
      if (stored === 'list' || stored === 'grid2' || stored === 'grid3') setLayout(stored);
    } catch {
      // localStorage unavailable (private browsing, etc.) -- fall back
      // to the default and don't persist future changes either.
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
    setSelectedCollection(null);
    setShowSavedOnly(false);
    fetch(`/api/tips/${skill}/lessons`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const list: Lesson[] = data.lessons ?? [];
        setLessons(list);
        // Skills with no bite-sized content prepared yet (e.g. still
        // only has full chapters) fall back to the chapter list rather
        // than showing an empty grid.
        if (list.length === 0) onNoLessons();
      })
      .catch(() => {
        if (!cancelled) setError('Could not load quick tips. Please try again.');
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skill]);

  // Distinct collections actually present, in a stable order, with
  // counts -- computed from real data rather than hardcoded, so it
  // degrades gracefully if a skill's lessons have no collection tags
  // at all (chip bar simply doesn't render).
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
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] p-6 text-sm text-[var(--danger)]">
        <span>{error}</span>
      </div>
    );
  }

  if (!lessons) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] p-8 text-center text-sm text-[var(--text-dim)]">
        <span>Loading quick tips...</span>
      </div>
    );
  }

  if (lessons.length === 0) {
    // onNoLessons already fired above; render nothing while the parent
    // swaps to the chapter list.
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
                  ? 'bg-[var(--accent-a)]/20 text-[var(--accent-a)] border-[var(--accent-a)]/30'
                  : 'bg-[var(--panel-2)] text-[var(--text-dim)] border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--border-strong)]'
              }`}
            >
              <span>All</span>
              <span
                className={`px-1.5 rounded-full text-[10px] ${
                  selectedCollection === null ? 'bg-[var(--accent-a)]/20' : 'bg-[var(--bg)]'
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
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] p-8 text-center">
          {showSavedOnly ? (
            <>
              <h4 className="font-display font-bold text-[var(--text)] mb-1">No saved lessons yet</h4>
              <p className="text-sm text-[var(--text-dim)]">Open any lesson and tap the bookmark button to save it here.</p>
            </>
          ) : (
            <p className="text-sm text-[var(--text-dim)]">No lessons in this category.</p>
          )}
        </div>
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

      {/* Bite detail modal */}
      {active && (
        <div
          className="animate-fadeIn fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="animate-pouchPopIn relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-[var(--bg-elevated)] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header bar. The body below stays on a neutral surface since
                it holds lesson text the candidate reads carefully. */}
            <div className="flex items-start justify-between gap-3 px-6 py-4 shrink-0 border-b border-[var(--border)] bg-[var(--panel-2)]">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  {active.sourceLabel && (
                    <span className="text-[10px] font-mono uppercase text-[var(--text-faint)] tracking-wide">
                      {active.sourceLabel}
                    </span>
                  )}
                  {active.collection && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wide text-[var(--text-dim)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-faint)]" />
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
                    saved.has(active.slug) ? 'text-[var(--accent-a)]' : 'text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--bg)]'
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

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <LessonMarkdown md={active.detailMd} />
            </div>

            {active.chapterSlug && (
              <div className="px-6 py-4 border-t border-[var(--border)] shrink-0">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<ArrowRight size={14} />}
                  onClick={() => {
                    const chapterSlug = active.chapterSlug!;
                    const anchorBlockId = active.anchorBlockId;
                    setActive(null);
                    onOpenChapter(chapterSlug, anchorBlockId);
                  }}
                  className="w-full justify-center"
                >
                  Read the full chapter
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
