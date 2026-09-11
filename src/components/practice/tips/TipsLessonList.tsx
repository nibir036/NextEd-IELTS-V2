'use client';

import React, { useEffect, useState } from 'react';
import { GlassPanel } from '../../ui/GlassPanel';
import { Button } from '../../ui/Button';
import { Clock, X, ArrowRight } from '../../ui/icons';
import { LessonMarkdown } from './LessonMarkdown';

interface Lesson {
  id: string;
  slug: string;
  title: string;
  sourceLabel: string | null;
  bite: string;
  detailMd: string;
  estimatedMin: number | null;
  chapterSlug: string | null;
  anchorBlockId: string | null;
}

/**
 * The bite-sized browsing layer that was missing: a grid of short,
 * quick-read lessons (not full chapters) -- matching the reference
 * architecture's "skim the bite, then read more if it matters" flow,
 * instead of dropping the user straight into a full chapter.
 */
export const TipsLessonList: React.FC<{
  skill: 'listening' | 'reading' | 'writing' | 'speaking';
  onOpenChapter: (chapterSlug: string, anchorBlockId: string | null) => void;
  onNoLessons: () => void;
}> = ({ skill, onOpenChapter, onNoLessons }) => {
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<Lesson | null>(null);

  useEffect(() => {
    let cancelled = false;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {lessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => setActive(lesson)}
            className="text-left rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 p-4 hover:border-[var(--accent-a)]/40 hover:bg-[var(--panel-2)] transition-all group cursor-pointer"
          >
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
          </button>
        ))}
      </div>

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
                {active.sourceLabel && (
                  <div className="text-[10px] font-mono uppercase text-[var(--accent-a)] tracking-wide mb-0.5">
                    {active.sourceLabel}
                  </div>
                )}
                <h3 className="font-display font-bold text-lg text-[var(--text)]">{active.title}</h3>
              </div>
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-[var(--text-faint)] hover:text-[var(--text)] hover:bg-[var(--panel-2)] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
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
