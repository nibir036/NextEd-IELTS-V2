import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { DiagnosticPromptModal } from './DiagnosticPromptModal';

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
  return (
    <div id={id} className="min-h-screen flex bg-[var(--bg)] text-[var(--text)] relative">
      {/* Ambient background wash layer fixed across viewport */}
      <div className="bg-layer">
        <div className="bg-pattern" />
      </div>

      {/* Global diagnostic nudge -- shows on top of whichever screen the
          user is on, not just the dashboard. */}
      <DiagnosticPromptModal currentRoute={currentRoute} onNavigateAction={onNavigate} />

      {/* Persistent Left Sidebar */}
      <Sidebar currentRoute={currentRoute} onNavigate={onNavigate} onLogout={onLogout} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
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
