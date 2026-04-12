-- ContextMatic Production Supabase Schema (Hardened)
-- Date: 2026-04-06
-- This file creates all tables, functions, and security policies for a production environment.

-- ============================================================
-- 1. PROFILES & AUTHENTICATION
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business', 'enterprise', 'free_abuse')),
  credits_remaining INTEGER DEFAULT 5,
  referral_code TEXT UNIQUE DEFAULT substring(md5(random()::text), 1, 8),
  referred_by UUID REFERENCES public.profiles(id),
  onboarding_completed BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'user',
  stripe_customer_id TEXT,
  plan_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. CONTENT & ASSETS (AI GEN & UPLOADS)
-- ============================================================
-- AI Generated snippets
CREATE TABLE IF NOT EXISTS public.snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  platform TEXT,
  type TEXT DEFAULT 'text',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Generated Media (Images, Logos, Videos)
CREATE TABLE IF NOT EXISTS public.media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'image', 'logo', 'video'
  prompt TEXT NOT NULL,
  url TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Editor Projects & Assets
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Project',
  timeline_data JSONB DEFAULT '{"tracks": [], "duration": 60}',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. WORKSPACES & SOCIAL
-- ============================================================
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES public.profiles(id),
  plan TEXT DEFAULT 'agency',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'editor' CHECK (role IN ('owner','admin','editor','viewer')),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  platforms TEXT[] NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments & Billing History
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  gateway TEXT NOT NULL, -- 'razorpay', 'paypal', 'stripe'
  gateway_payment_id TEXT UNIQUE NOT NULL,
  gateway_order_id TEXT,
  amount FLOAT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  plan_name TEXT NOT NULL,
  credits_added INTEGER NOT NULL,
  status TEXT DEFAULT 'completed',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policy Logic (Secure Defaults)
CREATE POLICY "Users access own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users content access" ON public.snippets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users media access" ON public.media_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users project access" ON public.projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users asset access" ON public.assets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users schedule access" ON public.scheduled_posts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users billing access" ON public.transactions FOR SELECT USING (auth.uid() = user_id);

-- Workspace Specifics
CREATE POLICY "Workspace visibility" ON public.workspaces FOR SELECT USING (
  id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()) OR owner_id = auth.uid()
);
CREATE POLICY "Workspace management" ON public.workspaces FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Member visibility" ON public.workspace_members FOR SELECT USING (
  workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid() OR id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()))
);

-- ============================================================
-- 5. ADMINISTRATIVE FUNCTIONS (CREDITS)
-- ============================================================
-- RPC for atomic credit deduction
CREATE OR REPLACE FUNCTION decrement_credits(user_id uuid, amount int)
RETURNS int LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE new_balance int;
BEGIN
  UPDATE public.profiles SET credits_remaining = credits_remaining - amount
  WHERE id = user_id AND credits_remaining >= amount
  RETURNING credits_remaining INTO new_balance;
  
  IF NOT FOUND THEN RAISE EXCEPTION 'INSUFFICIENT_CREDITS'; END IF;
  RETURN new_balance;
END; $$;

-- RPC for atomic payment processing
-- Ensures transaction log and profile update happen together
CREATE OR REPLACE FUNCTION process_payment_success(
  p_user_id uuid,
  p_plan_name text,
  p_credits_to_add int,
  p_gateway text,
  p_payment_id text,
  p_order_id text,
  p_amount float,
  p_currency text
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- 1. Insert transaction record
  INSERT INTO public.transactions (
    user_id, gateway, gateway_payment_id, gateway_order_id, 
    amount, currency, plan_name, credits_added, status
  ) VALUES (
    p_user_id, p_gateway, p_payment_id, p_order_id, 
    p_amount, p_currency, p_plan_name, p_credits_to_add, 'completed'
  );

  -- 2. Update user profile
  UPDATE public.profiles 
  SET 
    plan = p_plan_name,
    credits_remaining = credits_remaining + p_credits_to_add,
    updated_at = NOW()
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'USER_NOT_FOUND';
  END IF;
END; $$;
