# ContextMatic — Production Launch Checklist
Complete every item in order. Do not skip steps.

## STEP 1 — Get Free API Keys (30 mins)
- [ ] Groq → console.groq.com → Create API Key → save as GROQ_API_KEY
- [ ] HuggingFace → huggingface.co/settings/tokens → New token (read access) → save as HUGGINGFACE_API_KEY
- [ ] Fal.ai → fal.ai → Sign up → Dashboard → API Keys → save as FAL_API_KEY (comes with $10 free credit)
- [ ] Google Gemini → aistudio.google.com → Get API key → save as GEMINI_API_KEY

## STEP 2 — Paid Services Setup (30 mins)
- [ ] Razorpay → dashboard.razorpay.com → Settings → switch to Live Mode → copy Live Key ID + Key Secret
- [ ] Ayrshare → app.ayrshare.com → Profile → API Key → copy key
- [ ] Resend → resend.com → Add domain → verify DNS → copy API key
- [ ] Upstash → console.upstash.com → Create Redis database → choose region closest to Vercel → copy REST URL + REST Token

## STEP 3 — Supabase Setup (30 mins)
- [ ] Open Supabase SQL Editor
- [ ] Run supabase/schema.sql completely — wait for success message
- [ ] Run supabase/setup.sql completely — wait for success message
- [ ] Verify tables: SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name
- [ ] Verify RLS: SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public'
- [ ] All tables must show rowsecurity = true
- [ ] Authentication → Providers → Enable Google → add Client ID + Secret from Google Cloud Console
- [ ] Authentication → Providers → Enable GitHub → add Client ID + Secret from GitHub Developer Settings
- [ ] Authentication → Providers → Enable Azure → add Client ID + Secret from Azure App Registration
- [ ] Authentication → URL Configuration → add https://YOUR_DOMAIN/auth/callback to allowed redirect URLs
- [ ] Storage → confirm buckets exist: assets, previews, avatars (created by setup.sql)

## STEP 4 — Vercel Setup (20 mins)
- [ ] Go to Vercel → Your Project → Settings → Environment Variables
- [ ] Add every variable from .env.example with production values
- [ ] Do not forget CRON_SECRET — generate a random 32-char string
- [ ] Trigger a fresh production deployment
- [ ] Watch build log — confirm zero errors
- [ ] Visit production URL — confirm landing page loads with content visible
- [ ] Check browser console — confirm no errors on landing page

## STEP 5 — Razorpay Webhook (10 mins)
- [ ] Razorpay Dashboard → Settings → Webhooks → Add New Webhook
- [ ] Webhook URL: https://YOUR_DOMAIN/api/webhooks/razorpay
- [ ] Enable event: payment.captured
- [ ] Copy webhook secret → add as RAZORPAY_WEBHOOK_SECRET in Vercel
- [ ] Redeploy after adding webhook secret
- [ ] Test webhook using Razorpay test tool — confirm 200 response

## STEP 6 — Domain Setup (15 mins)
- [ ] Vercel → Project → Settings → Domains → Add domain
- [ ] Copy DNS records shown by Vercel
- [ ] Add DNS records at your domain registrar
- [ ] Wait for SSL certificate (usually under 5 minutes)
- [ ] Update NEXT_PUBLIC_APP_URL in Vercel to https://YOUR_CUSTOM_DOMAIN
- [ ] Update Supabase redirect URL to use custom domain
- [ ] Trigger final redeploy

## STEP 7 — Smoke Test (45 mins)
Test every critical flow on production before telling anyone:
- [ ] Sign up with email → verify email received → lands on onboarding
- [ ] Sign up with Google OAuth → lands on onboarding
- [ ] Sign up with GitHub OAuth → lands on onboarding
- [ ] Complete all 4 onboarding steps → dashboard loads with welcome toast
- [ ] Generate a Twitter post → credits deducted in navbar
- [ ] Generate a LinkedIn post → different output, same topic
- [ ] Repurpose a URL → all 6 platform outputs appear
- [ ] Open Voice Studio → paste 3 samples → analyse → fingerprint appears
- [ ] Generate with brand voice on → output style changes
- [ ] Schedule a post → appears in calendar with correct date
- [ ] Open Audience Inbox → refresh → comments load
- [ ] Add a competitor → sync → posts appear
- [ ] Go to Monetisation → generate Lead Magnet → asset saves
- [ ] Go to /pricing → click Pro → Razorpay modal opens
- [ ] Complete test payment → credits update in dashboard
- [ ] Go to /admin as admin user → stats load correctly
- [ ] Go to /admin as regular user → redirected to dashboard
- [ ] Open on iPhone Safari (375px) → mobile nav visible → generator works
- [ ] Open on Android Chrome → same checks pass
- [ ] Check Vercel function logs → no errors

## STEP 8 — Launch Day Actions
- [ ] Post Twitter/X launch thread (template in docs/LAUNCH_TEMPLATES.md)
- [ ] Post LinkedIn launch post
- [ ] Send WhatsApp message to 10 beta users asking for feedback
- [ ] Submit to Product Hunt (best day: Tuesday or Wednesday, 12:01am PST)
- [ ] Post in r/SocialMediaMarketing
- [ ] Post in r/entrepreneur
- [ ] Write IndieHackers build story post
- [ ] Share in relevant WhatsApp/Telegram creator groups
