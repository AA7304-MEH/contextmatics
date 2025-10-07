/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RAZORPAY_KEY_ID: string
  readonly VITE_PAYPAL_CLIENT_ID: string
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_GA_ID?: string
  readonly VITE_MIXPANEL_TOKEN?: string
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_WEBHOOK_URL?: string
  readonly VITE_ANALYTICS_URL?: string
  readonly VITE_ENABLE_PAYMENT_TESTING?: string
  readonly VITE_ENABLE_ANALYTICS?: string
  readonly VITE_ENABLE_ERROR_REPORTING?: string
  readonly VITE_MAINTENANCE_MODE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}