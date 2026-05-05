export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { generateText } from '@/lib/ai/providers';
import { logger } from '@/lib/logger';
import { buildEnhancedSystemPrompt } from '@/lib/ai/withVoiceFingerprint';
import { Profile } from '@/types/database';

async function competitorInspireHandler(req: NextRequest, { user, supabase, deductCredits }: AuthContext) {
  const route = '/api/competitor/inspire';

  try {
    const { competitorId, platform } = await req.json();

    if (!competitorId) {
      return NextResponse.json({ error: 'competitorId is required' }, { status: 400 });
    }

    // Fetch the competitor's top posts from DB
    const { data: posts, error: postsError } = await supabase
      .from('competitor_posts')
      .select('content, likes, comments')
      .eq('competitor_id', competitorId)
      .order('likes', { ascending: false })
      .limit(5);

    if (postsError) throw postsError;

    if (!posts || posts.length === 0) {
      return NextResponse.json({
        success: false,
        code: 'NO_POSTS',
        message: 'No competitor posts found. Run a sync first.',
      }, { status: 404 });
    }

    // Fetch user profile for voice fingerprint
    const { data: profileData } = await supabase
      .from('profiles')
      .select('brand_voice, preferred_language, niche')
      .eq('id', user.id)
      .single();

    const profile = profileData as Profile | null;

    const topPostsSummary = posts
      .map((p, i) => `Post ${i + 1} (${p.likes} likes, ${p.comments} comments):\n"${p.content}"`)
      .join('\n\n');

    const basePrompt = `
You are an expert content strategist. A creator wants inspiration from their competitor's top-performing posts.

Here are the competitor's best posts:
${topPostsSummary}

Generate 3 original content ideas INSPIRED BY (not copied from) these posts. Tailor them for ${platform || 'LinkedIn'}.

For each idea return:
- hook: A compelling opening line
- angle: The strategic angle (e.g., "Personal Story", "Controversial Take", "Data-Driven")  
- outline: 2-3 sentence content outline
- why_it_works: One sentence explaining why this will resonate

Return ONLY a valid JSON array of 3 objects with fields: hook, angle, outline, why_it_works.
    `;

    const systemPrompt = buildEnhancedSystemPrompt(
      basePrompt,
      profile?.brand_voice ?? null,
      profile?.preferred_language ?? 'english'
    );

    const text = await generateText({
      routeType: 'social_post',
      prompt: systemPrompt,
      jsonMode: true,
    });

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('AI failed to generate inspiration ideas');
    }

    const ideas = JSON.parse(jsonMatch[0]);

    await deductCredits();

    logger.info({ route, message: `Generated ${ideas.length} inspiration ideas`, userId: user.id, data: { competitorId } });

    return NextResponse.json({ success: true, data: ideas });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    logger.error({ route, message: msg, userId: user.id });
    return NextResponse.json({ success: false, code: 'INSPIRE_FAILED', message: msg }, { status: 500 });
  }
}

export const POST = withAuthAndCredits(competitorInspireHandler, {
  requirePlan: 'pro',
  requireCredits: 1,
  rateLimit: 20,
  rateLimitWindow: '3600 s',
  actionName: 'Competitor Intelligence Inspire',
});
