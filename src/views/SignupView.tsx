import React, { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { BackLink } from '../components/ui/BackLink';
import {
  Sparkles,
  PhoneCall,
  KeyRound,
  ShieldCheck,
  UserPlus,
  User,
  ArrowRight,
  Award,
} from '../components/ui/icons';
import { db } from '../lib/db';

interface SignupViewProps {
  onSignupSuccess: () => void;
  onNavigateToLogin: () => void;
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

export const SignupView: React.FC<SignupViewProps> = ({
  onSignupSuccess,
  onNavigateToLogin,
  onNavigateToLanding,
}) => {
  const [countryCode, setCountryCode] = useState<string>('+1');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [targetBand, setTargetBand] = useState<number>(8.0);
  const [examDate, setExamDate] = useState<string>('2026-11-14');

  // Phone OTP verification — wired to /api/auth/otp/{send,verify} (Alpha
  // SMS behind the scenes). Verifying returns a signed proof string that
  // must be passed to registerUser(); Create Account stays disabled until
  // that proof exists. Changing the phone after verifying invalidates the
  // proof (it's bound to the exact phone string), so it's reset below
  // whenever the number or country code changes.
  const [otp, setOtp] = useState<string>('');
  const [otpProof, setOtpProof] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [otpStatusMessage, setOtpStatusMessage] = useState<string | null>(null);
  const [otpErrorMessage, setOtpErrorMessage] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fullPhone = `${countryCode} ${phoneNumber.trim()}`;
  const cleanPhone = fullPhone.replace(/\s+/g, '');
  const isOtpVerified = Boolean(otpProof);

  const resetOtpState = () => {
    setOtp('');
    setOtpProof(null);
    setOtpSent(false);
    setOtpStatusMessage(null);
    setOtpErrorMessage(null);
  };

  const handleCountryCodeChange = (value: string) => {
    setCountryCode(value);
    resetOtpState();
  };

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
    resetOtpState();
  };

  const handleSendOtp = async (e: React.MouseEvent) => {
    e.preventDefault();
    setOtpErrorMessage(null);
    setOtpStatusMessage(null);

    if (!phoneNumber.trim() || phoneNumber.trim().length < 6) {
      setOtpErrorMessage('Enter your mobile phone number first.');
      return;
    }

    setIsSendingOtp(true);
    try {
      await db.sendOtp(cleanPhone, 'signup');
      setOtpSent(true);
      setOtpProof(null);
      setOtp('');
      setOtpStatusMessage('Code sent — check your SMS inbox.');
    } catch (err: any) {
      setOtpErrorMessage(err?.message || 'Failed to send verification code.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.MouseEvent) => {
    e.preventDefault();
    setOtpErrorMessage(null);

    if (!otp.trim()) {
      setOtpErrorMessage('Enter the 6-digit code first.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const proof = await db.verifyOtp(cleanPhone, otp.trim(), 'signup');
      setOtpProof(proof);
      setOtpStatusMessage('Phone number verified.');
    } catch (err: any) {
      setOtpErrorMessage(err?.message || 'Incorrect or expired code.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Email is collected later from the candidate's profile after they log
  // in, not at signup — this is a single-step phone + password
  // registration (Academic module only).
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Please enter your full candidate name.');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 6) {
      setErrorMessage('Please enter a valid mobile phone number.');
      return;
    }
    if (!otpProof) {
      setErrorMessage('Please verify your phone number with the OTP code first.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newUser = await db.registerUser({
        phone: fullPhone,
        password,
        name: fullName.trim(),
        targetBand,
        examDate,
        otpProof,
      });
      if (newUser) {
        onSignupSuccess();
      } else {
        setErrorMessage('Failed to create account. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to create account. Please try again.');
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

        <BackLink onClick={onNavigateToLanding}>Back to Home</BackLink>
      </header>

      {/* Main Signup Form */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-lg space-y-6">
          <GlassPanel className="p-6 md:p-8 border border-[var(--border)] shadow-2xl space-y-6 relative">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center mx-auto shadow-lg">
                <UserPlus size={24} />
              </div>
              <h1 className="font-display text-2xl font-extrabold text-[var(--text)]">
                Create Candidate Account
              </h1>
              <p className="text-xs text-[var(--text-dim)]">
                Phone &amp; Password Registration
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium text-center animate-fadeIn">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Candidate Name */}
              <div>
                <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                  Full Candidate Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-faint)]">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Sterling"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors"
                  />
                </div>
              </div>

              {/* Phone number and country code */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                    Country Code
                  </label>
                  <select
                    value={countryCode}
                    onChange={(e) => handleCountryCodeChange(e.target.value)}
                    className="w-full px-2.5 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] font-mono"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} ({c.name.slice(0, 10)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
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
                      placeholder="e.g. 555-019-9988"
                      value={phoneNumber}
                      onChange={(e) => handlePhoneNumberChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Phone OTP verification — sends via /api/auth/otp/send (Alpha
                  SMS) and checks via /api/auth/otp/verify. A successful
                  verify is required before Create Account is enabled. */}
              <div>
                <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                  Verification Code (OTP)
                </label>

                {!otpSent ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    className="w-full py-2.5 flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck size={16} />
                    <span>{isSendingOtp ? 'Sending Code...' : 'Send Verification Code'}</span>
                  </Button>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-faint)]">
                          <KeyRound size={16} />
                        </div>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Enter the 6-digit code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          disabled={isOtpVerified}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors font-mono tracking-widest disabled:opacity-60"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleVerifyOtp}
                        disabled={isVerifyingOtp || isOtpVerified}
                        className="px-4 flex items-center gap-1.5 shrink-0"
                      >
                        <ShieldCheck size={16} />
                        <span>{isOtpVerified ? 'Verified' : isVerifyingOtp ? 'Verifying...' : 'Verify'}</span>
                      </Button>
                    </div>
                    {!isOtpVerified && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp}
                        className="text-[11px] text-[var(--accent-a)] hover:underline mt-1.5 cursor-pointer"
                      >
                        {isSendingOtp ? 'Resending...' : 'Resend code'}
                      </button>
                    )}
                  </>
                )}

                {otpStatusMessage && (
                  <p className="text-[11px] text-emerald-400 mt-1.5">{otpStatusMessage}</p>
                )}
                {otpErrorMessage && (
                  <p className="text-[11px] text-rose-400 mt-1.5">{otpErrorMessage}</p>
                )}
                {!otpSent && !otpErrorMessage && (
                  <p className="text-[11px] text-[var(--text-faint)] mt-1.5">
                    We&apos;ll text a 6-digit code to confirm this number before your account is created.
                  </p>
                )}
              </div>

              {/* Password + Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors"
                  />
                </div>
              </div>

              {/* Target Band */}
              <div>
                <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                  Target Band Score
                </label>
                <select
                  value={targetBand}
                  onChange={(e) => setTargetBand(parseFloat(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs font-bold text-[var(--accent-a)] focus:outline-none focus:border-[var(--accent-a)]"
                >
                  <option value={6.5}>Band 6.5 (Competent)</option>
                  <option value={7.0}>Band 7.0 (Good User)</option>
                  <option value={7.5}>Band 7.5 (Proficient)</option>
                  <option value={8.0}>Band 8.0 (Very Good)</option>
                  <option value={8.5}>Band 8.5 (Expert Goal)</option>
                  <option value={9.0}>Band 9.0 (Perfect Score)</option>
                </select>
              </div>

              {/* Target Exam Date */}
              <div>
                <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                  Target Official Exam Date
                </label>
                <input
                  type="date"
                  required
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] font-mono"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !isOtpVerified}
                className="w-full py-3 flex items-center justify-center gap-2 mt-2"
              >
                <Award size={16} />
                <span>
                  {isSubmitting
                    ? 'Creating Account...'
                    : !isOtpVerified
                      ? 'Verify Phone to Continue'
                      : 'Create Account'}
                </span>
              </Button>
            </form>

            {/* Footer Navigation */}
            <div className="text-center pt-4 border-t border-[var(--border)]">
              <span className="text-xs text-[var(--text-dim)]">Already have a candidate account? </span>
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-xs font-bold text-[var(--accent-a)] hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <span>Log In</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </GlassPanel>
        </div>
      </main>

      <footer className="font-michroma relative z-10 py-4 text-center text-xs tracking-wide text-[var(--text-faint)] border-t border-[var(--border)]">
        AI IELTS Pro • Phone Authentication • Powered by PostgreSQL
      </footer>
    </div>
  );
};
