import React from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { TestSelector } from '../components/practice/TestSelector';
import SpeakingTipsList from '../components/speaking/SpeakingTipsList';
import { Sparkles } from '../components/ui/icons';

interface SpeakingViewProps {
  id?: string;
}

export const SpeakingView: React.FC<SpeakingViewProps> = ({ id }) => {
  return (
    <div id={id} className="space-y-6">
      {/* Header Banner */}
      <GlassPanel className="p-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-mono mb-2">
          <Sparkles size={14} />
          <span>Speaking Practice</span>
        </div>

        <h2 className="font-display text-2xl font-bold text-[var(--text)]">
          IELTS Speaking Simulator
        </h2>

        <p className="text-xs text-[var(--text-dim)] mt-1">
          Cue card timer & fluency analysis with AI-examined band feedback.
        </p>
      </GlassPanel>

      {/* Speaking Tests Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-[var(--text)] px-1">
          Speaking Tests
        </h3>
        <TestSelector
          skill="speaking"
          onSelect={(testId) => {
            console.log("Selected test:", testId);
          }}
          emptyDescription="Speaking tests are being prepared. In the meantime, review the tips below to get ready."
        />
      </div>

      {/* Speaking Tips Section */}
      <div className="space-y-3 pt-4">
        <h3 className="text-lg font-semibold text-[var(--text)] px-1">
          Speaking Tips
        </h3>
        <SpeakingTipsList />
      </div>
    </div>
  );
};