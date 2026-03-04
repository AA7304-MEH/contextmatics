import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
    title: "ContextMatic | AI Content Repurposing for Creators",
    description: "Effortlessly repurpose your content into engaging formats like blog posts, tweet threads, and newsletters with ContextMatic's AI.",
    keywords: ["AI content repurposing", "content marketing", "social media marketing", "SaaS", "Gemini API"],
    openGraph: {
        title: "ContextMatic | AI Content Repurposing for Creators",
        description: "Transform any content into multiple formats with the power of AI. Get started for free.",
        type: "website",
        url: "https://contextmatic.com/",
        images: [{ url: "https://contextmatic.com/og-image.png" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "ContextMatic | AI Content Repurposing for Creators",
        description: "Transform any content into multiple formats with the power of AI.",
        images: ["https://contextmatic.com/twitter-image.png"],
    },
};

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
                />
            </head>
            <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased font-sans bg-background-primary text-text-primary`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
