import React, { useRef, useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { BackLink } from '../components/ui/BackLink';
import {
  PhoneCall,
  KeyRound,
  ShieldCheck,
  UserPlus,
  User,
  ArrowRight,
  Award,
  Sparkles,
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
  { code: '+88', name: 'Bangladesh' },
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
  const [countryCode, setCountryCode] = useState<string>('+88');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

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

  // Per-field errors shown directly under the offending input, instead of
  // (or alongside) the generic banner above the form -- and the matching
  // ref each is scrolled into view with on a failed submit, so the
  // candidate lands right on the field that needs fixing rather than
  // having to hunt for it.
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const fullNameFieldRef = useRef<HTMLDivElement>(null);
  const phoneFieldRef = useRef<HTMLDivElement>(null);
  const otpFieldRef = useRef<HTMLDivElement>(null);
  const passwordFieldRef = useRef<HTMLDivElement>(null);
  const confirmPasswordFieldRef = useRef<HTMLDivElement>(null);

  const scrollToField = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

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

    if (!phoneNumber.trim() || phoneNumber.trim().length !== 11) {
      setOtpErrorMessage('Enter a valid 11-digit BD mobile number first.');
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
    setFieldErrors({});

    if (!fullName.trim() || fullName.trim().length < 2) {
      setFieldErrors({ fullName: 'Please enter your full candidate name.' });
      scrollToField(fullNameFieldRef);
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length !== 11) {
      setFieldErrors({ phone: 'Please enter a valid 11-digit BD mobile number.' });
      scrollToField(phoneFieldRef);
      return;
    }
    if (!otpProof) {
      setOtpErrorMessage('Please verify your phone number with the OTP code first.');
      scrollToField(otpFieldRef);
      return;
    }
    if (password.length < 6) {
      setFieldErrors({ password: 'Password must be at least 6 characters.' });
      scrollToField(passwordFieldRef);
      return;
    }
    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match.' });
      scrollToField(confirmPasswordFieldRef);
      return;
    }

    setIsSubmitting(true);
    try {
      // Signup only ever collects the minimum required to create an
      // account -- target band and exam date used to be asked here too,
      // but candidates set those from their profile after logging in
      // instead. The register API already defaults target_band to 8.0
      // and leaves exam_date null when neither is sent.
      const newUser = await db.registerUser({
        phone: fullPhone,
        password,
        name: fullName.trim(),
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
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity overflow-hidden min-w-0"
        >
          <img src="/branding/ielts-ai-mascot-full.png" alt="IELTS AI" className="h-10 w-auto object-contain shrink-0" />
          <img src="/branding/ielts-ai-wordmark-dark.png" alt="IELTS AI by nextED." className="brand-wordmark-dark h-9 w-auto object-contain" />
          <img src="/branding/ielts-ai-wordmark-light.png" alt="IELTS AI by nextED." className="brand-wordmark-light h-9 w-auto object-contain" />
        </div>

        <BackLink onClick={onNavigateToLanding}>Back to Home</BackLink>
      </header>

      {/* Main Signup Form */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-lg space-y-6">
          <div className="flex justify-center">
            <img src="/branding/ielts-ai-mascot-full-dark.png" alt="IELTS AI by nextED." className="brand-mascot-dark h-40 w-auto object-contain" />
            <img src="/branding/ielts-ai-mascot-full-light.png" alt="IELTS AI by nextED." className="brand-mascot-light h-40 w-auto object-contain" />
          </div>

          {/* How-to-register highlight -- explains the phone-first flow
              before the candidate hits the disabled password fields below,
              so the OTP-gating doesn't read as a bug. */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[var(--accent-a)]/10 border border-[var(--accent-a)]/30 text-xs text-[var(--text-dim)] leading-relaxed">
            <Sparkles size={16} className="text-[var(--accent-a)] shrink-0 mt-0.5" />
            <span>
              <span className="font-semibold text-[var(--text)]">How to register:</span> enter your name and phone number, verify your phone with the OTP code we text you, then set your password. You can't create a password until your phone number is verified.
            </span>
          </div>

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
              <div ref={fullNameFieldRef}>
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
                    onChange={(e) => {
                      setFullName(e.target.value.replace(/[^A-Za-z\s.'-]/g, ''));
                      if (fieldErrors.fullName) setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
                    }}
                    pattern="[A-Za-z\s.'-]+"
                    title="Name can only contain letters"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg)] border text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors ${fieldErrors.fullName ? 'border-rose-500/60' : 'border-[var(--border)]'}`}
                  />
                </div>
                {fieldErrors.fullName && (
                  <p className="text-[11px] text-rose-400 mt-1.5">{fieldErrors.fullName}</p>
                )}
              </div>

              {/* Phone number and country code */}
              <div ref={phoneFieldRef} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                    Country Code
                  </label>
                  <select
                    value={countryCode}
                    onChange={(e) => handleCountryCodeChange(e.target.value)}
                    disabled={isOtpVerified}
                    className="w-full px-2.5 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] font-mono disabled:opacity-60"
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
                      inputMode="numeric"
                      maxLength={11}
                      placeholder="e.g. 01712345678"
                      value={phoneNumber}
                      onChange={(e) => {
                        handlePhoneNumberChange(e.target.value.replace(/\D/g, '').slice(0, 11));
                        if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      disabled={isOtpVerified}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg)] border text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors font-mono disabled:opacity-60 ${fieldErrors.phone ? 'border-rose-500/60' : 'border-[var(--border)]'}`}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="text-[11px] text-rose-400 mt-1.5">{fieldErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Phone OTP verification — sends via /api/auth/otp/send (Alpha
                  SMS) and checks via /api/auth/otp/verify. A successful
                  verify is required before Create Account is enabled. */}
              <div ref={otpFieldRef}>
                <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                  Verification Code (OTP)
                </label>

                {!otpSent ? (
                  <Button
                    type="button"
                    variant="primary"
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
                    We&apos;ll text a 6-digit code to confirm this number. You can&apos;t set a
                    password until it&apos;s verified.
                  </p>
                )}
              </div>

              {/* Password + Confirm Password -- disabled until the OTP is
                  verified, mirroring ForgotPasswordView.tsx: a candidate
                  can't type a password for an unverified phone number,
                  not just be blocked from submitting one. */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div ref={passwordFieldRef}>
                  <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder={isOtpVerified ? 'At least 6 characters' : 'Verify your phone first'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    disabled={!isOtpVerified}
                    className={`w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors disabled:opacity-60 ${fieldErrors.password ? 'border-rose-500/60' : 'border-[var(--border)]'}`}
                  />
                  {fieldErrors.password && (
                    <p className="text-[11px] text-rose-400 mt-1.5">{fieldErrors.password}</p>
                  )}
                </div>
                <div ref={confirmPasswordFieldRef}>
                  <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder={isOtpVerified ? 'Re-enter password' : 'Verify your phone first'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }}
                    disabled={!isOtpVerified}
                    className={`w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors disabled:opacity-60 ${fieldErrors.confirmPassword ? 'border-rose-500/60' : 'border-[var(--border)]'}`}
                  />
                  {fieldErrors.confirmPassword && (
                    <p className="text-[11px] text-rose-400 mt-1.5">{fieldErrors.confirmPassword}</p>
                  )}
                </div>
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
        IELTS AI • Phone Authentication • Powered by PostgreSQL
      </footer>
    </div>
  );
};
