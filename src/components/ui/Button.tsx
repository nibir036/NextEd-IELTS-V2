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
      'bg-[image:var(--accent-gradient)] text-white shadow-lg shadow-[var(--glow-a)] hover:opacity-95 font-semibold border border-[rgba(255,255,255,0.2)]',
    secondary:
      'bg-[var(--bg-elevated)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--panel-2)]',
    ghost:
      'bg-transparent text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--panel-2)]',
  };

  return (
    <button
      id={id}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
