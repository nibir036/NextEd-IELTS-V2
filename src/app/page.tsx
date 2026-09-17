import App from '../App';

// This one route (the root "/") is now server-rendered -- App itself is
// SSR-safe (see the loading-gate change in App.tsx: the 'landing' route no
// longer waits on the async auth check before rendering), so Google's
// first response for "/" now contains the real marketing HTML instead of
// an empty client-only shell. Every other route still goes through
// src/app/[...slug]/page.tsx, which keeps ssr:false exactly as before --
// those are all behind the auth gate anyway and excluded from crawling by
// robots.ts, so there's no SEO reason to touch them, and no reason to
// take on any extra risk there.
export default function Home() {
  return <App />;
}
