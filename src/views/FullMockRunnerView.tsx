import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { BackLink } from '../components/ui/BackLink';
import { GlassPanel } from '../components/ui/GlassPanel';
import { ListeningExamView } from './ListeningExamView';
import { ReadingExamView } from './ReadingExamView';
import { WritingView } from './WritingView';
import { SpeakingView } from './SpeakingView';
import { ieltsOverall } from '../lib/scoring';
import {
  Clock, Trophy, ArrowRight, Headphones, BookOpen, PenTool, Mic, Sparkles, CheckCircle2,
} from '../components/ui/icons';

type Skill = 'listening' | 'reading' | 'writing' | 'speaking';

interface MockSection {
  position: number;
  skill: Skill;
  testId: string;
  title: string;
  durationSeconds: number | null;
}

interface MockTestDetail {
  id: string;
  title: string;
  description: string;
  sections: MockSection[];
  totalDurationSeconds: number;
}

interface FullMockRunnerViewProps {
  id?: string;
  // The mock test to run, taken from the route's sub-path (see App.tsx).
  mockTestId: string | null;
  onNavigateAction?: (route: string) => void;
}

const SKILL_META: Record<Skill, { label: string; Icon: typeof Headphones }> = {
  listening: { label: 'Listening', Icon: Headphones },
  reading: { label: 'Reading', Icon: BookOpen },
  writing: { label: 'Writing', Icon: PenTool },
  speaking: { label: 'Speaking', Icon: Mic },
};

// Drives a real, complete 4-skill IELTS mock test end-to-end: an intro
// screen with the section breakdown, then Listening -> Reading -> Writing
// -> Speaking in sequence (each rendered by reusing that skill's own,
// already-built exam view in "forced" mode -- see forcedTestId/
// onExamComplete on those views), and finally a combined band report
// (mean of the 4 section bands, using the same IELTS rounding rule as the
// running overall-band system).
export const FullMockRunnerView: React.FC<FullMockRunnerViewProps> = ({ id, mockTestId, onNavigateAction }) => {
  const [mockTest, setMockTest] = useState<MockTestDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [phase, setPhase] = useState<'intro' | 'running' | 'report'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bands, setBands] = useState<Partial<Record<Skill, number>>>({});

  useEffect(() => {
    if (!mockTestId) return;
    let cancelled = false;
    setMockTest(null);
    setLoadError(null);
    fetch(`/api/mock-tests?id=${mockTestId}`, { credentials: 'include' })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Could not load this mock test.');
        if (!cancelled) setMockTest(data.mockTest);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Could not load this mock test.');
      });
    return () => {
      cancelled = true;
    };
  }, [mockTestId]);

  if (!mockTestId) {
    return (
      <div id={id} className="max-w-lg mx-auto">
        <GlassPanel className="p-8 text-center text-sm text-[var(--text-dim)] border border-[var(--border)] shadow-lg">
          No mock test selected.
        </GlassPanel>
      </div>
    );
  }

  if (loadError) {
    return (
      <div id={id} className="max-w-lg mx-auto space-y-4">
        <BackLink onClick={() => onNavigateAction?.('mock-tests')}>Back to mock tests</BackLink>
        <GlassPanel className="p-6 text-sm text-[var(--danger)] border border-[var(--border)] shadow-lg">
          {loadError}
        </GlassPanel>
      </div>
    );
  }

  if (!mockTest) {
    return (
      <div id={id} className="max-w-lg mx-auto">
        <GlassPanel className="p-8 text-center text-sm text-[var(--text-dim)] border border-[var(--border)] shadow-lg">
          Loading mock test…
        </GlassPanel>
      </div>
    );
  }

  const handleSectionComplete = (skill: Skill, band: number) => {
    setBands((b) => ({ ...b, [skill]: band }));
  };

  const handleContinue = () => {
    if (currentIndex + 1 >= mockTest.sections.length) {
      setPhase('report');
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  // ---------- INTRO ----------
  if (phase === 'intro') {
    return (
      <div id={id} className="max-w-2xl mx-auto space-y-6">
        <BackLink onClick={() => onNavigateAction?.('mock-tests')}>Back to mock tests</BackLink>
        <GlassPanel className="p-8 border border-[var(--border)] shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--panel-2)] border border-[var(--border)] text-[var(--accent-a)] flex items-center justify-center shadow-lg">
              <Sparkles size={26} />
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text)]">{mockTest.title}</h2>
            <p className="text-xs text-[var(--text-dim)] max-w-md mx-auto leading-relaxed">{mockTest.description}</p>
          </div>

          <div className="space-y-2">
            {mockTest.sections.map((s) => {
              const meta = SKILL_META[s.skill];
              const Icon = meta.Icon;
              return (
                <div
                  key={s.testId}
                  className="flex items-center justify-between p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--border)]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--accent-a)] flex items-center justify-center shrink-0">
                      <Icon size={16} />
                    </span>
                    <div>
                      <div className="text-[11px] font-mono uppercase text-[var(--text-faint)]">{meta.label}</div>
                      <div className="text-sm text-[var(--text)]">{s.title}</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[var(--text-faint)] flex items-center gap-1 shrink-0">
                    <Clock size={12} /> {s.durationSeconds ? Math.round(s.durationSeconds / 60) : '--'} min
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-[var(--text-faint)] text-center leading-relaxed">
            About {Math.round(mockTest.totalDurationSeconds / 60)} minutes total across all 4 skills, taken back to
            back. Each section is timed and auto-scored (or AI-evaluated) the moment you submit it — you cannot go
            back to a previous section once you continue.
          </p>

          <div className="flex justify-center">
            <Button variant="primary" size="lg" icon={<ArrowRight size={16} />} onClick={() => setPhase('running')}>
              Begin Full Mock Test
            </Button>
          </div>
        </GlassPanel>
      </div>
    );
  }

  // ---------- REPORT ----------
  if (phase === 'report') {
    const allBands = Object.values(bands).filter((b): b is number => typeof b === 'number');
    const overall = ieltsOverall(allBands);
    return (
      <div id={id} className="max-w-2xl mx-auto space-y-6">
        <GlassPanel className="p-8 text-center space-y-4 border border-[var(--border)] shadow-lg">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--panel-2)] border border-[var(--border)] text-[var(--accent-a)] flex items-center justify-center shadow-lg">
            <Trophy size={30} />
          </div>
          <div>
            <div className="text-xs font-mono uppercase text-[var(--text-faint)]">Overall Band — {mockTest.title}</div>
            <div className="font-display font-extrabold text-5xl text-[var(--text)] mt-1">
              {overall !== null ? overall.toFixed(1) : '—'}
            </div>
            <p className="text-[11px] text-[var(--text-faint)] mt-2 max-w-md mx-auto">
              Mean of your 4 section bands, rounded to the nearest half band per the official IELTS rounding rule.
            </p>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 space-y-3 border border-[var(--border)] shadow-lg">
          <h3 className="font-display font-bold text-base text-[var(--text)]">Section Bands</h3>
          <div className="grid grid-cols-2 gap-3">
            {mockTest.sections.map((s) => {
              const meta = SKILL_META[s.skill];
              const Icon = meta.Icon;
              const band = bands[s.skill];
              return (
                <div
                  key={s.testId}
                  className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2 text-xs text-[var(--text-dim)]">
                    <span className="w-6 h-6 rounded-md bg-[var(--bg)] border border-[var(--border)] text-[var(--accent-a)] flex items-center justify-center shrink-0">
                      <Icon size={12} />
                    </span>
                    {meta.label}
                  </span>
                  <span className="font-display font-bold text-sm text-[var(--text)]">
                    {band !== undefined ? band.toFixed(1) : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassPanel>

        <div className="flex justify-center">
          <Button variant="secondary" size="md" onClick={() => onNavigateAction?.('mock-tests')}>
            Back to mock tests
          </Button>
        </div>
      </div>
    );
  }

  // ---------- RUNNING ----------
  const section = mockTest.sections[currentIndex];
  const meta = SKILL_META[section.skill];
  const band = bands[section.skill];
  const isLast = currentIndex + 1 >= mockTest.sections.length;

  const sectionView = (() => {
    switch (section.skill) {
      case 'listening':
        return (
          <ListeningExamView
            forcedTestId={section.testId}
            onExamComplete={(b) => handleSectionComplete('listening', b)}
          />
        );
      case 'reading':
        return (
          <ReadingExamView
            forcedTestId={section.testId}
            onExamComplete={(b) => handleSectionComplete('reading', b)}
          />
        );
      case 'writing':
        return (
          <WritingView forcedTestId={section.testId} onExamComplete={(b) => handleSectionComplete('writing', b)} />
        );
      case 'speaking':
        return (
          <SpeakingView forcedTestId={section.testId} onExamComplete={(b) => handleSectionComplete('speaking', b)} />
        );
      default:
        return null;
    }
  })();

  return (
    <div id={id} className="space-y-4">
      <GlassPanel className="p-4 border border-[var(--border)] shadow-lg flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {mockTest.sections.map((s, i) => {
            const m = SKILL_META[s.skill];
            const Icon = m.Icon;
            const done = bands[s.skill] !== undefined;
            const active = i === currentIndex;
            return (
              <span
                key={s.testId}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${
                  active
                    ? 'bg-[image:var(--accent-gradient)] border-transparent text-white shadow-md'
                    : done
                      ? 'border-[var(--border)] bg-[var(--panel-2)] text-[var(--text)]'
                      : 'border-[var(--border)] bg-[var(--panel-2)] text-[var(--text-faint)]'
                }`}
              >
                {done ? <CheckCircle2 size={12} /> : <Icon size={12} />} {m.label}
              </span>
            );
          })}
        </div>
        <span className="text-[11px] font-mono text-[var(--text-dim)]">{mockTest.title}</span>
      </GlassPanel>

      {sectionView}

      {band !== undefined && (
        <GlassPanel className="p-4 border border-[var(--border)] shadow-lg flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs text-[var(--text-dim)]">
            {meta.label} scored — Band {band.toFixed(1)}. Review your results above, then continue.
          </span>
          <Button variant="primary" size="md" icon={<ArrowRight size={16} />} onClick={handleContinue}>
            {isLast ? 'See Combined Band Report' : `Continue to ${SKILL_META[mockTest.sections[currentIndex + 1].skill].label}`}
          </Button>
        </GlassPanel>
      )}
    </div>
  );
};
