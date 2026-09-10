import React from 'react';
import { SkillType } from '../../types';

interface SkillTagProps {
  skill: SkillType | 'Reading' | 'Listening' | 'Writing' | 'Speaking' | 'Mock';
  size?: 'sm' | 'md';
  className?: string;
  id?: string;
}

export const SkillTag: React.FC<SkillTagProps> = ({ skill, size = 'md', className = '', id }) => {
  const normalized = skill.toLowerCase();

  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    reading: {
      bg: 'rgba(63, 143, 176, 0.15)',
      text: '#3f8fb0',
      border: 'rgba(63, 143, 176, 0.3)',
    },
    listening: {
      bg: 'rgba(139, 140, 240, 0.15)',
      text: '#8b8cf0',
      border: 'rgba(139, 140, 240, 0.3)',
    },
    writing: {
      bg: 'rgba(232, 164, 99, 0.15)',
      text: '#e8a463',
      border: 'rgba(232, 164, 99, 0.3)',
    },
    speaking: {
      bg: 'rgba(16, 185, 129, 0.15)',
      text: '#10b981',
      border: 'rgba(16, 185, 129, 0.3)',
    },
    mock: {
      bg: 'rgba(217, 122, 63, 0.15)',
      text: '#d97a3f',
      border: 'rgba(217, 122, 63, 0.3)',
    },
  };

  const style = colorMap[normalized] || colorMap.writing;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      id={id}
      className={`inline-flex items-center font-mono font-medium rounded-full border ${padding} ${className}`}
      style={{
        backgroundColor: style.bg,
        color: style.text,
        borderColor: style.border,
      }}
    >
      {skill.charAt(0).toUpperCase() + skill.slice(1)}
    </span>
  );
};
