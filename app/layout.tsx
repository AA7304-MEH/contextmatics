import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import UpgradeModal from '@/components/UpgradeModal';
import LowCreditsBanner from '@/components/LowCreditsBanner';
import { ModernNav } from '@/components/shared/ModernNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | ContextMatic',
    default: 'ContextMatic - AI Content Repurposing Platform',
  },
  description: 'Stop staring at a blank screen. Create a week of content in 10 minutes.',
  manifest: '/manifest.json',
  metadataBase: new URL('https://contextmatics.vercel.app'),
  openGraph: {
    title: 'ContextMatic',
    description: 'Stop staring at a blank screen. Create a week of content in 10 minutes.',
    url: '/',
    siteName: 'ContextMatic',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContextMatic',
    description: 'Stop staring at a blank screen. Create a week of content in 10 minutes.',
  },
};

export const viewport = {
  themeColor: '#09090b',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-white min-h-screen selection:bg-brand-primary/30`}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <LowCreditsBanner />
            <UpgradeModal />
            <div className="flex flex-1">
              <ModernNav />
              <main className="flex-1 w-full overflow-x-hidden">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
