import React, { useState, useEffect } from 'react';

interface SkillScoreSet {
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
  activeSkill: string;
  monthlyChange: string;
  target: number;
}

const PRESET_FRAMES: SkillScoreSet[] = [
  {
    listening: 7.5,
    reading: 8.0,
    writing: 6.5,
    speaking: 7.0,
    activeSkill: 'Writing',
    monthlyChange: '+0.5 this month',
    target: 7.5,
  },
  {
    listening: 7.0,
    reading: 7.5,
    writing: 6.0,
    speaking: 6.5,
    activeSkill: 'Speaking',
    monthlyChange: '+0.5 this month',
    target: 7.5,
  },
  {
    listening: 8.0,
    reading: 8.5,
    writing: 7.0,
    speaking: 7.5,
    activeSkill: 'Reading',
    monthlyChange: '+1.0 this month',
    target: 8.0,
  },
  {
    listening: 7.5,
    reading: 7.0,
    writing: 6.5,
    speaking: 6.5,
    activeSkill: 'Listening',
    monthlyChange: '+0.5 this month',
    target: 7.5,
  },
];

// Official IELTS Band Rounding Formula
// Average ends in .25 -> rounded up to .5
// Average ends in .75 -> rounded up to next integer
// Standard formula: Math.round(rawAverage * 2) / 2
export const calculateIeltsBand = (l: number, r: number, w: number, s: number) => {
  const raw = (l + r + w + s) / 4;
  const officialBand = Math.round(raw * 2) / 2;
  return { raw, officialBand };
};

export const HeroScoreCard: React.FC = () => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % PRESET_FRAMES.length);
    }, 4500); // Slow transition every 4.5s
    return () => clearInterval(interval);
  }, [isPaused]);

  const currentFrame = PRESET_FRAMES[frameIndex];
  const { raw, officialBand } = calculateIeltsBand(
    currentFrame.listening,
    currentFrame.reading,
    currentFrame.writing,
    currentFrame.speaking
  );

  // SVG Gauge calculations
  const radius = 54;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  // Progress ratio based on raw score out of 9.0
  const progressRatio = raw / 9.0;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const skillsList = [
    { name: 'Listening', score: currentFrame.listening },
    { name: 'Reading', score: currentFrame.reading },
    { name: 'Writing', score: currentFrame.writing },
    { name: 'Speaking', score: currentFrame.speaking },
  ];

  return (
    <div
      className="relative w-full max-w-lg rounded-3xl p-6 sm:p-7 text-[var(--text)] shadow-2xl overflow-hidden transition-all duration-700 bg-[var(--bg-elevated)]/90 backdrop-blur-2xl border border-[var(--border)]"
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px var(--accent-a-glow, rgba(16, 185, 129, 0.12))',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background glowing rings overlay */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none opacity-30 blur-3xl bg-[var(--accent-a)]" />
      <div className="absolute top-1/2 -right-10 w-48 h-48 rounded-full pointer-events-none opacity-20 border-[16px] border-[var(--accent-b)]" />
      <div className="absolute top-1/3 -right-20 w-64 h-64 rounded-full pointer-events-none opacity-15 border-[12px] border-[var(--accent-a)]" />

      {/* Header Row */}
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div>
          <div className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[var(--accent-a)] uppercase">
            OVERALL BAND SCORE
          </div>
          <div className="text-sm sm:text-base font-semibold text-[var(--text)] mt-0.5">
            On track for Nov 2026
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-a)]/15 border border-[var(--accent-a)]/30 text-[var(--accent-a)] text-xs font-mono font-medium shadow-sm">
          <span>▲ {currentFrame.monthlyChange}</span>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center relative z-10">
        {/* Ring Chart Column */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
              <defs>
                <linearGradient id="scoreArcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent-a)" />
                  <stop offset="50%" stopColor="var(--accent-b)" />
                  <stop offset="100%" stopColor="var(--accent-c)" />
                </linearGradient>
              </defs>
              {/* Background Track */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="none"
                stroke="var(--border)"
                strokeWidth={strokeWidth}
              />
              {/* Progress Arc */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="none"
                stroke="url(#scoreArcGradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inner Center Score - Strict IELTS Official Band (.0 or .5) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-serif font-extrabold text-3xl sm:text-4xl tracking-tight text-[var(--text)] transition-all duration-500">
                {officialBand.toFixed(1)}
              </span>
              <span className="text-[11px] font-mono text-[var(--accent-a)] mt-0.5">
                / {currentFrame.target.toFixed(1)} target
              </span>
            </div>
          </div>

          {/* Official Band Score Callout */}
          <div className="mt-2.5 px-2.5 py-1 rounded-lg bg-[var(--accent-a)]/10 border border-[var(--accent-a)]/20 text-[11px] font-mono text-[var(--text-dim)] text-center">
            Exact IELTS Band: <span className="font-bold text-[var(--text)]">{officialBand.toFixed(1)}</span>
          </div>
        </div>

        {/* Skill Bars Column */}
        <div className="sm:col-span-7 space-y-3.5">
          {skillsList.map((item) => {
            const isSelected = currentFrame.activeSkill === item.name;
            const barWidthPercent = (item.score / 9.0) * 100;

            return (
              <div
                key={item.name}
                className="flex items-center gap-3 text-xs sm:text-sm font-medium"
              >
                {/* Skill Name Label */}
                <div className="w-20 shrink-0">
                  {isSelected ? (
                    <span className="inline-block px-2 py-0.5 rounded bg-[var(--accent-a)] text-[var(--bg)] font-bold text-xs shadow-md transition-all duration-300">
                      {item.name}
                    </span>
                  ) : (
                    <span className="text-[var(--text-dim)] font-medium transition-colors duration-300">
                      {item.name}
                    </span>
                  )}
                </div>

                {/* Progress Bar Track */}
                <div className="flex-1 h-2 rounded-full bg-[var(--border)] overflow-hidden relative">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${barWidthPercent}%`,
                      background: isSelected
                        ? 'linear-gradient(90deg, var(--accent-b) 0%, var(--accent-a) 100%)'
                        : 'linear-gradient(90deg, var(--accent-a) 0%, var(--accent-b) 100%)',
                    }}
                  />
                </div>

                {/* Score Number */}
                <span className="w-7 text-right font-mono font-bold text-[var(--text)]">
                  {item.score.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer helper note */}
      <div className="mt-5 pt-3 border-t border-[var(--border)] flex items-center justify-between text-[10px] font-mono text-[var(--text-faint)]">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-a)] animate-pulse" />
          Live Band Diagnostic Simulation
        </span>
        <span>
          Enforces 0.5 Band Rounding
        </span>
      </div>
    </div>
  );
};
