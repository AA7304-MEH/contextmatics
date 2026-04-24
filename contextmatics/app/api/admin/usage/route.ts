export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { isAdminEmail } from '@/config/admin';
import { getDailyUsage, FREE_TIER_LIMITS } from '@/lib/ai/usageTracker';
import { getProviderStatus } from '@/lib/ai/providers';

export async function GET() {
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

    // Double-check role in DB for absolute sovereignty
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single();

    if (profile?.role !== 'admin' && !isWhitelisted) {
        console.warn(`[Security] Potential role bypass attempt by ${authUser.email}`);
        return new NextResponse('Forbidden', { status: 403 });
    }

    const usage = await getDailyUsage();
    const status = await getProviderStatus();

    return NextResponse.json({
        usage,
        limits: FREE_TIER_LIMITS,
        status
    });
}
