import React from 'react';
import { Sparkles, ArrowUpRight, LogIn, UserPlus, LayoutDashboard } from '../ui/icons';
import { Button } from '../ui/Button';

interface LandingNavProps {
  onNavigate: (route: string) => void;
  isLoggedIn?: boolean;
  id?: string;
}

export const LandingNav: React.FC<LandingNavProps> = ({ onNavigate, isLoggedIn = false, id }) => {
  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    onNavigate('landing');
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      id={id}
      className="sticky top-0 z-30 bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)] px-4 md:px-10 py-4 flex items-center justify-between"
    >
      <a
        href="#home"
        className="flex items-center gap-3 cursor-pointer"
        onClick={(e) => handleScrollToSection(e, 'home')}
      >
        <div className="w-9 h-9 rounded-xl bg-[image:var(--accent-gradient)] flex items-center justify-center text-white font-bold shadow-md shadow-[var(--glow-a)]">
          <Sparkles size={18} />
        </div>
        <span className="font-display font-bold text-xl tracking-tight text-[var(--text)]">
          AI IELTS Pro
        </span>
      </a>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-dim)]">
        <a
          href="#home"
          onClick={(e) => handleScrollToSection(e, 'home')}
          className="hover:text-[var(--text)] transition-colors"
        >
          Home
        </a>
        <a
          href="#about"
          onClick={(e) => handleScrollToSection(e, 'about')}
          className="hover:text-[var(--text)] transition-colors"
        >
          About
        </a>
        <a
          href="#how-it-works"
          onClick={(e) => handleScrollToSection(e, 'how-it-works')}
          className="hover:text-[var(--text)] transition-colors"
        >
          How It Works
        </a>
        <a
          href="#pricing"
          onClick={(e) => handleScrollToSection(e, 'pricing')}
          className="hover:text-[var(--text)] transition-colors"
        >
          Pricing
        </a>
      </div>

      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <Button
            variant="primary"
            size="sm"
            icon={<LayoutDashboard size={16} />}
            onClick={() => onNavigate('dashboard')}
          >
            Go to Dashboard
          </Button>
        ) : (
          <>
            <Button
              variant="secondary"
              size="sm"
              icon={<LogIn size={15} />}
              onClick={() => onNavigate('login')}
            >
              Log In
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<UserPlus size={15} />}
              onClick={() => onNavigate('signup')}
            >
              Sign Up Free
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

