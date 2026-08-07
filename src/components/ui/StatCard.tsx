import React from 'react';
import { GlassPanel } from './GlassPanel';
import { StatSummary } from '../../types';
import * as Icons from './icons';

interface StatCardProps {
  stat: StatSummary;
  id?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ stat, id }) => {
  const IconComponent = (Icons as unknown as Record<string, React.FC<{ size?: number; className?: string }>>)[stat.icon] || Icons.Trophy;

  return (
    <GlassPanel id={id} interactive className="relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-faint)]">
          {stat.label}
        </span>
        <div className="p-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--accent-a)] group-hover:scale-110 transition-transform duration-200">
          <IconComponent size={18} />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-3xl font-bold tracking-tight text-[var(--text)]">
          {stat.value}
        </span>
        {stat.trend && (
          <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20">
            {stat.trend}
          </span>
        )}
      </div>

      <div className="mt-3 text-xs text-[var(--text-dim)] border-t border-[var(--border)] pt-2.5">
        {stat.footnote}
      </div>
    </GlassPanel>
  );
};
