import App from '../App';
import { getSessionUserId } from '../lib/session';

// This one route (the root "/") is now server-rendered -- App itself is
// SSR-safe (see the loading-gate change in App.tsx: the 'landing' route no
// longer waits on the async auth check before rendering), so Google's
// first response for "/" now contains the real marketing HTML instead of
// an empty client-only shell. Every other route still goes through
// src/app/[...slug]/page.tsx, which keeps ssr:false exactly as before --
// those are all behind the auth gate anyway and excluded from crawling by
// robots.ts, so there's no SEO reason to touch them, and no reason to
// take on any extra risk there.
//
// serverAuthed: a same-request read of the (httpOnly) session cookie,
// server-side, so App knows on the very first paint whether a logged-in
// user is sitting at "/" -- without this, App always renders the public
// landing page first (that's what keeps "/" crawlable for a logged-out
// visitor/Googlebot) and only swaps to the dashboard after its client-side
// auth check resolves a moment later, which is the flash a logged-in user
// was seeing. A crawler/anonymous visitor has no session cookie, so this
// is `null` for them and behavior is unchanged.
export default async function Home() {
  const serverUserId = await getSessionUserId();
  return <App serverAuthed={!!serverUserId} />;
}
