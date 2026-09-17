import type { Metadata } from 'next';
import Script from 'next/script';
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
  title: 'IELTS AI',
  description: 'IELTS AI by nextED.',
};

// Meta (Facebook/Instagram) ad Pixel -- browser-side half of the Pixel +
// Conversions API pair set up in Meta Events Manager. Reads the dataset's
// Pixel ID from env rather than hardcoding it, since it's fine to expose to
// the client (it's visible in any browser's network tab regardless) but
// differs per environment/campaign if that ever changes.
// Server-side CompleteRegistration events (Conversions API) are sent
// separately from the signup API route using META_CAPI_ACCESS_TOKEN --
// that token is server-only and never appears here.
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${openSans.variable} ${michroma.variable} ${jetbrainsMono.variable}`}>
      <body>
        {META_PIXEL_ID && (
          <>
            <Script id="meta-pixel-base" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${META_PIXEL_ID}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
