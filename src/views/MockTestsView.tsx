import React, { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { mockTestsList } from '../lib/data';
import { FileCheck, Sparkles, Clock, ArrowUpRight, Play, CheckCircle2 } from '../components/ui/icons';

interface MockTestsViewProps {
  onNavigateAction?: (route: string) => void;
  id?: string;
}

export const MockTestsView: React.FC<MockTestsViewProps> = ({ onNavigateAction, id }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeExamModal, setActiveExamModal] = useState<string | null>(null);

  const categories = ['All', 'Academic', 'General Training', 'Skill Sprint'];

  const filteredTests = selectedCategory === 'All'
    ? mockTestsList
    : mockTestsList.filter((t) => t.category === selectedCategory);

  return (
    <div id={id} className="space-y-6">
      {/* Header Banner */}
      <GlassPanel className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-mono mb-2">
              <FileCheck size={14} />
              <span>Timed Cambridge Exam Simulation</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text)]">
              Full Mock Tests & Section Sprints
            </h2>
            <p className="text-xs text-[var(--text-dim)] mt-1">
              Test your exam readiness under strict official timer constraints with automated AI band reporting.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 bg-[var(--bg-elevated)] p-1.5 rounded-xl border border-[var(--border)] overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[image:var(--accent-gradient)] text-white font-semibold'
                    : 'text-[var(--text-dim)] hover:text-[var(--text)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </GlassPanel>

      {/* Mock Test Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTests.map((test) => (
          <GlassPanel key={test.id} interactive className="p-6 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full bg-[var(--accent-a)]/15 text-[var(--accent-a)] border border-[var(--accent-a)]/30 text-xs font-mono">
                  {test.category}
                </span>
                <span className="text-xs font-mono text-[var(--text-faint)] flex items-center gap-1">
                  <Clock size={13} />
                  {test.duration}
                </span>
              </div>

              <h3 className="font-display text-xl font-bold text-[var(--text)] group-hover:text-[var(--accent-a)] transition-colors mb-2">
                {test.title}
              </h3>

              <p className="text-xs text-[var(--text-dim)] leading-relaxed mb-4">
                {test.description}
              </p>
            </div>

            <div className="border-t border-[var(--border)] pt-4 mt-2 flex items-center justify-between">
              <div className="text-xs font-mono text-[var(--text-faint)]">
                {test.completedCount.toLocaleString()} candidates completed
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={<Play size={14} />}
                onClick={() => setActiveExamModal(test.title)}
              >
                Start Simulation
              </Button>
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* Start Exam Confirmation Modal */}
      {activeExamModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <GlassPanel className="max-w-md w-full p-6 text-center space-y-4 animate-scale-in">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center shadow-lg">
              <Sparkles size={28} />
            </div>
            <h3 className="font-display font-bold text-xl text-[var(--text)]">
              Ready to begin simulation?
            </h3>
            <p className="text-xs text-[var(--text-dim)] leading-relaxed">
              You are about to start <span className="text-[var(--text)] font-semibold">{activeExamModal}</span>. Please ensure you are in a quiet environment.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <Button variant="secondary" size="md" onClick={() => setActiveExamModal(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={<ArrowUpRight size={16} />}
                onClick={() => {
                  setActiveExamModal(null);
                  onNavigateAction?.('writing');
                }}
              >
                Begin Exam Timer
              </Button>
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
};
