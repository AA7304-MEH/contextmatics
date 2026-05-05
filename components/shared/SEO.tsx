"use client";

import React from 'react';
import Head from 'next/head';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string[];
    image?: string;
    url?: string;
    type?: string;
}

/**
 * Modern Next.js SEO Component for Client-Side Components
 * Note: Next.js 14 prefers Metadata API in server components/layouts,
 * but for client-side pages (especially legacy/ported components),
 * this provides a consistent way to update the page title/meta.
 */
export const SEO: React.FC<SEOProps> = ({ 
    title, 
    description, 
    keywords, 
    image, 
    url, 
    type = 'website' 
}) => {
    const fullTitle = `${title} | ContextMatic`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://contextmatic.com';
    const ogImage = image || `${appUrl}/og-image.png`;

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords.join(', ')} />}
            
            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:type" content={type} />
            {url && <meta property="og:url" content={url} />}
            
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
        </Head>
    );
};
