'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-triggered fade/slide-in, used across the whole app now (not
 * just the landing page). Wrap any block with it; it becomes visible
 * once it's scrolled into view, with an optional stagger delay for
 * sibling elements in a grid/list.
 */
export function Reveal({
  children,
  delayMs = 0,
  className = '',
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => setVisible(true), delayMs);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <div
      ref={ref}
      className={`reveal-hidden ${visible ? 'reveal-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
