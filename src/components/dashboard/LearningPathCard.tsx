import React from 'react';
import { GlassPanel } from '../ui/GlassPanel';
import { SkillTag } from '../ui/SkillTag';
import { learningPath } from '../../lib/data';
import { ArrowUpRight, Clock, Sparkles } from '../ui/icons';

interface LearningPathCardProps {
  id?: string;
  onNavigateAction?: (route: string) => void;
}

export const LearningPathCard: React.FC<LearningPathCardProps> = ({ id, onNavigateAction }) => {
  return (
    <GlassPanel id={id} className="relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent-a)] mb-1">
            <Sparkles size={14} />
            <span>AI Curriculum Recommendation</span>
          </div>
          <h3 className="font-display text-xl font-bold text-[var(--text)]">
            Targeted Learning Path
          </h3>
        </div>
        <button
          onClick={() => onNavigateAction?.('writing')}
          className="text-xs font-mono text-[var(--accent-a)] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="space-y-3">
        {learningPath.map((item) => (
          <div
            key={item.id}
            onClick={() => onNavigateAction?.(item.skill)}
            className="p-3.5 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)] hover:border-[var(--border-strong)] transition-all cursor-pointer flex items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-3">
              <SkillTag skill={item.skill} size="sm" className="mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-[var(--text)] group-hover:text-[var(--accent-a)] transition-colors">
                  {item.title}
                </h4>
                <span className="text-[11px] text-[var(--text-dim)] font-mono">
                  {item.level}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-mono text-[var(--text-faint)] flex items-center gap-1 hidden sm:flex">
                <Clock size={12} />
                {item.duration}
              </span>
              <button className="px-3 py-1 rounded-lg bg-[var(--accent-gradient)] text-white font-mono text-xs font-semibold shadow-sm group-hover:scale-105 transition-transform">
                Start
              </button>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
};
