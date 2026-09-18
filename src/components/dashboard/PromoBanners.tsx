import React, { useState } from 'react';
import { GlassPanel } from '../ui/GlassPanel';
import { Users, Copy, Check, Gift, PhoneCall, MessageCircle, X } from '../ui/icons';
import {
  SUPPORT_PHONE_DISPLAY as COUNSELLING_PHONE_DISPLAY,
  SUPPORT_PHONE_DIGITS as COUNSELLING_PHONE_DIGITS,
} from '../../lib/contact';

// The senior counselor's contact for the "free counselling" reward now
// lives in lib/contact.ts -- the site-wide SupportWidget's "free
// consultation" button uses the same number, so it's defined once there
// instead of being retyped in both places.

// Persistently shown on the dashboard (not dismissible, not tied to any
// "first visit" flag) -- see DashboardView.tsx. Two unrelated promos that
// happen to share a visual weight/shape with DailyTipBanner, so they're
// grouped in one file rather than one each.
export const PromoBanners: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [showCounsellingModal, setShowCounsellingModal] = useState(false);

  const copyReferralLink = async () => {
    const link = typeof window !== 'undefined' ? window.location.origin : '';
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // navigator.clipboard can throw/be unavailable on insecure origins or
      // older browsers -- fall back to the old hidden-textarea + execCommand
      // trick rather than silently doing nothing.
      const textarea = document.createElement('textarea');
      textarea.value = link;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
      } catch {
        // Genuinely nothing more we can do -- leave `copied` false so the
        // button doesn't lie about having worked.
        document.body.removeChild(textarea);
        return;
      }
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Refer a friend */}
        <GlassPanel
          interactive
          onClick={copyReferralLink}
          className="p-6 flex items-center gap-4 border-2 border-[var(--accent-a)]/40 bg-[var(--accent-a)]/10 cursor-pointer"
        >
          <div className="shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center shadow-lg">
              <Users size={24} />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-wide text-[var(--accent-a)] mb-1.5">
              <span className="px-2 py-0.5 rounded-full bg-[var(--accent-a)]/15 border border-[var(--accent-a)]/30">
                Refer a Friend
              </span>
            </div>
            <p className="text-sm text-[var(--text)] leading-relaxed font-medium">
              Know someone prepping for IELTS? Share your link and help them get started.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-2 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] text-[var(--text)]">
            {copied ? (
              <>
                <Check size={14} className="text-emerald-500" />
                <span className="text-emerald-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy Link</span>
              </>
            )}
          </div>
        </GlassPanel>

        {/* Free counselling "gift" */}
        <GlassPanel
          interactive
          onClick={() => setShowCounsellingModal(true)}
          className="p-6 flex items-center gap-4 border-2 border-amber-400/40 bg-amber-400/10 cursor-pointer"
        >
          <div className="shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-white flex items-center justify-center shadow-lg">
              <Gift size={24} />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-wide text-amber-500 mb-1.5">
              <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30">
                Free Gift
              </span>
            </div>
            <p className="text-sm text-[var(--text)] leading-relaxed font-medium">
              Congratulations! You&apos;ve won a gift — tap to see what it is.
            </p>
          </div>
        </GlassPanel>
      </div>

      {showCounsellingModal && (
        <div
          className="animate-fadeIn h-full fixed inset-0 z-50 bg-black/70 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setShowCounsellingModal(false)}
        >
          <div
            className="animate-pouchPopIn max-w-sm w-full rounded-3xl shadow-2xl bg-white overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-white flex items-center justify-center shadow-lg">
                <Gift size={28} />
              </div>

              <div>
                <h3 className="font-display font-bold text-lg text-slate-800">
                  You&apos;ve Won a Free Gift!
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-2">
                  You have won a free counselling session for study abroad paths with our
                  senior counsellor.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Call / WhatsApp
                </div>
                <div className="font-display font-bold text-base text-slate-800">
                  {COUNSELLING_PHONE_DISPLAY}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${COUNSELLING_PHONE_DISPLAY}`}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-mono font-semibold hover:bg-slate-700 transition-colors"
                >
                  <PhoneCall size={14} /> Call
                </a>
                <a
                  href={`https://wa.me/${COUNSELLING_PHONE_DIGITS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-mono font-semibold hover:bg-emerald-700 transition-colors"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
              </div>

              <button
                onClick={() => setShowCounsellingModal(false)}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 hover:border-slate-300 text-xs font-mono text-slate-700 cursor-pointer"
              >
                <X size={12} /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
