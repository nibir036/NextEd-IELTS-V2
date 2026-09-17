import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ielts.nexted.app';

// This app is a client-side SPA: every route (including logged-in-only
// ones like /dashboard, /writing, /mock-runner/...) is served by the same
// shell and returns 200 even to a logged-out crawler. Without this,
// Google would happily crawl and index a pile of near-identical
// "Loading..." / login-redirect shells under /writing, /reading,
// /dashboard, etc, which is exactly the kind of thin/duplicate content
// that hurts a whole site's ranking. So: only the real public pages are
// allowed, everything behind the auth gate is blocked outright.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/login', '/signup', '/terms', '/privacy'],
        disallow: [
          '/api/',
          '/dashboard',
          '/diagnostic',
          '/writing',
          '/reading',
          '/speaking',
          '/listening',
          '/mock-tests',
          '/mock-runner',
          '/submissions',
          '/search',
          '/settings',
          '/lms-grammar',
          '/lms-vocab',
          '/tutor-ai',
          '/tutor-examiner',
          '/admin',
          '/admin-login',
          '/forgot-password',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
