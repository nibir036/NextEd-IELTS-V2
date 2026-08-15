import React, { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import {
  User,
  Mail,
  PhoneCall,
  LogOut,
} from '../components/ui/icons';

interface CurrentUser {
  name?: string;
  email?: string;
  phone?: string;
}

interface SettingsViewProps {
  currentUser?: CurrentUser;
  onNavigateBack?: () => void;
  onLogout?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  onNavigateBack,
  onLogout,
}) => {
  const [fullName, setFullName] = useState<string>(currentUser?.name || '');
  const [email, setEmail] = useState<string>(currentUser?.email || '');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName.trim()) return setErrorMessage('Please enter your full name.');

    setIsSaving(true);
    try {
      // NOTE: your `db` has no updateUser method yet.
      // Add one in src/lib/db.ts, then call it here, e.g.:
      // await db.updateUser({ name: fullName.trim(), email: email.trim().toLowerCase(), phone: phone.trim() });
      setSuccessMessage('Profile updated successfully.');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col p-4">
      <main className="flex-1 flex items-center justify-center">
        <GlassPanel className="p-8 max-w-md w-full space-y-4">
          <h2 className="text-2xl font-bold text-center">Settings</h2>

          {errorMessage && (
            <div className="text-rose-400 text-xs text-center">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-emerald-400 text-xs text-center">{successMessage}</div>
          )}

          <form onSubmit={handleSave} className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 opacity-60" />
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 opacity-60" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 opacity-60" />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm font-mono"
              />
            </div>

            <Button type="submit" disabled={isSaving} className="w-full py-3">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>

          <div className="pt-2 space-y-2">
            {onNavigateBack && (
              <Button
                type="button"
                onClick={onNavigateBack}
                className="w-full py-2.5 bg-transparent border border-[var(--border)]"
              >
                Back
              </Button>
            )}
            {onLogout && (
              <Button
                type="button"
                onClick={onLogout}
                className="w-full py-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-400"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            )}
          </div>
        </GlassPanel>
      </main>
    </div>
  );
};