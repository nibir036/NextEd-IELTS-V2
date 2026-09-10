'use client';

import React, { useEffect, useState } from 'react';
import { GlassPanel } from '../ui/GlassPanel';
import { Award } from '../ui/icons';

export const GoalPieChart: React.FC<{
  currentBand: number;
  targetBand: number;
  id?: string;
}> = ({ currentBand, targetBand, id }) => {
  const pct = targetBand > 0 ? Math.min(100, Math.round((currentBand / targetBand) * 100)) : 0;

  // Animate the ring fill in on mount rather than snapping straight to
  // its final value.
  const [animatedPct, setAnimatedPct] = useState(0);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimatedPct(pct));
    return () => cancelAnimationFrame(raf);
  }, [pct]);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPct / 100) * circumference;

  return (
    <GlassPanel id={id} className="p-6 border border-[var(--border)] h-full flex flex-col">
      <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[var(--accent-a)] mb-1">
        <Award size={16} />
        <span>Goal Completion</span>
      </div>
      <h3 className="font-display text-xl font-bold text-[var(--text)] mb-5">
        Progress to Target Band
      </h3>

      <div className="flex-1 flex items-center justify-center gap-6">
        <div className="relative w-32 h-32 shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="var(--bg)"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="var(--accent-a)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display font-extrabold text-2xl text-[var(--text)]">{pct}%</span>
            <span className="text-[10px] font-mono text-[var(--text-faint)] uppercase">of goal</span>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <div className="text-[var(--text-faint)] font-mono uppercase">Current</div>
            <div className="font-display font-bold text-lg text-[var(--text)]">
              {currentBand > 0 ? currentBand.toFixed(1) : '—'}
            </div>
          </div>
          <div>
            <div className="text-[var(--text-faint)] font-mono uppercase">Target</div>
            <div className="font-display font-bold text-lg text-[var(--accent-a)]">
              {targetBand.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
};
