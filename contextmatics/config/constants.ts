/**
 * Application constants and configuration
 */

// Payment Gateway Keys - These MUST be set as environment variables
export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
export const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

// AI Service Configuration - MUST be set as environment variable
export const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

// Application Configuration
export const APP_NAME = 'ContextMatic';
export const APP_VERSION = '1.0.0';
export const SUPPORT_EMAIL = 'support@contextmatic.example.com';

// Pricing Tiers (in USD cents for Razorpay, or dollars for PayPal)
export const PRICING_TIERS = {
    tier1: { // USA, Canada, Western Europe, Australia
        pro: { monthly: 2900, yearly: 29000 }, // $29/month, $290/year
        business: { monthly: 7900, yearly: 79000 }, // $79/month, $790/year
    },
    tier2: { // India, Brazil, Indonesia, Other
        pro: { monthly: 1500, yearly: 15000 }, // ₹1249/month, ₹12490/year
        business: { monthly: 3900, yearly: 39000 }, // ₹3249/month, ₹32490/year
    },
};

export const TIER1_COUNTRIES = ['US', 'CA', 'GB', 'DE', 'FR', 'AU', 'NZ'];

export const PLAN_FEATURES = [
    { name: 'AI Repurposing Credits', pro: '10/month', business: '50/month', enterprise: 'Custom' },
    { name: 'Multiple Output Formats', pro: true, business: true, enterprise: true },
    { name: 'Priority Processing', pro: false, business: true, enterprise: true },
    { name: 'Team Collaboration', pro: false, business: 'Up to 5 users', enterprise: 'Unlimited Users' },
    { name: 'API Access', pro: false, business: true, enterprise: true },
    { name: 'Single Sign-On (SSO)', pro: false, business: false, enterprise: true },
    { name: 'Dedicated Account Manager', pro: false, business: false, enterprise: true },
    { name: '24/7 Support', pro: true, business: true, enterprise: 'Priority 24/7 Support' },
];

export const REPURPOSE_OPTIONS = [
    { value: 'summary', label: 'Concise Summary' },
    { value: 'tweet_thread', label: 'Twitter (X) Thread' },
    { value: 'blog_post', label: 'Blog Post' },
    { value: 'linkedin_post', label: 'LinkedIn Post' },
    { value: 'email_newsletter', label: 'Email Newsletter' },
];

export const COUNTRIES = [
    { name: 'United States', code: 'US' },
    { name: 'Canada', code: 'CA' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'Germany', code: 'DE' },
    { name: 'France', code: 'FR' },
    { name: 'Australia', code: 'AU' },
    { name: 'India', code: 'IN' },
    { name: 'Brazil', code: 'BR' },
    { name: 'Japan', code: 'JP' },
    { name: 'Singapore', code: 'SG' },
    { name: 'Other', code: 'OTHER' },
];

// Rate limiting configuration
export const RATE_LIMITS = {
    free: { requests: 3, window: 3600000 }, // 3 requests per hour
    pro: { requests: 100, window: 3600000 }, // 100 requests per hour
    business: { requests: 500, window: 3600000 }, // 500 requests per hour
    enterprise: { requests: 1000, window: 3600000 }, // 1000 requests per hour
};

// File upload limits
export const UPLOAD_LIMITS = {
    free: { size: 10 * 1024 * 1024, type: 'text' }, // 10MB text only
    pro: { size: 50 * 1024 * 1024, type: 'text' }, // 50MB text only
    business: { size: 100 * 1024 * 1024, type: 'any' }, // 100MB any file type
    enterprise: { size: 500 * 1024 * 1024, type: 'any' }, // 500MB any file type
};

// Analytics and tracking
export const ANALYTICS = {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    mixpanelToken: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
};

// Feature flags
export const FEATURES = {
    enablePaymentTesting: process.env.NEXT_PUBLIC_ENABLE_PAYMENT_TESTING === 'true',
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enableErrorReporting: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === 'true',
    maintenanceMode: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
};

// API endpoints
export const API_ENDPOINTS = {
    gemini: 'https://generativelanguage.googleapis.com/v1',
    webhook: process.env.NEXT_PUBLIC_WEBHOOK_URL || '',
    analytics: process.env.NEXT_PUBLIC_ANALYTICS_URL || '',
};

// Social media links
export const SOCIAL_LINKS = {
    twitter: 'https://twitter.com/contextmatic',
    linkedin: 'https://linkedin.com/company/contextmatic',
    github: 'https://github.com/your-username/contextmatic',
    website: 'https://contextmatic.example.com',
};

// Contact information
export const CONTACT = {
    email: 'support@contextmatic.example.com',
    phone: '+1 (555) 123-4567',
    address: '123 AI Street, Tech City, TC 12345',
};
