export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  username: string | null;
  plan: 'free' | 'pro' | 'business' | 'enterprise';
  plan_expires_at: string | null;
  credits_remaining: number;
  role: 'user' | 'admin';
  niche: string | null;
  brand_voice: string | null;
  brand_description: string | null;
  preferred_language: string;
  secondary_languages: string[];
  onboarding_completed: boolean;
  content_os_enabled: boolean;
  posting_days: string[];
  best_posting_times: Record<string, string> | null;
  referral_code: string;
  referred_by: string | null;
  referral_credits_earned: number;
  razorpay_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface VoiceFingerprint {
  id: string;
  user_id: string;
  fingerprint: Record<string, unknown>;
  generation_instructions: string;
  voice_score: number;
  samples_count: number;
  analyzed_at: string;
}

export interface Snippet {
  id: string;
  user_id: string;
  workspace_id: string | null;
  title: string | null;
  content: string;
  platform: string | null;
  content_type: string | null;
  language: string;
  tags: string[];
  source: string | null;
  credits_used: number;
  created_at: string;
}

export interface ScheduledPost {
  id: string;
  user_id: string;
  workspace_id: string | null;
  content: string;
  platforms: string[];
  scheduled_at: string;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'scheduled' | 'published';
  post_ids: Record<string, string> | null;
  rejection_note: string | null;
  created_at: string;
}

export interface ContentPlan {
  id: string;
  user_id: string;
  week_start: string;
  plan: ContentPlanPost[];
  status: 'pending' | 'approved' | 'scheduled';
  created_at: string;
}

export interface ContentPlanPost {
  day: string;
  time: string;
  platform: string;
  content_type: string;
  topic: string;
  hook: string;
  full_content: string;
  hashtags: string[];
  estimated_engagement_score: number;
  reasoning: string;
}

export interface RepurposeJob {
  id: string;
  user_id: string;
  source_type: 'youtube' | 'podcast' | 'upload' | 'voice_memo' | 'url' | 'text';
  source_url: string | null;
  source_title: string | null;
  transcript: string | null;
  status: 'processing' | 'transcribed' | 'generating' | 'complete' | 'failed' | 'partial';
  outputs: Record<string, string> | null;
  credits_used: number;
  created_at: string;
}

export interface SocialInboxItem {
  id: string;
  user_id: string;
  platform: string;
  comment_id: string;
  post_id: string | null;
  post_content: string | null;
  commenter_handle: string | null;
  commenter_followers: number;
  comment_text: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'question' | 'opportunity' | null;
  priority: 'high' | 'normal' | 'low';
  status: 'unread' | 'read' | 'replied' | 'ignored';
  ai_replies: AiReply[] | null;
  replied_at: string | null;
  created_at: string;
}

export interface AiReply {
  style: 'short_warm' | 'detailed_helpful' | 'engaging_question';
  text: string;
}

export interface TrackedCompetitor {
  id: string;
  user_id: string;
  platform: string;
  handle: string;
  display_name: string | null;
  follower_count: number | null;
  last_synced_at: string | null;
  created_at: string;
}

export interface HookLibraryItem {
  id: string;
  hook_template: string;
  hook_type: 'question' | 'statement' | 'controversial' | 'story' | 'data' | 'curiosity' | 'fear' | 'aspiration';
  platform: string | null;
  niche: string | null;
  language: string;
  usage_count: number;
  created_at: string;
}

export interface MonetisationAsset {
  id: string;
  user_id: string;
  asset_type: 'lead_magnet' | 'email_sequence' | 'product_description' | 'landing_page' | 'mini_course_outline' | 'newsletter_issue' | 'paid_community_post';
  title: string;
  content: Record<string, unknown>;
  source_content: string | null;
  status: string;
  created_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  plan: string;
  ayrshare_profile_key: string | null;
  brand_voice: string | null;
  brand_description: string | null;
  created_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  invited_email: string | null;
  status: 'pending' | 'active';
  created_at: string;
}
