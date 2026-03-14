import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    // Check if profile exists
    const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
        return new NextResponse(fetchError.message, { status: 500 });
    }

    if (!profile) {
        // Create profile fallback (usually handled by DB trigger, but good for sync)
        const { error: insertError } = await supabase
            .from('profiles')
            .insert({
                id: user.id,
                username: user.email?.split('@')[0] || 'user',
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
                plan: 'free',
                credits_remaining: 3,
            });

        if (insertError) {
            console.error('[Profile Sync Error]', insertError);
            return new NextResponse(insertError.message, { status: 500 });
        }
    }

    return new NextResponse('OK', { status: 200 });
}
