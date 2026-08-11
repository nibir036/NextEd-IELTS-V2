import React, { useEffect, useRef, useState } from 'react';
import { Play, Headphones, Volume2 } from '../ui/icons';

interface PlayOnceAudioProps {
  src: string;
  onEnded?: () => void;
  onStart?: () => void;
}

// Real-test audio: plays through exactly ONCE. No seeking, no restart.
// Once started it cannot be paused-and-rewound; when it ends it locks.
export const PlayOnceAudio: React.FC<PlayOnceAudioProps> = ({ src, onEnded, onStart }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setCurrent(el.currentTime);
    const onMeta = () => setDuration(el.duration || 0);
    const onEnd = () => {
      setFinished(true);
      onEnded?.();
    };
    // Block any attempt to seek backwards/forwards.
    const onSeeking = () => {
      // Allow only forward drift from natural playback; snap back otherwise.
      if (Math.abs(el.currentTime - current) > 1.5) {
        el.currentTime = current;
      }
    };
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('ended', onEnd);
    el.addEventListener('seeking', onSeeking);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('ended', onEnd);
      el.removeEventListener('seeking', onSeeking);
    };
  }, [current, onEnded]);

  const start = () => {
    const el = audioRef.current;
    if (!el || started) return;
    setStarted(true);
    onStart?.();
    el.play().catch(() => setStarted(false));
  };

  const fmt = (s: number) => {
    if (!Number.isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 space-y-3">
      {/* Hidden native element; controls are custom so seeking is impossible. */}
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center shrink-0">
          <Headphones size={20} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[var(--text)]">Listening Audio</div>
          <div className="text-[11px] font-mono text-[var(--text-faint)]">
            {finished ? 'Playback finished' : started ? 'Playing — plays once only' : 'Plays once. You cannot pause or rewind.'}
          </div>
        </div>
      </div>

      {!started ? (
        <button
          onClick={start}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[image:var(--accent-gradient)] text-white font-semibold text-sm cursor-pointer hover:opacity-95"
        >
          <Play size={16} /> Start Audio (plays once)
        </button>
      ) : (
        <>
          <div className="w-full h-2 rounded-full bg-[var(--bg)] overflow-hidden">
            <div className="h-full bg-[image:var(--accent-gradient)]" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-faint)]">
            <span>{fmt(current)} / {fmt(duration)}</span>
            <span className="flex items-center gap-1.5">
              <Volume2 size={13} />
              <input
                type="range" min={0} max={1} step={0.05} value={volume}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setVolume(v);
                  if (audioRef.current) audioRef.current.volume = v;
                }}
                className="w-20 accent-[var(--accent-a)]"
              />
            </span>
          </div>
        </>
      )}
    </div>
  );
};
