export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext, ApiHandler } from '@/lib/api-utils';
import { generateText } from '@/lib/ai/providers';
import { logger } from '@/lib/logger';
import { buildEnhancedSystemPrompt } from '@/lib/ai/withVoiceFingerprint';
import { MonetisationAsset, Profile } from '@/types/database';

async function generateOfferHandler(req: NextRequest, { user, supabase, deductCredits }: AuthContext) {
    try {
        const { productIdea, targetPrice } = await req.json();

        if (!productIdea) {
            return NextResponse.json({ success: false, code: 'INVALID_INPUT', message: 'Product idea is required' }, { status: 400 });
        }

        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        const profile = profileData as Profile;

        const basePrompt = `
            You are a World-Class Direct Response Copywriter. Create a high-converting offer structure for: "${productIdea}".
            Target Price Point: ${targetPrice || 'Dynamic'}
            
            Return ONLY a JSON object with:
            - title: Catchy product name.
            - price: Structured price.
            - deliverables: Array of 3 key features.
            - bonus: A high-value bonus.
            - guarantee: A risk-reversal statement.
            - scarcity: A reason to act now.
            - strategy: One of (Course, Affiliate, Digital Product, Coaching).
            - estimated_revenue: Projected monthly or per-unit revenue.
        `;

        const systemPrompt = buildEnhancedSystemPrompt(
            basePrompt,
            profile?.brand_voice || null,
            profile?.preferred_language || 'english'
        );

        const text = await generateText({
            routeType: 'monetise',
            prompt: systemPrompt,
            jsonMode: true,
        });

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
            throw new Error("AI failed to generate a structured offer.");
        }

        const offer = JSON.parse(jsonMatch[0]);

        // Save to monetisation_assets
        const { data: savedOffer, error: saveError } = await supabase
            .from('monetisation_assets')
            .insert({
                user_id: user.id,
                asset_type: 'product_description',
                title: offer.title,
                content: offer,
                status: 'generated'
            })
            .select()
            .single();

        if (saveError) throw saveError;

        // Deduct Credits
        await deductCredits();

        return NextResponse.json({ success: true, data: savedOffer as MonetisationAsset }, { status: 200 });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Offer generation failed', { userId: user.id, error: errorMessage });
        return NextResponse.json({ success: false, code: 'OFFER_FAILED', message: errorMessage }, { status: 500 });
    }
}

export const POST = withAuthAndCredits(generateOfferHandler as ApiHandler, {
    requireCredits: 5,
    actionName: 'Generate Monetisation Offer'
});
