export const env = {
    // Core — Supabase
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

    // Security — Secrets
    CRON_SECRET: process.env.CRON_SECRET || '',

    // Internal — App
    APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://contextmatic.com',

    // Social — Ayrshare
    AYRSHARE_API_KEY: process.env.AYRSHARE_API_KEY || '',

    // Payments — Stripe (Legacy/Future)
    STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',

    // AI (Server-side ONLY)
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN || '',

    // Payments — Razorpay & PayPal
    RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
    PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',

    // Runtime
    API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',

    // Feature flags
    ENABLE_PAYMENT_TESTING: process.env.NEXT_PUBLIC_ENABLE_PAYMENT_TESTING === 'true',
    ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',

    // Derived flags
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV !== 'production',
};

export const isSupabaseConfigured = (): boolean => {
    return !!env.SUPABASE_URL &&
        !env.SUPABASE_URL.includes('placeholder') &&
        !!env.SUPABASE_ANON_KEY;
};

export const isServiceConfigured = (key: string): boolean => {
    return !!key && !key.includes('dummy') && !key.includes('placeholder') && !key.includes('your_');
};

export const validateEnv = () => {
    const critical = [
        'SUPABASE_URL', 
        'SUPABASE_ANON_KEY', 
        'SUPABASE_SERVICE_ROLE_KEY',
        'AYRSHARE_API_KEY', 
        'GEMINI_API_KEY',
        'CRON_SECRET'
    ];
    const missing: string[] = [];

    critical.forEach(key => {
        if (!env[key as keyof typeof env]) {
            const prefix = key.startsWith('SUPABASE_') && !key.includes('SERVICE') ? 'NEXT_PUBLIC_' : '';
            missing.push(prefix + key);
        }
    });

    if (missing.length > 0) {
        console.warn(`[ContextMatic] CRITICAL Missing Environment Variables: ${missing.join(', ')}.`);
        // In local development, we might want to return false to catch issues early.
        // But in build/production, we want the build to finish so we can scale.
        if (env.isDevelopment) return false;
    }

    const services = [
        { name: 'Ayrshare Social', key: env.AYRSHARE_API_KEY, env: 'AYRSHARE_API_KEY' },
        { name: 'Gemini AI', key: env.GEMINI_API_KEY, env: 'GEMINI_API_KEY' },
        { name: 'Replicate AI', key: env.REPLICATE_API_TOKEN, env: 'REPLICATE_API_TOKEN' },
        { name: 'Razorpay', key: env.RAZORPAY_KEY_ID, env: 'NEXT_PUBLIC_RAZORPAY_KEY_ID' }
    ];

    services.forEach(service => {
        if (!isServiceConfigured(service.key)) {
            console.info(`[ContextMatic] ${service.name} not configured (${service.env}). System running in demo mode.`);
        }
    });

    // Always return true in production/build to prevent build crashes
    return true;
};
