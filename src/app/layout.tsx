import type { Metadata } from 'next';
import { Open_Sans, Michroma } from 'next/font/google';
import './globals.css';

// Single classic sans-serif for the whole site -- headings, body, and
// labels all use this one family now (see globals.css: body, h1-h3/
// .font-display, and .font-mono all point at --font-sans).
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

export const metadata: Metadata = {
  title: 'AI IELTS Pro',
  description: 'AI IELTS Pro',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${openSans.variable} ${michroma.variable}`}>
      <body>{children}</body>
    </html>
  );
}
