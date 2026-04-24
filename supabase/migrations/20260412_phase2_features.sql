-- ContextMatic Phase Two Features Migration
-- Date: 2026-04-12

-- 1. Voice Fingerprints
CREATE TABLE IF NOT EXISTS public.voice_fingerprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sample_text TEXT,
  fingerprint_data JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Repurpose Jobs (YouTube/Podcast)
CREATE TABLE IF NOT EXISTS public.repurpose_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  type TEXT CHECK (type IN ('youtube', 'podcast')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  transcription TEXT,
  partial_chunks JSONB DEFAULT '[]', -- Store information about processed chunks
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Content Plans (Content OS)
CREATE TABLE IF NOT EXISTS public.content_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  plan_data JSONB NOT NULL DEFAULT '[]',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Audience Inbox
CREATE TABLE IF NOT EXISTS public.audience_inbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  external_id TEXT NOT NULL,
  sender_name TEXT,
  sender_handle TEXT,
  message_content TEXT,
  received_at TIMESTAMPTZ NOT NULL,
  ai_suggested_reply TEXT,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform, external_id)
);

-- 5. Competitors
CREATE TABLE IF NOT EXISTS public.competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  handle TEXT NOT NULL,
  platform TEXT NOT NULL,
  avatar_url TEXT,
  stats JSONB DEFAULT '{}',
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Hook Library
CREATE TABLE IF NOT EXISTS public.hook_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hook_type TEXT NOT NULL,
  platform TEXT NOT NULL,
  niche TEXT NOT NULL,
  language TEXT NOT NULL, -- English, Hinglish
  hook_text TEXT NOT NULL,
  description TEXT,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Hook A/B Tests
CREATE TABLE IF NOT EXISTS public.ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  hook_a TEXT NOT NULL,
  hook_b TEXT NOT NULL,
  platform TEXT NOT NULL,
  winner TEXT CHECK (winner IN ('A', 'B')),
  stats JSONB DEFAULT '{"A": {"clicks": 0, "views": 0}, "B": {"clicks": 0, "views": 0}}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 8. Monetisation Ideas
CREATE TABLE IF NOT EXISTS public.monetisation_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  snippet_id UUID REFERENCES public.snippets(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  description TEXT,
  strategy TEXT, -- Course, Affiliate, Digital Product, etc.
  estimated_revenue TEXT,
  links JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Cron Logs
CREATE TABLE IF NOT EXISTS public.cron_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cron_name text NOT NULL,
  status text CHECK (status IN ('success','partial','failed')),
  users_processed int DEFAULT 0,
  errors jsonb,
  duration_ms int,
  ran_at timestamptz DEFAULT now()
);

-- RLS Policies for new tables
ALTER TABLE public.voice_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repurpose_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audience_inbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hook_library ENABLE ROW LEVEL SECURITY; -- Public read, admin write
ALTER TABLE public.ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monetisation_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cron_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access own voice fingerprints" ON public.voice_fingerprints FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own repurpose jobs" ON public.repurpose_jobs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own content plans" ON public.content_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own audience inbox" ON public.audience_inbox FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own competitors" ON public.competitors FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public hook library access" ON public.hook_library FOR SELECT USING (true);
CREATE POLICY "Users access own AB tests" ON public.ab_tests FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own monetisation ideas" ON public.monetisation_ideas FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admin access cron logs" ON public.cron_logs FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_voice_fingerprints_updated_at BEFORE UPDATE ON public.voice_fingerprints FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_repurpose_jobs_updated_at BEFORE UPDATE ON public.repurpose_jobs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_content_plans_updated_at BEFORE UPDATE ON public.content_plans FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
