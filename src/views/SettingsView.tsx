import React, { useEffect, useRef, useState } from 'react';
import { ThemeSwitcher } from '../components/settings/ThemeSwitcher';
import { Button } from '../components/ui/Button';
import { GlassPanel } from '../components/ui/GlassPanel';
import { BackLink } from '../components/ui/BackLink';
import { db, type DbUser, type ExamType, type AcademicBackground } from '../lib/db';
import {
  Settings,
  Sparkles,
  Check,
  LogOut,
  User,
  Award,
  Mail,
  PhoneCall,
} from '../components/ui/icons';

interface SettingsViewProps {
  id?: string;
  onLogout?: () => void | Promise<void>;
  onNavigateAction?: (route: string) => void;
}

const ACADEMIC_OPTIONS: { value: AcademicBackground; label: string }[] = [
  { value: 'ssc_olevels', label: 'SSC / O Levels' },
  { value: 'hsc_alevels', label: 'HSC / A Levels' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'bachelors', label: "Bachelor's" },
  { value: 'masters', label: "Master's" },
  { value: 'phd', label: 'PhD' },
  { value: 'other', label: 'Other' },
];

const inputClass =
  'w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--accent-a)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors';
const inputBaseClass =
  'w-full bg-[var(--bg)] rounded-xl p-3 text-xs text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--accent-a)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors';
// For a field that can show a validation error: swaps the border color
// instead of layering a second border-color utility on top of inputClass's
// own (which risks either one winning depending on Tailwind's generated
// CSS order).
const inputClassWithError = (hasError: boolean) =>
  `${inputBaseClass} border ${hasError ? 'border-rose-500/60' : 'border-[var(--border)]'}`;
const labelClass =
  'block text-xs font-mono text-[var(--text-dim)] uppercase mb-1 tracking-wide';
const errorClass =
  'text-xs font-semibold text-rose-300 bg-rose-500/15 border border-rose-500/30 rounded-lg px-3 py-2';

export const SettingsView: React.FC<SettingsViewProps> = ({ id, onLogout, onNavigateAction }) => {
  const [user, setUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Profile form state ---
  const [name, setName] = useState('');
  const [legalFullName, setLegalFullName] = useState('');
  const [email, setEmail] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState('');
  const [country, setCountry] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [examType, setExamType] = useState<ExamType | ''>('');
  const [academicBackground, setAcademicBackground] = useState<AcademicBackground | ''>('');
  const [hasTakenIelts, setHasTakenIelts] = useState(false);
  const [previousIeltsYear, setPreviousIeltsYear] = useState('');
  const [previousIeltsBand, setPreviousIeltsBand] = useState('');

  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Per-field errors shown directly under the offending input, with the
  // matching ref scrolled into view on a failed save -- same pattern as
  // SignupView.tsx / LoginView.tsx.
  const [profileFieldErrors, setProfileFieldErrors] = useState<{
    legalFullName?: string;
    email?: string;
    dateOfBirth?: string;
    previousIeltsYear?: string;
    previousIeltsBand?: string;
  }>({});
  const legalFullNameFieldRef = useRef<HTMLDivElement>(null);
  const emailFieldRef = useRef<HTMLDivElement>(null);
  const dateOfBirthFieldRef = useRef<HTMLDivElement>(null);
  const previousIeltsYearFieldRef = useRef<HTMLDivElement>(null);
  const previousIeltsBandFieldRef = useRef<HTMLDivElement>(null);

  // --- Goals form state ---
  const [targetBand, setTargetBand] = useState(8.0);
  const [examDate, setExamDate] = useState('');
  const [goalsSaving, setGoalsSaving] = useState(false);
  const [goalsSaved, setGoalsSaved] = useState(false);
  const [goalsError, setGoalsError] = useState('');
  const [goalsFieldErrors, setGoalsFieldErrors] = useState<{ examDate?: string }>({});
  const examDateFieldRef = useRef<HTMLDivElement>(null);

  const scrollToField = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Hydrate every field from the real logged-in user.
  useEffect(() => {
    let cancelled = false;
    db.getCurrentUser()
      .then((u) => {
        if (cancelled || !u) return;
        setUser(u);
        setName(u.name === 'Candidate' ? '' : u.name);
        setLegalFullName(u.legalFullName);
        setEmail(u.email);
        setNativeLanguage(u.nativeLanguage);
        setCountry(u.country);
        setDateOfBirth(u.dateOfBirth);
        setExamType(u.examType);
        setAcademicBackground(u.academicBackground);
        setHasTakenIelts(u.hasTakenIelts);
        setPreviousIeltsYear(u.previousIeltsYear != null ? String(u.previousIeltsYear) : '');
        setPreviousIeltsBand(u.previousIeltsBand != null ? String(u.previousIeltsBand) : '');
        setTargetBand(u.targetBand || 8.0);
        setExamDate(u.examDate);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveProfile = async () => {
    setProfileError('');
    setProfileFieldErrors({});

    if (legalFullName.trim() && legalFullName.trim().length < 2) {
      setProfileFieldErrors({ legalFullName: 'Enter your full legal name.' });
      scrollToField(legalFullNameFieldRef);
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setProfileFieldErrors({ email: 'Enter a valid email address.' });
      scrollToField(emailFieldRef);
      return;
    }
    if (dateOfBirth && new Date(dateOfBirth) > new Date()) {
      setProfileFieldErrors({ dateOfBirth: 'Date of birth can\'t be in the future.' });
      scrollToField(dateOfBirthFieldRef);
      return;
    }
    if (hasTakenIelts) {
      const year = Number(previousIeltsYear);
      if (
        previousIeltsYear &&
        (!Number.isInteger(year) || year < 1990 || year > new Date().getFullYear())
      ) {
        setProfileFieldErrors({ previousIeltsYear: `Enter a year between 1990 and ${new Date().getFullYear()}.` });
        scrollToField(previousIeltsYearFieldRef);
        return;
      }
      if (!previousIeltsBand) {
        setProfileFieldErrors({ previousIeltsBand: 'Select your previous overall band.' });
        scrollToField(previousIeltsBandFieldRef);
        return;
      }
    }

    setProfileSaving(true);
    try {
      const updated = await db.updateProfile({
        name: name.trim(),
        legalFullName,
        email,
        nativeLanguage,
        country,
        dateOfBirth,
        examType,
        academicBackground,
        hasTakenIelts,
        previousIeltsYear: hasTakenIelts && previousIeltsYear ? Number(previousIeltsYear) : null,
        previousIeltsBand: hasTakenIelts && previousIeltsBand ? Number(previousIeltsBand) : null,
      });
      setUser(updated);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Failed to save profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSaveGoals = async () => {
    setGoalsError('');
    setGoalsFieldErrors({});

    if (examDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(examDate) < today) {
        setGoalsFieldErrors({ examDate: "Exam date can't be in the past." });
        scrollToField(examDateFieldRef);
        return;
      }
    }

    setGoalsSaving(true);
    try {
      const updated = await db.updateGoals({ targetBand, examDate });
      setUser(updated);
      setGoalsSaved(true);
      setTimeout(() => setGoalsSaved(false), 2000);
    } catch (err) {
      setGoalsError(err instanceof Error ? err.message : 'Failed to save goals.');
    } finally {
      setGoalsSaving(false);
    }
  };

  const initials = user?.avatar && user.avatar !== '??' ? user.avatar : '--';
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—';

  return (
    <div id={id} className="space-y-6">
      {onNavigateAction && (
        <BackLink onClick={() => onNavigateAction('dashboard')}>Back to Dashboard</BackLink>
      )}

      {/* Identity header */}
      <GlassPanel className="p-6 border border-[var(--border)] shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--accent-a)] font-bold text-lg flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-xl font-bold text-[var(--text)] truncate">
              {user?.name && user.name !== 'Candidate' ? user.name : 'Your Profile'}
            </h2>
            <p className="text-xs text-[var(--text-dim)] mt-0.5">
              Member since {memberSince}
              {user && user.currentBand > 0 && (
                <> · Current band {user.currentBand.toFixed(1)}</>
              )}
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* Profile details */}
      <GlassPanel className="p-6 border border-[var(--border)] shadow-lg space-y-4">
        <div className="flex items-center gap-2">
          <User size={18} className="text-[var(--accent-a)]" />
          <h3 className="font-display text-xl font-bold text-[var(--text)]">
            Personal & Academic Details
          </h3>
        </div>

        {loading ? (
          <p className="text-xs text-[var(--text-dim)] py-4">Loading your details…</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className={labelClass}>Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="How we address you"
                  className={inputClass}
                />
              </div>

              <div ref={legalFullNameFieldRef}>
                <label className={labelClass}>Legal Full Name</label>
                <input
                  type="text"
                  value={legalFullName}
                  onChange={(e) => {
                    setLegalFullName(e.target.value.replace(/[^A-Za-z\s.'-]/g, ''));
                    if (profileFieldErrors.legalFullName) {
                      setProfileFieldErrors((prev) => ({ ...prev, legalFullName: undefined }));
                    }
                  }}
                  pattern="[A-Za-z\s.'-]+"
                  title="Name can only contain letters"
                  placeholder="As on your passport / ID"
                  className={inputClassWithError(Boolean(profileFieldErrors.legalFullName))}
                />
                {profileFieldErrors.legalFullName && (
                  <p className="text-[11px] text-rose-400 mt-1">{profileFieldErrors.legalFullName}</p>
                )}
              </div>

              <div ref={emailFieldRef}>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (profileFieldErrors.email) {
                      setProfileFieldErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  placeholder="you@example.com"
                  className={inputClassWithError(Boolean(profileFieldErrors.email))}
                />
                {profileFieldErrors.email && (
                  <p className="text-[11px] text-rose-400 mt-1">{profileFieldErrors.email}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Native Language</label>
                <input
                  type="text"
                  value={nativeLanguage}
                  onChange={(e) => setNativeLanguage(e.target.value)}
                  placeholder="e.g. Bengali"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Bangladesh"
                  className={inputClass}
                />
              </div>

              <div ref={dateOfBirthFieldRef}>
                <label className={labelClass}>Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => {
                    setDateOfBirth(e.target.value);
                    if (profileFieldErrors.dateOfBirth) {
                      setProfileFieldErrors((prev) => ({ ...prev, dateOfBirth: undefined }));
                    }
                  }}
                  className={inputClassWithError(Boolean(profileFieldErrors.dateOfBirth))}
                />
                {profileFieldErrors.dateOfBirth && (
                  <p className="text-[11px] text-rose-400 mt-1">{profileFieldErrors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Academic Background</label>
                <select
                  value={academicBackground}
                  onChange={(e) => setAcademicBackground(e.target.value as AcademicBackground | '')}
                  className={inputClass}
                >
                  <option value="">Select…</option>
                  {ACADEMIC_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone — read-only */}
              <div>
                <label className={labelClass}>Phone (login ID)</label>
                <input
                  type="text"
                  value={user?.phone || ''}
                  disabled
                  className={inputClass}
                />
                <p className="flex items-center gap-1.5 text-[11px] text-[var(--text-dim)] mt-1">
                  <PhoneCall size={12} className="text-[var(--text-faint)]" />
                  To change your phone number, contact NextEd support.
                </p>
              </div>
            </div>

            {/* Prior IELTS history */}
            <div className="pt-2 border-t border-[var(--border)]">
              <div className="flex items-center gap-2 pt-3 pb-1">
                <Award size={16} className="text-[var(--accent-a)]" />
                <h4 className="text-sm font-semibold text-[var(--text)]">Previous IELTS Experience</h4>
              </div>

              <label className="flex items-center gap-2 text-xs text-[var(--text-dim)] py-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasTakenIelts}
                  onChange={(e) => setHasTakenIelts(e.target.checked)}
                  className="accent-[var(--accent-a)] w-4 h-4"
                />
                I have taken the IELTS exam before
              </label>

              {hasTakenIelts && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div ref={previousIeltsYearFieldRef}>
                    <label className={labelClass}>Year Taken</label>
                    <input
                      type="number"
                      min={1990}
                      max={new Date().getFullYear()}
                      value={previousIeltsYear}
                      onChange={(e) => {
                        setPreviousIeltsYear(e.target.value);
                        if (profileFieldErrors.previousIeltsYear) {
                          setProfileFieldErrors((prev) => ({ ...prev, previousIeltsYear: undefined }));
                        }
                      }}
                      placeholder="e.g. 2023"
                      className={inputClassWithError(Boolean(profileFieldErrors.previousIeltsYear))}
                    />
                    {profileFieldErrors.previousIeltsYear && (
                      <p className="text-[11px] text-rose-400 mt-1">{profileFieldErrors.previousIeltsYear}</p>
                    )}
                  </div>
                  <div ref={previousIeltsBandFieldRef}>
                    <label className={labelClass}>Previous Overall Band</label>
                    <select
                      value={previousIeltsBand}
                      onChange={(e) => {
                        setPreviousIeltsBand(e.target.value);
                        if (profileFieldErrors.previousIeltsBand) {
                          setProfileFieldErrors((prev) => ({ ...prev, previousIeltsBand: undefined }));
                        }
                      }}
                      className={inputClassWithError(Boolean(profileFieldErrors.previousIeltsBand))}
                    >
                      <option value="">Select…</option>
                      {[4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((b) => (
                        <option key={b} value={b}>
                          Band {b.toFixed(1)}
                        </option>
                      ))}
                    </select>
                    {profileFieldErrors.previousIeltsBand && (
                      <p className="text-[11px] text-rose-400 mt-1">{profileFieldErrors.previousIeltsBand}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {profileError && (
              <p className={errorClass}>{profileError}</p>
            )}

            <div className="pt-2 flex items-center justify-end">
              <Button
                variant="primary"
                size="md"
                icon={profileSaved ? <Check size={16} /> : <Sparkles size={16} />}
                onClick={handleSaveProfile}
                disabled={profileSaving}
              >
                {profileSaved ? 'Profile Saved!' : profileSaving ? 'Saving…' : 'Save Profile'}
              </Button>
            </div>
          </>
        )}
      </GlassPanel>

      {/* Exam goals — separate save */}
      <GlassPanel className="p-6 border border-[var(--border)] shadow-lg space-y-4">
        <div className="flex items-center gap-2">
          <Settings size={18} className="text-[var(--accent-a)]" />
          <h3 className="font-display text-xl font-bold text-[var(--text)]">
            Candidate Exam Goals
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className={labelClass}>Target Overall Band Score</label>
            <select
              value={targetBand}
              onChange={(e) => setTargetBand(parseFloat(e.target.value))}
              className={inputClass}
            >
              {[6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((b) => (
                <option key={b} value={b}>
                  Band {b.toFixed(1)} Goal
                </option>
              ))}
            </select>
          </div>

          <div ref={examDateFieldRef}>
            <label className={labelClass}>Scheduled Official Exam Date</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => {
                setExamDate(e.target.value);
                if (goalsFieldErrors.examDate) {
                  setGoalsFieldErrors((prev) => ({ ...prev, examDate: undefined }));
                }
              }}
              className={inputClassWithError(Boolean(goalsFieldErrors.examDate))}
            />
            {goalsFieldErrors.examDate && (
              <p className="text-[11px] text-rose-400 mt-1">{goalsFieldErrors.examDate}</p>
            )}
          </div>
        </div>

        {goalsError && <p className={errorClass}>{goalsError}</p>}

        <div className="pt-3 flex items-center justify-end">
          <Button
            variant="primary"
            size="md"
            icon={goalsSaved ? <Check size={16} /> : <Sparkles size={16} />}
            onClick={handleSaveGoals}
            disabled={goalsSaving}
          >
            {goalsSaved ? 'Goals Saved!' : goalsSaving ? 'Saving…' : 'Save Target Goals'}
          </Button>
        </div>
      </GlassPanel>

      {/* Theme */}
      <GlassPanel className="p-6 border border-[var(--border)] shadow-lg">
        <ThemeSwitcher />
      </GlassPanel>

      {/* Account / Session */}
      {onLogout && (
        <GlassPanel className="p-6 border border-[var(--border)] shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <LogOut size={18} className="text-[var(--accent-a)]" />
            <h3 className="font-display text-xl font-bold text-[var(--text)]">Account</h3>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-[var(--text-dim)]">
              Sign out of this device. You&apos;ll need your phone and password to log back in.
            </p>
            <Button
              variant="secondary"
              size="md"
              icon={<LogOut size={16} />}
              onClick={() => onLogout()}
            >
              Log Out
            </Button>
          </div>
        </GlassPanel>
      )}
    </div>
  );
};
