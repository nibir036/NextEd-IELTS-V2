import React, { useEffect, useState } from 'react';
import { Search, Sparkles, Settings, BookOpen, PenTool, Mic, Headphones, FileCheck, History, LayoutDashboard, Bell } from '../ui/icons';
import { currentUser as fallbackUser } from '../../lib/data';
import { db, type DbUser } from '../../lib/db';

interface TopBarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  id?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ currentRoute, onNavigate, id }) => {
  const [user, setUser] = useState<DbUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    db.getCurrentUser()
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Fall back to the placeholder profile until the real user resolves.
  const activeUser = user ?? fallbackUser;

  const titleMap: Record<string, { title: string; subtitle: string; icon: React.FC<{ size?: number; className?: string }> }> = {
    dashboard: { title: 'Exam Dashboard', subtitle: 'Personalized Band 8.0 target tracker', icon: LayoutDashboard },
    reading: { title: 'IELTS Reading', subtitle: 'Passages with instant AI line justifications', icon: BookOpen },
    listening: { title: 'IELTS Listening', subtitle: 'Native accent audio with synchronized transcript', icon: Headphones },
    writing: { title: 'IELTS Writing Evaluator', subtitle: 'Instant Band 0-9 analysis against official descriptors', icon: PenTool },
    speaking: { title: 'IELTS Speaking Simulator', subtitle: 'Cue card timer & fluency analysis', icon: Mic },
    'mock-tests': { title: 'Full Exam Simulations', subtitle: 'Cambridge-style 4-skill timed mock tests', icon: FileCheck },
    submissions: { title: 'Submission History', subtitle: 'Past practice attempts & detailed examiner logs', icon: History },
    search: { title: 'Search & Strategy', subtitle: 'IELTS vocabulary, grammar patterns & tips', icon: Search },
    settings: { title: 'System Settings', subtitle: 'Theme system, exam date & band goals', icon: Settings },
  };

  const routeInfo = titleMap[currentRoute] || {
    title: currentRoute.charAt(0).toUpperCase() + currentRoute.slice(1),
    subtitle: 'AI IELTS Pro Platform',
    icon: Sparkles,
  };

  const IconComponent = routeInfo.icon;

  return (
    <header
      id={id}
      className="sticky top-0 z-10 bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)] px-4 md:px-8 py-3.5 grid grid-cols-[1fr_auto_1fr] items-center gap-4"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] text-[var(--accent-a)] hidden sm:block">
          <IconComponent size={20} />
        </div>
        <div className="min-w-0">
          <h1 className="font-display font-bold text-lg md:text-xl text-[var(--text)] tracking-tight truncate">
            {routeInfo.title}
          </h1>
          <p className="text-xs text-[var(--text-dim)] hidden sm:block truncate">
            {routeInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Quick Search Input -- centered */}
      <div
        onClick={() => onNavigate('search')}
        className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] text-xs text-[var(--text-faint)] hover:border-[var(--border-strong)] cursor-pointer w-64 justify-self-center transition-colors"
      >
        <Search size={14} />
        <span>Search tips & vocabulary...</span>
      </div>

      <div className="flex items-center gap-3 justify-self-end">
        {/* Notifications */}
        <button
          onClick={() => onNavigate('submissions')}
          title="Notifications"
          className="relative w-9 h-9 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] hover:border-[var(--border-strong)] text-[var(--text-dim)] hover:text-[var(--text)] flex items-center justify-center cursor-pointer transition-colors"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent-a)]" />
        </button>

        {/* User Avatar */}
        <div
          onClick={() => onNavigate('settings')}
          title={`${activeUser.name} (${activeUser.phone})`}
          className="w-9 h-9 rounded-xl bg-[image:var(--accent-gradient)] text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition-transform shrink-0"
        >
          {activeUser.avatar}
        </div>
      </div>
    </header>
  );
};
