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
import { currentUser, skillScores } from '../../lib/data';

interface DashboardCarouselProps {
  onNavigateAction: (route: string) => void;
}

export const DashboardCarousel: React.FC<DashboardCarouselProps> = ({ onNavigateAction }) => {
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

  // Auto-slide logic
  useEffect(() => {
    if (!isAutoPlaying) return;

    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, totalSlides]);

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      className="space-y-4"
    >
      {/* Carousel Top Navigation Bar & Direct Tab Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--panel-2)]/80 p-2 rounded-2xl border border-[var(--border)]">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {slides.map((slide) => {
            const Icon = slide.icon;
            const isActive = activeSlide === slide.id;
            return (
              <button
                key={slide.id}
                onClick={() => setActiveSlide(slide.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--accent-gradient)] text-white shadow-md'
                    : 'text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--bg)]'
                }`}
              >
                <Icon size={14} />
                <span>{slide.label}</span>
              </button>
            );
          })}
        </div>

        {/* Carousel Manual Arrow Buttons & Status */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono text-[var(--text-faint)]">
            Card {activeSlide + 1} of {totalSlides}
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

      {/* Slide Container Frame */}
      <GlassPanel className="p-6 md:p-8 relative min-h-[380px] flex flex-col justify-between border border-[var(--border)] shadow-xl overflow-hidden">
        {/* CARD 1: OVERALL BAND SCORE & DETAILED MODULE BREAKDOWN */}
        {activeSlide === 0 && (
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
                  Band {currentUser.currentBand}
                </div>
                <div className="text-[11px] font-mono text-[var(--text-faint)]">
                  Target: Band {currentUser.targetBand}
                </div>
              </div>
            </div>

            {/* Detailed Module Breakdown Bars */}
            <div className="space-y-4">
              {skillScores.map((skill) => (
                <div key={skill.skill} className="space-y-1.5">
                  <div className="flex justify-between text-xs md:text-sm font-medium">
                    <span className="text-[var(--text)] font-semibold">{skill.skill}</span>
                    <span className="font-mono font-bold text-[var(--accent-a)]">
                      Band {skill.band}{' '}
                      <span className="text-[var(--text-faint)] font-normal text-xs">
                        ({skill.change})
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[var(--bg)] border border-[var(--border)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent-gradient)] rounded-full transition-all duration-500"
                      style={{ width: `${(skill.band / 9.0) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                size="sm"
                onClick={() => onNavigateAction('writing')}
                className="flex items-center gap-1.5"
              >
                <span>Improve Lowest Module (Writing)</span>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* CARD 2: DAILY STREAK & STUDY CONSISTENCY */}
        {activeSlide === 1 && (
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
                <Flame size={22} className="text-[var(--warning)] animate-bounce" />
                <div className="font-display font-extrabold text-2xl text-[var(--text)]">
                  12 <span className="text-xs font-normal text-[var(--text-dim)]">Days Active</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-[var(--text-dim)]">
              Candidates who maintain a 10+ day consecutive study streak show a 0.5+ band score improvement within 3 weeks.
            </p>

            {/* Weekly Active Days Checklist */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-[var(--text-faint)] uppercase">
                This Week's Activity Log:
              </div>
              <div className="grid grid-cols-7 gap-2 text-center">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                  const isCompleted = idx < 5;
                  return (
                    <div
                      key={day}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 ${
                        isCompleted
                          ? 'bg-[var(--accent-a)]/15 border-[var(--accent-a)]/40 text-[var(--accent-a)]'
                          : 'bg-[var(--bg)] border-[var(--border)] text-[var(--text-faint)]'
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase font-bold">{day}</span>
                      {isCompleted ? <Check size={16} /> : <span className="text-xs">•</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] flex items-center justify-between text-xs">
              <span className="text-[var(--text-dim)]">Today's Target: 60 mins practice</span>
              <span className="font-mono font-bold text-[var(--success)]">45 / 60 Mins (75%)</span>
            </div>
          </div>
        )}

        {/* CARD 3: 30 DAYS PROGRESS AND BAND TREND */}
        {activeSlide === 2 && (
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
              <div className="px-3 py-1.5 rounded-xl bg-[var(--success)]/15 text-[var(--success)] font-mono font-bold text-sm">
                +0.5 Band Gain
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-dim)]">30 Days Ago:</span>
                <span className="font-mono font-bold text-[var(--text)]">Band 6.5</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-dim)]">Current Evaluated Level:</span>
                <span className="font-mono font-bold text-[var(--accent-a)]">Band 7.0</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-dim)]">Target Exam Score:</span>
                <span className="font-mono font-bold text-[var(--text)]">Band 7.5</span>
              </div>
            </div>

            {/* Visual Trend Bar */}
            <div className="p-4 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] space-y-2">
              <div className="text-xs font-mono text-[var(--text-faint)] flex justify-between">
                <span>Month Start: Band 6.5</span>
                <span>Current: Band 7.0</span>
                <span>Target: Band 7.5</span>
              </div>
              <div className="w-full h-4 rounded-full bg-[var(--bg)] border border-[var(--border)] overflow-hidden flex">
                <div className="w-[50%] bg-[var(--text-faint)]/40 h-full" />
                <div className="w-[25%] bg-[var(--accent-gradient)] h-full" />
                <div className="w-[25%] bg-transparent h-full border-l border-dashed border-[var(--accent-a)]" />
              </div>
            </div>
          </div>
        )}

        {/* CARD 4: PRACTICE HOURS & STUDY TIME */}
        {activeSlide === 3 && (
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
                  48.5 <span className="text-sm font-normal text-[var(--text-dim)]">Hours</span>
                </div>
                <div className="text-[11px] font-mono text-[var(--text-faint)]">
                  Avg 45 Mins / Day
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { module: 'Writing', hours: '18.0 hrs', color: 'border-amber-500/30' },
                { module: 'Reading', hours: '12.5 hrs', color: 'border-blue-500/30' },
                { module: 'Speaking', hours: '10.0 hrs', color: 'border-emerald-500/30' },
                { module: 'Listening', hours: '8.0 hrs', color: 'border-purple-500/30' },
              ].map((item, idx) => (
                <div key={idx} className={`p-3.5 rounded-xl bg-[var(--panel-2)] border ${item.color} space-y-1`}>
                  <div className="text-xs font-mono text-[var(--text-faint)]">{item.module}</div>
                  <div className="font-bold text-sm text-[var(--text)]">{item.hours}</div>
                </div>
              ))}
            </div>

            <p className="text-xs text-[var(--text-dim)]">
              You have completed 82% of recommended practice hours for Band 7.5 readiness.
            </p>
          </div>
        )}

        {/* CARD 5: TESTS COMPLETED & MASTERY COUNT */}
        {activeSlide === 4 && (
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
                  52 <span className="text-sm font-normal text-[var(--text-dim)]">Total</span>
                </div>
                <div className="text-[11px] font-mono text-[var(--success)]">
                  100% Evaluated by AI
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[var(--panel-2)] border border-[var(--border)] space-y-2">
                <div className="text-xs font-mono text-[var(--text-faint)] uppercase">Full Mock Exams:</div>
                <div className="font-display font-bold text-2xl text-[var(--accent-a)]">14 Exams</div>
                <div className="text-[11px] text-[var(--text-dim)]">Avg Score: Band 7.0</div>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--panel-2)] border border-[var(--border)] space-y-2">
                <div className="text-xs font-mono text-[var(--text-faint)] uppercase">Modular Practice Sets:</div>
                <div className="font-display font-bold text-2xl text-[var(--text)]">38 Sets</div>
                <div className="text-[11px] text-[var(--text-dim)]">Writing, Reading, Speaking</div>
              </div>
            </div>

            <Button
              onClick={() => onNavigateAction('mock-tests')}
              className="w-full flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              <span>Take Full Timed Mock Test Now</span>
            </Button>
          </div>
        )}

        {/* Bottom Carousel Indicator Dots */}
        <div className="flex items-center justify-center gap-2 pt-4 border-t border-[var(--border)]">
          {slides.map((slide) => (
            <button
              key={slide.id}
              onClick={() => setActiveSlide(slide.id)}
              title={slide.label}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                activeSlide === slide.id
                  ? 'w-8 bg-[var(--accent-a)]'
                  : 'w-2.5 bg-[var(--border)] hover:bg-[var(--text-faint)]'
              }`}
            />
          ))}
        </div>
      </GlassPanel>
    </div>
  );
};
