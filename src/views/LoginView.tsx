import React, { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import {
  Sparkles,
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
}

const COUNTRY_CODES = [
  { code: '+1', name: 'USA / Canada' },
  { code: '+44', name: 'United Kingdom' },
  { code: '+880', name: 'Bangladesh' },
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
}) => {
  const [countryCode, setCountryCode] = useState<string>('+1');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fullPhone = `${countryCode} ${phoneNumber.trim()}`;

  // NOTE: OTP verification is planned as a second step after this succeeds
  // (see project notes). For now this is a single-step phone + password login.
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!phoneNumber.trim() || phoneNumber.trim().length < 6) {
      setErrorMessage('Please enter a valid mobile phone number.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await db.loginUserByPhone(fullPhone, password);
      if (user) {
        onLoginSuccess();
      } else {
        setErrorMessage('Invalid phone number or password.');
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
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-xl bg-[image:var(--accent-gradient)] flex items-center justify-center text-white font-bold shadow-md">
            <Sparkles size={18} />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">AI IELTS Pro</span>
        </div>

        <Button variant="ghost" size="sm" onClick={onNavigateToLanding}>
          ← Back to Home
        </Button>
      </header>

      {/* Main Login Panel */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-6">
          <GlassPanel className="p-6 md:p-8 border border-[var(--border)] shadow-2xl space-y-6 relative">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent-a)]/15 text-[var(--accent-a)] flex items-center justify-center mx-auto shadow-inner">
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

              <div>
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
                    placeholder="e.g. 555-019-2834"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-faint)]">
                    <KeyRound size={16} />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors"
                  />
                </div>
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

      <footer className="relative z-10 py-4 text-center text-xs text-[var(--text-faint)] font-mono border-t border-[var(--border)]">
        AI IELTS Pro • Phone Authentication • Powered by PostgreSQL
      </footer>
    </div>
  );
};