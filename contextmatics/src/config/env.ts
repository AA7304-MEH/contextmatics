export const env = {
    // Core — Supabase
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',

    // Payments
    RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
    PAYPAL_CLIENT_ID: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',

    // AI
    GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',

    // Auth
    CLERK_PUBLISHABLE_KEY: (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '') as string,

    // Stripe (optional)
    STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',

    // Runtime
    API_URL: import.meta.env.VITE_API_URL || '/api',

    // Feature flags
    ENABLE_PAYMENT_TESTING: import.meta.env.VITE_ENABLE_PAYMENT_TESTING === 'true',
    ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    ENABLE_ERROR_REPORTING: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
    MAINTENANCE_MODE: import.meta.env.VITE_MAINTENANCE_MODE === 'true',

    // Derived flags
    isProduction: import.meta.env.PROD,
    isDevelopment: import.meta.env.DEV,
};

/**
 * Returns true when Supabase is configured with real credentials.
 * Used throughout the app to decide between real DB calls and demo mode.
 */
export const isSupabaseConfigured = (): boolean => {
    return !!env.SUPABASE_URL &&
        !env.SUPABASE_URL.includes('placeholder') &&
        !!env.SUPABASE_ANON_KEY &&
        !env.SUPABASE_ANON_KEY.includes('placeholder');
};

/**
 * Returns true when a real (non-dummy) key is set for the given service.
 */
export const isServiceConfigured = (key: string): boolean => {
    return !!key && !key.includes('dummy') && !key.includes('placeholder') && !key.includes('your_');
};

// Validation helper (can be called in App.tsx or main.tsx)
export const validateEnv = () => {
    const missing: string[] = [];
    if (!env.SUPABASE_URL) missing.push('VITE_SUPABASE_URL');
    if (!env.SUPABASE_ANON_KEY) missing.push('VITE_SUPABASE_ANON_KEY');

    if (missing.length > 0) {
        console.warn(`[ContextMatic] Missing Environment Variables: ${missing.join(', ')}. Running in demo mode.`);
        return false;
    }
    return true;
};
