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

const PUBLIC_ROUTES = ['landing', 'login', 'signup'];
const ALL_ROUTES = new Set([...PUBLIC_ROUTES, ...PROTECTED_ROUTES]);

// Routes can now carry an optional sub-path after the base id, e.g.
// 'reading/tips' or 'lms-grammar/module-2-complex-structures' -- used by
// the sidebar's new nested dropdowns to deep-link straight into a
// specific tab/module instead of always landing on a view's default
// view. All auth/URL/switch matching happens on the base id only; the
// remainder is handed to the view itself to pick its initial state.
function baseRouteOf(route: string): string {
  return route.split('/')[0];
}

function subPathOf(route: string): string | null {
  const idx = route.indexOf('/');
  return idx === -1 ? null : route.slice(idx + 1);
}

// Route id <-> URL path are the same string (e.g. route 'writing' <->
// '/writing', 'reading/tips' <-> '/reading/tips'), except 'landing'
// which lives at '/'.
function routeToPath(route: string): string {
  return route === 'landing' ? '/' : `/${route}`;
}

function pathToRoute(pathname: string): string {
  const slug = pathname.replace(/^\/+|\/+$/g, ''); // strip leading/trailing slashes
  if (slug === '') return 'landing';
  return ALL_ROUTES.has(baseRouteOf(slug)) ? slug : 'landing';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // True once we've checked the session cookie at least once. Prevents a
  // flash of "logged out" content (or a wrong redirect) before the very
  // first async auth check resolves.
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  // Restore whatever route the URL points at (this is what makes a
  // reload land back where the user was, instead of always resetting to
  // the landing page), then run it through the same auth gate real
  // navigation uses -- so a reload on a protected page while logged out
  // still correctly bounces to /login rather than flashing protected
  // content.
  useEffect(() => {
    let cancelled = false;
    const requestedRoute = pathToRoute(window.location.pathname);

    db.isAuthenticated().then((authed) => {
      if (cancelled) return;
      setIsAuthenticated(authed);
      setAuthChecked(true);

      if (PROTECTED_ROUTES.includes(baseRouteOf(requestedRoute)) && !authed) {
        setCurrentRoute('login');
        window.history.replaceState({}, '', routeToPath('login'));
      } else {
        setCurrentRoute(requestedRoute);
        // Normalize the URL bar (e.g. a trailing slash or unknown path
        // that fell back to landing) without adding a history entry.
        window.history.replaceState({}, '', routeToPath(requestedRoute));
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Keep state in sync with the browser's own back/forward buttons.
  useEffect(() => {
    const onPopState = () => {
      setCurrentRoute(pathToRoute(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleNavigate = useCallback(
    async (route: string) => {
      if (PROTECTED_ROUTES.includes(baseRouteOf(route))) {
        const authed = await db.isAuthenticated();
        setIsAuthenticated(authed);
        if (!authed) {
          setCurrentRoute('login');
          window.history.pushState({}, '', routeToPath('login'));
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      setCurrentRoute(route);
      window.history.pushState({}, '', routeToPath(route));
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
    // Previously sent brand-new users straight to the placement
    // diagnostic as their first screen -- felt like a mandatory gate
    // even though it was technically skippable. Now they land on the
    // dashboard like anyone else; DiagnosticPromptModal (in AppShell)
    // nudges them to take it via a dismissible popup instead.
    handleNavigate('dashboard');
  };

  const handleLogout = async () => {
    await db.logout();
    setIsAuthenticated(false);
    setCurrentRoute('landing');
    window.history.pushState({}, '', routeToPath('landing'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const baseRoute = baseRouteOf(currentRoute);
  const subPath = subPathOf(currentRoute);

  const renderMainContent = () => {
    switch (baseRoute) {
      case 'dashboard':
        return <DashboardView onNavigateAction={handleNavigate} />;
      case 'diagnostic':
        return <DiagnosticView onNavigateAction={handleNavigate} />;
      case 'writing':
        return <WritingView initialBrowseTab={subPath === 'tips' ? 'tips' : 'tests'} />;
      case 'reading':
        return <ReadingExamView initialBrowseTab={subPath === 'tips' ? 'tips' : 'tests'} />;
      case 'speaking':
        return <SpeakingView initialBrowseTab={subPath === 'tips' ? 'tips' : 'tests'} />;
      case 'listening':
        return <ListeningExamView initialBrowseTab={subPath === 'tips' ? 'tips' : 'tests'} />;
      case 'mock-tests':
        return <MockTestsView onNavigateAction={handleNavigate} />;
      case 'submissions':
        return <SubmissionsView />;
      case 'search':
        return <SearchView onNavigateAction={handleNavigate} />;
      case 'settings':
        return <SettingsView onLogout={handleLogout} />;
      case 'lms-grammar':
        return <LmsView initialTab="grammar" initialModuleSlug={subPath} />;
      case 'lms-vocab':
        return <LmsView initialTab="vocab" initialChapter={subPath ? Number(subPath) : null} />;
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
      {baseRoute === 'landing' ? (
        <LandingView
          onLaunchApp={(target) => handleNavigate(target || 'dashboard')}
          isLoggedIn={isAuthenticated}
        />
      ) : baseRoute === 'login' ? (
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          onNavigateToSignup={() => handleNavigate('signup')}
          onNavigateToLanding={() => handleNavigate('landing')}
        />
      ) : baseRoute === 'signup' ? (
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
