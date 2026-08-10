import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  FileCheck,
  History,
  Settings,
  Sparkles,
  LogOut,
  ChevronDown,
  ChevronRight,
  Pin,
  PinOff,
  GraduationCap,
  Bot,
} from '../ui/icons';
import { currentUser as fallbackUser } from '../../lib/data';
import { db, DbUser } from '../../lib/db';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onLogout: () => void;
  id?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.FC<{ size?: number; className?: string }>;
}

interface NavSection {
  key: string;
  title: string;
  icon: React.FC<{ size?: number; className?: string }>;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onNavigate, onLogout, id }) => {
  const [activeUser, setActiveUser] = useState<DbUser | typeof fallbackUser>(fallbackUser);

  useEffect(() => {
    let cancelled = false;
    db.getCurrentUser().then((user) => {
      if (!cancelled && user) {
        setActiveUser(user);
      }
    });
    return () => {
      cancelled = true;
    };
    // Re-fetch whenever the route changes (e.g. right after login/settings update).
  }, [currentRoute]);

  const handleLogout = () => {
    onLogout();
  };

  // Pin state: false = toggle on hover (icon-only by default), true = permanently fixed/expanded (w-64)
  const [isPinned, setIsPinned] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sidebar_pinned') === 'true';
    } catch {
      return false;
    }
  });

  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Accordion open sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    overview: true,
    practice: true,
    lms: true,
    tutor: true,
  });

  const togglePin = () => {
    const nextPinned = !isPinned;
    setIsPinned(nextPinned);
    try {
      localStorage.setItem('sidebar_pinned', String(nextPinned));
    } catch {
      // ignore
    }
  };

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Nav configuration with requested dropdown categories
  const sections: NavSection[] = [
    {
      key: 'overview',
      title: 'Overview & History',
      icon: LayoutDashboard,
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'submissions', label: 'Submission History', icon: History },
      ],
    },
    {
      key: 'practice',
      title: 'Practice Tests',
      icon: PenTool,
      items: [
        { id: 'writing', label: 'Writing Evaluator', icon: PenTool },
        { id: 'reading', label: 'Reading Practice', icon: BookOpen },
        { id: 'listening', label: 'Listening Practice', icon: Headphones },
        { id: 'speaking', label: 'Speaking Practice', icon: Mic },
        { id: 'mock-tests', label: 'Full Mock Tests', icon: FileCheck },
      ],
    },
    {
      key: 'lms',
      title: 'LMS Modules',
      icon: GraduationCap,
      items: [
        { id: 'lms-grammar', label: 'Grammar Masterclass', icon: GraduationCap },
        { id: 'lms-vocab', label: 'IELTS Vocabulary', icon: BookOpen },
        { id: 'lms-tips', label: 'Band 8+ Tips & Tricks', icon: Sparkles },
      ],
    },
    {
      key: 'tutor',
      title: 'AI Tutor & Examiner',
      icon: Bot,
      items: [
        { id: 'tutor-ai', label: 'Personal AI Tutor', icon: Bot },
        { id: 'tutor-examiner', label: 'Examiner Diagnostic', icon: Sparkles },
      ],
    },
  ];

  const isExpanded = isPinned || isHovered;

  return (
    <aside
      id={id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`hidden md:flex flex-col justify-between h-screen sticky top-0 bg-[var(--bg-elevated)]/95 backdrop-blur-2xl border-r border-[var(--border)] p-3 z-30 transition-all duration-300 group ${
        isExpanded
          ? 'w-64 shadow-2xl shadow-black/20'
          : 'w-16 shrink-0'
      }`}
    >
      <div className="overflow-y-auto overflow-x-hidden no-scrollbar space-y-4">
        {/* Header & Pin Toggle */}
        <div className="flex items-center justify-between px-1 py-2">
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer overflow-hidden min-w-0"
          >
            <div className="w-10 h-10 rounded-xl bg-[image:var(--accent-gradient)] flex items-center justify-center text-white font-bold shadow-md shadow-[var(--glow-a)] shrink-0 hover:scale-105 transition-transform">
              <Sparkles size={20} />
            </div>
            {isExpanded && (
              <div className="animate-fadeIn min-w-0 whitespace-nowrap">
                <div className="font-display font-bold text-base tracking-tight text-[var(--text)] truncate">
                  AI IELTS Pro
                </div>
                <div className="text-[10px] font-mono text-[var(--text-faint)] uppercase tracking-wider">
                  Band 8.0 Masterclass
                </div>
              </div>
            )}
          </div>

          {/* Toggle Fix/Pin Button (Visible when expanded) */}
          {isExpanded && (
            <button
              onClick={togglePin}
              title={isPinned ? 'Unpin Sidebar (Expand on hover)' : 'Pin Sidebar (Keep fixed)'}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer shrink-0 ${
                isPinned
                  ? 'bg-[var(--accent-a)]/20 text-[var(--accent-a)] border border-[var(--accent-a)]/30'
                  : 'text-[var(--text-faint)] hover:text-[var(--text)] hover:bg-[var(--panel-2)]'
              }`}
            >
              {isPinned ? <Pin size={16} /> : <PinOff size={16} />}
            </button>
          )}
        </div>

        <hr className="border-[var(--border)]" />

        {/* Navigation Sections */}
        <nav className="space-y-4">
          {sections.map((section) => {
            const SectionIcon = section.icon;
            const isOpen = openSections[section.key] !== false;
            const hasActiveChild = section.items.some((it) => currentRoute === it.id);

            return (
              <div key={section.key} className="space-y-1">
                {/* Accordion Dropdown Header / Shrunken Section Icon */}
                {isExpanded ? (
                  <button
                    onClick={() => toggleSection(section.key)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
                      hasActiveChild
                        ? 'text-[var(--accent-a)] font-semibold'
                        : 'text-[var(--text-faint)] hover:text-[var(--text)]'
                    }`}
                  >
                    <span className="truncate">{section.title}</span>
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate(section.items[0].id)}
                    title={section.title}
                    className={`w-full flex justify-center p-2.5 rounded-xl transition-all cursor-pointer ${
                      hasActiveChild
                        ? 'bg-[var(--accent-a)]/20 text-[var(--accent-a)] shadow-sm'
                        : 'text-[var(--text-faint)] hover:text-[var(--text)] hover:bg-[var(--panel-2)]'
                    }`}
                  >
                    <SectionIcon
                      size={20}
                      className={hasActiveChild ? 'text-[var(--accent-a)]' : 'text-[var(--text-faint)]'}
                    />
                  </button>
                )}

                {/* Sub-item Dropdown Menu (Only rendered when expanded) */}
                {isExpanded && isOpen && (
                  <div className="space-y-0.5 pl-2">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentRoute === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => onNavigate(item.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-xl font-medium transition-all duration-150 cursor-pointer ${
                            isActive
                              ? 'bg-[image:var(--accent-gradient)] text-white shadow-md shadow-[var(--glow-a)] font-semibold'
                              : 'text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--panel-2)]'
                          }`}
                        >
                          <Icon
                            size={16}
                            className={isActive ? 'text-white' : 'text-[var(--text-faint)] shrink-0'}
                          />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Settings & User Profile */}
      <div className="space-y-2 border-t border-[var(--border)] pt-3">
        <button
          onClick={() => onNavigate('settings')}
          title={!isExpanded ? 'Settings' : undefined}
          className={`w-full flex items-center ${
            isExpanded ? 'gap-3 px-3 py-2.5 text-xs' : 'justify-center p-2.5'
          } rounded-xl font-medium transition-all duration-150 cursor-pointer ${
            currentRoute === 'settings'
              ? 'bg-[image:var(--accent-gradient)] text-white font-semibold'
              : 'text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--panel-2)]'
          }`}
        >
          <Settings size={18} className="shrink-0" />
          {isExpanded && <span>Settings</span>}
        </button>

        {isExpanded ? (
          <div className="rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)] p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[var(--accent-a)]/20 text-[var(--accent-a)] border border-[var(--accent-a)]/30 font-bold text-xs flex items-center justify-center shrink-0">
                {activeUser.avatar}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[var(--text)] truncate">{activeUser.name}</div>
                <div className="text-[10px] font-mono text-[var(--text-faint)]">
                  Target Band {activeUser.targetBand}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Log out of account"
              className="text-[var(--text-faint)] hover:text-[var(--danger)] p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => onNavigate('settings')}
            title={`${activeUser.name} (Target Band ${activeUser.targetBand})`}
            className="flex justify-center p-1 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[var(--accent-a)]/20 text-[var(--accent-a)] border border-[var(--accent-a)]/40 font-bold text-xs flex items-center justify-center shrink-0 shadow-sm hover:scale-105 transition-transform">
              {activeUser.avatar}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};