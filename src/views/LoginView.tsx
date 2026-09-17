import React, { useRef, useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { BackLink } from '../components/ui/BackLink';
import {
  PhoneCall,
  KeyRound,
  LogIn,
  ArrowRight,
} from '../components/ui/icons';
import { db } from '../lib/db';

interface LoginViewProps {
  onLoginSuccess: () => void;
  onNavigateToSignup: () => void;
  onNavigateToLanding: () => void;
  onNavigateToForgotPassword: () => void;
}

const COUNTRY_CODES = [
  { code: '+1', name: 'USA / Canada' },
  { code: '+44', name: 'United Kingdom' },
  { code: '+88', name: 'Bangladesh' },
  { code: '+91', name: 'India' },
  { code: '+61', name: 'Australia' },
  { code: '+971', name: 'UAE' },
  { code: '+86', name: 'China' },
  { code: '+60', name: 'Malaysia' },
  { code: '+92', name: 'Pakistan' },
  { code: '+234', name: 'Nigeria' },
];

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigateToSignup,
  onNavigateToLanding,
  onNavigateToForgotPassword,
}) => {
  const [countryCode, setCountryCode] = useState<string>('+88');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Per-field errors shown directly under the offending input, with the
  // matching ref scrolled into view on a failed submit -- see the same
  // pattern in SignupView.tsx.
  const [fieldErrors, setFieldErrors] = useState<{ phone?: string; password?: string }>({});
  const phoneFieldRef = useRef<HTMLDivElement>(null);
  const passwordFieldRef = useRef<HTMLDivElement>(null);

  const scrollToField = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const fullPhone = `${countryCode} ${phoneNumber.trim()}`;

  // NOTE: OTP verification is planned as a second step after this succeeds
  // (see project notes). For now this is a single-step phone + password login.
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    if (!phoneNumber.trim() || phoneNumber.trim().length < 6) {
      setFieldErrors({ phone: 'Please enter a valid mobile phone number.' });
      scrollToField(phoneFieldRef);
      return;
    }
    if (!password) {
      setFieldErrors({ password: 'Please enter your password.' });
      scrollToField(passwordFieldRef);
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await db.loginUserByPhone(fullPhone, password);
      if (user) {
        onLoginSuccess();
      } else {
        setFieldErrors({ password: 'Invalid phone number or password.' });
        scrollToField(passwordFieldRef);
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-between relative overflow-hidden">
      {/* Background ambient pattern */}
      <div className="bg-layer">
        <div className="bg-pattern" />
      </div>

      {/* Header bar */}
      <header className="relative z-10 border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
        <div
          onClick={onNavigateToLanding}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity overflow-hidden min-w-0"
        >
          <img src="/branding/ielts-ai-mascot-full.png" alt="IELTS AI" className="h-10 w-auto object-contain shrink-0" />
          <img src="/branding/ielts-ai-wordmark-dark.png" alt="IELTS AI by nextED." className="brand-wordmark-dark h-9 w-auto object-contain" />
          <img src="/branding/ielts-ai-wordmark-light.png" alt="IELTS AI by nextED." className="brand-wordmark-light h-9 w-auto object-contain" />
        </div>

        <BackLink onClick={onNavigateToLanding}>Back to Home</BackLink>
      </header>

      {/* Main Login Panel */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-center">
            <img src="/branding/ielts-ai-mascot-full-dark.png" alt="IELTS AI by nextED." className="brand-mascot-dark h-40 w-auto object-contain" />
            <img src="/branding/ielts-ai-mascot-full-light.png" alt="IELTS AI by nextED." className="brand-mascot-light h-40 w-auto object-contain" />
          </div>
          <GlassPanel className="p-6 md:p-8 border border-[var(--border)] shadow-2xl space-y-6 relative">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center mx-auto shadow-lg">
                <LogIn size={24} />
              </div>
              <h1 className="font-display text-2xl font-extrabold text-[var(--text)]">
                Log In to Your Account
              </h1>
              <p className="text-xs text-[var(--text-dim)]">
                Phone &amp; Password Authentication for IELTS Candidates
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium text-center animate-fadeIn">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                  Select Country Code
                </label>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)]"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.name})
                    </option>
                  ))}
                </select>
              </div>

              <div ref={phoneFieldRef}>
                <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                  Mobile Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-faint)]">
                    <PhoneCall size={16} />
                  </div>
                  <input
                    type="tel"
                    required
                    inputMode="numeric"
                    maxLength={11}
                    placeholder="e.g. 01712345678"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11));
                      if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg)] border text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors font-mono ${fieldErrors.phone ? 'border-rose-500/60' : 'border-[var(--border)]'}`}
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="text-[11px] text-rose-400 mt-1.5">{fieldErrors.phone}</p>
                )}
              </div>

              <div ref={passwordFieldRef}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono uppercase text-[var(--text-dim)] font-semibold">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={onNavigateToForgotPassword}
                    className="text-[11px] font-semibold text-[var(--accent-a)] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-faint)]">
                    <KeyRound size={16} />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg)] border text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors ${fieldErrors.password ? 'border-rose-500/60' : 'border-[var(--border)]'}`}
                  />
                </div>
                {fieldErrors.password && (
                  <p className="text-[11px] text-rose-400 mt-1.5">{fieldErrors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 flex items-center justify-center gap-2 mt-2"
              >
                <LogIn size={16} />
                <span>{isSubmitting ? 'Logging in...' : 'Log In'}</span>
              </Button>
            </form>

            {/* Footer Navigation */}
            <div className="text-center pt-4 border-t border-[var(--border)]">
              <span className="text-xs text-[var(--text-dim)]">Don't have an account yet? </span>
              <button
                type="button"
                onClick={onNavigateToSignup}
                className="text-xs font-bold text-[var(--accent-a)] hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <span>Sign Up</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </GlassPanel>
        </div>
      </main>

      <footer className="font-michroma relative z-10 py-4 text-center text-xs tracking-wide text-[var(--text-faint)] border-t border-[var(--border)]">
        IELTS AI • Phone Authentication • Powered by PostgreSQL
      </footer>
    </div>
  );
};