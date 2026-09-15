import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { GlassPanel } from '../components/ui/GlassPanel';
import {
  FileCheck, Sparkles, Clock, ArrowUpRight, Play, Headphones, BookOpen, PenTool, Mic,
} from '../components/ui/icons';

interface MockTestsViewProps {
  onNavigateAction?: (route: string) => void;
  id?: string;
}

type Skill = 'listening' | 'reading' | 'writing' | 'speaking';

interface MockSection {
  position: number;
  skill: Skill;
  testId: string;
  title: string;
  durationSeconds: number | null;
}

interface MockTest {
  id: string;
  title: string;
  description: string;
  sections: MockSection[];
  totalDurationSeconds: number;
}

const SKILL_META: Record<Skill, { label: string; Icon: typeof Headphones }> = {
  listening: { label: 'Listening', Icon: Headphones },
  reading: { label: 'Reading', Icon: BookOpen },
  writing: { label: 'Writing', Icon: PenTool },
  speaking: { label: 'Speaking', Icon: Mic },
};

const fmtDuration = (totalSeconds: number) => {
  const mins = Math.round(totalSeconds / 60);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h} hr${m ? ` ${m} min` : ''}` : `${m} min`;
};

export const MockTestsView: React.FC<MockTestsViewProps> = ({ onNavigateAction, id }) => {
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeExamModal, setActiveExamModal] = useState<MockTest | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch('/api/mock-tests', { credentials: 'include' })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Could not load mock tests.');
        if (!cancelled) setMockTests(data.mockTests);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Could not load mock tests.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div id={id} className="space-y-6">
      {/* Header Banner */}
      <GlassPanel className="p-6 border border-[var(--border)] shadow-lg overflow-hidden">
        <div className="flex flex-col-reverse md:flex-row items-center gap-6">
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--panel-2)] border border-[var(--border)] text-[var(--text)] text-xs font-mono mb-2">
              <FileCheck size={14} />
              <span>Timed Cambridge Exam Simulation</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text)]">
              Full Mock Tests
            </h2>
            <p className="text-xs text-[var(--text-dim)] mt-1">
              Take all 4 skills back to back under real exam timing — Listening, Reading, Writing, and Speaking —
              then get one combined band report.
            </p>
          </div>
          {/* Muted, looping preview clip -- the same module video used on
              the Dashboard/Landing practice cards, framed to match. */}
          <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-[var(--border)] shadow-xl bg-[image:var(--accent-gradient)]">
              <video
                className="w-full h-full object-cover"
                src="/videos/modules/mock-tests.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </GlassPanel>

      {loading && (
        <GlassPanel className="p-8 text-center text-sm text-[var(--text-dim)] border border-[var(--border)] shadow-lg">
          Loading mock tests…
        </GlassPanel>
      )}

      {loadError && (
        <GlassPanel className="p-6 text-sm text-[var(--danger)] border border-[var(--border)] shadow-lg">
          {loadError}
        </GlassPanel>
      )}

      {!loading && !loadError && mockTests.length === 0 && (
        <GlassPanel className="p-10 text-center flex flex-col items-center border border-[var(--border)] shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-[var(--panel-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text)] mb-4">
            <FileCheck size={26} />
          </div>
          <h3 className="font-display text-xl font-bold text-[var(--text)] mb-2">No full mock tests yet</h3>
          <p className="text-xs text-[var(--text-dim)] max-w-sm leading-relaxed">
            Full mock tests are being prepared. In the meantime, practice each skill individually from the sidebar.
          </p>
        </GlassPanel>
      )}

      {/* Mock Test Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockTests.map((test, index) => (
          <GlassPanel
            key={test.id}
            style={{ animationDelay: `${Math.min(index, 14) * 35}ms` }}
            className="p-6 border border-[var(--border)] shadow-lg animate-tileDropIn flex flex-col justify-between group cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full bg-[var(--panel-2)] text-[var(--text)] border border-[var(--border)] text-xs font-mono">
                  Academic
                </span>
                <span className="text-xs font-mono text-[var(--text-dim)] flex items-center gap-1">
                  <Clock size={13} />
                  {fmtDuration(test.totalDurationSeconds)}
                </span>
              </div>

              <h3 className="font-display text-xl font-bold text-[var(--text)] mb-2">
                {test.title}
              </h3>

              <p className="text-xs text-[var(--text-dim)] leading-relaxed mb-4">
                {test.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {test.sections.map((s) => {
                  const meta = SKILL_META[s.skill];
                  const Icon = meta.Icon;
                  return (
                    <span
                      key={s.testId}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--panel-2)] border border-[var(--border)] text-[10px] font-mono text-[var(--text-dim)]"
                    >
                      <Icon size={11} /> {meta.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-4 mt-2 flex items-center justify-between">
              <div className="text-xs font-mono text-[var(--text-dim)]">
                {test.sections.length} sections
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={<Play size={14} />}
                onClick={() => setActiveExamModal(test)}
              >
                Start Simulation
              </Button>
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* Start Exam Confirmation Modal */}
      {activeExamModal && (
        <div className="animate-fadeIn fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <GlassPanel className="animate-pouchPopIn max-w-md w-full p-6 text-center space-y-4 border border-[var(--border)] shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--panel-2)] border border-[var(--border)] text-[var(--text)] flex items-center justify-center shadow-lg">
              <Sparkles size={28} />
            </div>
            <h3 className="font-display font-bold text-xl text-[var(--text)]">
              Ready to begin simulation?
            </h3>
            <p className="text-xs text-[var(--text-dim)] leading-relaxed">
              You are about to start <span className="text-[var(--text)] font-semibold">{activeExamModal.title}</span>.
              Please ensure you are in a quiet environment — this takes about{' '}
              {fmtDuration(activeExamModal.totalDurationSeconds)} across all 4 skills.
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
                  const testId = activeExamModal.id;
                  setActiveExamModal(null);
                  onNavigateAction?.(`mock-runner/${testId}`);
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
