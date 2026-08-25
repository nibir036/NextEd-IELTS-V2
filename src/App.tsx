'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { AppShell } from './components/layout/AppShell';
import { LandingView } from './views/LandingView';
import { LoginView } from './views/LoginView';
import { SignupView } from './views/SignupView';
import { DashboardView } from './views/DashboardView';
import { WritingView } from './views/WritingView';
import { ReadingExamView } from './views/ReadingExamView';
import { SpeakingView } from './views/SpeakingView';
import { ListeningView } from './views/ListeningView';
import { ListeningExamView } from './views/ListeningExamView';
import { MockTestsView } from './views/MockTestsView';
import { SubmissionsView } from './views/SubmissionsView';
import { SearchView } from './views/SearchView';
import { SettingsView } from './views/SettingsView';
import { LmsView } from './views/LmsView';
import { AiTutorView } from './views/AiTutorView';
import { DiagnosticView } from './views/DiagnosticView';
import { db } from './lib/db';

const PROTECTED_ROUTES = [
  'dashboard',
  'diagnostic',
  'writing',
  'reading',
  'speaking',
  'listening',
  'mock-tests',
  'submissions',
  'search',
  'settings',
  'lms-grammar',
  'lms-vocab',
  'tutor-ai',
  'tutor-examiner',
];

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // True once we've checked the session cookie at least once. Prevents a
  // flash of "logged out" content (or a wrong redirect) before the very
  // first async auth check resolves.
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  // Check session once on mount.
  useEffect(() => {
    let cancelled = false;
    db.isAuthenticated().then((result) => {
      if (!cancelled) {
        setIsAuthenticated(result);
        setAuthChecked(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleNavigate = useCallback(
    async (route: string) => {
      if (PROTECTED_ROUTES.includes(route)) {
        const authed = await db.isAuthenticated();
        setIsAuthenticated(authed);
        if (!authed) {
          setCurrentRoute('login');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      setCurrentRoute(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [],
  );

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    handleNavigate('dashboard');
  };

  const handleSignupSuccess = () => {
    setIsAuthenticated(true);
    // Brand-new users go straight to the placement diagnostic (skippable).
    handleNavigate('diagnostic');
  };

  const handleLogout = async () => {
    await db.logout();
    setIsAuthenticated(false);
    setCurrentRoute('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderMainContent = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardView onNavigateAction={handleNavigate} />;
      case 'diagnostic':
        return <DiagnosticView onNavigateAction={handleNavigate} />;
      case 'writing':
        return <WritingView />;
      case 'reading':
        return <ReadingExamView />;
      case 'speaking':
        return <SpeakingView />;
      case 'listening':
        return <ListeningExamView />;
      case 'mock-tests':
        return <MockTestsView onNavigateAction={handleNavigate} />;
      case 'submissions':
        return <SubmissionsView />;
      case 'search':
        return <SearchView />;
      case 'settings':
        return <SettingsView onLogout={handleLogout} />;
      case 'lms-grammar':
        return <LmsView initialTab="grammar" />;
      case 'lms-vocab':
        return <LmsView initialTab="vocab" />;
      case 'tutor-ai':
        return <AiTutorView initialTab="tutor" />;
      case 'tutor-examiner':
        return <AiTutorView initialTab="examiner" />;
      default:
        return <DashboardView onNavigateAction={handleNavigate} />;
    }
  };

  // Avoid rendering protected content (or bouncing to login) before the
  // first session check has resolved.
  if (!authChecked) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text-dim)] text-sm font-mono">
          Loading...
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      {currentRoute === 'landing' ? (
        <LandingView
          onLaunchApp={(target) => handleNavigate(target || 'dashboard')}
          isLoggedIn={isAuthenticated}
        />
      ) : currentRoute === 'login' ? (
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          onNavigateToSignup={() => handleNavigate('signup')}
          onNavigateToLanding={() => handleNavigate('landing')}
        />
      ) : currentRoute === 'signup' ? (
        <SignupView
          onSignupSuccess={handleSignupSuccess}
          onNavigateToLogin={() => handleNavigate('login')}
          onNavigateToLanding={() => handleNavigate('landing')}
        />
      ) : (
        <AppShell currentRoute={currentRoute} onNavigate={handleNavigate} onLogout={handleLogout}>
          {renderMainContent()}
        </AppShell>
      )}
    </ThemeProvider>
  );
}
