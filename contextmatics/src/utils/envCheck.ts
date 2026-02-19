/**
 * Environment variable validation utility
 */

export const validateEnvironmentVariables = () => {
  const REQUIRED_ENV_VARS = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    // 'VITE_REPLICATE_API_KEY', // Optional for real AI
    'VITE_GEMINI_API_KEY'
  ];

  const missingVars = REQUIRED_ENV_VARS.filter(varName => {
    const value = import.meta.env[varName];
    return !value || value === '';
  });

  if (missingVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingVars);
    console.warn('Some features may not work properly. Please set these in your deployment environment.');
  }

  return {
    isValid: missingVars.length === 0,
    missingVars
  };
};

export const getEnvironmentInfo = () => {
  const key = (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) as string | undefined;

  // Check if it's a development mode (missing or placeholder key)
  const isDevMode = import.meta.env.DEV && (
    !key ||
    key.includes('dummy') ||
    key.includes('your_clerk') ||
    key.includes('test_dummy')
  );

  return {
    hasRazorpay: !!import.meta.env.VITE_RAZORPAY_KEY_ID && !import.meta.env.VITE_RAZORPAY_KEY_ID?.includes('dummy'),
    hasPaypal: !!import.meta.env.VITE_PAYPAL_CLIENT_ID && !import.meta.env.VITE_PAYPAL_CLIENT_ID?.includes('dummy'),
    hasGemini: !!import.meta.env.VITE_GEMINI_API_KEY && !import.meta.env.VITE_GEMINI_API_KEY?.includes('dummy'),
    hasClerk: !!key && !isDevMode,
    isClerkKeyValid: (() => {
      if (!key) return false;
      if (isDevMode) return false; // Development mode with placeholder key
      if (!/^pk_(test|live)_.{20,}$/.test(key)) return false;
      if (/^pk_(test|live)_X+$/i.test(key)) return false;
      return true;
    })(),
    isDevelopmentMode: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    isDevMode
  };
};