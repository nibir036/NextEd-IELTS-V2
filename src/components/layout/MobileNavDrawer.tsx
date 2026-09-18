import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  FileCheck,
  History,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Shield,
  X,
} from '../ui/icons';
import { currentUser as fallbackUser } from '../../lib/data';
import { db, DbUser } from '../../lib/db';

interface MobileNavDrawerProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.FC<{ size?: number; className?: string }>;
  dropdownKind?: 'tests-tips' | 'grammar-modules' | 'vocab-chapters';
}

interface NavSubItem {
  id: string;
  label: string;
}

interface NavSection {
  key: string;
  title: string;
  icon: React.FC<{ size?: number; className?: string }>;
  items: NavItem[];
}

// Full-screen slide-in nav overlay for phone-width viewports, opened via
// the hamburger button in TopBar. Mirrors the desktop Sidebar's nav
// structure exactly (same sections, items, dropdowns, admin conditional,
// settings/logout footer) since the sidebar itself is hidden below `md`
// and there's otherwise no way to reach most of the app on mobile.
export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  currentRoute,
  onNavigate,
  onLogout,
  isOpen,
  onClose,
}) => {
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
  }, [currentRoute]);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    overview: true,
    practice: true,
    lms: true,
  });

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const [grammarModules, setGrammarModules] = useState<{ slug: string; title: string }[] | null>(null);
  const [loadingGrammarModules, setLoadingGrammarModules] = useState(false);
  const [vocabChapters, setVocabChapters] = useState<{ chapter: number; title: string }[] | null>(null);
  const [loadingVocabChapters, setLoadingVocabChapters] = useState(false);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleItemDropdown = (item: NavItem) => {
    const wasOpen = !!expandedItems[item.id];
    setExpandedItems((prev) => ({ ...prev, [item.id]: !wasOpen }));

    if (wasOpen) return;

    if (item.dropdownKind === 'grammar-modules' && grammarModules === null && !loadingGrammarModules) {
      setLoadingGrammarModules(true);
      fetch('/api/grammar/modules')
        .then((res) => res.json())
        .then((data) => {
          setGrammarModules(
            (data.modules ?? []).map((m: { slug: string; title: string }) => ({
              slug: m.slug,
              title: m.title,
            })),
          );
        })
        .catch(() => setGrammarModules([]))
        .finally(() => setLoadingGrammarModules(false));
    }

    if (item.dropdownKind === 'vocab-chapters' && vocabChapters === null && !loadingVocabChapters) {
      setLoadingVocabChapters(true);
      fetch('/api/vocab')
        .then((res) => res.json())
        .then((data) => {
          setVocabChapters(
            (data.chapters ?? []).map((c: { chapter: number; title: string }) => ({
              chapter: c.chapter,
              title: c.title,
            })),
          );
        })
        .catch(() => setVocabChapters([]))
        .finally(() => setLoadingVocabChapters(false));
    }
  };

  const isAdmin = 'role' in activeUser && activeUser.role === 'admin';

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
      key: 'lms',
      title: 'LMS Modules',
      icon: GraduationCap,
      items: [
        { id: 'lms-grammar', label: 'Grammar Masterclass', icon: GraduationCap, dropdownKind: 'grammar-modules' },
        { id: 'lms-vocab', label: 'IELTS Vocabulary', icon: BookOpen, dropdownKind: 'vocab-chapters' },
      ],
    },
    {
      key: 'practice',
      title: 'Practice Tests',
      icon: PenTool,
      items: [
        { id: 'listening', label: 'Listening Practice', icon: Headphones, dropdownKind: 'tests-tips' },
        { id: 'reading', label: 'Reading Practice', icon: BookOpen, dropdownKind: 'tests-tips' },
        { id: 'writing', label: 'Writing Practice', icon: PenTool, dropdownKind: 'tests-tips' },
        { id: 'speaking', label: 'Speaking Practice', icon: Mic, dropdownKind: 'tests-tips' },
        { id: 'mock-tests', label: 'Full Mock Tests', icon: FileCheck },
      ],
    },
    ...(isAdmin
      ? [
          {
            key: 'admin',
            title: 'Admin',
            icon: Shield,
            items: [{ id: 'admin', label: 'Admin Panel', icon: Shield }],
          } as NavSection,
        ]
      : []),
  ];

  const subItemsFor = (item: NavItem): NavSubItem[] | 'loading' => {
    if (item.dropdownKind === 'tests-tips') {
      return [
        { id: `${item.id}/tests`, label: 'Tests' },
        { id: `${item.id}/tips`, label: 'Tips & Tricks' },
      ];
    }
    if (item.dropdownKind === 'grammar-modules') {
      if (loadingGrammarModules || grammarModules === null) return 'loading';
      return grammarModules.map((m) => ({ id: `lms-grammar/${m.slug}`, label: m.title }));
    }
    if (item.dropdownKind === 'vocab-chapters') {
      if (loadingVocabChapters || vocabChapters === null) return 'loading';
      return vocabChapters.map((c) => ({ id: `lms-vocab/${c.chapter}`, label: c.title }));
    }
    return [];
  };

  const baseRoute = currentRoute.split('/')[0];

  const goTo = (route: string) => {
    onClose();
    onNavigate(route);
  };

  const handleLogout = () => {
    onClose();
    onLogout();
  };

  return (
    <div
      className={`md:hidden fixed inset-0 z-[60] ${isOpen ? '' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Drawer panel */}
      <aside
        className={`absolute left-0 top-0 h-full w-[82vw] max-w-[300px] bg-[var(--bg-elevated)] border-r border-[var(--border)] shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] shrink-0">
          <div
            onClick={() => goTo('landing')}
            className="flex items-center gap-2 cursor-pointer overflow-hidden min-w-0"
          >
            <img src="/branding/ielts-ai-mascot-full.png" alt="IELTS AI" className="h-9 w-auto object-contain shrink-0" />
            <div className="min-w-0 whitespace-nowrap">
              <img src="/branding/ielts-ai-wordmark-dark.png" alt="IELTS AI by nextED." className="brand-wordmark-dark h-8 w-auto object-contain" />
              <img src="/branding/ielts-ai-wordmark-light.png" alt="IELTS AI by nextED." className="brand-wordmark-light h-8 w-auto object-contain" />
            </div>
          </div>
          <button
            onClick={onClose}
            title="Close menu"
            className="p-1.5 rounded-lg text-[var(--text-faint)] hover:text-[var(--text)] hover:bg-[var(--panel-2)] cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav sections */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-3 space-y-4">
          <nav className="space-y-4">
            {sections.map((section) => {
              const isSectionOpen = openSections[section.key] !== false;
              const hasActiveChild = section.items.some((it) => baseRoute === it.id);

              return (
                <div key={section.key} className="space-y-1">
                  <button
                    onClick={() => toggleSection(section.key)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
                      hasActiveChild
                        ? 'text-[var(--accent-a)] font-semibold'
                        : 'text-[var(--text-faint)] hover:text-[var(--text)]'
                    }`}
                  >
                    <span className="truncate">{section.title}</span>
                    {isSectionOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>

                  {isSectionOpen && (
                    <div className="space-y-0.5 pl-2">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = baseRoute === item.id;
                        const hasDropdown = !!item.dropdownKind;
                        const isDropdownOpen = !!expandedItems[item.id];

                        if (!hasDropdown) {
                          return (
                            <button
                              key={item.id}
                              onClick={() => goTo(item.id)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl font-medium transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-[image:var(--accent-gradient)] text-white shadow-md font-semibold'
                                  : 'text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--panel-2)]'
                              }`}
                            >
                              <Icon size={17} className={isActive ? 'text-white' : 'text-[var(--text-faint)] shrink-0'} />
                              <span className="truncate">{item.label}</span>
                            </button>
                          );
                        }

                        const subItems = subItemsFor(item);
                        return (
                          <div key={item.id}>
                            <div
                              className={`w-full flex items-center gap-1 rounded-xl font-medium transition-all ${
                                isActive
                                  ? 'bg-[image:var(--accent-gradient)] text-white shadow-md font-semibold'
                                  : 'text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--panel-2)]'
                              }`}
                            >
                              <button
                                onClick={() => goTo(item.id)}
                                className="flex-1 flex items-center gap-3 px-3 py-2.5 text-sm cursor-pointer min-w-0"
                              >
                                <Icon size={17} className={isActive ? 'text-white' : 'text-[var(--text-faint)] shrink-0'} />
                                <span className="truncate">{item.label}</span>
                              </button>
                              <button
                                onClick={() => toggleItemDropdown(item)}
                                title={isDropdownOpen ? 'Collapse' : 'Expand'}
                                className={`p-2.5 mr-1 rounded-lg cursor-pointer shrink-0 ${
                                  isActive ? 'text-white/80 hover:text-white' : 'text-[var(--text-faint)] hover:text-[var(--text)]'
                                }`}
                              >
                                {isDropdownOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </button>
                            </div>

                            {isDropdownOpen && (
                              <div className="pl-4 mt-0.5 space-y-0.5 border-l border-[var(--border)] ml-4">
                                {subItems === 'loading' ? (
                                  <div className="px-3 py-2 text-xs font-mono text-[var(--text-faint)]">Loading...</div>
                                ) : subItems.length === 0 ? (
                                  <div className="px-3 py-2 text-xs font-mono text-[var(--text-faint)]">Nothing here yet</div>
                                ) : (
                                  subItems.map((sub) => {
                                    const subActive = currentRoute === sub.id;
                                    return (
                                      <button
                                        key={sub.id}
                                        onClick={() => goTo(sub.id)}
                                        className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer truncate ${
                                          subActive
                                            ? 'text-[var(--accent-a)] font-semibold bg-[var(--accent-a)]/10'
                                            : 'text-[var(--text-faint)] hover:text-[var(--text)] hover:bg-[var(--panel-2)]'
                                        }`}
                                      >
                                        {sub.label}
                                      </button>
                                    );
                                  })
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer: Settings & user profile / logout */}
        <div className="shrink-0 space-y-2 border-t border-[var(--border)] p-3">
          <button
            onClick={() => goTo('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl font-medium transition-all cursor-pointer ${
              currentRoute === 'settings'
                ? 'bg-[image:var(--accent-gradient)] text-white font-semibold'
                : 'text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--panel-2)]'
            }`}
          >
            <Settings size={17} className="shrink-0" />
            <span>Settings</span>
          </button>

          <div className="rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)] p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[var(--accent-a)]/20 text-[var(--accent-a)] border border-[var(--accent-a)]/30 font-bold text-xs flex items-center justify-center shrink-0">
                {activeUser.avatar}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[var(--text)] truncate">{activeUser.name}</div>
                <div className="text-[11px] font-mono text-[var(--text-faint)]">Target Band {activeUser.targetBand}</div>
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
        </div>
      </aside>
    </div>
  );
};
