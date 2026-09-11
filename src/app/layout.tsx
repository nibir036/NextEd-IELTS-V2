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

export const metadata: Metadata = {
  title: 'AI IELTS Pro',
  description: 'AI IELTS Pro',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${openSans.variable} ${michroma.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
