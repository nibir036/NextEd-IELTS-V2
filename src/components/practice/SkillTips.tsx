import React from 'react';
import { GlassPanel } from '../ui/GlassPanel';
import { Sparkles, CheckCircle2 } from '../ui/icons';

type Skill = 'writing' | 'reading' | 'listening' | 'speaking';

// Module-specific Band 8+ tips. Hardcoded for now; can be DB-backed later
// (lessons.section='tips' with a skill tag).
const SKILL_TIPS: Record<Skill, string[]> = {
  writing: [
    'Task 1: always open with a clear overview sentence summarising the main trend or change before any detail.',
    'Task 2: state your position in the introduction and keep it consistent through every body paragraph.',
    'Use a range of cohesive devices, but avoid mechanical overuse of "Firstly/Secondly/Finally".',
    'Spend ~20 min on Task 1 and ~40 min on Task 2 — Task 2 is weighted double.',
    'Paraphrase the prompt in your introduction rather than copying it word-for-word.',
  ],
  reading: [
    'Skim the passage for structure first; do not read every word before looking at the questions.',
    'For "True/False/Not Given", "Not Given" means the text neither confirms nor denies — do not infer.',
    'Locate keywords from the question in the passage, but watch for paraphrased synonyms.',
    'Budget ~20 minutes per passage; do not let one hard question consume your time.',
    'Transfer answers carefully — spelling and grammar must be correct to score.',
  ],
  listening: [
    'Read the questions during the pauses so you know what to listen for next.',
    'Watch for distractors — speakers often correct themselves ("actually, make that...").',
    'Write answers as you hear them; do not wait, the audio only plays once.',
    'Mind the word limit ("no more than two words") — exceeding it scores zero.',
    'Check spelling and singular/plural when you transfer your answers.',
  ],
  speaking: [
    'Part 1: keep answers natural and extend them with a reason or example — avoid one-word replies.',
    'Part 2: use the one-minute prep to jot keywords; cover all the bullet points on the cue card.',
    'Part 3: give opinions and justify them; treat it as a discussion, not a quiz.',
    'Fluency beats perfection — self-correcting endlessly hurts more than a small slip.',
    'Use a range of tenses and some less common vocabulary, but only where it fits naturally.',
  ],
};

export const SkillTips: React.FC<{ skill: Skill }> = ({ skill }) => {
  const tips = SKILL_TIPS[skill];
  if (!tips || tips.length === 0) return null;

  return (
    <GlassPanel className="p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-[var(--accent-a)]" />
        <h3 className="font-display font-bold text-base text-[var(--text)]">Band 8+ Tips &amp; Tricks</h3>
      </div>
      <div className="space-y-2">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-[var(--text-dim)] leading-relaxed">
            <CheckCircle2 size={14} className="text-[var(--success)] shrink-0 mt-0.5" />
            <span>{tip}</span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
};
