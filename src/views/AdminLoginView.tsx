import React, { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { BackLink } from '../components/ui/BackLink';
import { Shield, User, KeyRound, LogIn } from '../components/ui/icons';
import { db } from '../lib/db';

interface AdminLoginViewProps {
  onLoginSuccess: () => void;
  onNavigateToLanding: () => void;
}

// Standalone admin sign-in -- deliberately not linked from the public
// /login, /signup, or landing pages; admins just know this URL. Reuses the
// same phone+password account/session mechanism as the student login (the
// `phone` column doubles as this page's "Username" -- the schema has no
// separate username column), but strips out everything that doesn't belong
// on an admin-only screen: no country-code picker, no signup link, no
// forgot-password link, no OTP step. After a successful login it double-
// checks role === 'admin' server-side (via the returned user) and
// immediately logs out + refuses any non-admin account, since this page
// implies admin-only access even though the underlying login endpoint is
// shared with everyone.
export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onLoginSuccess,
  onNavigateToLanding,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim()) {
      setErrorMessage('Please enter your username.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await db.loginUserByPhone(username.trim(), password);
      if (!user) {
        setErrorMessage('Invalid username or password.');
        return;
      }
      if (user.role !== 'admin') {
        await db.logout();
        setErrorMessage('This login is for admin accounts only.');
        return;
      }
      onLoginSuccess();
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

      {/* Main Admin Login Panel */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-6">
          <GlassPanel className="p-6 md:p-8 border border-[var(--border)] shadow-2xl space-y-6 relative">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[image:var(--accent-gradient)] text-white flex items-center justify-center mx-auto shadow-lg">
                <Shield size={24} />
              </div>
              <h1 className="font-display text-2xl font-extrabold text-[var(--text)]">
                Admin Sign In
              </h1>
              <p className="text-xs text-[var(--text-dim)]">
                Restricted access. Admin accounts only.
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
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-faint)]">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    autoComplete="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    autoComplete="current-password"
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
                <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
              </Button>
            </form>
          </GlassPanel>
        </div>
      </main>

      <footer className="font-michroma relative z-10 py-4 text-center text-xs tracking-wide text-[var(--text-faint)] border-t border-[var(--border)]">
        IELTS AI • Admin Access
      </footer>
    </div>
  );
};
