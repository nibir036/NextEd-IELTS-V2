import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { DiagnosticPromptModal } from './DiagnosticPromptModal';
import { OnboardingTour } from './OnboardingTour';

interface AppShellProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
  id?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentRoute,
  onNavigate,
  onLogout,
  children,
  id,
}) => {
  // First-time product tour takes priority over the diagnostic nudge --
  // no point stacking two attention-grabbing overlays on someone's very
  // first session. The diagnostic prompt simply holds off while it runs.
  const [tourActive, setTourActive] = useState(false);

  return (
    <div id={id} className="min-h-screen flex bg-[var(--bg)] text-[var(--text)] relative">
      {/* Ambient background wash layer fixed across viewport */}
      <div className="bg-layer">
        <div className="bg-pattern" />
      </div>

      {/* New-user product tour -- mascot-guided walkthrough of the
          sidebar, dashboard modules, search and profile. Shows once per
          account, above everything else on the page. */}
      <OnboardingTour currentRoute={currentRoute} onActiveChange={setTourActive} />

      {/* Global diagnostic nudge -- shows on top of whichever screen the
          user is on, not just the dashboard. */}
      <DiagnosticPromptModal
        currentRoute={currentRoute}
        onNavigateAction={onNavigate}
        suppressed={tourActive}
      />

      {/* Persistent Left Sidebar */}
      <Sidebar currentRoute={currentRoute} onNavigate={onNavigate} onLogout={onLogout} />

      {/* Main Content Area
          z-40 (not z-10): this div is a flex item with an explicit
          z-index, so it forms its own stacking context -- every fixed
          full-screen overlay rendered anywhere inside it (Tips/Grammar/
          Vocab readers, lesson-list modals, MockTests/Submissions full-
          screen views) is confined to THIS context for stacking
          purposes, no matter how high their own z-index is set. With
          this at z-10 and the pinned Sidebar at z-30, the sidebar's
          stacking context always won and visually clipped/overlapped
          every one of those overlays. z-40 just needs to clear the
          sidebar's z-30 so this whole subtree -- and everything fixed
          inside it -- renders above the sidebar again. */}
      <div className="flex-1 flex flex-col min-w-0 z-40">
        <TopBar currentRoute={currentRoute} onNavigate={onNavigate} />
        
        {/* Mobile Bottom Navigation Bar */}
        <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[var(--bg-elevated)]/90 backdrop-blur-xl border-t border-[var(--border)] px-2 py-2 flex justify-around">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'reading', label: 'Reading' },
            { id: 'writing', label: 'Writing' },
            { id: 'speaking', label: 'Speaking' },
            { id: 'settings', label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                currentRoute === item.id
                  ? 'bg-[image:var(--accent-gradient)] text-white font-semibold'
                  : 'text-[var(--text-dim)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <main className="flex-1 p-4 md:p-8 max-w-[1650px] w-full mx-auto pb-20 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
};
