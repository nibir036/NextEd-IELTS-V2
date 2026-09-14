'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../ui/Button';
import { ChevronLeft, ChevronRight, X } from '../../ui/icons';

type ZeroBlock = {
  id: string;
  type: string;
  title?: string;
  [key: string]: any;
};

type ZeroChapterMeta = {
  id: string;
  number: number;
  title: string;
  difficulty: number | null;
  updatedAt?: string;
};

type ZeroChapterData = {
  meta: ZeroChapterMeta;
  content: {
    schema_version: string;
    content_type?: string;
    chapter: { title?: string; description?: string; learning_objectives?: string[] };
    blocks: ZeroBlock[];
    [key: string]: any;
  };
};

/**
 * Zero to Band 9's chapter reading view -- same overlay/sidebar/footer
 * shape as TipsReaderOverlay and GrammarReaderOverlay, adapted for how
 * this content actually differs from those two:
 *  - All 7 chapters are already loaded client-side (no module concept,
 *    no per-chapter API fetch), so this component takes the already-
 *    loaded chapters as a prop and derives prev/next locally instead
 *    of fetching them.
 *  - Blocks have no heading/level structure -- each top-level block
 *    (error matrix, vocabulary matrix, a topic bundle, an exercise...)
 *    IS the navigable unit, so the sidebar lists blocks with a title
 *    rather than level-2 headings within them.
 *  - There's no progress-tracking API for vocab chapters yet, so
 *    there's no "mark complete" button -- just prev/next.
 */
export const ZeroReaderOverlay: React.FC<{
  chapters: ZeroChapterData[];
  number: number;
  anchorBlockId?: string | null;
  onNavigate: (number: number, anchorBlockId?: string | null) => void;
  onClose: () => void;
  renderBlock: (block: ZeroBlock) => React.ReactNode;
}> = ({ chapters, number, anchorBlockId, onNavigate, onClose, renderBlock }) => {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(() => [...chapters].sort((a, b) => a.meta.number - b.meta.number), [chapters]);
  const index = sorted.findIndex((c) => c.meta.number === number);
  const chapter = index >= 0 ? sorted[index] : null;
  const prev = index > 0 ? sorted[index - 1] : null;
  const next = index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : null;

  // The sidebar's "in this chapter" list -- every top-level block that
  // carries its own title (a few structural blocks, like intros and
  // batch dividers, don't, and are skipped as jump targets even though
  // they still render inline in the content).
  const sections = useMemo(() => {
    if (!chapter) return [];
    return (chapter.content.blocks ?? [])
      .filter((b) => !!b.title)
      .map((b) => ({ id: b.id, text: b.title as string }));
  }, [chapter]);

  useEffect(() => {
    setActiveSectionId(null);
    const root = contentRef.current;
    if (root) root.scrollTop = 0;
  }, [number]);

  useEffect(() => {
    const root = contentRef.current;
    if (!root || sections.length === 0) return;

    const ACTIVE_LINE_OFFSET = 96;

    const updateActive = () => {
      const rootTop = root.getBoundingClientRect().top;
      let current: string | null = sections[0]?.id ?? null;
      for (const s of sections) {
        const el = document.getElementById(`vocab-block-${s.id}`);
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
      document.getElementById(`vocab-block-${anchorBlockId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    document.getElementById(`vocab-block-${sectionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!chapter) return null;

  return (
    <div className="animate-fadeIn fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-black/70 backdrop-blur-sm">
      <div className="animate-pouchPopIn relative w-[92vw] md:w-[88vw] max-w-6xl h-[92vh] rounded-2xl bg-[var(--bg-elevated)] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 md:px-8 py-4 shrink-0 border-b border-[var(--border)] bg-[var(--panel-2)]">
          <div className="min-w-0">
            <div className="text-[11px] font-mono uppercase text-[var(--text-faint)] tracking-wide truncate">
              Zero to Band 9 &middot; Chapter {chapter.meta.number}
            </div>
            <h2 className="font-display text-lg md:text-xl font-bold text-[var(--text)] truncate">
              {chapter.meta.title}
            </h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {chapter.meta.difficulty != null && (
              <span className="hidden sm:inline px-2 py-0.5 rounded-md bg-[var(--bg)] border border-[var(--border)] text-[var(--text-dim)] font-mono text-[11px] font-semibold">
                Difficulty {chapter.meta.difficulty}
              </span>
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
              {chapter.content.chapter?.description && (
                <p className="text-sm text-[var(--text-dim)] mb-6 leading-relaxed">
                  {chapter.content.chapter.description}
                </p>
              )}
              {(chapter.content.chapter?.learning_objectives ?? []).length > 0 && (
                <ul className="mb-6 space-y-1">
                  {chapter.content.chapter!.learning_objectives!.map((obj, i) => (
                    <li key={i} className="text-xs text-[var(--text-faint)] flex gap-2">
                      <span className="text-[var(--accent-a)]">&bull;</span>
                      {obj}
                    </li>
                  ))}
                </ul>
              )}
              {(chapter.content.blocks ?? []).map((block) => (
                <div key={block.id} id={`vocab-block-${block.id}`}>
                  {renderBlock(block)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer nav */}
        <div className="flex items-center justify-between gap-3 px-5 md:px-8 py-4 border-t border-[var(--border)] shrink-0">
          <Button
            variant="secondary"
            size="sm"
            icon={<ChevronLeft size={14} />}
            onClick={() => prev && onNavigate(prev.meta.number)}
            disabled={!prev}
          >
            {prev ? prev.meta.title : 'First'}
          </Button>
          <Button variant="secondary" size="sm" onClick={onClose}>
            All chapters
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<ChevronRight size={14} />}
            onClick={() => next && onNavigate(next.meta.number)}
            disabled={!next}
          >
            {next ? next.meta.title : 'Last'}
          </Button>
        </div>
      </div>
    </div>
  );
};
