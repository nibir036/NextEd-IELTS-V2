import React from 'react';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
  id?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  interactive = false,
  className = '',
  id,
  ...props
}) => {
  return (
    <div
      id={id}
      className={`glass ${interactive ? 'glass-interactive cursor-pointer' : ''} p-5 md:p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
