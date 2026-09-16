'use client';

import React, { useEffect, useRef } from 'react';

interface RecordingVisualizerProps {
  // The live mic stream currently feeding the MediaRecorder. Rendered
  // purely for reassurance ("yes, I can hear you") -- this component
  // only reads levels off the stream, it never stores or transmits
  // audio itself.
  stream: MediaStream | null;
  className?: string;
}

const BAR_COUNT = 28;
const GAP_PX = 3;

// Reads a CSS custom property's live (theme-aware) value off <html>,
// falling back if it's ever unset. Canvas fillStyle can't take a
// `var(--x)` string directly the way DOM styles can, so this is done
// once per mount rather than baking in a hex value.
function readCssVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

export const RecordingVisualizer: React.FC<RecordingVisualizerProps> = ({ stream, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx2d = canvas?.getContext('2d');
    if (!canvas || !ctx2d || !stream) return;

    const AudioCtx: typeof AudioContext | undefined =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const audioCtx = new AudioCtx();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.8;
    source.connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount);
    const dpr = window.devicePixelRatio || 1;
    const colorA = readCssVar('--accent-a', '#a073fd');
    const colorC = readCssVar('--accent-c', '#9179fe');

    let raf: number;
    let disposed = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const gap = GAP_PX * dpr;
    // A slowly-decaying peak per bar keeps each column from looking
    // like it snaps to zero between loud syllables -- reads much more
    // like "live audio" than raw per-frame values would.
    const smoothed = new Array(BAR_COUNT).fill(0);

    const draw = () => {
      if (disposed) return;
      analyser.getByteFrequencyData(data);

      const w = canvas.width;
      const h = canvas.height;
      ctx2d.clearRect(0, 0, w, h);

      const barW = (w - gap * (BAR_COUNT - 1)) / BAR_COUNT;
      const step = Math.max(1, Math.floor(data.length / BAR_COUNT));

      for (let i = 0; i < BAR_COUNT; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) sum += data[i * step + j] ?? 0;
        const level = sum / step / 255; // 0..1

        // Rise fast (feels responsive), fall slowly (feels alive).
        smoothed[i] = level > smoothed[i] ? level : smoothed[i] * 0.85 + level * 0.15;

        const barH = Math.max(h * 0.08, smoothed[i] * h);
        const x = i * (barW + gap);
        const y = (h - barH) / 2;

        const grad = ctx2d.createLinearGradient(0, y, 0, y + barH);
        grad.addColorStop(0, colorC);
        grad.addColorStop(1, colorA);
        ctx2d.fillStyle = grad;

        const radius = Math.min(barW / 2, 4 * dpr);
        ctx2d.beginPath();
        if (typeof ctx2d.roundRect === 'function') {
          ctx2d.roundRect(x, y, barW, barH, radius);
        } else {
          ctx2d.rect(x, y, barW, barH);
        }
        ctx2d.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      source.disconnect();
      analyser.disconnect();
      audioCtx.close().catch(() => {});
    };
  }, [stream]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`w-full h-12 block ${className}`}
    />
  );
};
