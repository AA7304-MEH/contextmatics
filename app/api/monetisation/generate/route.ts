export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { generateText } from '@/lib/ai/providers';
import { logger } from '@/lib/logger';

async function monetisationGenerateHandler(req: NextRequest, { user, deductCredits }: AuthContext) {
  const route = '/api/monetisation/generate';

  const { content, format } = await req.json();

  if (!content) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  const prompt = `
    As a monetization expert, analyze this ${format || 'content'} and suggest 3 specific digital products or services the creator could sell to their audience based on this topic.

    Content:
    "${content}"

    Return a JSON object with a field "ideas" which is an array of 3 objects. Each object should have:
    - product_name (catchy name)
    - strategy (one of: Course, Coaching, Digital Product, Affiliate, Subscription, Service)
    - description (how it helps the audience, 1 sentence)
    - estimated_revenue (e.g., "$50 - $200 per sale")

    Ensure the output is valid JSON.
  `;

  try {
    const text = await generateText({
      routeType: 'monetise',
      prompt,
      jsonMode: true,
    });

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI failed to generate monetisation ideas');
    }

    await deductCredits();

    const data = JSON.parse(jsonMatch[0]);
    logger.info({ route, message: `Generated ${data.ideas?.length || 0} inspiration ideas`, userId: user.id });
    return NextResponse.json(data);

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to generate monetisation ideas';
    logger.error({ route, message: msg, userId: user.id });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export const POST = withAuthAndCredits(monetisationGenerateHandler, {
  requirePlan: 'pro',
  requireCredits: 5,
  rateLimit: 10,
  rateLimitWindow: '3600 s',
  actionName: 'Generate Monetisation Ideas',
});
