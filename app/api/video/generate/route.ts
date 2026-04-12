import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits } from '@/lib/api-utils';
import { aiService } from '@/services/aiService';

async function generateVideoHandler(req: NextRequest, { user, supabase, deductCredits }: any) {
    const body = await req.json();
    const { prompt, style, platform, snippetId } = body;

    // 2. Trigger AI Orchestration
    try {
        const project = await aiService.generateFullVideoProject(supabase, user.id, prompt, style);

        // Deduct credits after successful AI call
        await deductCredits();

        // 3. Log the "video" job for history
        await supabase
            .from('videos')
            .insert({
                user_id: user.id,
                prompt,
                style,
                platform,
                status: 'completed',
                url: project.clips[0]?.url,
                thumbnail_url: 'https://res.cloudinary.com/demo/video/upload/v1690989016/samples/sea-turtle.jpg',
                snippet_id: snippetId
            });

        return NextResponse.json({ 
            success: true,
            projectId: project.projectId, 
            message: 'Project generated successfully' 
        });

    } catch (err: any) {
        console.error('[Video Generation Error]', err);
        throw err; // Let withAuthAndCredits catch it and report to Sentry
    }
}

export const POST = withAuthAndCredits(generateVideoHandler, { 
    requireCredits: 10, 
    actionName: 'Generate Video' 
});
