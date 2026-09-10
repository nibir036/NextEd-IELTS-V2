import React, { useEffect, useRef, useState } from 'react';
import { Search, Sparkles, Settings, BookOpen, PenTool, Mic, Headphones, FileCheck, History, LayoutDashboard, Bell } from '../ui/icons';
import { currentUser as fallbackUser } from '../../lib/data';
import { db, type DbUser } from '../../lib/db';

interface TopBarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  id?: string;
}

interface SearchableItem {
  label: string;
  route: string;
  keywords: string[];
}

// Quick-search catalogue for the top-bar search box. Each item is a page
// the query can jump to; `keywords` widen what the user can type to find
// it (e.g. typing "essay" should still surface Writing Practice).
const SEARCHABLE_ITEMS: SearchableItem[] = [
  { label: 'Dashboard', route: 'dashboard', keywords: ['dashboard', 'home', 'overview'] },
  { label: 'Reading Practice', route: 'reading', keywords: ['reading', 'read'] },
  { label: 'Listening Practice', route: 'listening', keywords: ['listening', 'listen', 'audio'] },
  { label: 'Writing Practice', route: 'writing', keywords: ['writing', 'write', 'essay'] },
  { label: 'Speaking Practice', route: 'speaking', keywords: ['speaking', 'speak', 'cue card'] },
  { label: 'Full Mock Tests', route: 'mock-tests', keywords: ['mock', 'mock test', 'full exam', 'simulation'] },
  { label: 'Submission History', route: 'submissions', keywords: ['submission', 'history', 'past attempt'] },
  { label: 'Grammar', route: 'lms-grammar', keywords: ['grammar'] },
  { label: 'Vocabulary', route: 'lms-vocab', keywords: ['vocab', 'vocabulary', 'word'] },
  { label: 'AI Tutor', route: 'tutor-ai', keywords: ['tutor', 'ai tutor', 'chat'] },
  { label: 'Examiner Practice', route: 'tutor-examiner', keywords: ['examiner'] },
  { label: 'Settings', route: 'settings', keywords: ['settings', 'profile', 'account'] },
];

function findMatches(query: string): SearchableItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return SEARCHABLE_ITEMS.filter(
    (item) => item.label.toLowerCase().includes(q) || item.keywords.some((kw) => kw.includes(q) || q.includes(kw)),
  );
}

export const TopBar: React.FC<TopBarProps> = ({ currentRoute, onNavigate, id }) => {
  const [user, setUser] = useState<DbUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
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
  const matches = findMatches(searchQuery);

  const goToItem = (item: SearchableItem) => {
    setSearchQuery('');
    setShowDropdown(false);
    onNavigate(item.route);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    if (matches.length > 0) {
      goToItem(matches[0]);
      return;
    }

    // No direct page match -- fall back to the grammar/vocab search page,
    // carrying the query along so it can be pre-filled there.
    sessionStorage.setItem('pendingSearchQuery', q);
    setSearchQuery('');
    setShowDropdown(false);
    onNavigate('search');
  };

  const handleBlur = () => {
    // Delay so a click on a dropdown item registers before we hide it.
    blurTimeoutRef.current = setTimeout(() => setShowDropdown(false), 150);
  };

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
      <div className="hidden lg:block relative w-64 justify-self-center">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] text-xs text-[var(--text-faint)] focus-within:border-[var(--border-strong)] transition-colors"
        >
          <Search size={14} className="shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => {
              if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
              if (searchQuery.trim()) setShowDropdown(true);
            }}
            onBlur={handleBlur}
            placeholder="Search tips & vocabulary..."
            className="bg-transparent outline-none border-none w-full text-xs text-[var(--text)] placeholder:text-[var(--text-faint)]"
          />
        </form>

        {/* Live suggestions dropdown */}
        {showDropdown && searchQuery.trim() && (
          <div className="absolute top-full mt-1.5 left-0 right-0 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] shadow-lg overflow-hidden z-20">
            {matches.length > 0 ? (
              matches.map((item) => (
                <button
                  key={item.route}
                  type="button"
                  // onMouseDown fires before the input's onBlur, so the
                  // click is registered before the dropdown disappears.
                  onMouseDown={(e) => {
                    e.preventDefault();
                    goToItem(item);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-[var(--text)] hover:bg-[var(--panel-3,rgba(255,255,255,0.06))] cursor-pointer flex items-center gap-2"
                >
                  <Search size={12} className="text-[var(--text-faint)] shrink-0" />
                  {item.label}
                </button>
              ))
            ) : (
              <div className="px-3.5 py-2 text-xs text-[var(--text-faint)]">
                No matching pages -- press Enter to search tips & vocabulary
              </div>
            )}
          </div>
        )}
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
