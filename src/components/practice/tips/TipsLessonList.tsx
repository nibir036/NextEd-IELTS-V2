'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { GlassPanel } from '../../ui/GlassPanel';
import { Button } from '../../ui/Button';
import { Clock, X, ArrowRight, Bookmark } from '../../ui/icons';
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
  const { saved, toggle: toggleSaved } = useSavedLessons(skill);

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
    return <GlassPanel className="p-6 text-sm text-[var(--danger)]">{error}</GlassPanel>;
  }

  if (!lessons) {
    return (
      <GlassPanel className="p-8 text-center text-sm text-[var(--text-dim)]">
        Loading quick tips...
      </GlassPanel>
    );
  }

  if (lessons.length === 0) {
    // onNoLessons already fired above; render nothing while the parent
    // swaps to the chapter list.
    return null;
  }

  return (
    <>
      {collections.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button
            onClick={() => setSelectedCollection(null)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-colors cursor-pointer border ${
              selectedCollection === null
                ? 'bg-[var(--accent-a)] text-white border-[var(--accent-a)]'
                : 'bg-[var(--panel-2)] text-[var(--text-dim)] border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--border-strong)]'
            }`}
          >
            <span>All</span>
            <span
              className={`px-1.5 rounded-full text-[10px] ${
                selectedCollection === null ? 'bg-white/20' : 'bg-[var(--bg)]'
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
      )}

      {filteredLessons.length === 0 ? (
        <GlassPanel className="p-8 text-center">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredLessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => setActive(lesson)}
              className="relative text-left overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 p-4 hover:border-[var(--accent-a)]/40 hover:bg-[var(--panel-2)] transition-all group cursor-pointer"
            >
              {lesson.collection && (
                <span
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: collectionColor(lesson.collection.slug) }}
                />
              )}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                {lesson.sourceLabel && (
                  <span className="text-[10px] font-mono uppercase text-[var(--accent-a)] tracking-wide">
                    {lesson.sourceLabel}
                  </span>
                )}
                {lesson.estimatedMin && (
                  <div className="flex items-center gap-1 text-[10px] text-[var(--text-faint)]">
                    <Clock size={10} />
                    <span>{lesson.estimatedMin} min</span>
                  </div>
                )}
              </div>
              <h4 className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent-a)] transition-colors">
                {lesson.title}
              </h4>
              <p className="text-xs text-[var(--text-dim)] mt-1.5 leading-relaxed line-clamp-3">
                {lesson.bite}
              </p>
              {saved.has(lesson.slug) && (
                <div className="flex items-center gap-1 text-[10px] text-[var(--text)] mt-2">
                  <Bookmark size={10} filled />
                  <span>Saved</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Bite detail modal */}
      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-[var(--border)] shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  {active.sourceLabel && (
                    <span className="text-[10px] font-mono uppercase text-[var(--accent-a)] tracking-wide">
                      {active.sourceLabel}
                    </span>
                  )}
                  {active.collection && (
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wide"
                      style={{ color: collectionColor(active.collection.slug) }}
                    >
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
                      ? 'text-[var(--accent-a)]'
                      : 'text-[var(--text-faint)] hover:text-[var(--text)] hover:bg-[var(--panel-2)]'
                  }`}
                >
                  <Bookmark size={16} filled={saved.has(active.slug)} />
                </button>
                <button
                  onClick={() => setActive(null)}
                  aria-label="Close"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-faint)] hover:text-[var(--text)] hover:bg-[var(--panel-2)] transition-colors cursor-pointer"
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
