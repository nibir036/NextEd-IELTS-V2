import React, { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { BackLink } from '../components/ui/BackLink';
import {
  PhoneCall,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from '../components/ui/icons';
import { db } from '../lib/db';

interface ForgotPasswordViewProps {
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

// Forgot-password workflow: phone entry -> Send OTP (server only texts a
// code if the phone belongs to an existing account) -> Verify OTP -> new
// password + confirm -> Reset Password -> candidate returns to Login and
// signs in with the new password. Mirrors SignupView's OTP widget
// (src/views/SignupView.tsx), pointed at purpose "password_reset" instead
// of "signup", and swaps the account-creation fields for a password reset.
export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({
  onNavigateToLogin,
  onNavigateToLanding,
}) => {
  const [countryCode, setCountryCode] = useState<string>('+1');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const [otp, setOtp] = useState<string>('');
  const [otpProof, setOtpProof] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [otpStatusMessage, setOtpStatusMessage] = useState<string | null>(null);
  const [otpErrorMessage, setOtpErrorMessage] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [resetComplete, setResetComplete] = useState<boolean>(false);

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
      await db.sendOtp(cleanPhone, 'password_reset');
      setOtpSent(true);
      setOtpProof(null);
      setOtp('');
      setOtpStatusMessage('Code sent — check your SMS inbox.');
    } catch (err: any) {
      // Server returns "No account found with this phone number." for an
      // unregistered number — surfaced verbatim, since the workflow
      // explicitly requires telling the candidate why nothing arrived.
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
      const proof = await db.verifyOtp(cleanPhone, otp.trim(), 'password_reset');
      setOtpProof(proof);
      setOtpStatusMessage('Phone number verified.');
    } catch (err: any) {
      setOtpErrorMessage(err?.message || 'Incorrect or expired code.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!otpProof) {
      setErrorMessage('Please verify your phone number with the OTP code first.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await db.resetPassword(cleanPhone, newPassword, otpProof);
      setResetComplete(true);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to reset password. Please try again.');
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

      {/* Main Panel */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-center">
            <img src="/branding/ielts-ai-mascot-full-dark.png" alt="IELTS AI by nextED." className="brand-mascot-dark h-40 w-auto object-contain" />
            <img src="/branding/ielts-ai-mascot-full-light.png" alt="IELTS AI by nextED." className="brand-mascot-light h-40 w-auto object-contain" />
          </div>
          <GlassPanel className="p-6 md:p-8 border border-[var(--border)] shadow-2xl space-y-6 relative">
            {resetComplete ? (
              <div className="text-center space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-2">
                  <h1 className="font-display text-2xl font-extrabold text-[var(--text)]">
                    Password Reset
                  </h1>
                  <p className="text-xs text-[var(--text-dim)]">
                    Your password has been changed. Log in with your new password.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="w-full py-3 flex items-center justify-center gap-2"
                >
                  <ArrowRight size={16} />
                  <span>Go to Log In</span>
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center mx-auto shadow-lg">
                    <ShieldCheck size={24} />
                  </div>
                  <h1 className="font-display text-2xl font-extrabold text-[var(--text)]">
                    Reset Your Password
                  </h1>
                  <p className="text-xs text-[var(--text-dim)]">
                    Verify your phone number, then set a new password
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium text-center animate-fadeIn">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-4">
                  {/* Phone number and country code */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                          placeholder="e.g. 555-019-2834"
                          value={phoneNumber}
                          onChange={(e) => handlePhoneNumberChange(e.target.value)}
                          disabled={isOtpVerified}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors font-mono disabled:opacity-60"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone OTP verification */}
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
                        We&apos;ll text a 6-digit code to this number if it belongs to an existing account.
                      </p>
                    )}
                  </div>

                  {/* New password — fields are disabled until the OTP is
                      verified, and the submit button stays gated on it too. */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-faint)]">
                          <KeyRound size={16} />
                        </div>
                        <input
                          type="password"
                          required
                          placeholder="At least 6 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          disabled={!isOtpVerified}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors disabled:opacity-60"
                        />
                      </div>
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
                        disabled={!isOtpVerified}
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !isOtpVerified}
                    className="w-full py-3 flex items-center justify-center gap-2 mt-2"
                  >
                    <ShieldCheck size={16} />
                    <span>
                      {isSubmitting
                        ? 'Resetting Password...'
                        : !isOtpVerified
                          ? 'Verify Phone to Continue'
                          : 'Reset Password'}
                    </span>
                  </Button>
                </form>

                {/* Footer Navigation */}
                <div className="text-center pt-4 border-t border-[var(--border)]">
                  <span className="text-xs text-[var(--text-dim)]">Remember your password? </span>
                  <button
                    type="button"
                    onClick={onNavigateToLogin}
                    className="text-xs font-bold text-[var(--accent-a)] hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Log In</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </>
            )}
          </GlassPanel>
        </div>
      </main>

      <footer className="font-michroma relative z-10 py-4 text-center text-xs tracking-wide text-[var(--text-faint)] border-t border-[var(--border)]">
        IELTS AI • Phone Authentication • Powered by PostgreSQL
      </footer>
    </div>
  );
};
