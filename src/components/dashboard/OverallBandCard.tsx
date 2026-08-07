import React from 'react';
import { GlassPanel } from '../ui/GlassPanel';
import { ProgressBar } from '../ui/ProgressBar';
import { bandSummary, skillScores } from '../../lib/data';
import { Trophy, TrendingUp, Sparkles } from '../ui/icons';

interface OverallBandCardProps {
  id?: string;
  onNavigateAction?: (route: string) => void;
}

export const OverallBandCard: React.FC<OverallBandCardProps> = ({ id, onNavigateAction }) => {
  return (
    <GlassPanel id={id} className="relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-mono mb-2">
            <Sparkles size={13} />
            <span>AI Verified Band Diagnostic</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-[var(--text)]">
            Overall Band Score
          </h2>
          <p className="text-xs text-[var(--text-dim)] mt-1">
            Target Goal: Band {bandSummary.target} · Exam Date: Sep 15, 2026
          </p>
        </div>

        {/* Big Score Dial Display */}
        <div className="flex items-center gap-4 bg-[var(--bg-elevated)] p-4 rounded-2xl border border-[var(--border)]">
          <div className="w-16 h-16 rounded-xl bg-[var(--accent-gradient)] flex flex-col items-center justify-center text-white shadow-lg shadow-[var(--glow-a)]">
            <span className="font-display font-extrabold text-2xl leading-none">
              {bandSummary.overall}
            </span>
            <span className="text-[10px] font-mono opacity-80 uppercase tracking-widest mt-0.5">
              Band
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--success)]">
              <TrendingUp size={14} />
              <span>+0.5 improvement vs last mock</span>
            </div>
            <div className="text-xs text-[var(--text-dim)] mt-1">
              92% confidence level across 12 tests
            </div>
          </div>
        </div>
      </div>

      {/* 4 Skill Score Breakdown Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {skillScores.map((item) => (
          <div
            key={item.skill}
            onClick={() => onNavigateAction?.(item.skill.toLowerCase())}
            className="p-3.5 rounded-xl bg-[var(--panel-2)]/50 border border-[var(--border)] hover:border-[var(--border-strong)] transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-[var(--text)] group-hover:text-[var(--accent-a)] transition-colors">
                {item.skill}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[var(--text-faint)]">
                  {item.change}
                </span>
                <span className="font-display font-bold text-sm text-[var(--text)]">
                  Band {item.band}
                </span>
              </div>
            </div>
            <ProgressBar value={(item.band / 9.0) * 100} showPercent={false} size="sm" />
          </div>
        ))}
      </div>
    </GlassPanel>
  );
};
