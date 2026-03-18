import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();
    const { prompt, style, platform, snippetId } = body;

    // 1. Check & Deduct Credits
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('credits_remaining')
        .eq('id', authUser.id)
        .single();

    if (profileError || !profile) return new NextResponse('Profile not found', { status: 404 });
    if (profile.credits_remaining < 1) return new NextResponse('Insufficient credits', { status: 402 });

    // Deduct credit
    await supabase.from('profiles').update({
        credits_remaining: profile.credits_remaining - 1
    }).eq('id', authUser.id);

    // 2. Trigger AI Orchestration
    try {
        const { aiService } = await import('@/services/aiService');
        const project = await aiService.generateFullVideoProject(supabase, authUser.id, prompt, style);

        // 3. Log the "video" job for history (optional, since we now have "projects")
        // But let's keep it for compatibility with the History UI
        await supabase
            .from('videos')
            .insert({
                user_id: authUser.id,
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
        console.error('[AI Generation Error]', err);
        return new NextResponse(err.message, { status: 500 });
    }
}
