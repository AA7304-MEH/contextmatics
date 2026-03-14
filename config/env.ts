export const env = {
    // Core — Supabase
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',

    // Payments — Stripe
    STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',

    // AI (Server-side ONLY)
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY || '',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',

    // Runtime
    API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',

    // Feature flags
    ENABLE_PAYMENT_TESTING: process.env.NEXT_PUBLIC_ENABLE_PAYMENT_TESTING === 'true',
    ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    ENABLE_ERROR_REPORTING: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === 'true',
    MAINTENANCE_MODE: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',

    // Derived flags
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV !== 'production',
};

export const isSupabaseConfigured = (): boolean => {
    return !!env.SUPABASE_URL &&
        !env.SUPABASE_URL.includes('placeholder') &&
        !!env.SUPABASE_ANON_KEY &&
        !env.SUPABASE_ANON_KEY.includes('placeholder');
};

export const isServiceConfigured = (key: string): boolean => {
    return !!key && !key.includes('dummy') && !key.includes('placeholder') && !key.includes('your_');
};

export const validateEnv = () => {
    const critical = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'STRIPE_PUBLISHABLE_KEY'];
    const missing: string[] = [];

    critical.forEach(key => {
        if (!env[key as keyof typeof env]) missing.push('NEXT_PUBLIC_' + key);
    });

    if (missing.length > 0) {
        console.warn(`[ContextMatic] CRITICAL Missing Environment Variables: ${missing.join(', ')}. Some features will be disabled.`);
    }

    const services = [
        { name: 'Gemini AI', key: env.GEMINI_API_KEY, env: 'GEMINI_API_KEY' },
        { name: 'Stripe', key: env.STRIPE_PUBLISHABLE_KEY, env: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY' }
    ];

    services.forEach(service => {
        if (!isServiceConfigured(service.key)) {
            console.info(`[ContextMatic] ${service.name} not configured (${service.env}). Running in Demo/Mock mode.`);
        }
    });

    return missing.length === 0;
};
