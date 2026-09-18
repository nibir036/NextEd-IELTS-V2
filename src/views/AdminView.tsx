import React, { useEffect, useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import { StatSummary } from '../types';
import { db, type AdminAnalytics, type AdminFeedbackItem, type DbUser, type UserRole } from '../lib/db';
import {
  Shield,
  PhoneCall,
  KeyRound,
  User,
  UserPlus,
  MessageCircle,
  Check,
  Clock,
} from '../components/ui/icons';

interface AdminViewProps {
  onNavigateAction: (route: string) => void;
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

// Admin-only dashboard: daily signup/login/submission analytics + an
// add-user form. Client-side role check here just redirects non-admins
// away for UX -- the real gate is server-side (src/lib/admin.ts,
// requireAdmin()) on every /api/admin/* route this page calls.
export const AdminView: React.FC<AdminViewProps> = ({ onNavigateAction }) => {
  const [checkedRole, setCheckedRole] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<AdminFeedbackItem[]>([]);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const loadAnalytics = () => {
    db.getAdminAnalytics()
      .then((data) => {
        setAnalytics(data);
        setAnalyticsError(null);
      })
      .catch((err) => {
        setAnalyticsError(err instanceof Error ? err.message : 'Could not load analytics.');
      });
  };

  useEffect(() => {
    let cancelled = false;
    db.getCurrentUser().then((user: DbUser | null) => {
      if (cancelled) return;
      const admin = user?.role === 'admin';
      setIsAdmin(admin);
      setCheckedRole(true);
      if (!admin) {
        onNavigateAction('dashboard');
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFeedback = () => {
    db.getAdminFeedback()
      .then((data) => {
        setFeedback(data);
        setFeedbackError(null);
      })
      .catch((err) => {
        setFeedbackError(err instanceof Error ? err.message : 'Could not load feedback.');
      });
  };

  useEffect(() => {
    if (isAdmin) {
      loadAnalytics();
      loadFeedback();
    }
  }, [isAdmin]);

  const handleToggleReviewed = async (item: AdminFeedbackItem) => {
    const nextReviewed = !item.reviewed_at;
    try {
      await db.setFeedbackReviewed(item.id, nextReviewed);
      setFeedback((prev) =>
        prev.map((f) =>
          f.id === item.id ? { ...f, reviewed_at: nextReviewed ? new Date().toISOString() : null } : f,
        ),
      );
    } catch (err) {
      setFeedbackError(err instanceof Error ? err.message : 'Could not update feedback.');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setFormError('Please enter a full name.');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 6) {
      setFormError('Please enter a valid mobile phone number.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      await db.adminCreateUser({
        phone: `${countryCode} ${phoneNumber.trim()}`,
        password,
        name: fullName.trim(),
        role,
      });
      setFormSuccess(`Account created for ${fullName.trim()} (${role}).`);
      setFullName('');
      setPhoneNumber('');
      setPassword('');
      setRole('student');
      loadAnalytics();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!checkedRole || !isAdmin) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-[var(--text-dim)] font-mono">
        Loading...
      </div>
    );
  }

  const stats: StatSummary[] = analytics
    ? [
        {
          label: 'Total Users',
          value: String(analytics.totalUsers),
          footnote: 'All registered accounts',
          icon: 'Users',
        },
        {
          label: 'Registered Today',
          value: String(analytics.today.registered),
          footnote: 'New signups today (UTC)',
          icon: 'UserPlus',
        },
        {
          label: 'Logged In Today',
          value: String(analytics.today.loggedIn),
          footnote: 'Distinct users today (UTC)',
          icon: 'LogIn',
        },
        {
          label: 'Writing Submissions',
          value: String(analytics.today.writingSubmissions),
          footnote: 'AI-graded today',
          icon: 'PenTool',
        },
        {
          label: 'Speaking Submissions',
          value: String(analytics.today.speakingSubmissions),
          footnote: 'AI-graded today',
          icon: 'Mic',
        },
      ]
    : [];

  return (
    <div className="space-y-6 page-fade-in">
      <GlassPanel className="p-6 flex items-center gap-3 border border-[var(--border)]">
        <div className="w-12 h-12 rounded-2xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center shadow-lg shrink-0">
          <Shield size={22} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text)]">Admin Panel</h1>
          <p className="text-xs text-[var(--text-dim)]">
            Site analytics and account management. Admin-only.
          </p>
        </div>
      </GlassPanel>

      {analyticsError && (
        <GlassPanel className="p-4 border border-rose-500/30 bg-rose-500/10">
          <p className="text-sm text-rose-300">{analyticsError}</p>
        </GlassPanel>
      )}

      {analytics && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.map((s) => (
              <StatCard key={s.label} stat={s} />
            ))}
          </div>

          <GlassPanel className="p-5 border border-[var(--border)]">
            <h2 className="font-display text-lg font-bold text-[var(--text)] mb-1">
              Last 30 Days
            </h2>
            <p className="text-xs text-[var(--text-dim)] mb-4">
              Signups and Writing/Speaking submissions are accurate for any date. Logins are
              tracked from the day this page shipped onward — earlier days show 0 since no login
              log existed before then.
            </p>
            <div className="overflow-x-auto max-h-96 overflow-y-auto rounded-xl border border-[var(--border)]">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-[var(--bg-elevated)]">
                  <tr className="text-left text-[var(--text-faint)] font-mono uppercase tracking-wide">
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2 text-right">Registered</th>
                    <th className="px-3 py-2 text-right">Logged In</th>
                    <th className="px-3 py-2 text-right">Writing</th>
                    <th className="px-3 py-2 text-right">Speaking</th>
                  </tr>
                </thead>
                <tbody>
                  {[...analytics.daily].reverse().map((d) => (
                    <tr key={d.date} className="border-t border-[var(--border)]">
                      <td className="px-3 py-2 font-mono text-[var(--text)]">{d.date}</td>
                      <td className="px-3 py-2 text-right text-[var(--text)]">{d.registered}</td>
                      <td className="px-3 py-2 text-right text-[var(--text)]">{d.loggedIn}</td>
                      <td className="px-3 py-2 text-right text-[var(--text)]">
                        {d.writingSubmissions}
                      </td>
                      <td className="px-3 py-2 text-right text-[var(--text)]">
                        {d.speakingSubmissions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        </>
      )}

      {feedbackError && (
        <GlassPanel className="p-4 border border-rose-500/30 bg-rose-500/10">
          <p className="text-sm text-rose-300">{feedbackError}</p>
        </GlassPanel>
      )}

      <GlassPanel className="p-5 border border-[var(--border)]">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <MessageCircle size={18} className="text-[var(--accent-a)]" />
            <h2 className="font-display text-lg font-bold text-[var(--text)]">Feedback Inbox</h2>
          </div>
          {feedback.length > 0 && (
            <span className="text-xs font-mono text-[var(--text-dim)]">
              {feedback.filter((f) => !f.reviewed_at).length} unread
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--text-dim)] mb-4">
          Submitted from the support widget on the landing page and dashboard.
        </p>
        {feedback.length === 0 ? (
          <p className="text-sm text-[var(--text-dim)] py-6 text-center">No feedback yet.</p>
        ) : (
          <div className="space-y-2 max-h-[32rem] overflow-y-auto">
            {feedback.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border ${
                  item.reviewed_at
                    ? 'border-[var(--border)] bg-[var(--bg)]'
                    : 'border-[var(--accent-a)]/40 bg-[var(--accent-a)]/5'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--text)]">
                      <User size={12} />
                      <span>{item.user_display_name || item.phone || 'Unknown'}</span>
                    </div>
                    <div className="text-[11px] text-[var(--text-faint)] mt-0.5">
                      {(item.user_phone || item.phone) && <span>{item.user_phone || item.phone} · </span>}
                      {new Date(item.created_at).toLocaleString()}
                      {item.page_path && <span> · {item.page_path}</span>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleReviewed(item)}
                    className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold cursor-pointer transition-colors ${
                      item.reviewed_at
                        ? 'bg-[var(--panel-2)] border border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--accent-a)]/40'
                        : 'bg-[var(--accent-a)]/15 border border-[var(--accent-a)]/40 text-[var(--accent-a)] hover:bg-[var(--accent-a)]/25'
                    }`}
                  >
                    {item.reviewed_at ? <Check size={12} /> : <Clock size={12} />}
                    {item.reviewed_at ? 'Reviewed' : 'Mark reviewed'}
                  </button>
                </div>
                <p className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-wrap">
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>

      <GlassPanel className="p-5 border border-[var(--border)] max-w-lg">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus size={18} className="text-[var(--accent-a)]" />
          <h2 className="font-display text-lg font-bold text-[var(--text)]">Add User</h2>
        </div>

        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium text-center">
            {formError}
          </div>
        )}
        {formSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium text-center">
            {formSuccess}
          </div>
        )}

        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
              Full Name
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

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                Code
              </label>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full px-2.5 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] font-mono"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
                Phone Number
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
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 font-semibold">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)]"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 flex items-center justify-center gap-2"
          >
            <UserPlus size={16} />
            <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
          </Button>
        </form>
      </GlassPanel>
    </div>
  );
};
