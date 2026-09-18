'use client';

import React, { useState } from 'react';
import { MessageCircle, X, User, PhoneCall, Send, ChevronRight } from '../ui/icons';
import { whatsAppLink } from '../../lib/contact';

type View = 'menu' | 'feedback' | 'success';

interface SupportWidgetProps {
  isLoggedIn: boolean;
}

// Floating support button -- shown on the landing page and the dashboard
// (see App.tsx). Collapsed: a single round button, bottom-right, always
// visible. Expanded: three options -- "free consultation" and "technical
// issue" both hand off to WhatsApp (same counselling number PromoBanners
// already uses, via lib/contact.ts so it's never typed twice); "feedback"
// opens an inline form, submitted to /api/feedback. Feedback is
// "unanonymous": logged-in visitors are identified by their session, a
// logged-out visitor must supply a phone number instead (enforced again
// server-side, see that route -- this client check is just to fail fast).
export const SupportWidget: React.FC<SupportWidgetProps> = ({ isLoggedIn }) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>('menu');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetAndClose = () => {
    setOpen(false);
    setView('menu');
    setMessage('');
    setPhone('');
    setError(null);
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedMessage = message.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedMessage) {
      setError('Please enter your feedback.');
      return;
    }
    if (!isLoggedIn && !trimmedPhone) {
      setError('Please enter your phone number.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedMessage,
          phone: isLoggedIn ? undefined : trimmedPhone,
          pagePath: typeof window !== 'undefined' ? window.location.pathname : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || 'Failed to submit feedback. Please try again.');
        return;
      }
      setView('success');
    } catch {
      setError('Failed to submit feedback. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="Support"
          className="fixed bottom-24 right-5 z-[70] w-[min(360px,calc(100vw-2.5rem))] rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-2xl overflow-hidden animate-pouchPopIn"
        >
          {view === 'menu' && (
            <div className="p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display font-bold text-base text-[var(--text)]">How can we help you?</h3>
                <button
                  type="button"
                  onClick={resetAndClose}
                  aria-label="Close"
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-dim)] hover:bg-[var(--panel-2)] cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs text-[var(--text-dim)] mb-4">Choose an option below:</p>

              <div className="space-y-2">
                <a
                  href={whatsAppLink("Hi, I'd like to book a free consultation.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={resetAndClose}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-emerald-400/50 hover:bg-emerald-400/5 transition-colors cursor-pointer"
                >
                  <span className="shrink-0 w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <User size={18} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-[var(--text)]">Get your free consultation</span>
                    <span className="block text-xs text-[var(--text-dim)]">Talk to our counsellor</span>
                  </span>
                  <ChevronRight size={16} className="shrink-0 text-[var(--text-faint)]" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setView('feedback');
                    setError(null);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-amber-400/50 hover:bg-amber-400/5 transition-colors cursor-pointer text-left"
                >
                  <span className="shrink-0 w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center">
                    <MessageCircle size={18} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-[var(--text)]">Have any feedback/review?</span>
                    <span className="block text-xs text-[var(--text-dim)]">Let us know</span>
                  </span>
                  <ChevronRight size={16} className="shrink-0 text-[var(--text-faint)]" />
                </button>

                <a
                  href={whatsAppLink("Hi, I'm having a technical issue with IELTS AI.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={resetAndClose}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-red-400/50 hover:bg-red-400/5 transition-colors cursor-pointer"
                >
                  <span className="shrink-0 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center">
                    <PhoneCall size={18} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-[var(--text)]">Technical issue?</span>
                    <span className="block text-xs text-[var(--text-dim)]">Call us.</span>
                  </span>
                  <ChevronRight size={16} className="shrink-0 text-[var(--text-faint)]" />
                </a>
              </div>
            </div>
          )}

          {view === 'feedback' && (
            <form onSubmit={handleSubmitFeedback} className="p-5">
              <div className="flex items-center justify-between mb-1">
                <button
                  type="button"
                  onClick={() => {
                    setView('menu');
                    setError(null);
                  }}
                  className="text-xs font-mono text-[var(--text-dim)] hover:text-[var(--text)] cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={resetAndClose}
                  aria-label="Close"
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-dim)] hover:bg-[var(--panel-2)] cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <h3 className="font-display font-bold text-base text-[var(--text)] mb-1">Share your feedback</h3>
              <p className="text-xs text-[var(--text-dim)] mb-4">
                Good, bad, or somewhere in between -- we read all of it.
              </p>

              <label htmlFor="support-widget-message" className="block text-[11px] font-mono uppercase text-[var(--text-dim)] mb-1.5">
                Your feedback
              </label>
              <textarea
                id="support-widget-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={4000}
                placeholder="Tell us what's on your mind..."
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm p-3 mb-3 resize-none focus:outline-none focus:border-[var(--accent-a)]"
              />

              {!isLoggedIn && (
                <>
                  <label htmlFor="support-widget-phone" className="block text-[11px] font-mono uppercase text-[var(--text-dim)] mb-1.5">
                    Your phone number
                  </label>
                  <input
                    id="support-widget-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+8801XXXXXXXXX"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm p-3 mb-3 focus:outline-none focus:border-[var(--accent-a)]"
                  />
                </>
              )}

              {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[image:var(--accent-gradient)] text-white text-sm font-semibold shadow-md hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                <Send size={15} />
                {submitting ? 'Sending...' : 'Send feedback'}
              </button>
            </form>
          )}

          {view === 'success' && (
            <div className="p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-3">
                <MessageCircle size={20} />
              </div>
              <h3 className="font-display font-bold text-base text-[var(--text)] mb-1">Thank you!</h3>
              <p className="text-xs text-[var(--text-dim)] mb-4">Your feedback has been received.</p>
              <button
                type="button"
                onClick={resetAndClose}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] text-[var(--text)] text-sm font-semibold cursor-pointer hover:border-[var(--accent-a)]/50"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close support menu' : 'Open support menu'}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-[70] w-14 h-14 rounded-full bg-[image:var(--accent-gradient)] text-white shadow-xl flex items-center justify-center hover:brightness-110 active:scale-95 transition-all cursor-pointer"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  );
};
