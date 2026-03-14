/**
 * Environment variable validation utility
 */
import { env } from '@/config/env';

export const validateEnvironmentVariables = () => {
  const REQUIRED_ENV_VARS = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_GEMINI_API_KEY'
  ];

  const missingVars = REQUIRED_ENV_VARS.filter(varName => {
    const value = (process.env as any)[varName];
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
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const isDevMode = process.env.NODE_ENV !== 'production' && (
    !key ||
    key.includes('dummy') ||
    key.includes('your_clerk') ||
    key.includes('test_dummy')
  );

  return {
    hasRazorpay: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.includes('dummy'),
    hasPaypal: !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && !process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.includes('dummy'),
    hasGemini: !!process.env.NEXT_PUBLIC_GEMINI_API_KEY && !process.env.NEXT_PUBLIC_GEMINI_API_KEY?.includes('dummy'),
    hasClerk: !!key && !isDevMode,
    isClerkKeyValid: (() => {
      if (!key) return false;
      if (isDevMode) return false;
      if (!/^pk_(test|live)_.{20,}$/.test(key)) return false;
      if (/^pk_(test|live)_X+$/i.test(key)) return false;
      return true;
    })(),
    isDevelopmentMode: process.env.NODE_ENV !== 'production',
    isProduction: process.env.NODE_ENV === 'production',
    isDevMode
  };
};