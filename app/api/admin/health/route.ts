import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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

    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check for admin role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Access Denied' }, { status: 403 });
        }

        // --- Fetch Database Stats ---
        const [
            { count: totalUsers },
            { count: totalGenerations },
            { count: activeWorkspaces },
            { data: revenueData },
            { data: highVolumeUsers }
        ] = await Promise.all([
            supabase.from('profiles').select('*', { count: 'exact', head: true }),
            supabase.from('snippets').select('*', { count: 'exact', head: true }),
            supabase.from('workspaces').select('*', { count: 'exact', head: true }),
            supabase.from('transactions').select('amount').eq('status', 'completed'),
            supabase.from('profiles').select('id').gt('credits_remaining', 500)
        ]);

        const totalRevenue = revenueData?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;

        return NextResponse.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            metrics: {
                totalUsers,
                totalGenerations,
                activeWorkspaces,
                totalRevenue,
                highVolumeUsers: highVolumeUsers?.length || 0,
                dbConnection: "active",
                uptime: process.uptime()
            }
        });

    } catch (error: any) {
        console.error('Health check failed', error);
        return NextResponse.json({ 
            status: 'degraded', 
            error: error.message 
        }, { status: 500 });
    }
}
