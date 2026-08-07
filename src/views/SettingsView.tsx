import React, { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { ThemeSwitcher } from '../components/settings/ThemeSwitcher';
import { Button } from '../components/ui/Button';
import { currentUser } from '../lib/data';
import { Settings, Sparkles, Check, Shield } from '../components/ui/icons';

interface SettingsViewProps {
  id?: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ id }) => {
  const [targetBand, setTargetBand] = useState(currentUser.targetBand);
  const [examDate, setExamDate] = useState(currentUser.examDate);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div id={id} className="space-y-6">
      {/* Theme Customization Section */}
      <GlassPanel className="p-6">
        <ThemeSwitcher />
      </GlassPanel>

      {/* Target Goals & Exam Preferences */}
      <GlassPanel className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Settings size={18} className="text-[var(--accent-a)]" />
          <h3 className="font-display text-xl font-bold text-[var(--text)]">
            Candidate Exam Goals
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-mono text-[var(--text-faint)] uppercase mb-1">
              Target Overall Band Score
            </label>
            <select
              value={targetBand}
              onChange={(e) => setTargetBand(parseFloat(e.target.value))}
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)]"
            >
              {[6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((b) => (
                <option key={b} value={b}>
                  Band {b.toFixed(1)} Goal
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--text-faint)] uppercase mb-1">
              Scheduled Official Exam Date
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)]"
            />
          </div>
        </div>

        <div className="pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[var(--text-faint)]">
            <Shield size={14} className="text-[var(--success)]" />
            <span>Local profile state updated</span>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={savedSuccess ? <Check size={16} /> : <Sparkles size={16} />}
            onClick={handleSave}
          >
            {savedSuccess ? 'Preferences Saved!' : 'Save Target Goals'}
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
};
