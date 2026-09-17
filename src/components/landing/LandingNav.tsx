import React from 'react';
import { ArrowUpRight, LogIn, UserPlus, LayoutDashboard } from '../ui/icons';
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
      className="glass-nav sticky top-0 z-30 px-4 md:px-10 py-4 flex items-center justify-between"
    >
      <a
        href="#home"
        className="flex items-center gap-2 cursor-pointer"
        onClick={(e) => handleScrollToSection(e, 'home')}
      >
        <img src="/branding/ielts-ai-mascot-full.png" alt="IELTS AI" className="h-10 w-auto object-contain" />
        <img src="/branding/ielts-ai-wordmark-dark.png" alt="IELTS AI by nextED." className="brand-wordmark-dark h-9 w-auto object-contain" />
        <img src="/branding/ielts-ai-wordmark-light.png" alt="IELTS AI by nextED." className="brand-wordmark-light h-9 w-auto object-contain" />
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
          Your Journey
        </a>
        <a
          href="#how-it-works"
          onClick={(e) => handleScrollToSection(e, 'how-it-works')}
          className="hover:text-[var(--text)] transition-colors"
        >
          How It Works
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
            Continue My Journey
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
              start free
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

