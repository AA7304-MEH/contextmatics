-- Referral system
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code text UNIQUE DEFAULT substring(md5(random()::text), 1, 8);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES profiles(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_credits_earned int DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan_expires_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS niche text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS brand_voice text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS brand_description text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

CREATE TABLE IF NOT EXISTS referrals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id uuid REFERENCES profiles(id),
  referred_id uuid REFERENCES profiles(id),
  status text DEFAULT 'pending' CHECK (status IN ('pending','completed')),
  credits_awarded int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own referrals" ON referrals FOR ALL USING (auth.uid() = referrer_id);

-- Workspaces
CREATE TABLE IF NOT EXISTS workspaces (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  owner_id uuid REFERENCES auth.users(id),
  plan text DEFAULT 'agency',
  ayrshare_profile_key text,
  brand_voice text,
  brand_description text,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS workspace_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'editor' CHECK (role IN ('owner','admin','editor','viewer')),
  invited_email text,
  status text DEFAULT 'pending' CHECK (status IN ('pending','active')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(workspace_id, user_id)
);
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members access workspace" ON workspaces FOR ALL USING (
  id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
);

-- Scheduled posts
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id uuid REFERENCES workspaces(id),
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
