import React, { useEffect, useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { ThemeSwitcher } from '../components/settings/ThemeSwitcher';
import { Button } from '../components/ui/Button';
import { db, type DbUser, type ExamType, type AcademicBackground } from '../lib/db';
import {
  Settings,
  Sparkles,
  Check,
  Shield,
  LogOut,
  User,
  GraduationCap,
  Award,
  Mail,
  PhoneCall,
} from '../components/ui/icons';

interface SettingsViewProps {
  id?: string;
  onLogout?: () => void | Promise<void>;
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

const EXAM_TYPE_OPTIONS: { value: ExamType; label: string }[] = [
  { value: 'academic', label: 'Academic' },
  { value: 'general_training', label: 'General Training' },
];

const inputClass =
  'w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] disabled:opacity-60 disabled:cursor-not-allowed';
const labelClass =
  'block text-xs font-mono text-[var(--text-faint)] uppercase mb-1';

export const SettingsView: React.FC<SettingsViewProps> = ({ id, onLogout }) => {
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

  // --- Goals form state ---
  const [targetBand, setTargetBand] = useState(8.0);
  const [examDate, setExamDate] = useState('');
  const [goalsSaving, setGoalsSaving] = useState(false);
  const [goalsSaved, setGoalsSaved] = useState(false);
  const [goalsError, setGoalsError] = useState('');

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
      {/* Identity header */}
      <GlassPanel className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[image:var(--accent-gradient)] text-white font-bold text-lg flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-xl font-bold text-[var(--text)] truncate">
              {user?.name && user.name !== 'Candidate' ? user.name : 'Your Profile'}
            </h2>
            <p className="text-xs text-[var(--text-faint)] mt-0.5">
              Member since {memberSince}
              {user && user.currentBand > 0 && (
                <> · Current band {user.currentBand.toFixed(1)}</>
              )}
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* Theme */}
      <GlassPanel className="p-6">
        <ThemeSwitcher />
      </GlassPanel>

      {/* Profile details */}
      <GlassPanel className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <User size={18} className="text-[var(--accent-a)]" />
          <h3 className="font-display text-xl font-bold text-[var(--text)]">
            Personal & Academic Details
          </h3>
        </div>

        {loading ? (
          <p className="text-xs text-[var(--text-faint)] py-4">Loading your details…</p>
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

              <div>
                <label className={labelClass}>Legal Full Name</label>
                <input
                  type="text"
                  value={legalFullName}
                  onChange={(e) => setLegalFullName(e.target.value)}
                  placeholder="As on your passport / ID"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
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

              <div>
                <label className={labelClass}>Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Exam Type</label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value as ExamType | '')}
                  className={inputClass}
                >
                  <option value="">Select…</option>
                  {EXAM_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
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
                <p className="flex items-center gap-1.5 text-[11px] text-[var(--text-faint)] mt-1">
                  <PhoneCall size={12} className="text-[var(--accent-a)]" />
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
                  <div>
                    <label className={labelClass}>Year Taken</label>
                    <input
                      type="number"
                      min={1990}
                      max={new Date().getFullYear()}
                      value={previousIeltsYear}
                      onChange={(e) => setPreviousIeltsYear(e.target.value)}
                      placeholder="e.g. 2023"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Previous Overall Band</label>
                    <select
                      value={previousIeltsBand}
                      onChange={(e) => setPreviousIeltsBand(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select…</option>
                      {[4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((b) => (
                        <option key={b} value={b}>
                          Band {b.toFixed(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {profileError && (
              <p className="text-xs text-[var(--danger)]">{profileError}</p>
            )}

            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[var(--text-faint)]">
                <GraduationCap size={14} className="text-[var(--accent-a)]" />
                <span>Used to personalize your study plan</span>
              </div>
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
      <GlassPanel className="p-6 space-y-4">
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

          <div>
            <label className={labelClass}>Scheduled Official Exam Date</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {goalsError && <p className="text-xs text-[var(--danger)]">{goalsError}</p>}

        <div className="pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[var(--text-faint)]">
            <Shield size={14} className="text-[var(--success)]" />
            <span>Saved to your account</span>
          </div>

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

      {/* Account / Session */}
      {onLogout && (
        <GlassPanel className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <LogOut size={18} className="text-[var(--accent-a)]" />
            <h3 className="font-display text-xl font-bold text-[var(--text)]">Account</h3>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-[var(--text-faint)]">
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
