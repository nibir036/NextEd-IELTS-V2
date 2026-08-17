import React, { useEffect, useState } from 'react';
import { GlassPanel } from '../../ui/GlassPanel';
import { Button } from '../../ui/Button';
import { ChevronLeft, ChevronRight, Clock } from '../../ui/icons';
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

export const SpeakingTipsReader: React.FC<{
  slug: string;
  onNavigate: (slug: string) => void;
  onBack: () => void;
}> = ({ slug, onNavigate, onBack }) => {
  const [chapter, setChapter] = useState<ChapterPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setChapter(null);
    setError(null);
    fetch(`/api/tips/speaking/chapters/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setError(data.error);
          return;
        }
        setChapter(data.chapter);
        // Fire-and-forget progress ping; ignore failures (e.g. logged-out users).
        fetch(`/api/tips/speaking/chapters/${slug}/progress`, {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (error) {
    return <GlassPanel className="p-6 text-sm text-[var(--danger)]">{error}</GlassPanel>;
  }

  if (!chapter) {
    return <GlassPanel className="p-8 text-center text-sm text-[var(--text-dim)]">Loading…</GlassPanel>;
  }

  const markComplete = () => {
    fetch(`/api/tips/speaking/chapters/${slug}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    }).catch(() => {});
    if (chapter.next) onNavigate(chapter.next.slug);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-xs font-medium text-[var(--text-dim)] hover:text-[var(--text)] flex items-center gap-1">
          <ChevronLeft size={14} /> Back to Files
        </button>
        {chapter.estimatedMin && (
          <div className="flex items-center gap-1 text-[10px] text-[var(--text-dim)]">
            <Clock size={11} />
            <span>{chapter.estimatedMin} min</span>
          </div>
        )}
      </div>

      <GlassPanel className="p-6">
        <h2 className="font-display text-xl font-bold text-[var(--text)]">{chapter.title}</h2>
        {chapter.summary && <p className="text-xs text-[var(--text-dim)] mt-1">{chapter.summary}</p>}
      </GlassPanel>

      <GlassPanel className="p-6">
        {chapter.content.blocks.map((block) => (
          <TipsBlockRenderer key={block.id} block={block} />
        ))}
      </GlassPanel>

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="secondary"
          size="sm"
          icon={<ChevronLeft size={14} />}
          onClick={() => chapter.prev && onNavigate(chapter.prev.slug)}
          disabled={!chapter.prev}
        >
          {chapter.prev ? chapter.prev.title.replace(/^File \d+:\s*/, '') : 'First file'}
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
          {chapter.next ? chapter.next.title.replace(/^File \d+:\s*/, '') : 'Last file'}
        </Button>
      </div>
    </div>
  );
};
