import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { isAdminEmail } from '@/config/admin';

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

    const { data: transactions, error } = await supabase
        .from('transactions')
        .select(`
            *,
            profiles:user_id (
                username,
                full_name
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[Admin Transactions Fetch Error]', error);
        return new NextResponse(error.message, { status: 500 });
    }

    return NextResponse.json(transactions);
}
