import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { generateText } from '@/lib/ai/providers';
import { logger, apiError } from '@/lib/logger';

async function generatePlanHandler(request: NextRequest, { user, supabase, deductCredits }: AuthContext) {
  try {
    const { niche, goals, platforms } = await request.json();

    if (!niche || !goals || !platforms || !Array.isArray(platforms)) {
      return apiError('Missing required fields', 'INVALID_INPUT', 400);
    }

    // 1. Fetch Active Voice Fingerprint
    const { data: activeFP } = await supabase
      .from('voice_fingerprints')
      .select('fingerprint_data')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    const prompt = `
Generate a high-performance 7-day content strategy for a creator in the ${niche} niche.
GOALS: ${goals}
PLATFORMS: ${platforms.join(', ')}

${activeFP ? `VOICE FINGERPRINT:\n${JSON.stringify(activeFP.fingerprint_data, null, 2)}` : 'Tone: Professional & Expert'}

For each day (1-7), provide:
1. Day number
2. Primary Platform
3. Core Concept
4. Viral Hook Idea
5. Suggested Visual/Media description

Return the result as a valid JSON array of objects:
[
  {
    "day": 1,
    "platform": "string",
    "concept": "string",
    "hook": "string",
    "visual": "string"
  },
  ...
]
    `;

    const text = await generateText({
      routeType: 'content_plan',
      prompt,
      jsonMode: true,
    });
    
    // Extract JSON
    let jsonString = text;
    if (text.includes('```json')) {
      jsonString = text.split('```json')[1].split('```')[0].trim();
    } else if (text.includes('```')) {
      jsonString = text.split('```')[1].split('```')[0].trim();
    }

    const planData = JSON.parse(jsonString);

    // 2. Store in DB
    const { data: insertedPlan, error: insertError } = await supabase
      .from('content_plans')
      .insert({
        user_id: user.id,
        status: 'active',
        plan_data: {
          niche,
          goals,
          platforms,
          schedule: planData
        }
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Deduct 5 credits
    await deductCredits();

    return NextResponse.json({ success: true, data: insertedPlan });

  } catch (error) {
    logger.error('content-os plan generation failed', { userId: user.id, error });
    return apiError('Failed to generate content plan', 'PLAN_FAILED', 500);
  }
}

export const POST = withAuthAndCredits(generatePlanHandler, {
  requireCredits: 5,
  actionName: 'content-os-generate'
});
