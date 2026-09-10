import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  id?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  id,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap active:scale-[0.98]';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-[image:var(--accent-gradient)] text-white shadow-lg shadow-[var(--glow-a)] hover:shadow-xl hover:shadow-[var(--glow-a)] hover:brightness-110 font-semibold border border-[rgba(255,255,255,0.2)]',
    secondary:
      'bg-[var(--bg-elevated)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--accent-a)]/50 hover:bg-[var(--panel-2)] hover:shadow-md hover:shadow-[var(--glow-a)]',
    ghost:
      'bg-transparent text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--panel-2)]',
  };

  return (
    <button
      id={id}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {/* Render icon (if passed via the `icon` prop) and children as direct
          flex items of this button — NOT wrapped in an inner <span>. An
          inner span mixing an icon (Tailwind sets svg { display: block })
          with inline text forces a line break between them, stacking icon
          above text. The button's own inline-flex + gap already lays out
          direct children horizontally, so no wrapper is needed. */}
      {icon && <span className="shrink-0 inline-flex">{icon}</span>}
      {children}
    </button>
  );
};
