import React from 'react';
import { GlassPanel } from '../ui/GlassPanel';
import { Sparkles } from '../ui/icons';

// Same tip content already used in SkillTips.tsx during practice --
// reused here rather than authoring new copy, so tips stay consistent
// across the app.
const SKILL_TIPS: { skill: string; text: string }[] = [
  { skill: 'Writing', text: 'Task 1: always open with a clear overview sentence summarising the main trend or change before any detail.' },
  { skill: 'Reading', text: 'For "True/False/Not Given", "Not Given" means the text neither confirms nor denies -- do not infer.' },
  { skill: 'Listening', text: 'Read the questions during the pauses so you know what to listen for next.' },
  { skill: 'Speaking', text: 'Fluency beats perfection -- self-correcting endlessly hurts more than a small slip.' },
  { skill: 'Writing', text: 'Spend ~20 min on Task 1 and ~40 min on Task 2 -- Task 2 is weighted double.' },
  { skill: 'Reading', text: 'Budget ~20 minutes per passage; do not let one hard question consume your time.' },
  { skill: 'Listening', text: 'Write answers as you hear them; do not wait, the audio only plays once.' },
];

function dayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export const DailyTipBanner: React.FC<{ id?: string }> = ({ id }) => {
  const tip = SKILL_TIPS[dayOfYear() % SKILL_TIPS.length];

  return (
    <GlassPanel
      id={id}
      className="relative overflow-hidden p-6 border-2 border-[var(--accent-a)]/40 bg-[var(--accent-a)]/10 flex items-start gap-4 shadow-lg shadow-[var(--glow-a)]"
    >
      {/* Faint shimmer sweep -- purely decorative, sits behind the content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-dailyTipShimmer"
      />

      <div className="relative shrink-0">
        <div className="absolute inset-0 rounded-2xl animate-dailyTipPulse" />
        <div className="relative w-14 h-14 rounded-2xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center shadow-lg shadow-[var(--glow-a)]">
          <Sparkles size={24} />
        </div>
      </div>

      <div className="relative min-w-0">
        <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-wide text-[var(--accent-a)] mb-1.5">
          <span className="px-2 py-0.5 rounded-full bg-[var(--accent-a)]/15 border border-[var(--accent-a)]/30">
            Daily Tip
          </span>
          <span className="text-[var(--text-faint)] font-normal normal-case">&middot; {tip.skill}</span>
        </div>
        <p className="text-base text-[var(--text)] leading-relaxed font-medium">{tip.text}</p>
      </div>
    </GlassPanel>
  );
};
