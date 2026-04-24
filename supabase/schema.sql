-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES
CREATE TABLE profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  username text UNIQUE,
  plan text DEFAULT 'free' CHECK (plan IN ('free','pro','business','enterprise')),
  plan_expires_at timestamptz,
  credits_remaining int DEFAULT 30,
  role text DEFAULT 'user' CHECK (role IN ('user','admin')),
  niche text,
  brand_voice text,
  brand_description text,
  preferred_language text DEFAULT 'english',
  secondary_languages text[] DEFAULT '{}',
  onboarding_completed boolean DEFAULT false,
  content_os_enabled boolean DEFAULT false,
  posting_days text[] DEFAULT '{monday,wednesday,friday}',
  best_posting_times jsonb,
  referral_code text UNIQUE DEFAULT substring(md5(random()::text),1,8),
  referred_by uuid REFERENCES profiles(id),
  referral_credits_earned int DEFAULT 0,
  razorpay_customer_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- VOICE FINGERPRINTS
CREATE TABLE voice_fingerprints (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  fingerprint jsonb NOT NULL,
  generation_instructions text NOT NULL,
  voice_score int DEFAULT 0,
  samples_count int DEFAULT 0,
  analyzed_at timestamptz DEFAULT now()
);
ALTER TABLE voice_fingerprints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own fingerprints" ON voice_fingerprints FOR ALL USING (auth.uid() = user_id);

-- SNIPPETS
CREATE TABLE snippets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id uuid,
  title text,
  content text NOT NULL,
  platform text,
  content_type text,
  language text DEFAULT 'english',
  tags text[] DEFAULT '{}',
  source text,
  credits_used int DEFAULT 1,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own snippets" ON snippets FOR ALL USING (auth.uid() = user_id);

-- ASSETS
CREATE TABLE assets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text CHECK (type IN ('image','video','audio','document')),
  url text NOT NULL,
  thumbnail_url text,
  size_bytes bigint,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own assets" ON assets FOR ALL USING (auth.uid() = user_id);

-- VIDEOS
CREATE TABLE videos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt text,
  style text,
  platform text,
  url text,
  audio_url text,
  thumbnail_url text,
  status text DEFAULT 'processing',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own videos" ON videos FOR ALL USING (auth.uid() = user_id);

-- PROJECTS (video editor)
CREATE TABLE projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  timeline_data jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own projects" ON projects FOR ALL USING (auth.uid() = user_id);

-- SCHEDULED POSTS
CREATE TABLE scheduled_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id uuid,
  content text NOT NULL,
  platforms text[] NOT NULL,
  scheduled_at timestamptz NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft','pending_review','approved','rejected','scheduled','published')),
  post_ids jsonb,
  rejection_note text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own scheduled posts" ON scheduled_posts FOR ALL USING (auth.uid() = user_id);

-- CONTENT PLANS
CREATE TABLE content_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  plan jsonb NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending','approved','scheduled')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE content_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own content plans" ON content_plans FOR ALL USING (auth.uid() = user_id);

-- REPURPOSE JOBS
CREATE TABLE repurpose_jobs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  source_type text CHECK (source_type IN ('youtube','podcast','upload','voice_memo','url','text')),
  source_url text,
  source_title text,
  transcript text,
  status text DEFAULT 'processing' CHECK (status IN ('processing','transcribed','generating','complete','failed','partial')),
  outputs jsonb,
  credits_used int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE repurpose_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own repurpose jobs" ON repurpose_jobs FOR ALL USING (auth.uid() = user_id);

-- SOCIAL INBOX
CREATE TABLE social_inbox (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  platform text NOT NULL,
  comment_id text NOT NULL,
  post_id text,
  post_content text,
  commenter_handle text,
  commenter_followers int DEFAULT 0,
  comment_text text NOT NULL,
  sentiment text CHECK (sentiment IN ('positive','neutral','negative','question','opportunity')),
  priority text DEFAULT 'normal' CHECK (priority IN ('high','normal','low')),
  status text DEFAULT 'unread' CHECK (status IN ('unread','read','replied','ignored')),
  ai_replies jsonb,
  replied_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(platform, comment_id)
);
ALTER TABLE social_inbox ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own inbox" ON social_inbox FOR ALL USING (auth.uid() = user_id);

-- TRACKED COMPETITORS
CREATE TABLE tracked_competitors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  platform text NOT NULL,
  handle text NOT NULL,
  display_name text,
  follower_count int,
  last_synced_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE tracked_competitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own competitors" ON tracked_competitors FOR ALL USING (auth.uid() = user_id);

-- COMPETITOR POSTS
CREATE TABLE competitor_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  competitor_id uuid REFERENCES tracked_competitors(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  platform text NOT NULL,
  post_id text NOT NULL,
  content text NOT NULL,
  likes int DEFAULT 0,
  comments int DEFAULT 0,
  shares int DEFAULT 0,
  engagement_rate float DEFAULT 0,
  why_it_worked text,
  posted_at timestamptz,
  UNIQUE(platform, post_id)
);
ALTER TABLE competitor_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own competitor posts" ON competitor_posts FOR ALL USING (auth.uid() = user_id);

-- HOOK LIBRARY
CREATE TABLE hook_library (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  hook_template text NOT NULL,
  hook_type text CHECK (hook_type IN ('question','statement','controversial','story','data','curiosity','fear','aspiration')),
  platform text,
  niche text,
  language text DEFAULT 'english',
  usage_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- HOOK AB TESTS
CREATE TABLE hook_ab_tests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  topic text NOT NULL,
  hook_a text NOT NULL,
  hook_b text NOT NULL,
  hook_c text NOT NULL,
  post_a_id text,
  post_b_id text,
  post_c_id text,
  winner text,
  analysis text,
  status text DEFAULT 'running' CHECK (status IN ('running','complete')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE hook_ab_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own ab tests" ON hook_ab_tests FOR ALL USING (auth.uid() = user_id);

-- MONETISATION ASSETS
CREATE TABLE monetisation_assets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_type text CHECK (asset_type IN ('lead_magnet','email_sequence','product_description','landing_page','mini_course_outline','newsletter_issue','paid_community_post')),
  title text NOT NULL,
  content jsonb NOT NULL,
  source_content text,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE monetisation_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own monetisation assets" ON monetisation_assets FOR ALL USING (auth.uid() = user_id);

-- REFERRALS
CREATE TABLE referrals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id uuid REFERENCES profiles(id),
  referred_id uuid REFERENCES profiles(id),
  status text DEFAULT 'pending' CHECK (status IN ('pending','completed')),
  credits_awarded int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own referrals" ON referrals FOR ALL USING (auth.uid() = referrer_id);

-- WORKSPACES
CREATE TABLE workspaces (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  owner_id uuid REFERENCES auth.users(id),
  plan text DEFAULT 'agency',
  ayrshare_profile_key text,
  brand_voice text,
  brand_description text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- WORKSPACE MEMBERS
CREATE TABLE workspace_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'editor' CHECK (role IN ('owner','admin','editor','viewer')),
  invited_email text,
  status text DEFAULT 'pending' CHECK (status IN ('pending','active')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(workspace_id, user_id)
);
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- CRON LOGS
CREATE TABLE cron_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cron_name text NOT NULL,
  status text CHECK (status IN ('success','partial','failed')),
  users_processed int DEFAULT 0,
  errors jsonb,
  duration_ms int,
  ran_at timestamptz DEFAULT now()
);

-- DECREMENT CREDITS FUNCTION
CREATE OR REPLACE FUNCTION decrement_credits(user_id uuid, amount int)
RETURNS int LANGUAGE plpgsql AS $$
DECLARE new_balance int;
BEGIN
  UPDATE profiles SET credits_remaining = credits_remaining - amount
  WHERE id = user_id AND credits_remaining >= amount
  RETURNING credits_remaining INTO new_balance;
  IF NOT FOUND THEN RAISE EXCEPTION 'INSUFFICIENT_CREDITS'; END IF;
  RETURN new_balance;
END; $$;
