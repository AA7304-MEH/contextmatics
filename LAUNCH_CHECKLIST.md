# 🚀 ContextMatic Production Launch Checklist

This document outlines all manual steps required to move ContextMatic from staging/development to a live production environment.

## 1. Supabase Preparation
- [ ] **Run Final Schema Sync**: Ensure `supabase/schema.sql` and `supabase/setup.sql` are executed in the production SQL Editor.
- [ ] **Verify RLS**: Run a test query as a non-authenticated user to ensure `videos`, `profiles`, and `snippets` are protected.
- [ ] **Storage Buckets**: Create the following public buckets:
  - `assets` (Public)
  - `previews` (Public)
  - `avatars` (Public)
- [ ] **Auth Configuration**:
  - [ ] Update "Site URL" to your production domain (e.g., `https://contextmatic.com`).
  - [ ] Add "Redirect URLs" for `https://contextmatic.com/auth/callback`.

## 2. Infrastructure & API Keys (Vercel)
Configure these environment variables in your Vercel Project Settings:
- [ ] `NEXT_PUBLIC_SUPABASE_URL`: Production URL.
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Production Anon Key.
- [ ] `SUPABASE_SERVICE_ROLE_KEY`: Production Service Role Key (Keep secret).
- [ ] `GEMINI_API_KEY`: Production Google AI Key.
- [ ] `REPLICATE_API_TOKEN`: Production Replicate Token.
- [ ] `UPSTASH_REDIS_REST_URL`: Production Redis URL.
- [ ] `UPSTASH_REDIS_REST_TOKEN`: Production Redis Token.
- [ ] `AYRSHARE_API_KEY`: Production Ayrshare Key.

## 3. Payment Gateways (Live Mode)
- [ ] **Razorpay**:
  - [ ] Switch to **Live Mode** in the Razorpay Dashboard.
  - [ ] Generate Live `Key ID` and `Key Secret`.
  - [ ] Update `NEXT_PUBLIC_RAZORPAY_KEY_ID` in Vercel.
  - [ ] Set up **Webhooks**: Point `https://contextmatic.com/api/webhooks/razorpay` to receive `payment.captured` and `order.paid` events.
- [ ] **Stripe**:
  - [ ] Switch to **Live Mode**.
  - [ ] Update `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.

## 4. Domain & DNS
- [ ] Add custom domain in Vercel.
- [ ] Configure `A` and `CNAME` records at your registrar.
- [ ] Verify SSL certificate generation.

## 5. Post-Launch Smoke Test
- [ ] **Sign Up**: Create a new account and verify the `onboarding` redirect.
- [ ] **Generate**: Perform one AI Text and one AI Image generation (Verify credit deduction).
- [ ] **Billing**: Attempt a small "Add Credits" purchase via Razorpay/PayPal.
- [ ] **Admin**: Verify `/admin` dashboard only loads for authorized emails.

---
> [!IMPORTANT]
> **Security Audit**: Ensure `NEXT_PUBLIC_ENABLE_PAYMENT_TESTING` is set to `false` in production to disable bypass routes.
