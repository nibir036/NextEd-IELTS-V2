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
      className="p-5 border border-[var(--accent-a)]/25 bg-[var(--accent-a)]/5 flex items-start gap-4"
    >
      <div className="w-10 h-10 rounded-xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center shrink-0">
        <Sparkles size={18} />
      </div>
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[var(--accent-a)] mb-1">
          <span>Daily Tip</span>
          <span className="text-[var(--text-faint)] font-normal">&middot; {tip.skill}</span>
        </div>
        <p className="text-sm text-[var(--text-dim)] leading-relaxed">{tip.text}</p>
      </div>
    </GlassPanel>
  );
};
