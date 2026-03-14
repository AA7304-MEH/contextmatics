import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
    title: {
        default: "ContextMatic | AI Content Workspace for Creators",
        template: "%s | ContextMatic"
    },
    description: "Transform your content 10x faster. ContextMatic uses AI to turn ideas into blog posts, social threads, videos, and newsletters instantly.",
    keywords: ["AI content creator", "content repurposing", "video generator", "SaaS", "Gemini AI", "OpenAI", "content marketing automation"],
    openGraph: {
        title: "ContextMatic | AI Content Workspace for Creators",
        description: "Transform your content 10x faster with AI. Blog posts, videos, and social threads in seconds.",
        type: "website",
        url: "https://contextmatic.com/",
        siteName: "ContextMatic",
        locale: "en_US",
        images: [{
            url: "https://contextmatic.com/og-image.png",
            width: 1200,
            height: 630,
            alt: "ContextMatic AI Dashboard"
        }],
    },
    twitter: {
        card: "summary_large_image",
        title: "ContextMatic | AI Content Workspace for Creators",
        description: "Transform your content 10x faster with AI.",
        creator: "@contextmatic",
        images: ["https://contextmatic.com/twitter-image.png"],
    },
    robots: {
        index: true,
        follow: true,
    }
};

import OnboardingTour from '@/components/OnboardingTour';
import CookieConsent from '@/components/CookieConsent';
import GlobalErrorBoundary from '@/components/GlobalErrorBoundary';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <head>
                <Script
                    src="https://checkout.razorpay.com/v1/checkout.js"
                    strategy="beforeInteractive"
                    key="razorpay-script"
                />
            </head>
            <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased font-sans bg-background-primary text-text-primary`}>
                <Providers>
                    <GlobalErrorBoundary>
                        <OnboardingTour />
                        <CookieConsent />
                        {children}
                    </GlobalErrorBoundary>
                </Providers>
            </body>
        </html>
    );
}
