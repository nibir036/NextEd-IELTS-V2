import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  sublabel?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  sublabel,
  showPercent = true,
  size = 'md',
  className = '',
  id,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div id={id} className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-mono text-[var(--text-dim)]">
          {label ? <span>{label}</span> : <span />}
          {showPercent && (
            <span className="font-semibold text-[var(--text)]">
              {Math.round(percentage)}% {sublabel && <span className="text-[var(--text-faint)] font-normal">({sublabel})</span>}
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className="h-full bg-[var(--accent-gradient)] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
