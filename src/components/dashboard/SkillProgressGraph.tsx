import React from 'react';
import { GlassPanel } from '../ui/GlassPanel';
import { TrendingUp } from '../ui/icons';
import type { DashboardData } from '../../lib/db';

const SKILL_LABELS: { key: 'listening' | 'reading' | 'writing' | 'speaking'; label: string }[] = [
  { key: 'listening', label: 'Listening' },
  { key: 'reading', label: 'Reading' },
  { key: 'writing', label: 'Writing' },
  { key: 'speaking', label: 'Speaking' },
];

export const SkillProgressGraph: React.FC<{ data: DashboardData | null; id?: string }> = ({
  data,
  id,
}) => {
  const anyBand = data ? SKILL_LABELS.some(({ key }) => data.skillBands[key] !== null) : false;

  return (
    <GlassPanel id={id} className="p-6 border border-[var(--border)] h-full flex flex-col">
      <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[var(--accent-a)] mb-1">
        <TrendingUp size={16} />
        <span>Analytics</span>
      </div>
      <h3 className="font-display text-xl font-bold text-[var(--text)] mb-5">
        Skill Progress Tracker
      </h3>

      {anyBand ? (
        <div className="space-y-4 flex-1">
          {SKILL_LABELS.map(({ key, label }, idx) => {
            const band = data?.skillBands[key] ?? null;
            const pct = band !== null ? Math.min(100, (band / 9) * 100) : 0;
            return (
              <div key={key} className="space-y-1.5">
                <div className="flex justify-between text-xs md:text-sm font-medium">
                  <span className="text-[var(--text)] font-semibold">{label}</span>
                  <span className="font-mono font-bold text-[var(--accent-a)]">
                    {band !== null ? `Band ${band.toFixed(1)}` : 'Not assessed'}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-[var(--bg)] border border-[var(--border)] overflow-hidden">
                  <div
                    className="h-full bg-[image:var(--accent-gradient)] rounded-full transition-[width] duration-[1200ms] ease-out"
                    style={{ width: `${pct}%`, transitionDelay: `${idx * 120}ms` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-[var(--text-dim)] text-center py-8">
          Complete a practice test in each skill to see your progress here.
        </div>
      )}
    </GlassPanel>
  );
};
