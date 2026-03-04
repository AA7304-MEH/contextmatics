# ContextMatic — Production Setup Guide

## Quick Start

1. Copy `.env.example` → `.env`
2. Fill in your real API keys (see sections below)
3. `npm install && npm run build`
4. Deploy `dist/` to Netlify (or any static host)

---

## Required Services

### 1. Supabase (Database & Auth backend)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
3. Run the SQL schema (see `supabase/schema.sql` if present)

### 2. Clerk (Authentication)

1. Create an app at [clerk.com](https://clerk.com)
2. Go to **API Keys** and copy:
   - `Publishable key` → `VITE_CLERK_PUBLISHABLE_KEY`
3. Configure sign-in methods (Email + OAuth providers)
4. Set allowed origins in Clerk dashboard to your production domain

### 3. Razorpay (India Payments)

1. Create account at [razorpay.com](https://razorpay.com)
2. Go to **Settings → API Keys** and copy:
   - `Key ID` → `VITE_RAZORPAY_KEY_ID`
3. Use `rzp_test_*` keys for testing, `rzp_live_*` for production

### 4. PayPal (International Payments)

1. Create app at [developer.paypal.com](https://developer.paypal.com)
2. Go to **My Apps & Credentials** and copy:
   - `Client ID` → `VITE_PAYPAL_CLIENT_ID`

### 5. Google Gemini (AI Content)

1. Get API key at [aistudio.google.com](https://aistudio.google.com/app/apikey)
2. Copy → `VITE_GEMINI_API_KEY`

---

## Netlify Deployment

### Environment Variables

Set these in **Netlify → Site Settings → Environment Variables**:

| Variable | Required | Example |
|----------|:--------:|---------|
| `VITE_SUPABASE_URL` | ✅ | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | ✅ | `eyJhbGci...` |
| `VITE_CLERK_PUBLISHABLE_KEY` | ✅ | `pk_live_...` |
| `VITE_RAZORPAY_KEY_ID` | ✅ | `rzp_live_...` |
| `VITE_PAYPAL_CLIENT_ID` | ✅ | `AXxx...` |
| `VITE_GEMINI_API_KEY` | ✅ | `AIza...` |
| `VITE_ENABLE_ANALYTICS` | ❌ | `true` |
| `VITE_ENABLE_ERROR_REPORTING` | ❌ | `true` |
| `VITE_MAINTENANCE_MODE` | ❌ | `false` |

### Custom Domain

1. In Netlify → **Domain Management** → add your domain
2. Netlify auto-provisions SSL via Let's Encrypt
3. HSTS is pre-configured in `netlify.toml`

---

## Demo Mode

When API keys are missing or set to dummy values, the app automatically runs in **demo mode**:

- Auth → Mock login with `dev@example.com` / any password
- Payments → Simulated payment flows (no real charges)
- AI Content → Pre-written demo responses
- Database → localStorage fallback

This is useful for development and demos without needing real service accounts.

---

## Security Checklist

- [x] `.env` in `.gitignore` (API keys never committed)
- [x] CSP headers restrict script/connect sources
- [x] HSTS with 2-year max-age + preload
- [x] X-Frame-Options: DENY (prevents clickjacking)
- [x] Permissions-Policy: camera/mic/geo disabled
- [x] All API keys are `VITE_` prefixed (Vite's public env convention)

---

## Go-Live Checklist

- [ ] All env vars set in Netlify dashboard
- [ ] Supabase database schema deployed
- [ ] Clerk auth configured with production domain
- [ ] Razorpay webhooks pointed to your domain (if using)
- [ ] PayPal app set to "Live" mode
- [ ] Custom domain configured with SSL
- [ ] Test a real payment flow end-to-end
- [ ] Verify Clerk sign-up/sign-in works
- [ ] Check browser console for errors on all pages
