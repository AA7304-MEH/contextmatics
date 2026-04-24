export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext, ApiHandler } from '@/lib/api-utils';
import { generateText } from '@/lib/ai/providers';
import { logger } from '@/lib/logger';
import { buildEnhancedSystemPrompt } from '@/lib/ai/withVoiceFingerprint';
import { Profile, SocialInboxItem } from '@/types/database';

interface AyrshareComment {
  id: string;
  platform: string;
  text: string;
  username: string;
  postId?: string;
  createdAt?: string;
}

async function inboxSyncHandler(_req: NextRequest, { user, supabase }: AuthContext) {
  const route = '/api/inbox/sync';

  try {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const profile = profileData as Profile;

    // Fetch real comments from Ayrshare
    const response = await fetch('https://app.ayrshare.com/api/comments', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.AYRSHARE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      logger.warn({ route, message: 'Ayrshare comments fetch failed', userId: user.id });
      return NextResponse.json({ success: true, synced: 0, message: 'No connected accounts or Ayrshare unavailable' });
    }

    const body = await response.json() as { comments?: AyrshareComment[] };
    const comments: AyrshareComment[] = body.comments ?? [];

    const syncedItems: SocialInboxItem[] = [];

    for (const comment of comments) {
      // Skip if already exists
      const { data: existing } = await supabase
        .from('social_inbox')
        .select('id')
        .eq('user_id', user.id)
        .eq('comment_id', comment.id)
        .maybeSingle();

      if (!existing) {
        const basePrompt = `Generate a 1-sentence contextual reply to this comment: "${comment.text}" from ${comment.username}. Keep it engaging and high-value.`;
        const systemPrompt = buildEnhancedSystemPrompt(
          basePrompt,
          profile?.brand_voice ?? null,
          profile?.preferred_language ?? 'english'
        );

        const aiReply = await generateText({
          routeType: 'reply_suggest',
          prompt: systemPrompt,
        });

        const { data: newItem, error: insertError } = await supabase
          .from('social_inbox')
          .insert({
            user_id: user.id,
            platform: comment.platform,
            comment_id: comment.id,
            comment_text: comment.text,
            commenter_handle: comment.username,
            priority: 'normal',
            status: 'unread',
            ai_replies: [{ style: 'short_warm', text: aiReply.trim() }],
          })
          .select()
          .single();

        if (insertError) throw insertError;
        if (newItem) syncedItems.push(newItem as SocialInboxItem);
      }
    }

    logger.info({ route, message: `Synced ${syncedItems.length} new inbox items`, userId: user.id });

    return NextResponse.json({
      success: true,
      data: { count: syncedItems.length, items: syncedItems },
    }, { status: 200 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Inbox sync failed', { userId: user.id, error: errorMessage });
    return NextResponse.json({ success: false, code: 'SYNC_FAILED', message: errorMessage }, { status: 500 });
  }
}

export const POST = withAuthAndCredits(inboxSyncHandler as ApiHandler, {
  requireCredits: 0,
  rateLimit: 10,
  rateLimitWindow: '3600 s',
  actionName: 'Audience Inbox Sync',
});
