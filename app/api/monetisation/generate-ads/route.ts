import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext, ApiHandler } from '@/lib/api-utils';
import { generateText } from '@/lib/ai/providers';
import { logger } from '@/lib/logger';
import { buildEnhancedSystemPrompt } from '@/lib/ai/withVoiceFingerprint';
import { MonetisationAsset, Profile } from '@/types/database';

async function generateAdsHandler(req: NextRequest, { user, supabase, deductCredits }: AuthContext) {
    try {
        const { assetId } = await req.json();

        if (!assetId) {
            return NextResponse.json({ 
                success: false, 
                code: 'INVALID_INPUT', 
                message: 'Asset ID is required' 
            }, { status: 400 });
        }

        const { data: assetData } = await supabase
            .from('monetisation_assets')
            .select('*')
            .eq('id', assetId)
            .eq('user_id', user.id)
            .single();

        if (!assetData) {
             return NextResponse.json({ success: false, code: 'NOT_FOUND', message: 'Asset not found' }, { status: 404 });
        }

        const asset = assetData as MonetisationAsset;

        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        const profile = profileData as Profile;

        const basePrompt = `
            Generate high-converting ad copy for this offer: "${asset.title}".
            Offer Details: ${JSON.stringify(asset.content)}
            
            Return ONLY a JSON object with:
            - facebook: Ad copy with emojis.
            - twitter: A punchy thread starter ad.
            - linkedin: Professional authority-building ad.
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
            throw new Error("AI failed to generate structured ads.");
        }

        const ads = JSON.parse(jsonMatch[0]);

        // Save as new assets or update? Standardizing on saving as new assets linked to source
        const { data: savedAds, error: saveError } = await supabase
            .from('monetisation_assets')
            .insert({
                user_id: user.id,
                asset_type: 'product_description', // or 'ad_copy' if added to enum
                title: `Ads: ${asset.title}`,
                content: ads,
                source_content: asset.id,
                status: 'generated'
            })
            .select()
            .single();

        if (saveError) throw saveError;

        // Deduct Credits
        await deductCredits();

        return NextResponse.json({ success: true, data: savedAds as MonetisationAsset }, { status: 200 });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Ad generation failed', { userId: user.id, error: errorMessage });
        return NextResponse.json({ 
            success: false, 
            code: 'ADS_FAILED', 
            message: errorMessage 
        }, { status: 500 });
    }
}

export const POST = withAuthAndCredits(generateAdsHandler as ApiHandler, {
    requireCredits: 3,
    actionName: 'Generate Ad Copy'
});
