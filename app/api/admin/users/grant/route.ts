import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { isAdminEmail } from '@/config/admin';

export async function POST(req: Request) {
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value; },
            },
        }
    );

    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const isWhitelisted = isAdminEmail(authUser.email);

    // Double-check role in DB for absolute sovereignty
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single();

    if (profile?.role !== 'admin' && !isWhitelisted) {
        const { logger } = await import('@/lib/logger');
        logger.warn(`Potential role bypass attempt for grant-credits`, { actor: authUser.email });
        return new NextResponse('Forbidden', { status: 403 });
    }

    try {
        const { targetUserId, amount, reason } = await req.json();

        if (!targetUserId || !amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }

        const { logger } = await import('@/lib/logger');
        logger.info(`Admin credit grant initiated`, { actor: authUser.email, targetUserId, amount, reason: reason || 'None' });

        // 1. Get current credits
        const { data: targetProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('credits_remaining')
            .eq('id', targetUserId)
            .single();

        if (fetchError || !targetProfile) {
            throw new Error('Target user not found');
        }

        const newCredits = (targetProfile.credits_remaining || 0) + amount;

        // 2. Update credits
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ credits_remaining: newCredits })
            .eq('id', targetUserId);

        if (updateError) throw updateError;

        // 3. Optional: Log the transaction if a transactions table expects it
        // For now, we'll assume the credit change is enough, but a log is better.
        
        return NextResponse.json({ 
            success: true, 
            newBalance: newCredits 
        });

    } catch (error: any) {
        console.error('[Admin Grant Error]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
