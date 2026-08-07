import React from 'react';
import { GlassPanel } from './GlassPanel';
import { Button } from './Button';
import { Sparkles, ArrowUpRight, BookOpen } from './icons';

interface ComingSoonProps {
  title: string;
  description: string;
  onNavigateAction?: (route: string) => void;
  id?: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({
  title,
  description,
  onNavigateAction,
  id,
}) => {
  return (
    <GlassPanel id={id} className="max-w-3xl mx-auto my-10 p-8 text-center relative overflow-hidden">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-mono mb-4">
        <Sparkles size={14} />
        <span>Module Under Active Development</span>
      </div>

      <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--text)] mb-3">
        {title}
      </h2>

      <p className="text-[var(--text-dim)] max-w-lg mx-auto text-sm leading-relaxed mb-6">
        {description}
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          variant="primary"
          icon={<BookOpen size={16} />}
          onClick={() => onNavigateAction?.('dashboard')}
        >
          Back to Dashboard
        </Button>
        <Button
          variant="secondary"
          icon={<ArrowUpRight size={16} />}
          onClick={() => onNavigateAction?.('writing')}
        >
          Try AI Writing Evaluator
        </Button>
      </div>
    </GlassPanel>
  );
};
