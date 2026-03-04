import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
}

export const SEO: React.FC<SEOProps> = ({
    title,
    description = "Effortlessly repurpose your content into engaging formats like blog posts, tweet threads, and newsletters with ContextMatic's AI.",
    keywords = "AI content repurposing, content marketing, social media marketing, SaaS, content creation",
    image = "/og-image.png",
    url = "https://contextmatic.netlify.app/",
    type = "website"
}) => {
    const siteTitle = "ContextMatic | AI Content Repurposing";
    const fullTitle = title === "ContextMatic" ? siteTitle : `${title} | ContextMatic`;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />
        </Helmet>
    );
};
