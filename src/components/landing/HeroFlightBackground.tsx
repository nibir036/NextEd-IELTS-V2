'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Full-bleed Lottie animation used behind the landing hero's headline --
 * a looping flight-route illustration (plane, pin, drifting clouds),
 * recolored from its original blue palette to match the app's own
 * accent tokens (--accent-a/--accent-b/--accent-d/--text) so it reads
 * as part of the product rather than a stock asset. Source file lives
 * at public/lottie/hero-flight.json.
 *
 * Loaded client-side only (lottie-web needs the DOM), with the SVG
 * renderer set to "slice" so it covers its container the way a
 * background-image: cover would, regardless of the hero's aspect
 * ratio.
 */
export const HeroFlightBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let anim: { destroy: () => void } | null = null;
    let cancelled = false;

    import('lottie-web').then(({ default: lottie }) => {
      if (cancelled || !containerRef.current) return;
      anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/lottie/hero-flight.json',
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      });
    });

    return () => {
      cancelled = true;
      anim?.destroy();
    };
  }, []);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
};
