'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { db, type DbUser } from '../../lib/db';
import { Button } from '../ui/Button';
import { Sparkles, X, ChevronRight } from '../ui/icons';

const SNOOZE_MS = 45 * 60 * 1000; // 45 minutes

function storageKey(userId: string) {
  return `ai-ielts-pro-diagnostic-prompt-dismissed:${userId}`;
}

interface DiagnosticPromptModalProps {
  currentRoute: string;
  onNavigateAction: (route: string) => void;
}

export const DiagnosticPromptModal: React.FC<DiagnosticPromptModalProps> = ({
  currentRoute,
  onNavigateAction,
}) => {
  const [user, setUser] = useState<DbUser | null>(null);
  const [diagnosticDone, setDiagnosticDone] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(false);

  // Decide whether the popup should be showing right now, based on
  // completion status and how long ago it was last snoozed.
  const evaluate = useCallback((userId: string) => {
    let dismissedAt = 0;
    try {
      dismissedAt = Number(localStorage.getItem(storageKey(userId)) ?? 0);
    } catch {
      // localStorage unavailable -- treat as never dismissed.
    }
    const elapsed = Date.now() - dismissedAt;
    setVisible(elapsed >= SNOOZE_MS);
  }, []);

  // Initial fetch: who's logged in, and have they done the diagnostic.
  useEffect(() => {
    let cancelled = false;
    Promise.all([db.getCurrentUser(), db.getDiagnosticStatus().catch(() => true)]).then(
      ([u, done]) => {
        if (cancelled) return;
        setUser(u);
        setDiagnosticDone(done);
        if (u && !done) evaluate(u.id);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [evaluate]);

  // Re-check on a timer so the popup reappears on its own after the
  // snooze window elapses, without needing a navigation or reload --
  // "prompted every 45 mins ... on whichever screen he or she is on."
  useEffect(() => {
    if (!user || diagnosticDone) return;
    const interval = setInterval(() => evaluate(user.id), 30 * 1000);
    return () => clearInterval(interval);
  }, [user, diagnosticDone, evaluate]);

  const handleSkip = () => {
    if (user) {
      try {
        localStorage.setItem(storageKey(user.id), String(Date.now()));
      } catch {
        // ignore -- worst case it re-prompts sooner than 45 min
      }
    }
    setVisible(false);
  };

  const handleTakeIt = () => {
    setVisible(false);
    onNavigateAction('diagnostic');
  };

  // Never show while already on the diagnostic screen itself, or before
  // we actually know the completion status yet.
  if (diagnosticDone !== false || currentRoute === 'diagnostic' || !visible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="diagnostic-prompt-title"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-2xl p-6 md:p-8">
        <button
          onClick={handleSkip}
          aria-label="Skip for now"
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--text)] hover:bg-[var(--panel-2)] transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center mb-4 shadow-lg shadow-[var(--glow-a)]">
          <Sparkles size={22} />
        </div>

        <h2 id="diagnostic-prompt-title" className="font-display text-xl font-bold text-[var(--text)] mb-2">
          Estimate your starting band
        </h2>
        <p className="text-sm text-[var(--text-dim)] leading-relaxed mb-6">
          Take the 2-minute placement diagnostic so your practice is personalised from the start.
          You can skip it -- we&apos;ll just check back in 45 minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            size="md"
            icon={<ChevronRight size={16} />}
            onClick={handleTakeIt}
            className="flex-1 justify-center"
          >
            Take Diagnostic
          </Button>
          <Button variant="secondary" size="md" onClick={handleSkip} className="flex-1 justify-center">
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
};
