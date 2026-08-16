import React from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { TestSelector } from '../components/practice/TestSelector';
import { SkillTips } from '../components/practice/SkillTips';
import { Sparkles } from '../components/ui/icons';

interface ReadingViewProps {
  id?: string;
}

export const ReadingView: React.FC<ReadingViewProps> = ({ id }) => {
  return (
    <div id={id} className="space-y-6">
      <GlassPanel className="p-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-mono mb-2">
          <Sparkles size={14} />
          <span>Reading Practice</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-[var(--text)]">Reading Practice</h2>
        <p className="text-xs text-[var(--text-dim)] mt-1">Timed passages with comprehension questions, auto-scored on completion.</p>
      </GlassPanel>

      <TestSelector
        skill="reading"
        onSelect={() => { /* Wired when reading tests are added. */ }}
        emptyDescription="Reading tests are being prepared. In the meantime, review the tips below to get ready."
      />
    </div>
  );
};
