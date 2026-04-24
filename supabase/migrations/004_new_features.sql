-- ContextMatic Phase 2 - New Features Migration
-- Features: Brand Voice, Language Support, Content OS, Repurpose Studio, Inbox, Competitor Intel, Hook Library, Monetisation.

-- 1. PROFILE ENHANCEMENTS
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS voice_fingerprint jsonb DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS voice_samples text[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS voice_analyzed_at timestamptz;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'english';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS secondary_languages text[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS content_os_enabled boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS posting_days text[] DEFAULT '{monday,wednesday,friday}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS best_posting_times jsonb DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS content_os_niche text;

-- 2. BRAND VOICE SAMPLES
CREATE TABLE IF NOT EXISTS public.voice_samples (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  platform text,
  performance_score int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.voice_samples ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own voice samples" ON public.voice_samples FOR ALL USING (auth.uid() = user_id);

-- 3. CONTENT PLANS (Content OS)
CREATE TABLE IF NOT EXISTS public.content_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  plan jsonb NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending','approved','scheduled')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.content_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own content plans" ON public.content_plans FOR ALL USING (auth.uid() = user_id);

-- 4. REPURPOSE JOBS
CREATE TABLE IF NOT EXISTS public.repurpose_jobs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  source_type text CHECK (source_type IN ('youtube','podcast','upload','voice_memo')),
  source_url text,
  source_title text,
  transcript text,
  status text DEFAULT 'processing' CHECK (status IN ('processing','transcribed','generating','complete','failed')),
  outputs jsonb DEFAULT '{}',
  credits_used int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.repurpose_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own repurpose jobs" ON public.repurpose_jobs FOR ALL USING (auth.uid() = user_id);

-- 5. SOCIAL INBOX
CREATE TABLE IF NOT EXISTS public.social_inbox (
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
  ai_replies jsonb DEFAULT '{}',
  replied_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(platform, comment_id)
);
ALTER TABLE public.social_inbox ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own inbox" ON public.social_inbox FOR ALL USING (auth.uid() = user_id);

-- 6. COMPETITOR INTELLIGENCE
CREATE TABLE IF NOT EXISTS public.tracked_competitors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  platform text NOT NULL,
  handle text NOT NULL,
  display_name text,
  follower_count int DEFAULT 0,
  last_synced_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.tracked_competitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own tracked competitors" ON public.tracked_competitors FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.competitor_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  competitor_id uuid REFERENCES public.tracked_competitors(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  platform text NOT NULL,
  post_id text NOT NULL,
  content text NOT NULL,
  likes int DEFAULT 0,
  comments int DEFAULT 0,
  shares int DEFAULT 0,
  engagement_rate float DEFAULT 0,
  posted_at timestamptz,
  inspired_version_generated boolean DEFAULT false,
  UNIQUE(platform, post_id)
);
ALTER TABLE public.competitor_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own competitor posts" ON public.competitor_posts FOR ALL USING (auth.uid() = user_id);

-- 7. HOOK LIBRARY & A/B TESTS
CREATE TABLE IF NOT EXISTS public.hook_library (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  hook_template text NOT NULL,
  hook_type text CHECK (hook_type IN ('question','statement','controversial','story','data','curiosity','fear','aspiration')),
  platform text,
  niche text,
  language text DEFAULT 'english',
  usage_count int DEFAULT 0,
  avg_performance_score float DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.hook_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read hook library" ON public.hook_library FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.hook_ab_tests (
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
ALTER TABLE public.hook_ab_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own ab tests" ON public.hook_ab_tests FOR ALL USING (auth.uid() = user_id);

-- 8. MONETISATION ASSETS
CREATE TABLE IF NOT EXISTS public.monetisation_assets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_type text CHECK (asset_type IN ('lead_magnet','email_sequence','product_description','landing_page','mini_course_outline','newsletter_issue','paid_community_post')),
  title text NOT NULL,
  content jsonb NOT NULL,
  source_content text,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.monetisation_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own monetisation assets" ON public.monetisation_assets FOR ALL USING (auth.uid() = user_id);

-- 9. CRON LOGS
CREATE TABLE IF NOT EXISTS public.cron_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cron_name text NOT NULL,
  status text CHECK (status IN ('success','partial','failed')),
  users_processed int DEFAULT 0,
  errors jsonb DEFAULT '[]',
  duration_ms int,
  ran_at timestamptz DEFAULT now()
);
ALTER TABLE public.cron_logs ENABLE ROW LEVEL SECURITY;
-- Cron logs are usually system-level, but let's allow read for admins if needed.
CREATE POLICY "Admins can see cron logs" ON public.cron_logs FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- RE-ENABLE RLS AND RE-APPLY POLICIES FOR PROFILES
-- Policy already exists in schema.sql but making sure it's enforced.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
