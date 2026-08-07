'use client';

import dynamic from 'next/dynamic';

// The original app is a pure client-side SPA (localStorage-based auth/db,
// state-based routing). Disabling SSR for it reproduces that behavior
// exactly and avoids no-op server renders touching localStorage.
const App = dynamic(() => import('../App'), { ssr: false });

export default function Home() {
  return <App />;
}
