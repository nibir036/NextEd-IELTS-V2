import React from 'react';
import { GlassPanel } from '../ui/GlassPanel';
import { Sparkles, TrendingUp, CheckCircle2 } from '../ui/icons';
import { bandSummary } from '../../lib/data';

interface ForecastCardProps {
  id?: string;
  onNavigateAction?: (route: string) => void;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ id, onNavigateAction }) => {
  return (
    <GlassPanel id={id} className="relative overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent-a)]">
            <Sparkles size={15} />
            <span>AI Predictive Trajectory</span>
          </div>
          <span className="text-xs font-mono text-[var(--text-faint)]">Updated Today</span>
        </div>

        <h3 className="font-display text-xl font-bold text-[var(--text)] mb-2">
          Exam Score Forecast
        </h3>
        <p className="text-xs text-[var(--text-dim)] leading-relaxed mb-4">
          Based on your last 12 practice submissions and current error rate patterns.
        </p>

        <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] mb-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-faint)]">
              Predicted Final Band
            </div>
            <div className="font-display font-extrabold text-3xl text-[var(--text)] mt-1">
              Band {bandSummary.forecastBand}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-[var(--success)] flex items-center gap-1 justify-end">
              <TrendingUp size={14} />
              <span>Target: 8.0</span>
            </div>
            <div className="text-[11px] font-mono text-[var(--text-faint)] mt-1">
              {bandSummary.confidencePercent}% Confidence
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {[
            { text: 'Writing Coherence: +0.5 growth projected in 3 sessions', done: true },
            { text: 'Speaking Fluency: Idiomatic vocabulary score stable at 7.5', done: true },
            { text: 'Reading Speed: 14 mins avg per passage (Target < 16 mins)', done: true },
          ].map((point, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-dim)]">
              <CheckCircle2 size={14} className="text-[var(--success)] shrink-0" />
              <span>{point.text}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => onNavigateAction?.('mock-tests')}
        className="mt-5 w-full py-2.5 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] hover:border-[var(--border-strong)] text-xs font-mono text-[var(--text)] hover:text-[var(--accent-a)] transition-all cursor-pointer text-center"
      >
        Run Full Mock to Confirm Forecast →
      </button>
    </GlassPanel>
  );
};
