import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import UpgradeModal from '@/components/UpgradeModal';
import LowCreditsBanner from '@/components/LowCreditsBanner';
import { ModernNav } from '@/components/shared/ModernNav';
import { MobileNav } from '@/components/shared/MobileNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | ContextMatic',
    default: 'ContextMatic - AI Content Repurposing Platform',
  },
  description: 'Stop staring at a blank screen. Create a week of content in 10 minutes.',
  manifest: '/manifest.json',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://contextmatic.example.com'),
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
  // We can wrap children conditionally for the dashboard routes vs marketing routes,
  // but to keep it simple and fulfill the generic app layout requirement:
  // usually, we might have a (dashboard) route group for ModernNav. 
  // Let's assume ModernNav handles checking if it should render or we just render it.
  
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950 text-white min-h-screen text-zinc-100`}>
        <Providers>
          <UpgradeModal />
          <div className="flex h-screen flex-col overflow-hidden">
            <LowCreditsBanner />
            <div className="flex flex-1 overflow-hidden">
              <ModernNav />
              <main className="flex-1 overflow-y-auto w-full custom-scrollbar pb-20 md:pb-0">
                {children}
              </main>
              <MobileNav />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
