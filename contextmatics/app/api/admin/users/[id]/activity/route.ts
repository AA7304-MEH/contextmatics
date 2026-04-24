import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminEmail } from '@/config/admin';

export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    const userId = params.id;
    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

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

    if (!authUser) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const isWhitelisted = isAdminEmail(authUser.email);

    // Double-check role in DB
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single();

    if (profile?.role !== 'admin' && !isWhitelisted) {
        return new NextResponse('Forbidden', { status: 403 });
    }

    try {
        // Fetch all relevant activity for the user
        const [
            { data: snippets },
            { data: videos },
            { data: posts },
            { data: transactions }
        ] = await Promise.all([
            supabase.from('snippets').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
            supabase.from('media_items').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
            supabase.from('scheduled_posts').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
            supabase.from('transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20)
        ]);

        // Combine and normalize events
        const events = [
            ...(snippets || []).map(s => ({ id: s.id, type: 'snippet', title: s.title || 'Text Snippet', detail: s.platform, date: s.created_at, icon: '📝' })),
            ...(videos || []).map(v => ({ id: v.id, type: 'media', title: `Generated ${v.type}`, detail: v.prompt, date: v.created_at, icon: v.type === 'video' ? '🎬' : '✨' })),
            ...(posts || []).map(p => ({ id: p.id, type: 'post', title: 'Scheduled Post', detail: p.platforms.join(', '), date: p.created_at, icon: '📅' })),
            ...(transactions || []).map(t => ({ id: t.id, type: 'payment', title: `Payment: ${t.plan_name}`, detail: `${t.amount} ${t.currency}`, date: t.created_at, icon: '💰' }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return NextResponse.json(events);
    } catch (error:any) {
        console.error('[Admin Activity Fetch Error]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
