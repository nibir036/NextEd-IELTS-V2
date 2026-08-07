import React from 'react';
import { GlassPanel } from '../ui/GlassPanel';
import { SkillTag } from '../ui/SkillTag';
import { recentActivity } from '../../lib/data';
import { History, ArrowUpRight } from '../ui/icons';

interface RecentActivityCardProps {
  id?: string;
  onNavigateAction?: (route: string) => void;
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ id, onNavigateAction }) => {
  return (
    <GlassPanel id={id} className="relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History size={18} className="text-[var(--accent-a)]" />
          <h3 className="font-display text-xl font-bold text-[var(--text)]">
            Recent Practice Submissions
          </h3>
        </div>
        <button
          onClick={() => onNavigateAction?.('submissions')}
          className="text-xs font-mono text-[var(--accent-a)] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Full History</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="space-y-3">
        {recentActivity.map((activity) => (
          <div
            key={activity.id}
            onClick={() => onNavigateAction?.('submissions')}
            className="p-3.5 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)] hover:border-[var(--border-strong)] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
          >
            <div className="flex items-start gap-3">
              <SkillTag skill={activity.skill} size="sm" className="mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-[var(--text)] group-hover:text-[var(--accent-a)] transition-colors">
                  {activity.title}
                </h4>
                <p className="text-[11px] text-[var(--text-dim)] mt-0.5 line-clamp-1">
                  {activity.summary}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              <span className="text-[11px] font-mono text-[var(--text-faint)]">
                {activity.date}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] font-display font-bold text-xs text-[var(--text)]">
                Band {activity.band}
              </span>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
};
