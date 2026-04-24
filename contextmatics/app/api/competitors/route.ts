import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { generateText } from '@/lib/ai/providers';
import { logger, apiError } from '@/lib/logger';

async function competitorHandler(request: NextRequest, { user, supabase, deductCredits }: AuthContext) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'analyze') {
      const { competitorHandle, platform } = await request.json();

      if (!competitorHandle) return apiError('Handle required', 'INVALID_INPUT', 400);

      const prompt = `
Perform a strategic intelligence analysis of this competitor creator.
HANDLE: ${competitorHandle}
PLATFORM: ${platform}

Return ONLY a valid JSON object with these exact keys:
{
  "strengths": ["s1", "s2"],
  "content_strategy": "short desc",
  "hook_patterns": ["p1", "p2"],
  "estimated_engagement": "high/med/low",
  "monetization_clues": ["clue1", "clue2"],
  "opportunity": "one sentence on how to beat them"
}
      `;

      const text = await generateText({
        routeType: 'competitor_analyse',
        prompt,
        jsonMode: true,
      });

      const analysis = JSON.parse(text);

      // Store in DB
      const { data: competitor, error: insertError } = await supabase
        .from('competitors')
        .insert({
          user_id: user.id,
          handle: competitorHandle,
          platform,
          analysis_data: analysis,
          last_analyzed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Deduct 5 credits
      await deductCredits();

      return NextResponse.json({ success: true, analysis, competitor });
    }

    // Default: List tracked competitors
    const { data: competitors, error } = await supabase
      .from('competitors')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: competitors });

  } catch (error:any) {
    logger.error('competitor intelligence failed', { userId: user.id, error: error.message });
    return apiError('Competitor analysis failed', 'COMPETITOR_FAILED', 500);
  }
}

export const GET = withAuthAndCredits(competitorHandler, { actionName: 'competitor-list' });
export const POST = withAuthAndCredits(competitorHandler, { requireCredits: 5, actionName: 'competitor-analyze' });
