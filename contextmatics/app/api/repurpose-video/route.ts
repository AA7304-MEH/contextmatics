import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { generateVideo } from '@/lib/ai/providers';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

async function repurposeVideoHandler(req: NextRequest, { user, supabase, deductCredits }: AuthContext) {
    const route = '/api/repurpose-video';
    try {
        const { script } = await req.json();

        if (!script) {
            return NextResponse.json({ error: 'Script is required' }, { status: 400 });
        }

        const prompt = `Vertical cinematic video illustrating this script: ${script}. High quality, photorealistic, cinematic lighting.`;

        const videoUrl = await generateVideo(prompt);

        // Deduct credits after successful AI call
        await deductCredits();

        // Save to media_items
        const { data, error } = await supabase
            .from('media_items')
            .insert({
                user_id: user.id,
                type: 'video',
                prompt: script.substring(0, 100) + '...', 
                url: videoUrl,
                metadata: { script, isRepurpose: true }
            })
            .select()
            .single();

        if (error) {
            logger.error({ route, message: 'Error saving media item', userId: user.id, data: { error: error.message } });
        }

        logger.info({ route, message: 'Video repurpose complete', userId: user.id });

        return NextResponse.json({ url: videoUrl, item: data });
    } catch (error: any) {
        const msg = error instanceof Error ? error.message : 'Failed to repurpose video';
        logger.error({ route, message: msg, userId: user.id });
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

export const POST = withAuthAndCredits(repurposeVideoHandler, {
    requireCredits: 15,
    actionName: 'Repurpose Media'
});
