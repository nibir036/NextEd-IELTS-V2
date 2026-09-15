'use client';

import { useEffect, useState } from 'react';
import { db } from '../../lib/db';

// Blocks the right-click context menu and the common DevTools shortcuts
// (F12, Ctrl/Cmd+Shift+I, Ctrl/Cmd+Shift+J, Ctrl/Cmd+U) for logged-in
// students, exempting admin accounts so the team can still debug the live
// site. This is a casual deterrent only -- it does not (and cannot)
// actually prevent access to DevTools (the browser's own menu, an
// extension, or simply opening it before this effect runs all bypass it),
// and it does nothing to protect the paywalled Writing/Speaking content --
// that protection lives server-side in src/lib/paywall.ts and the routes
// that use it. Renders nothing; mounted once inside AppShell, exactly like
// DiagnosticPromptModal, so it covers every logged-in screen.
export function DevToolsGuard() {
  const [blockActive, setBlockActive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    db.getCurrentUser().then((user) => {
      if (!cancelled) setBlockActive(user?.role === 'student');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!blockActive) return;

    const blockContextMenu = (e: MouseEvent) => e.preventDefault();

    const blockDevToolsKeys = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const combo =
        key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (key === 'I' || key === 'J' || key === 'C')) ||
        ((e.ctrlKey || e.metaKey) && key === 'U');
      if (combo) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('keydown', blockDevToolsKeys, true);
    return () => {
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('keydown', blockDevToolsKeys, true);
    };
  }, [blockActive]);

  return null;
}
