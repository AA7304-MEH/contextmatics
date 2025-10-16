/**
 * Environment variable validation utility
 */

export const validateEnvironmentVariables = () => {
  const requiredVars = [
    'VITE_RAZORPAY_KEY_ID',
    'VITE_PAYPAL_CLIENT_ID', 
    'VITE_GEMINI_API_KEY'
  ];

  const missingVars = requiredVars.filter(varName => {
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
  return {
    hasRazorpay: !!import.meta.env.VITE_RAZORPAY_KEY_ID,
    hasPaypal: !!import.meta.env.VITE_PAYPAL_CLIENT_ID,
    hasGemini: !!import.meta.env.VITE_GEMINI_API_KEY,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD
  };
};