'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../ui/Button';
import { ChevronLeft, ChevronRight, Clock, X } from '../../ui/icons';
import { TipsBlockRenderer, TipsBlock } from './tipsblockrenderer';

interface ChapterPayload {
  id: string;
  slug: string;
  title: string;
  estimatedMin: number | null;
  summary: string | null;
  content: { version: number; blocks: TipsBlock[] };
  status: string;
  module: { title: string };
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}

/**
 * A large-screen reading view: a persistent left sidebar ("in this
 * chapter") listing every level-2 heading as a jump target, with the
 * section currently in view highlighted via scroll-spy -- plus the
 * wide main content area. Fixed overlay covering ~92vw x ~92vh,
 * independent of the sidebar/content-column width the rest of the app
 * is constrained to. Shared by all 4 skills via the `skill` prop.
 */
export const TipsReaderOverlay: React.FC<{
  skill: 'listening' | 'reading' | 'writing' | 'speaking';
  slug: string;
  anchorBlockId?: string | null;
  onNavigate: (slug: string, anchorBlockId?: string | null) => void;
  onClose: () => void;
}> = ({ skill, slug, anchorBlockId, onNavigate, onClose }) => {
  const [chapter, setChapter] = useState<ChapterPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setChapter(null);
    setError(null);
    setActiveSectionId(null);

    fetch(`/api/tips/${skill}/chapters/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setError(data.error);
          return;
        }
        setChapter(data.chapter);
        fetch(`/api/tips/${skill}/chapters/${slug}/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'in_progress' }),
        }).catch(() => {});
      })
      .catch(() => {
        if (!cancelled) setError('Could not load this chapter. Please try again.');
      });

    return () => {
      cancelled = true;
    };
  }, [skill, slug]);

  // The sidebar's "in this chapter" list -- every level-2 heading in
  // the chapter, in order. Level-1 headings are bare "PART N" markers
  // in the source content, not real navigable sections, so they're
  // excluded here (though they still render inline in the content).
  const sections = useMemo(() => {
    if (!chapter) return [];
    return chapter.content.blocks
      .filter((b): b is Extract<TipsBlock, { type: 'heading' }> => b.type === 'heading' && b.level === 2)
      .map((b) => ({ id: b.id, text: b.text }));
  }, [chapter]);

  // Scroll-spy: on every scroll, find the section heading closest to
  // (but not past) a line near the top of the content area, and
  // highlight it in the sidebar. A prior version used
  // IntersectionObserver with a narrow "top 30%" band, which rarely
  // caught single-line heading elements as they scrolled through it --
  // computing directly from scroll position is simpler and reliable
  // for this. Also sets an initial active section on load, before any
  // scrolling happens.
  useEffect(() => {
    const root = contentRef.current;
    if (!root || sections.length === 0) return;

    const ACTIVE_LINE_OFFSET = 96; // px from the top of the content area

    const updateActive = () => {
      const rootTop = root.getBoundingClientRect().top;
      let current: string | null = sections[0]?.id ?? null;
      for (const s of sections) {
        const el = document.getElementById(`tips-block-${s.id}`);
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

  // Scroll to the specific block a bite lesson linked to, once the
  // chapter's content has actually rendered (a plain useEffect on
  // `chapter` can fire before the DOM node for the anchor exists).
  useEffect(() => {
    if (!chapter || !anchorBlockId) return;
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(`tips-block-${anchorBlockId}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(raf);
  }, [chapter, anchorBlockId]);

  // Lock background scroll while the reader is open, and support Escape
  // to close, matching the flashcard overlay pattern used elsewhere.
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

  const markComplete = () => {
    fetch(`/api/tips/${skill}/chapters/${slug}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    }).catch(() => {});
    if (chapter?.next) onNavigate(chapter.next.slug);
  };

  const jumpTo = (sectionId: string) => {
    document.getElementById(`tips-block-${sectionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-black/70 backdrop-blur-sm">
      <div className="relative w-[92vw] md:w-[88vw] max-w-6xl h-[92vh] rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 md:px-8 py-4 border-b border-[var(--border)] shrink-0">
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
              <div className="hidden sm:flex items-center gap-1 text-xs text-[var(--text-dim)] font-mono">
                <Clock size={13} />
                <span>{chapter.estimatedMin} min</span>
              </div>
            )}
            <button
              onClick={onClose}
              aria-label="Close reader"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-faint)] hover:text-[var(--text)] hover:bg-[var(--panel-2)] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body: sidebar + content */}
        <div className="flex-1 flex min-h-0">
          {error && <p className="p-6 text-sm text-[var(--danger)]">{error}</p>}
          {!error && !chapter && (
            <p className="w-full text-sm text-[var(--text-dim)] font-mono text-center py-12">Loading...</p>
          )}
          {chapter && (
            <>
              {/* Sidebar: in this chapter */}
              {sections.length > 0 && (
                <nav className="hidden md:block w-56 shrink-0 border-r border-[var(--border)] overflow-y-auto px-4 py-5">
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
                              ? 'border-[var(--accent-a)] text-[var(--text)] font-semibold bg-[var(--panel-2)]'
                              : 'border-transparent text-[var(--text-faint)] hover:text-[var(--text-dim)]'
                          }`}
                        >
                          {s.text}
                        </button>
                      );
                    })}
                  </div>
                </nav>
              )}

              {/* Main content */}
              <div ref={contentRef} className="flex-1 overflow-y-auto px-5 md:px-10 py-6">
                <div className="max-w-3xl mx-auto">
                  {chapter.summary && (
                    <p className="text-sm text-[var(--text-dim)] mb-6 leading-relaxed">{chapter.summary}</p>
                  )}
                  {chapter.content.blocks.map((block) => (
                    <div key={block.id} id={`tips-block-${block.id}`}>
                      <TipsBlockRenderer block={block} />
                    </div>
                  ))}
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
              {chapter.prev ? chapter.prev.title.replace(/^File \d+:\s*/, '') : 'First'}
            </Button>
            <Button variant="primary" size="sm" onClick={markComplete}>
              {chapter.next ? 'Mark complete & continue' : 'Mark complete'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<ChevronRight size={14} />}
              onClick={() => chapter.next && onNavigate(chapter.next.slug)}
              disabled={!chapter.next}
            >
              {chapter.next ? chapter.next.title.replace(/^File \d+:\s*/, '') : 'Last'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
