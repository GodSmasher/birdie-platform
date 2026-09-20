import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import CookieConsent from '@/components/cookie-consent';

// Optional, off by default. Set NEXT_PUBLIC_GOOGLE_ADS_ID to enable.
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || '';

export const metadata: Metadata = {
  title: '.birdie — The Transparency Layer for Solar Installers',
  description: 'birdie connects your existing tools into one clear picture. Utility registration, document AI, monitoring, workflows — for solar installers.',
  keywords: ['Solar installer software', 'Utility registration automation', 'PV platform', 'Solar document management', 'Solar ERP alternative'],
  openGraph: {
    title: '.birdie — The Transparency Layer for Solar Installers',
    description: 'Connects your tools. Makes visible what happens. Automates the rest.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="font-sans">
      <body className="bg-bg text-fg min-h-screen">
        {GOOGLE_ADS_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');`}
            </Script>
          </>
        )}
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
