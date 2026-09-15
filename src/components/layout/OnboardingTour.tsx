'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { db, type DbUser } from '../../lib/db';
import { Button } from '../ui/Button';
import { X, ChevronRight, ArrowRight } from '../ui/icons';

function storageKey(userId: string) {
  return `ai-ielts-pro-tour-completed:${userId}`;
}

interface TourStep {
  id: string;
  title: string;
  body: string;
  // data-tour attribute value of the element to spotlight, or null for
  // a centered step with no specific target (welcome / closing).
  target: string | null;
}

const STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: "Hi, I'm Nexi 👋",
    body: "New here? Give me about a minute and I'll show you where everything lives before you jump into practice.",
    target: null,
  },
  {
    id: 'sidebar',
    title: 'Your practice hub',
    body: 'Reading, Listening, Writing, Speaking, full mock tests, plus the Grammar and Vocabulary courses all live in this sidebar. Hover it to expand, or pin it open with the pin icon.',
    target: 'sidebar-nav',
  },
  {
    id: 'dashboard-modules',
    title: 'Jump straight into a skill',
    body: 'These cards drop you right into a module -- tap any one and you are practicing in seconds, no extra menus.',
    target: 'dashboard-modules',
  },
  {
    id: 'search',
    title: 'Search anything, instantly',
    body: 'Looking for a specific tip, a vocabulary chapter, or a page? Start typing here and jump straight to it.',
    target: 'topbar-search',
  },
  {
    id: 'profile',
    title: 'Notifications & your profile',
    body: 'The bell takes you to your submission history. Tap your avatar any time to update your target band, exam date, or theme in Settings.',
    target: 'topbar-profile',
  },
  {
    id: 'done',
    title: "You're all set!",
    body: 'That was the full tour. Go take your first practice test -- I will be cheering you on from the sidelines.',
    target: null,
  },
];

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

// Rough, fixed estimate of the card's own rendered height, used only for
// vertical placement math (clamping / centering against a target). Every
// step's body copy is a similarly short 1-2 sentences, so a constant is
// close enough without needing an extra measure-then-reposition render
// pass.
const CARD_H_ESTIMATE = 200;
const MARGIN = 20;

// Nexi ships as two cutouts pointing opposite ways -- "bust" points to
// its own upper-right, "full" points to its own upper-left. Whichever
// side of the card Nexi sits on, we pick the pose that therefore points
// INTO the card rather than away from it.
type Side = 'left' | 'right';

// Positioned fully OUTSIDE the card on the given side (right-full /
// left-full = flush against that edge, plus a small gap margin) so Nexi
// never overlaps the card's own content -- title, body copy, or the
// Skip/Next buttons.
function mascotFor(side: Side): { src: string; className: string } {
  return side === 'left'
    ? { src: '/mascot/mascot-bust.png', className: 'w-20 sm:w-24 right-full mr-3 bottom-0' }
    : { src: '/mascot/mascot-full.png', className: 'w-24 sm:w-28 left-full ml-3 bottom-0' };
}

interface Layout {
  left: number;
  top: number;
  side: Side;
}

function computeLayout(rect: TargetRect | null, cardW: number, vw: number, vh: number): Layout {
  const cardH = CARD_H_ESTIMATE;

  if (!rect) {
    return { left: (vw - cardW) / 2, top: (vh - cardH) / 2, side: 'right' };
  }

  // A tall element hugging the left edge is the sidebar: card goes to
  // its right, vertically centered against it.
  const isLeftEdge = rect.left < vw * 0.28 && rect.height > vh * 0.4;
  if (isLeftEdge) {
    const left = Math.min(rect.left + rect.width + MARGIN, vw - cardW - MARGIN);
    let top = rect.top + rect.height / 2 - cardH / 2;
    top = Math.min(Math.max(top, MARGIN), vh - cardH - MARGIN);
    return { left, top, side: sideWithMoreRoom(left, cardW, vw) };
  }

  // Everything else (top bar items, dashboard sections): card goes
  // below the target, or above it if there isn't room below.
  const spaceBelow = vh - (rect.top + rect.height);
  const placeBelow = spaceBelow > cardH + MARGIN * 2 || rect.top < cardH;
  const top = placeBelow ? rect.top + rect.height + MARGIN : rect.top - MARGIN - cardH;
  let left = rect.left + rect.width / 2 - cardW / 2;
  left = Math.min(Math.max(left, MARGIN), vw - cardW - MARGIN);

  return { left, top: Math.min(Math.max(top, MARGIN), vh - cardH - MARGIN), side: sideWithMoreRoom(left, cardW, vw) };
}

// Nexi now sits fully OUTSIDE the card (see mascotFor), so pick
// whichever side actually has more open viewport space -- keeps it
// from being squeezed off-screen when the card is clamped up against
// an edge (e.g. the profile step, pinned to the top-right corner).
function sideWithMoreRoom(cardLeft: number, cardW: number, vw: number): Side {
  const roomLeft = cardLeft;
  const roomRight = vw - (cardLeft + cardW);
  return roomLeft >= roomRight ? 'left' : 'right';
}

interface OnboardingTourProps {
  // Not used for logic directly, but keeps this component re-rendering
  // (and its target measurements fresh) as the user navigates while the
  // tour happens to still be open.
  currentRoute: string;
  onActiveChange?: (active: boolean) => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ onActiveChange }) => {
  const [user, setUser] = useState<DbUser | null>(null);
  const [visible, setVisible] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<TargetRect | null>(null);
  const rafRef = useRef<number | null>(null);

  // Look up who's logged in and whether they've already completed (or
  // skipped) the tour before. A brand new account has never written
  // this key, so the very first dashboard load is exactly when this
  // fires -- same "first-time" pattern DashboardView already uses for
  // its welcome-back copy.
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    db.getCurrentUser().then((u) => {
      if (cancelled || !u) return;
      setUser(u);
      let done = false;
      try {
        done = localStorage.getItem(storageKey(u.id)) === 'true';
      } catch {
        // localStorage unavailable -- treat as not-yet-toured.
      }
      if (!done) {
        // Let the shell finish its first paint/layout before the tour
        // starts measuring elements against it.
        timer = setTimeout(() => setVisible(true), 700);
      }
    });
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    onActiveChange?.(visible);
  }, [visible, onActiveChange]);

  const step = STEPS[stepIndex];

  // Keep the highlighted target's position fresh for as long as its
  // step is showing. A rAF loop (rather than separate scroll/resize
  // listeners) cheaply tracks the sidebar's hover-expand animation and
  // any scrolling without extra wiring, and stops entirely once the
  // step changes or the tour closes.
  useEffect(() => {
    if (!visible) return;

    if (!step.target) {
      setRect(null);
      return;
    }

    let cancelled = false;
    const initial = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
    if (initial) {
      initial.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }

    const measure = () => {
      if (cancelled) return;
      const node = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
      if (node) {
        const r = node.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
        } else {
          setRect(null);
        }
      } else {
        setRect(null);
      }
      rafRef.current = requestAnimationFrame(measure);
    };
    rafRef.current = requestAnimationFrame(measure);

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible, stepIndex, step.target]);

  const finish = useCallback(() => {
    setVisible(false);
    if (user) {
      try {
        localStorage.setItem(storageKey(user.id), 'true');
      } catch {
        // ignore -- worst case the tour offers itself again next visit
      }
    }
  }, [user]);

  const handleNext = () => {
    if (stepIndex >= STEPS.length - 1) {
      finish();
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  if (!visible) return null;

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const CARD_W = Math.min(360, vw - 32);

  const { left: cardLeft, top: cardTop, side } = computeLayout(rect, CARD_W, vw, vh);
  const isLast = stepIndex === STEPS.length - 1;
  const mascot = mascotFor(side);

  // Dim/blur "hole" -- an 8px pad around the raw target rect, matching
  // the glow ring drawn on top of it.
  const holePad = 8;
  const hole = rect
    ? {
        left: Math.max(0, rect.left - holePad),
        top: Math.max(0, rect.top - holePad),
        right: Math.min(vw, rect.left + rect.width + holePad),
        bottom: Math.min(vh, rect.top + rect.height + holePad),
      }
    : null;

  const dimClass = 'absolute bg-black/[0.15] backdrop-blur-[3px]';

  return (
    <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true" aria-labelledby="tour-step-title">
      {hole ? (
        <>
          {/* Dim/blur everywhere EXCEPT the highlighted section -- built
              as four strips framing the hole, rather than one blanket
              overlay, so the section actually being explained stays
              sharp and fully readable instead of being blurred along
              with the rest of the page. */}
          <div className={`${dimClass} animate-fadeIn`} style={{ left: 0, top: 0, width: '100%', height: hole.top }} />
          <div
            className={`${dimClass} animate-fadeIn`}
            style={{ left: 0, top: hole.bottom, width: '100%', height: Math.max(0, vh - hole.bottom) }}
          />
          <div
            className={`${dimClass} animate-fadeIn`}
            style={{ left: 0, top: hole.top, width: hole.left, height: hole.bottom - hole.top }}
          />
          <div
            className={`${dimClass} animate-fadeIn`}
            style={{ left: hole.right, top: hole.top, width: Math.max(0, vw - hole.right), height: hole.bottom - hole.top }}
          />
          {/* Crisp, undimmed hole -- no visual styling, just captures
              clicks so the highlighted control can't be interacted with
              mid-tour. */}
          <div
            className="absolute"
            style={{
              left: hole.left,
              top: hole.top,
              width: hole.right - hole.left,
              height: hole.bottom - hole.top,
            }}
          />
          {/* Glow ring, drawn in the same spot so the section reads as
              "look here". */}
          <div
            className="absolute pointer-events-none transition-all duration-500 ease-out animate-tourRingPulse"
            style={{
              left: hole.left,
              top: hole.top,
              width: hole.right - hole.left,
              height: hole.bottom - hole.top,
              boxShadow: '0 0 0 3px var(--accent-a), 0 0 44px 8px var(--glow-a)',
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-black/[0.15] backdrop-blur-[3px] animate-fadeIn" />
      )}

      {/* Step card -- positioned with plain numeric left/top (no CSS
          transform), so it never fights with the entrance animation's
          own transform on the inner panel below. */}
      <div
        className="absolute"
        style={{
          width: CARD_W,
          left: cardLeft,
          top: cardTop,
          transition: 'left 0.5s ease-out, top 0.5s ease-out',
        }}
      >
        <div key={step.id} className="relative glass p-5 pt-6 animate-pouchPopIn">
          <button
            onClick={finish}
            aria-label="Skip tour"
            className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--text)] hover:bg-[var(--panel-2)] transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>

          <h3 id="tour-step-title" className="font-display text-base font-bold text-[var(--text)] pr-6 mb-1.5">
            {step.title}
          </h3>
          <p className="text-[13px] text-[var(--text-dim)] leading-relaxed mb-5">{step.body}</p>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {STEPS.map((s, i) => (
                <span
                  key={s.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === stepIndex ? 'w-5 bg-[var(--accent-a)]' : 'w-1.5 bg-[var(--border-strong)]'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {!isLast && (
                <button
                  onClick={finish}
                  className="text-xs font-medium text-[var(--text-faint)] hover:text-[var(--text)] transition-colors cursor-pointer px-2"
                >
                  Skip
                </button>
              )}
              <Button
                variant="primary"
                size="sm"
                icon={isLast ? <ArrowRight size={14} /> : <ChevronRight size={14} />}
                onClick={handleNext}
              >
                {isLast ? "Let's go" : 'Next'}
              </Button>
            </div>
          </div>

          {/* Nexi, peeking up from the card's corner and pointing into
              it -- which side depends on where the card landed on
              screen, see mascotFor(). */}
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative, pre-sized transparent PNG served from /public, no next/image gain here */}
          <img
            src={mascot.src}
            alt=""
            aria-hidden="true"
            draggable={false}
            className={`absolute pointer-events-none select-none drop-shadow-2xl animate-mascotFloat ${mascot.className}`}
          />
        </div>
      </div>
    </div>
  );
};
