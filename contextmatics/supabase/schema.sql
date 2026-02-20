-- ContextMatic Supabase Schema
-- Run this in Supabase SQL Editor: https://app.supabase.com → SQL Editor
-- This creates all tables, functions, and security policies needed for production.

-- ============================================================
-- 1. PROFILES TABLE (user data, credits, plan)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business', 'enterprise', 'free_abuse')),
  credits_remaining INTEGER DEFAULT 3,
  stripe_customer_id TEXT,
  country_code TEXT DEFAULT 'US',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 2. SNIPPETS TABLE (generated content history)
-- ============================================================
CREATE TABLE IF NOT EXISTS snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_snippets_user_id ON snippets(user_id);
CREATE INDEX IF NOT EXISTS idx_snippets_created_at ON snippets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_snippets_user_created ON snippets(user_id, created_at DESC);


-- ============================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Critical: ensures users can only access their own data

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Snippets: users can only CRUD their own content
CREATE POLICY "Users can view own snippets"
  ON snippets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own snippets"
  ON snippets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own snippets"
  ON snippets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own snippets"
  ON snippets FOR DELETE
  USING (auth.uid() = user_id);


-- ============================================================
-- 4. VERIFICATION QUERIES (run these to confirm setup)
-- ============================================================
-- SELECT * FROM pg_tables WHERE schemaname = 'public';
-- SELECT * FROM pg_policies WHERE schemaname = 'public';
