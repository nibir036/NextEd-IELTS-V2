import React, { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { BackLink } from '../components/ui/BackLink';
import {
  Sparkles,
  PhoneCall,
  Mail,
  User,
  UserPlus,
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SignupView: React.FC<SignupViewProps> = ({
  onSignupSuccess,
  onNavigateToLogin,
  onNavigateToLanding,
}) => {
  const [countryCode, setCountryCode] = useState<string>('+1');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [targetBand, setTargetBand] = useState<number>(8.0);
  // moduleType has no backing column in `users` yet — kept in UI state only
  // until a users.module_type migration is added.
  const [moduleType, setModuleType] = useState<'Academic' | 'General Training'>('Academic');
  const [examDate, setExamDate] = useState<string>('2026-11-14');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fullPhone = `${countryCode} ${phoneNumber.trim()}`;

  // NOTE: OTP verification is planned as a second step after this succeeds.
  // For now this is a single-step phone + password + email registration.
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
    if (!email.trim() || !EMAIL_REGEX.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
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
        email: email.trim().toLowerCase(),
        targetBand,
        examDate,
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
              <div className="w-12 h-12 rounded-2xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center mx-auto shadow-md">
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

              {/* Email */}
              <div>
                <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-faint)]">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="e.g. david@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    onChange={(e) => setCountryCode(e.target.value)}
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
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors font-mono"
                    />
                  </div>
                </div>
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

              {/* Target Band & Module Choice */}
              <div className="grid grid-cols-2 gap-3">
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

                <div>
                  <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                    IELTS Module
                  </label>
                  <select
                    value={moduleType}
                    onChange={(e) => setModuleType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)]"
                  >
                    <option value="Academic">Academic Module</option>
                    <option value="General Training">General Training</option>
                  </select>
                </div>
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
                disabled={isSubmitting}
                className="w-full py-3 flex items-center justify-center gap-2 mt-2"
              >
                <Award size={16} />
                <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
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
