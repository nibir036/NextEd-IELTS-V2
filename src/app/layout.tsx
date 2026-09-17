import type { Metadata } from 'next';
import { Open_Sans, Michroma, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// Single classic sans-serif for the whole site -- headings and body
// text use this one family (see globals.css: body, h1-h3/.font-display
// point at --font-sans). .font-mono uses its own dedicated face below,
// not this one -- labels/badges/chapter tags read as genuine monospace
// now instead of Open Sans with letter-spacing.
const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

// Techno/geometric display face used only for the site footer (see
// .font-michroma in globals.css).
const michroma = Michroma({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-michroma',
  display: 'swap',
});

// Real monospace face for .font-mono -- every uppercase/tracked label,
// badge, and chapter tag across the app (39 files use this class) was
// previously rendering in Open Sans despite the "mono" name.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono-real',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ielts.nexted.app';
const SITE_NAME = 'NextEd IELTS';
const DESCRIPTION =
  'Practice IELTS Writing, Reading, Listening, and Speaking online with AI-powered feedback, full-length mock tests, and a structured grammar & vocabulary course -- built for IELTS candidates preparing for their exam.';

// This app is a client-side SPA (see src/app/page.tsx), so every route
// shares this one metadata block -- there is no per-page title/description
// today. That's fine for now since only '/' is meant to be indexed (see
// robots.ts); if a second public marketing page is added later, give it
// its own generateMetadata in a server-rendered route rather than relying
// on this shared default.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} -- AI-Powered IELTS Preparation & Practice Tests`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    'IELTS practice',
    'IELTS preparation',
    'IELTS mock test',
    'IELTS writing feedback',
    'IELTS speaking practice',
    'IELTS listening practice',
    'IELTS reading practice',
    'AI IELTS tutor',
    'IELTS band score',
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} -- AI-Powered IELTS Preparation & Practice Tests`,
    description: DESCRIPTION,
    images: [
      {
        url: '/branding/ielts-ai-social-card.jpg',
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} -- AI-Powered IELTS Preparation & Practice Tests`,
    description: DESCRIPTION,
    images: ['/branding/ielts-ai-social-card.jpg'],
  },
};

// Organization + WebSite structured data -- helps Google understand what
// the site is and who runs it (can surface a sitelinks search box / logo
// in results). Kept minimal and honest: no fake ratings/reviews.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/branding/ielts-ai-icon.png`,
    },
    {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${openSans.variable} ${michroma.variable} ${jetbrainsMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
