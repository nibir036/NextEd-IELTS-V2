import React, { useState, useEffect, useRef } from 'react';
import { GlassPanel } from '../ui/GlassPanel';
import { Button } from '../ui/Button';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  Clock,
  TrendingUp,
  FileCheck,
  Check,
  Sparkles,
} from '../ui/icons';
import type { DbUser, DashboardData } from '../../lib/db';

interface DashboardCarouselProps {
  onNavigateAction: (route: string) => void;
  user: DbUser;
  data: DashboardData | null;
  loading?: boolean;
}

const SKILL_LABELS: { key: 'listening' | 'reading' | 'writing' | 'speaking'; label: string }[] = [
  { key: 'listening', label: 'Listening' },
  { key: 'reading', label: 'Reading' },
  { key: 'writing', label: 'Writing' },
  { key: 'speaking', label: 'Speaking' },
];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const DashboardCarousel: React.FC<DashboardCarouselProps> = ({
  onNavigateAction,
  user,
  data,
  loading,
}) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = 5;

  const slides = [
    { id: 0, label: 'Overall Band Score', icon: Award },
    { id: 1, label: 'Daily Streak', icon: Flame },
    { id: 2, label: '30-Day Progress', icon: TrendingUp },
    { id: 3, label: 'Practice Hours', icon: Clock },
    { id: 4, label: 'Tests Completed', icon: FileCheck },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, totalSlides]);

  const handleNext = () => setActiveSlide((prev) => (prev + 1) % totalSlides);
  const handlePrev = () => setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  // --- Derived, real values (with safe fallbacks) ---
  const currentBand = user.currentBand > 0 ? user.currentBand : null;
  const targetBand = user.targetBand || 0;
  const streakDays = data?.streakDays ?? 0;
  const practiceHours = data?.practiceHours ?? 0;
  const testsCompleted = data?.testsCompleted ?? 0;
  const mockCount = data?.mockCount ?? 0;
  const modularCount = data?.modularCount ?? 0;
  const trend = data?.trend ?? null;

  // Map weekly activity onto Mon–Sun columns for the streak checklist.
  const weekActivity = DAY_LABELS.map((label, idx) => {
    const match = data?.weeklyActivity?.find((d) => new Date(d.date).getUTCDay() === idx);
    return { label, active: match?.active ?? false };
  });
  // Reorder to start Monday for display.
  const weekMonFirst = [...weekActivity.slice(1), weekActivity[0]];

  const anySkillBand = data
    ? SKILL_LABELS.some(({ key }) => data.skillBands[key] !== null)
    : false;

  // Same five card bodies as before, just parameterized by index instead
  // of reading the closure's activeSlide directly -- lets us render two
  // cards (a left and a right slot) side by side instead of one at a time.
  const renderCardBody = (idx: number) => {
    switch (idx) {
      case 0:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[var(--accent-a)]">
                  <Award size={16} />
                  <span>Card 1 • Band Score Diagnostics</span>
                </div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-[var(--text)] mt-1">
                  Overall Band Score & Skill Breakdown
                </h3>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl font-extrabold text-[var(--accent-a)]">
                  {currentBand !== null ? `Band ${currentBand.toFixed(1)}` : '—'}
                </div>
                <div className="text-[11px] font-mono text-[var(--text-faint)]">
                  Target: Band {targetBand.toFixed(1)}
                </div>
              </div>
            </div>

            {anySkillBand ? (
              <div className="space-y-4">
                {SKILL_LABELS.map(({ key, label }) => {
                  const band = data?.skillBands[key] ?? null;
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
                          className="h-full bg-[image:var(--accent-gradient)] rounded-full transition-all duration-500"
                          style={{ width: band !== null ? `${(band / 9.0) * 100}%` : '0%' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-[var(--text-dim)]">
                No skill assessments yet. Complete a practice test to see your band breakdown.
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button size="sm" onClick={() => onNavigateAction('writing')} className="flex items-center gap-1.5">
                <span>Start a Practice Test</span>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[var(--warning)]">
                  <Flame size={16} />
                  <span>Card 2 • Consistency Metrics</span>
                </div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-[var(--text)] mt-1">
                  Daily Study Streak
                </h3>
              </div>
              <div className="flex items-center gap-2 bg-[var(--warning)]/15 border border-[var(--warning)]/30 px-3 py-1.5 rounded-xl">
                <Flame size={22} className="text-[var(--warning)]" />
                <div className="font-display font-extrabold text-2xl text-[var(--text)]">
                  {streakDays} <span className="text-xs font-normal text-[var(--text-dim)]">Days Active</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-[var(--text-dim)]">
              Candidates who maintain a 10+ day consecutive study streak show a 0.5+ band score improvement within 3 weeks.
            </p>

            <div className="space-y-2">
              <div className="text-xs font-mono text-[var(--text-faint)] uppercase">
                This Week&apos;s Activity Log:
              </div>
              <div className="grid grid-cols-7 gap-2 text-center">
                {weekMonFirst.map((day, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 ${
                      day.active
                        ? 'bg-[var(--accent-a)]/15 border-[var(--accent-a)]/40 text-[var(--accent-a)]'
                        : 'bg-[var(--bg)] border-[var(--border)] text-[var(--text-faint)]'
                    }`}
                  >
                    <span className="text-[10px] font-mono uppercase font-bold">{day.label}</span>
                    {day.active ? <Check size={16} /> : <span className="text-xs">•</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] flex items-center justify-between text-xs">
              <span className="text-[var(--text-dim)]">Total practice logged</span>
              <span className="font-mono font-bold text-[var(--success)]">{practiceHours} hrs</span>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[var(--success)]">
                  <TrendingUp size={16} />
                  <span>Card 3 • Growth Velocity</span>
                </div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-[var(--text)] mt-1">
                  30-Day Band Score Trajectory
                </h3>
              </div>
              {trend && (
                <div className="px-3 py-1.5 rounded-xl bg-[var(--success)]/15 text-[var(--success)] font-mono font-bold text-sm">
                  {trend.gain >= 0 ? '+' : ''}{trend.gain.toFixed(1)} Band
                </div>
              )}
            </div>

            {trend ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-dim)]">Earliest (last 30 days):</span>
                    <span className="font-mono font-bold text-[var(--text)]">Band {trend.startBand.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-dim)]">Most Recent Score:</span>
                    <span className="font-mono font-bold text-[var(--accent-a)]">Band {trend.latestBand.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-dim)]">Target Exam Score:</span>
                    <span className="font-mono font-bold text-[var(--text)]">Band {targetBand.toFixed(1)}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] space-y-2">
                  <div className="text-xs font-mono text-[var(--text-faint)] flex justify-between">
                    <span>Start: {trend.startBand.toFixed(1)}</span>
                    <span>Now: {trend.latestBand.toFixed(1)}</span>
                    <span>Target: {targetBand.toFixed(1)}</span>
                  </div>
                  <div className="w-full h-4 rounded-full bg-[var(--bg)] border border-[var(--border)] overflow-hidden flex">
                    <div
                      className="bg-[image:var(--accent-gradient)] h-full"
                      style={{ width: `${Math.min(100, (trend.latestBand / 9) * 100)}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-sm text-[var(--text-dim)]">
                Not enough scored submissions in the last 30 days to plot a trend yet.
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[var(--accent-a)]">
                  <Clock size={16} />
                  <span>Card 4 • Effort & Engagement</span>
                </div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-[var(--text)] mt-1">
                  Practice Hours Logged
                </h3>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl font-extrabold text-[var(--text)]">
                  {practiceHours} <span className="text-sm font-normal text-[var(--text-dim)]">Hours</span>
                </div>
              </div>
            </div>

            {practiceHours > 0 ? (
              <p className="text-sm text-[var(--text-dim)]">
                You&apos;ve logged {practiceHours} hours of focused practice. Keep a steady daily rhythm to build toward Band {targetBand.toFixed(1)} readiness.
              </p>
            ) : (
              <div className="py-8 text-center text-sm text-[var(--text-dim)]">
                No practice time logged yet. Your hours accumulate as you complete tests.
              </div>
            )}

            <Button onClick={() => onNavigateAction('mock-tests')} className="w-full flex items-center justify-center gap-2">
              <Sparkles size={16} />
              <span>Start Practicing</span>
            </Button>
          </div>
        );

      case 4:
      default:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[var(--accent-a)]">
                  <FileCheck size={16} />
                  <span>Card 5 • Assessment Record</span>
                </div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-[var(--text)] mt-1">
                  Tests & Skill Modules Completed
                </h3>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl font-extrabold text-[var(--text)]">
                  {testsCompleted} <span className="text-sm font-normal text-[var(--text-dim)]">Total</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[var(--panel-2)] border border-[var(--border)] space-y-2">
                <div className="text-xs font-mono text-[var(--text-faint)] uppercase">Full Mock Exams:</div>
                <div className="font-display font-bold text-2xl text-[var(--accent-a)]">{mockCount} Exams</div>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--panel-2)] border border-[var(--border)] space-y-2">
                <div className="text-xs font-mono text-[var(--text-faint)] uppercase">Modular Practice Sets:</div>
                <div className="font-display font-bold text-2xl text-[var(--text)]">{modularCount} Sets</div>
              </div>
            </div>

            <Button onClick={() => onNavigateAction('mock-tests')} className="w-full flex items-center justify-center gap-2">
              <Sparkles size={16} />
              <span>Take Full Timed Mock Test Now</span>
            </Button>
          </div>
        );
    }
  };

  const rightSlide = (activeSlide + 1) % totalSlides;

  return (
    <div
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      className="space-y-4"
    >
      {/* Carousel Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--panel-2)]/80 p-2 rounded-2xl border border-[var(--border)]">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {slides.map((slide) => {
            const Icon = slide.icon;
            const isActive = activeSlide === slide.id || rightSlide === slide.id;
            return (
              <button
                key={slide.id}
                onClick={() => setActiveSlide(slide.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[image:var(--accent-gradient)] text-white shadow-md'
                    : 'text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--bg)]'
                }`}
              >
                <Icon size={14} />
                <span>{slide.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono text-[var(--text-faint)]">
            Cards {activeSlide + 1}–{rightSlide + 1} of {totalSlides}
          </span>
          <button
            onClick={handlePrev}
            title="Previous Card"
            className="w-8 h-8 rounded-lg bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--text)] hover:border-[var(--accent-a)] transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            title="Next Card"
            className="w-8 h-8 rounded-lg bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--text)] hover:border-[var(--accent-a)] transition-colors cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Two-card viewport: left card holds its slot as the carousel
          advances, right card is the one new entrant sliding in --
          matches "displayed 2 at a time, slides to the next one entering
          only one" rather than swapping both cards at once. */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassPanel
          key={`left-${activeSlide}`}
          className="p-6 md:p-8 relative min-h-[380px] flex flex-col justify-between border border-[var(--border)] shadow-xl overflow-hidden animate-carouselShiftIn"
        >
          {renderCardBody(activeSlide)}
        </GlassPanel>
        <GlassPanel
          key={`right-${rightSlide}`}
          className="p-6 md:p-8 relative min-h-[380px] flex flex-col justify-between border border-[var(--border)] shadow-xl overflow-hidden animate-carouselSlideIn hidden lg:flex"
        >
          {renderCardBody(rightSlide)}
        </GlassPanel>
      </div>

      {/* Indicator Dots */}
      <div className="flex items-center justify-center gap-2 pt-1">
        {slides.map((slide) => (
          <button
            key={slide.id}
            onClick={() => setActiveSlide(slide.id)}
            title={slide.label}
            className={`h-2.5 rounded-full transition-all cursor-pointer ${
              activeSlide === slide.id || rightSlide === slide.id
                ? 'w-8 bg-[var(--accent-a)]'
                : 'w-2.5 bg-[var(--border)] hover:bg-[var(--text-faint)]'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
