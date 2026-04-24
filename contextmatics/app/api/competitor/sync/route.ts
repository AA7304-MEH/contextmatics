export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

interface AyrsharePost {
  id: string;
  postText: string;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  createdAt?: string;
}

async function competitorSyncHandler(req: NextRequest, { user, supabase }: AuthContext) {
  const route = '/api/competitor/sync';
  const { competitorId } = await req.json();

  if (!competitorId) {
    return NextResponse.json({ error: 'Competitor ID is required' }, { status: 400 });
  }

  // Fetch competitor details
  const { data: competitor, error: compError } = await supabase
    .from('competitors')
    .select('*')
    .eq('id', competitorId)
    .single();

  if (compError || !competitor) {
    return NextResponse.json({ error: 'Competitor not found' }, { status: 404 });
  }

  const platform = competitor.platform as string;
  const handle = (competitor.handle || competitor.username || '') as string;

  if (!handle) {
    return NextResponse.json({ error: 'Competitor has no handle configured' }, { status: 400 });
  }

  try {
    // Attempt real Ayrshare analytics fetch
    const ayrshareResponse = await fetch(
      `https://app.ayrshare.com/api/analytics/post?platform=${platform}&handle=${handle}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AYRSHARE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!ayrshareResponse.ok) {
      logger.warn({ route, message: 'Ayrshare competitor fetch unavailable', userId: user.id, data: { platform, handle } });
      return NextResponse.json({
        success: true,
        mode: 'manual',
        message: 'Automatic competitor sync unavailable for this platform. Use manual paste mode.',
        posts: [],
      });
    }

    const ayrshareData = await ayrshareResponse.json() as { posts?: AyrsharePost[] };
    const posts: AyrsharePost[] = ayrshareData.posts ?? [];

    // Upsert posts into DB and compute stats
    let totalLikes = 0;
    let totalComments = 0;

    for (const post of posts) {
      const likes = post.likeCount ?? 0;
      const comments = post.commentCount ?? 0;

      await supabase.from('competitor_posts').upsert({
        competitor_id: competitor.id,
        user_id: user.id,
        platform: competitor.platform,
        post_id: post.id,
        content: post.postText,
        likes,
        comments,
        posted_at: post.createdAt ?? new Date().toISOString(),
      }, { onConflict: 'platform, post_id' });

      totalLikes += likes;
      totalComments += comments;
    }

    const avgEngagement = posts.length > 0 ? (totalLikes + totalComments) / posts.length : 0;

    await supabase.from('competitors').update({
      stats: {
        avg_likes: posts.length > 0 ? totalLikes / posts.length : 0,
        avg_comments: posts.length > 0 ? totalComments / posts.length : 0,
        engagement_rate: avgEngagement,
      },
      last_sync_at: new Date().toISOString(),
    }).eq('id', competitorId);

    logger.info({ route, message: `Synced ${posts.length} posts for ${handle}`, userId: user.id });

    return NextResponse.json({ success: true, count: posts.length, mode: 'live' });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    logger.error({ route, message: msg, userId: user.id });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export const POST = withAuthAndCredits(competitorSyncHandler, {
  requirePlan: 'business',
  requireCredits: 0,
  rateLimit: 5,
  rateLimitWindow: '3600 s',
  actionName: 'Competitor Intelligence Sync',
});
