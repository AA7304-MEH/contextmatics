import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { generateText } from '@/lib/ai/providers';
import { logger } from '@/lib/logger';
import { Profile, Snippet } from '@/types/database';

async function monetisationHandler(request: NextRequest, { user, supabase, deductCredits }: AuthContext) {
  try {
    const body = await request.json().catch(() => ({ action: 'list' }));
    const { action } = body;

    if (action === 'analyze') {
      // 1. Fetch User Data (Niche, Recent Snippets)
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      const { data: snippetsData } = await supabase.from('snippets').select('*').eq('user_id', user.id).limit(5);

      const profile = profileData as Profile;
      const snippets = (snippetsData || []) as Snippet[];

      const context = `Niche: ${profile.niche || 'Unknown'}. Brand: ${profile.brand_description || 'Unknown'}. Recent Content: ${snippets.map(s => s.content).join('\n\n')}`;

      const prompt = `
Generate 3 high-ROI monetization ideas based on this creator's profile and content.
CONTEXT: ${context}

For each idea, provide:
1. Title
2. Business Model (e.g. Digital product, Coaching, Membership, Affiliate)
3. Difficulty (1-5)
4. Potential Revenue Range
5. The "Irresistible Offer" structure (what they actually sell)

Also, create an A/B Test for their main product:
- Variant A: Logical/Benefit-driven pitch
- Variant B: Emotional/FOMO-driven pitch

Return ONLY a valid JSON object:
{
  "ideas": [
    { "title": "...", "model": "...", "difficulty": 0, "revenue": "...", "offer": "..." }
  ],
  "ab_test": {
    "product": "Recommended Main Product",
    "variant_a": "...",
    "variant_b": "..."
  }
}
      `;

      const text = await generateText({
        routeType: 'monetise',
        prompt,
        jsonMode: true,
      });

      const data = JSON.parse(text.replace(/```json/g, '').replace(/```/g, ''));

      // Store ideas
      for (const idea of data.ideas) {
        await supabase.from('monetisation_assets').insert({
          user_id: user.id,
          title: idea.title,
          asset_type: 'product_description',
          content: idea,
          status: 'generated'
        });
      }

      // Store A/B Test
      await supabase.from('ab_tests').insert({
        user_id: user.id,
        test_name: `Main Offer Test - ${new Date().toLocaleDateString()}`,
        hypothesis: "Testing Logical vs Emotional messaging for the main product.",
        variant_a: data.ab_test.variant_a,
        variant_b: data.ab_test.variant_b,
        status: 'draft'
      });

      // Deduct 10 credits
      await deductCredits();

      return NextResponse.json({ success: true, data }, { status: 200 });
    }

    // Default: List existing ideas
    const { data: ideas } = await supabase.from('monetisation_assets').select('*').eq('user_id', user.id);
    const { data: tests } = await supabase.from('ab_tests').select('*').eq('user_id', user.id);

    return NextResponse.json({ success: true, data: { ideas, tests } }, { status: 200 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('monetisation analyzer failed', { userId: user.id, error: errorMessage });
    return NextResponse.json({ success: false, code: 'MONETISATION_FAILED', message: errorMessage }, { status: 500 });
  }
}

// Wrapping shared handler for both GET and POST with different credits
export const GET = withAuthAndCredits(monetisationHandler, { actionName: 'monetisation-list' });
export const POST = withAuthAndCredits(monetisationHandler, { requireCredits: 10, actionName: 'monetisation-analyze' });
