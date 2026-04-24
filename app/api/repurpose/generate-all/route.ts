export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { generateText } from '@/lib/ai/providers';
import { logger } from '@/lib/logger';

async function generateAllHandler(req: NextRequest, { user, supabase, deductCredits }: AuthContext) {
  const route = '/api/repurpose/generate-all';

  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const generateForPlatform = async (promptSnippet: string) => {
      const fullPrompt = `${promptSnippet}\n\nContent Source:\n${content.substring(0, 10000)}`;
      return generateText({
        routeType: 'repurpose',
        prompt: fullPrompt,
      });
    };

    // Parallel extraction across 3 platforms
    const [twitter, linkedin, newsletter] = await Promise.all([
      generateForPlatform('Repurpose the following content into a viral Twitter/X thread. Maximum 5-6 tweets. Number them. Use a catchy hook.'),
      generateForPlatform('Repurpose the following content into a highly engaging LinkedIn post. Use good formatting, a hook, and clear professional takeaways. Add line breaks.'),
      generateForPlatform('Repurpose the following content into a high-value Email Newsletter. Subject line first, then an engaging body that summarizes the key value.'),
    ]);

    await deductCredits();

    // Save to snippets silently — non-blocking
    await Promise.all([
      supabase.from('snippets').insert({ user_id: user.id, content: twitter, platform: 'Twitter', type: 'text', title: 'Viral Thread' }),
      supabase.from('snippets').insert({ user_id: user.id, content: linkedin, platform: 'LinkedIn', type: 'text', title: 'LinkedIn Post' }),
      supabase.from('snippets').insert({ user_id: user.id, content: newsletter, platform: 'Email', type: 'text', title: 'Newsletter' }),
    ]);

    logger.info({ route, message: 'Parallel repurpose complete', userId: user.id });

    return NextResponse.json({ twitter, linkedin, newsletter });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Generation failed';
    logger.error({ route, message: msg, userId: user.id });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export const POST = withAuthAndCredits(generateAllHandler, {
  requirePlan: 'pro',
  requireCredits: 3,
  rateLimit: 10,
  rateLimitWindow: '3600 s',
  actionName: 'Repurpose Parallel',
});
