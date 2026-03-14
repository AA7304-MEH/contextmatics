import { createServerClient, type CookieOptions } from '@supabase/ssr';
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

    // 2. Insert Pending Job
    const { data: job, error: insertError } = await supabase
        .from('videos')
        .insert({
            user_id: authUser.id,
            prompt,
            style,
            platform,
            status: 'pending',
            snippet_id: snippetId
        })
        .select()
        .single();

    if (insertError) return new NextResponse(insertError.message, { status: 500 });

    // 3. Return Job ID (Ideally we'd also enqueue a BullMQ job here)
    return NextResponse.json({ jobId: job.id, status: 'pending' });
}
