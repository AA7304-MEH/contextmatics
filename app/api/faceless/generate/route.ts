import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits } from '@/lib/api-utils';
import { videoScriptCore } from '@/app/api/ai/video-script/route';
import { generateFacelessScript } from '@/services/facelessGenerator';

async function facelessGenerateHandler(req: NextRequest, { user, supabase, deductCredits }: any) {
    try {
        const body = await req.json();
        const { topic, style, purpose, voice, platform, duration, themeId } = body;

        if (!topic && !themeId) {
            return NextResponse.json({ error: 'Topic or Theme is required' }, { status: 400 });
        }

        // 1. Generate the script
        // We can either use a pre-built theme or AI generation
        let script;
        if (themeId) {
            script = await generateFacelessScript({
                topic: topic || 'Custom Topic',
                style: style || 'cinematic',
                purpose: purpose || 'entertainment',
                platforms: [platform || 'TikTok'],
                themeId,
                voiceTone: voice,
                targetDuration: duration
            });
        } else {
            const aiScript = await videoScriptCore(topic, style, purpose, duration);
            script = {
                title: aiScript.title,
                scenes: aiScript.scenes,
                keyPoints: aiScript.keyPoints,
                voiceTone: voice,
                platforms: [platform]
            };
        }

        // 2. Deduct credits (Faceless generation is premium, say 5 credits)
        await deductCredits();

        // 3. Create a Project
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .insert({
                user_id: user.id,
                title: script.title || `Faceless: ${topic}`,
                status: 'ready',
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

        // 4. Create a History Entry (Snippet)
        await supabase.from('snippets').insert({
            user_id: user.id,
            title: script.title,
            content: JSON.stringify(script.scenes),
            platform: platform,
            type: 'faceless-script'
        });

        return NextResponse.json({ 
            success: true, 
            projectId: project.id,
            script: script 
        });

    } catch (error: any) {
        console.error('[Faceless Generate Error]:', error);
        return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 });
    }
}

export const POST = withAuthAndCredits(facelessGenerateHandler, { 
    requireCredits: 5, 
    actionName: 'Faceless Video Generation' 
});
