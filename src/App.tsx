'use client';

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { AppShell } from './components/layout/AppShell';
import { LandingView } from './views/LandingView';
import { LoginView } from './views/LoginView';
import { SignupView } from './views/SignupView';
import { DashboardView } from './views/DashboardView';
import { WritingView } from './views/WritingView';
import { ReadingView } from './views/ReadingView';
import { SpeakingView } from './views/SpeakingView';
import { ListeningView } from './views/ListeningView';
import { MockTestsView } from './views/MockTestsView';
import { SubmissionsView } from './views/SubmissionsView';
import { SearchView } from './views/SearchView';
import { SettingsView } from './views/SettingsView';
import { LmsView } from './views/LmsView';
import { AiTutorView } from './views/AiTutorView';
import { db } from './lib/db';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => db.isAuthenticated());

  // Keep auth state synced with DB state
  useEffect(() => {
    setIsAuthenticated(db.isAuthenticated());
  }, [currentRoute]);

  const handleNavigate = (route: string) => {
    const protectedRoutes = [
      'dashboard',
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
      'lms-tips',
      'tutor-ai',
      'tutor-examiner',
    ];

    // Protected Route Enforcement: Require authentication
    if (protectedRoutes.includes(route) && !db.isAuthenticated()) {
      setCurrentRoute('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    handleNavigate('dashboard');
  };

  const handleSignupSuccess = () => {
    setIsAuthenticated(true);
    handleNavigate('dashboard');
  };

  const renderMainContent = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardView onNavigateAction={handleNavigate} />;
      case 'writing':
        return <WritingView />;
      case 'reading':
        return <ReadingView />;
      case 'speaking':
        return <SpeakingView />;
      case 'listening':
        return <ListeningView />;
      case 'mock-tests':
        return <MockTestsView onNavigateAction={handleNavigate} />;
      case 'submissions':
        return <SubmissionsView />;
      case 'search':
        return <SearchView />;
      case 'settings':
        return <SettingsView />;
      case 'lms-grammar':
        return <LmsView initialTab="grammar" />;
      case 'lms-vocab':
        return <LmsView initialTab="vocab" />;
      case 'lms-tips':
        return <LmsView initialTab="tips" />;
      case 'tutor-ai':
        return <AiTutorView initialTab="tutor" />;
      case 'tutor-examiner':
        return <AiTutorView initialTab="examiner" />;
      default:
        return <DashboardView onNavigateAction={handleNavigate} />;
    }
  };

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
        <AppShell currentRoute={currentRoute} onNavigate={handleNavigate}>
          {renderMainContent()}
        </AppShell>
      )}
    </ThemeProvider>
  );
}
