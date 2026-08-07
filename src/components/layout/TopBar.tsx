import React from 'react';
import { Search, Sparkles, Settings, BookOpen, PenTool, Mic, Headphones, FileCheck, History, LayoutDashboard } from '../ui/icons';
import { useTheme } from '../theme/ThemeProvider';
import { currentUser as fallbackUser } from '../../lib/data';
import { db } from '../../lib/db';

interface TopBarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  id?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ currentRoute, onNavigate, id }) => {
  const { activeThemeConfig } = useTheme();
  const activeUser = db.getCurrentUser() || fallbackUser;

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
      className="sticky top-0 z-10 bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)] px-4 md:px-8 py-3.5 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] text-[var(--accent-a)] hidden sm:block">
          <IconComponent size={20} />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg md:text-xl text-[var(--text)] tracking-tight">
            {routeInfo.title}
          </h1>
          <p className="text-xs text-[var(--text-dim)] hidden sm:block">
            {routeInfo.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Search Input */}
        <div
          onClick={() => onNavigate('search')}
          className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] text-xs text-[var(--text-faint)] hover:border-[var(--border-strong)] cursor-pointer w-48 transition-colors"
        >
          <Search size={14} />
          <span>Search tips & vocabulary...</span>
        </div>

        {/* Theme Indicator Pill */}
        <button
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] hover:border-[var(--border-strong)] text-xs font-mono text-[var(--text-dim)] cursor-pointer transition-colors"
          title="Click to switch theme in Settings"
        >
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeThemeConfig.swatches[0] }} />
          <span className="hidden sm:inline">{activeThemeConfig.name}</span>
        </button>

        {/* User Avatar */}
        <div
          onClick={() => onNavigate('settings')}
          title={`${activeUser.name} (${activeUser.phone})`}
          className="w-9 h-9 rounded-xl bg-[var(--accent-gradient)] text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition-transform"
        >
          {activeUser.avatar}
        </div>
      </div>
    </header>
  );
};
