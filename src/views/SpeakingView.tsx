import React from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { TestSelector } from '../components/practice/TestSelector';
import { SkillTips } from '../components/practice/SkillTips';
import { Sparkles } from '../components/ui/icons';

interface SpeakingViewProps {
  id?: string;
}

export const SpeakingView: React.FC<SpeakingViewProps> = ({ id }) => {
  return (
    <div id={id} className="space-y-6">
      <GlassPanel className="p-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-mono mb-2">
          <Sparkles size={14} />
          <span>Speaking Practice</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-[var(--text)]">Speaking Practice</h2>
        <p className="text-xs text-[var(--text-dim)] mt-1">AI-examined speaking parts with band feedback across all four criteria.</p>
      </GlassPanel>

      <TestSelector
        skill="speaking"
        onSelect={() => { /* Wired when speaking tests are added. */ }}
        emptyDescription="Speaking tests are being prepared. In the meantime, review the tips below to get ready."
      />

      <SkillTips skill="speaking" />
    </div>
  );
};
