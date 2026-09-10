import React from 'react';
import { ChevronLeft } from './icons';

interface BackLinkProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Every "back to X" link in the app used to be a tiny text-xs,
 * text-faint plain button -- easy to miss since it read as ambient
 * text rather than a control. This gives it real visual weight: a
 * bordered pill with a background, full-contrast text by default, and
 * a clear hover state, while staying compact enough to sit at the top
 * of any view.
 */
export const BackLink: React.FC<BackLinkProps> = ({ onClick, children, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border-strong)] bg-[var(--panel-2)] text-sm font-semibold text-[var(--text)] shadow-sm hover:border-[var(--accent-a)] hover:text-[var(--accent-a)] hover:bg-[var(--accent-a)]/10 transition-colors cursor-pointer ${className}`}
  >
    <ChevronLeft size={16} className="shrink-0" />
    <span>{children}</span>
  </button>
);
