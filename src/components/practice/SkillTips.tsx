import React from 'react';

interface SkillTipsProps {
  skill: 'speaking' | 'reading' | 'listening' | 'writing';
}

const tips: Record<SkillTipsProps['skill'], string[]> = {
  speaking: [
    'Speak clearly and naturally.',
    'Answer the question directly before adding details.',
    'Use a range of vocabulary and grammatical structures.',
    'Avoid memorized answers.',
    'Develop your answers with examples and explanations.',
  ],

  reading: [
    'Read the questions carefully.',
    'Look for keywords and paraphrases.',
    'Manage your time across all passages.',
  ],

  listening: [
    'Read the questions before the recording starts.',
    'Listen for synonyms and paraphrases.',
    'Check spelling and grammar in your answers.',
  ],

  writing: [
    'Plan your answer before writing.',
    'Use clear paragraph structure.',
    'Support your ideas with relevant examples.',
  ],
};

export const SkillTips: React.FC<SkillTipsProps> = ({ skill }) => {
  const skillTips = tips[skill];

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h3 className="text-lg font-semibold text-[var(--text)]">
        {skill.charAt(0).toUpperCase() + skill.slice(1)} Tips
      </h3>

      <div className="mt-4 space-y-3">
        {skillTips.map((tip, index) => (
          <div
            key={`${skill}-tip-${index}`}
            className="flex items-start gap-3"
          >
            <span className="mt-1 text-[var(--accent-a)]">•</span>

            <p className="text-sm text-[var(--text-dim)]">
              {tip}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};