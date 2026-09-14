'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../ui/Button';
import { ChevronLeft, ChevronRight, Clock, X } from '../../ui/icons';

type ContentBlock = {
  id: string;
  type: string;
  level?: number;
  text?: string;
  title?: string;
  body?: string;
  variant?: string;
  headers?: string[];
  [key: string]: any;
};

type ChapterPayload = {
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

/**
 * Grammar's chapter reading view -- same overlay/sidebar/footer shape
 * as TipsReaderOverlay (fixed modal, "in this chapter" sidebar of
 * level-2 headings with scroll-spy, prev/next footer nav). Unlike
 * TipsReaderOverlay this one is "controlled" rather than self-fetching:
 * LmsView already owns chapter fetching/progress/exercise state (used
 * elsewhere -- the module chapter grid's status chips, the separate
 * exercise screen), so this component just renders whatever chapter
 * data it's handed rather than duplicating that fetch itself.
 */
export const GrammarReaderOverlay: React.FC<{
  chapter: ChapterPayload | null;
  loading: boolean;
  anchorBlockId?: string | null;
  onNavigate: (slug: string, anchorBlockId?: string | null) => void;
  onClose: () => void;
  onStartExercise: (exerciseSlug: string) => void;
  onMarkComplete: () => void;
  renderBlock: (block: ContentBlock) => React.ReactNode;
}> = ({ chapter, loading, anchorBlockId, onNavigate, onClose, onStartExercise, onMarkComplete, renderBlock }) => {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // The sidebar's "in this chapter" list -- every level-2 heading in
  // the chapter, in order. Level-3 headings are sub-points within a
  // section, not top-level jump targets, so they're excluded here
  // (though they still render inline in the content), same rule Tips
  // uses.
  const sections = useMemo(() => {
    if (!chapter) return [];
    return chapter.content.blocks
      .filter((b) => b.type === 'heading' && b.level !== 3 && b.text)
      .map((b) => ({ id: b.id, text: b.text as string }));
  }, [chapter]);

  useEffect(() => {
    setActiveSectionId(null);
    const root = contentRef.current;
    if (root) root.scrollTop = 0;
  }, [chapter?.slug]);

  useEffect(() => {
    const root = contentRef.current;
    if (!root || sections.length === 0) return;

    const ACTIVE_LINE_OFFSET = 96;

    const updateActive = () => {
      const rootTop = root.getBoundingClientRect().top;
      let current: string | null = sections[0]?.id ?? null;
      for (const s of sections) {
        const el = document.getElementById(`grammar-block-${s.id}`);
        if (!el) continue;
        const elTop = el.getBoundingClientRect().top - rootTop;
        if (elTop <= ACTIVE_LINE_OFFSET) {
          current = s.id;
        } else {
          break;
        }
      }
      setActiveSectionId(current);
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActive();
        ticking = false;
      });
    };

    updateActive();
    root.addEventListener('scroll', onScroll, { passive: true });
    return () => root.removeEventListener('scroll', onScroll);
  }, [sections]);

  useEffect(() => {
    if (!chapter || !anchorBlockId) return;
    const raf = requestAnimationFrame(() => {
      document.getElementById(`grammar-block-${anchorBlockId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(raf);
  }, [chapter, anchorBlockId]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const jumpTo = (sectionId: string) => {
    document.getElementById(`grammar-block-${sectionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="animate-fadeIn fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-black/70 backdrop-blur-sm">
      <div className="animate-pouchPopIn relative w-[92vw] md:w-[88vw] max-w-6xl h-[92vh] rounded-2xl bg-[var(--bg-elevated)] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 md:px-8 py-4 shrink-0 border-b border-[var(--border)] bg-[var(--panel-2)]">
          <div className="min-w-0">
            {chapter && (
              <div className="text-[11px] font-mono uppercase text-[var(--text-faint)] tracking-wide truncate">
                {chapter.module.title}
              </div>
            )}
            <h2 className="font-display text-lg md:text-xl font-bold text-[var(--text)] truncate">
              {chapter?.title ?? 'Loading...'}
            </h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {chapter?.estimatedMin && (
              <div className="hidden sm:flex items-center gap-1 text-xs text-[var(--text-faint)] font-mono">
                <Clock size={13} />
                <span>{chapter.estimatedMin} min</span>
              </div>
            )}
            <button
              onClick={onClose}
              aria-label="Close reader"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body: sidebar + content */}
        <div className="flex-1 flex min-h-0">
          {loading && !chapter && (
            <p className="w-full text-sm text-[var(--text-dim)] font-mono text-center py-12">Loading chapter...</p>
          )}
          {chapter && (
            <>
              {sections.length > 0 && (
                <nav className="hidden md:block w-56 shrink-0 border-r border-[var(--border)] bg-[var(--panel-2)]">
                  <div className="h-full overflow-y-auto px-4 py-5">
                    <div className="text-[10px] font-mono uppercase text-[var(--text-faint)] tracking-wide mb-2 px-2">
                      In this chapter
                    </div>
                    <div className="space-y-0.5">
                      {sections.map((s) => {
                        const isActive = activeSectionId === s.id;
                        return (
                          <button
                            key={s.id}
                            onClick={() => jumpTo(s.id)}
                            className={`w-full text-left px-2 py-1.5 rounded-lg text-xs leading-snug border-l-2 transition-colors cursor-pointer ${
                              isActive
                                ? 'border-[var(--accent-a)] text-[var(--accent-a)] font-semibold bg-[var(--accent-a)]/10'
                                : 'border-transparent text-[var(--text-dim)] hover:text-[var(--text)]'
                            }`}
                          >
                            {s.text}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </nav>
              )}

              <div ref={contentRef} className="flex-1 overflow-y-auto px-5 md:px-10 py-6">
                <div className="max-w-3xl mx-auto space-y-2">
                  {chapter.summary && (
                    <p className="text-sm text-[var(--text-dim)] mb-6 leading-relaxed">{chapter.summary}</p>
                  )}
                  {chapter.content.blocks.map((block) => (
                    <div key={block.id} id={`grammar-block-${block.id}`}>
                      {renderBlock(block)}
                    </div>
                  ))}

                  {chapter.exercises.length > 0 && (
                    <div className="mt-8 p-5 rounded-xl border border-[var(--border)] bg-[var(--panel-2)]/40 space-y-3">
                      <h3 className="font-display font-bold text-[var(--text)]">Exercises</h3>
                      {chapter.exercises.map((ex) => (
                        <button
                          key={ex.id}
                          type="button"
                          onClick={() => onStartExercise(ex.slug)}
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border)] hover:border-[var(--accent-a)]/40 transition-colors text-left cursor-pointer"
                        >
                          <div>
                            <div className="text-sm font-semibold text-[var(--text)]">{ex.title}</div>
                            <div className="text-[11px] font-mono text-[var(--text-faint)] capitalize">{ex.kind}</div>
                          </div>
                          <ChevronRight size={16} className="text-[var(--text-faint)]" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer nav */}
        {chapter && (
          <div className="flex items-center justify-between gap-3 px-5 md:px-8 py-4 border-t border-[var(--border)] shrink-0">
            <Button
              variant="secondary"
              size="sm"
              icon={<ChevronLeft size={14} />}
              onClick={() => chapter.prev && onNavigate(chapter.prev.slug)}
              disabled={!chapter.prev}
            >
              {chapter.prev ? chapter.prev.title : 'First'}
            </Button>
            <Button variant="primary" size="sm" onClick={onMarkComplete} disabled={chapter.status === 'completed'}>
              {chapter.status === 'completed' ? 'Completed' : chapter.next ? 'Mark complete & continue' : 'Mark complete'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<ChevronRight size={14} />}
              onClick={() => chapter.next && onNavigate(chapter.next.slug)}
              disabled={!chapter.next}
            >
              {chapter.next ? chapter.next.title : 'Last'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
