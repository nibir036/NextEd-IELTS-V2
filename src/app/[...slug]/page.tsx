'use client';

import dynamic from 'next/dynamic';

// Mirrors src/app/page.tsx exactly. This catch-all is what makes a real
// browser reload at e.g. /writing or /dashboard work at all -- previously
// ONLY '/' existed as a server route, so every other in-app "page" was
// client-state-only and 404'd on reload. App itself reads
// window.location.pathname on mount to restore the right view.
const App = dynamic(() => import('../../App'), { ssr: false });

export default function CatchAll() {
  return <App />;
}
