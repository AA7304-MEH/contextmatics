export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { generateText } from '@/lib/ai/providers';
import { logger, apiError } from '@/lib/logger';
import { buildEnhancedSystemPrompt } from '@/lib/ai/withVoiceFingerprint';

async function abTestGenerateHandler(req: NextRequest, { user, supabase, deductCredits }: AuthContext) {
    const route = '/api/ab-test/generate';
    
    try {
        const { baseContent, platforms } = await req.json();

        if (!baseContent) {
            return NextResponse.json({ 
                success: false, 
                code: 'INVALID_INPUT', 
                message: 'Base content is required' 
            }, { status: 400 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('voice_fingerprint')
            .eq('id', user.id)
            .single();

        const basePrompt = `
            Create 2 distinct A/B test variants for this content: "${baseContent}".
            Variant A: Focus on Logical Benefit / Gain.
            Variant B: Focus on Emotional Impact / Curiosity / FOMO.
            
            Return ONLY a JSON object with:
            - variant_a: { hook: string, body: string, angle: "Logic" }
            - variant_b: { hook: string, body: string, angle: "Emotion" }
        `;

        const systemPrompt = buildEnhancedSystemPrompt(
            basePrompt,
            profile?.voice_fingerprint ? JSON.stringify(profile.voice_fingerprint) : null,
        );

        const text = await generateText({
            routeType: 'social_post',
            prompt: systemPrompt,
            jsonMode: true,
        });

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
            throw new Error("AI failed to generate A/B variants.");
        }

        const variants = JSON.parse(jsonMatch[0]);

        // Save to DB
        const { data: testRecord, error: saveError } = await supabase
            .from('ab_tests')
            .insert({
                user_id: user.id,
                title: `A/B Test: ${baseContent.substring(0, 30)}...`,
                hook_a: variants.variant_a.hook,
                hook_b: variants.variant_b.hook,
                platform: platforms?.[0] || 'twitter',
                stats: { 
                    A: { angle: variants.variant_a.angle, content: variants.variant_a.body },
                    B: { angle: variants.variant_b.angle, content: variants.variant_b.body }
                }
            })
            .select()
            .single();

        if (saveError) throw saveError;

        // Deduct Credits
        await deductCredits();

        return NextResponse.json({ success: true, test: testRecord });

    } catch (error:any) {
        logger.error({ 
            route, 
            userId: user.id, 
            message: error instanceof Error ? error.message : 'Unknown error' 
        });
        return apiError(error.message || 'Failed to generate variants', 'AB_TEST_FAILED', 500);
    }
}

export const POST = withAuthAndCredits(abTestGenerateHandler, {
    requirePlan: 'business',
    requireCredits: 3,
    rateLimit: 5,
    rateLimitWindow: '3600 s',
    actionName: 'Generate A/B Test Variants'
});
