import React, { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { SkillTag } from '../components/ui/SkillTag';
import { submissionsHistory } from '../lib/data';
import { SubmissionItem } from '../types';
import { History, Trophy, ArrowUpRight, Sparkles, CheckCircle2 } from '../components/ui/icons';

interface SubmissionsViewProps {
  id?: string;
}

export const SubmissionsView: React.FC<SubmissionsViewProps> = ({ id }) => {
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionItem | null>(null);

  return (
    <div id={id} className="space-y-6">
      {/* Header Banner */}
      <GlassPanel className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-mono mb-2">
              <History size={14} />
              <span>Archive & Performance Log</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text)]">
              Practice Submissions History
            </h2>
            <p className="text-xs text-[var(--text-dim)] mt-1">
              Review past essays, speaking recordings, and reading attempts with full criterion audit logs.
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* List of Submissions */}
      <div className="space-y-4">
        {submissionsHistory.map((item) => (
          <GlassPanel
            key={item.id}
            interactive
            onClick={() => setSelectedSubmission(item)}
            className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] flex items-center justify-center font-display font-bold text-lg text-[var(--text)] group-hover:border-[var(--accent-a)] transition-colors">
                {item.bandScore}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <SkillTag skill={item.type} size="sm" />
                  <span className="text-[11px] font-mono text-[var(--text-faint)]">{item.submittedAt}</span>
                </div>
                <h3 className="font-display font-bold text-base text-[var(--text)] group-hover:text-[var(--accent-a)] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--text-dim)] line-clamp-1 mt-0.5">
                  {item.details.feedback}
                </p>
              </div>
            </div>

            <button className="self-end md:self-auto text-xs font-mono text-[var(--accent-a)] flex items-center gap-1 hover:underline cursor-pointer shrink-0">
              <span>View Audit Log</span>
              <ArrowUpRight size={14} />
            </button>
          </GlassPanel>
        ))}
      </div>

      {/* Submission Audit Log Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <GlassPanel className="max-w-2xl w-full p-6 space-y-5 max-h-[85vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-3">
                <SkillTag skill={selectedSubmission.type} />
                <div>
                  <h3 className="font-display font-bold text-lg text-[var(--text)]">
                    {selectedSubmission.title}
                  </h3>
                  <span className="text-xs font-mono text-[var(--text-faint)]">
                    Submitted: {selectedSubmission.submittedAt}
                  </span>
                </div>
              </div>

              <div className="px-3 py-1 rounded-xl bg-[var(--accent-gradient)] text-white font-display font-bold text-base">
                Band {selectedSubmission.bandScore}
              </div>
            </div>

            {/* Candidate Response Snippet */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
              <div className="text-[11px] font-mono uppercase text-[var(--text-faint)] mb-1">
                Candidate Response Text
              </div>
              <p className="text-xs text-[var(--text)] italic leading-relaxed">
                "{selectedSubmission.details.userResponse}"
              </p>
            </div>

            {/* Evaluations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedSubmission.details.evaluations.map((e, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--border)]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-[var(--text)]">{e.label}</span>
                    <span className="font-mono text-xs font-bold text-[var(--accent-a)]">{e.score}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-dim)] leading-tight">{e.notes}</p>
                </div>
              ))}
            </div>

            {/* Feedback */}
            <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--border)]">
              <div className="text-xs font-mono font-semibold text-[var(--accent-a)] mb-1 flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>Examiner Action Notes</span>
              </div>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                {selectedSubmission.details.feedback}
              </p>
            </div>

            <div className="text-right">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-strong)] text-xs font-mono text-[var(--text)] cursor-pointer"
              >
                Close Log
              </button>
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
};
