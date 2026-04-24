import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext, ApiHandler } from '@/lib/api-utils';
import { videoScriptCore } from '@/lib/ai/video-script-core';
import { logger } from '@/lib/logger';

async function facelessGenerateHandler(req: NextRequest, { user, supabase, deductCredits }: AuthContext) {
    try {
        const body = await req.json();
        const { topic, style, purpose, voice, platform, duration, themeId } = body;

        if (!topic && !themeId) {
            return NextResponse.json({ success: false, code: 'INVALID_INPUT', message: 'Topic or Theme is required' }, { status: 400 });
        }

        // 1. Generate the script
        // For now, we always use AI generation fallback if themeId logic is not fully implemented in services
        const aiScript = await videoScriptCore(topic || 'Custom Topic', style || 'cinematic', purpose || 'entertainment', duration || 15);
        
        const script = {
            title: aiScript.title || `Faceless: ${topic}`,
            scenes: aiScript.scenes || [],
            keyPoints: aiScript.keyPoints || [],
            voiceTone: voice,
            platforms: [platform || 'TikTok']
        };

        // 2. Create a Project
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .insert({
                user_id: user.id,
                title: script.title,
                status: 'ready',
                thumbnail_url: null,
                timeline_data: {
                    script: script,
                    scenes: script.scenes,
                    voice: voice,
                    platform: platform,
                    duration: duration,
                    isFaceless: true
                }
            })
            .select()
            .single();

        if (projectError) throw projectError;

        // 3. Deduct credits (Faceless generation is premium)
        await deductCredits();

        // 4. Create a History Entry (Snippet)
        await supabase.from('snippets').insert({
            user_id: user.id,
            title: script.title,
            content: JSON.stringify(script.scenes),
            platform: platform || 'general',
            content_type: 'faceless-script',
            language: 'english',
            credits_used: 0
        });

        return NextResponse.json({ 
            success: true, 
            data: {
                projectId: project.id,
                script: script 
            }
        }, { status: 200 });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('[Faceless Generate Error]:', { userId: user.id, error: errorMessage });
        return NextResponse.json({ success: false, code: 'GENERATION_FAILED', message: errorMessage }, { status: 500 });
    }
}

export const POST = withAuthAndCredits(facelessGenerateHandler as ApiHandler, { 
    requireCredits: 5, 
    actionName: 'Faceless Video Generation' 
});
