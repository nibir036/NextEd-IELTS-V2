import React, { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import {
  Sparkles,
  PhoneCall,
  KeyRound,
  ShieldCheck,
  LogIn,
  UserPlus,
  ArrowRight,
  CheckCircle2,
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
  const [phoneNumber, setPhoneNumber] = useState<string>('555-019-2834');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState<string>('123456');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fullPhone = `${countryCode} ${phoneNumber.trim()}`;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!phoneNumber.trim() || phoneNumber.trim().length < 6) {
      setErrorMessage('Please enter a valid mobile phone number.');
      return;
    }

    // Check if phone exists in static DB
    const existingUser = db.getUserByPhone(fullPhone);
    if (!existingUser) {
      setErrorMessage(
        `No account found with ${fullPhone}. Please create a new account using Sign Up.`
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit SMS verification code sent to your phone.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const user = db.loginUserByPhone(fullPhone);
      setIsSubmitting(false);

      if (user) {
        onLoginSuccess();
      } else {
        setErrorMessage('Failed to authenticate. Please check your phone number.');
      }
    }, 500);
  };

  // Quick 1-click test user auto-fill
  const handleQuickLogin = (demoPhone: string) => {
    setErrorMessage(null);
    const parts = demoPhone.split(' ');
    if (parts.length > 1) {
      setCountryCode(parts[0]);
      setPhoneNumber(parts.slice(1).join(' '));
    } else {
      setPhoneNumber(demoPhone);
    }

    const user = db.loginUserByPhone(demoPhone);
    if (user) {
      onLoginSuccess();
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
                Secure Phone Authentication for IELTS Candidates
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium text-center animate-fadeIn">
                {errorMessage}
              </div>
            )}

            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
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
                  <p className="text-[10px] text-[var(--text-faint)] mt-1">
                    No email or password needed. We deliver a secure OTP via SMS.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 flex items-center justify-center gap-2 mt-2"
                >
                  <KeyRound size={16} />
                  <span>{isSubmitting ? 'Sending SMS Code...' : 'Send OTP Verification Code'}</span>
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[var(--text-faint)]">Code sent to: </span>
                    <span className="font-bold text-[var(--text)]">{fullPhone}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-[var(--accent-a)] hover:underline cursor-pointer font-bold"
                  >
                    Edit Number
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                    Enter 6-Digit SMS Security Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-faint)]">
                      <ShieldCheck size={18} />
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-base font-mono tracking-widest text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors text-center"
                    />
                  </div>
                  <div className="mt-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center gap-2">
                    <CheckCircle2 size={14} className="shrink-0" />
                    <span>Demo mode active: Enter code <strong>123456</strong> or any 6 digits to verify.</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 flex items-center justify-center gap-2"
                >
                  <LogIn size={16} />
                  <span>{isSubmitting ? 'Verifying Code...' : 'Verify & Enter Dashboard'}</span>
                </Button>
              </form>
            )}

            {/* Quick Demo Login Option */}
            <div className="pt-4 border-t border-[var(--border)] space-y-2">
              <div className="text-[11px] font-mono uppercase text-[var(--text-faint)] text-center">
                Demo Accounts in Static DB (1-Click Test):
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('+1 555-019-2834')}
                  className="p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent-a)]/60 text-left text-xs transition-all cursor-pointer group"
                >
                  <div className="font-bold text-[var(--text)] group-hover:text-[var(--accent-a)]">Alex Rivers</div>
                  <div className="text-[10px] font-mono text-[var(--text-faint)]">+1 555-019-2834</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('+44 7700 900077')}
                  className="p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent-a)]/60 text-left text-xs transition-all cursor-pointer group"
                >
                  <div className="font-bold text-[var(--text)] group-hover:text-[var(--accent-a)]">Sarah Chen</div>
                  <div className="text-[10px] font-mono text-[var(--text-faint)]">+44 7700 900077</div>
                </button>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="text-center pt-2">
              <span className="text-xs text-[var(--text-dim)]">Don't have an account yet? </span>
              <button
                type="button"
                onClick={onNavigateToSignup}
                className="text-xs font-bold text-[var(--accent-a)] hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <span>Sign Up with Phone</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </GlassPanel>
        </div>
      </main>

      <footer className="relative z-10 py-4 text-center text-xs text-[var(--text-faint)] font-mono border-t border-[var(--border)]">
        AI IELTS Pro • Phone Authentication & Static Data Persistence
      </footer>
    </div>
  );
};
