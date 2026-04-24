import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { logger } from '@/lib/logger';
import { Profile } from '@/types/database';

/**
 * POST: Sync or create profile
 */
async function syncProfileHandler(_request: NextRequest, { user, supabase }: AuthContext) {
    try {
        // Check if profile exists
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError;
        }

        if (!profile) {
            // Create profile fallback
            const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    email: user.email || '',
                    username: user.email?.split('@')[0] || 'user',
                    full_name: user.email?.split('@')[0] || 'User',
                    plan: 'free',
                    credits_remaining: 5,
                    onboarding_completed: false,
                    preferred_language: 'english'
                });

            if (insertError) throw insertError;
        }

        return NextResponse.json({ success: true, message: 'Profile synced' }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('[Profile Sync Error]', { userId: user.id, error: errorMessage });
        return NextResponse.json({ success: false, code: 'SYNC_FAILED', message: errorMessage }, { status: 500 });
    }
}

/**
 * PATCH: Update profile data or deduct credits (manual)
 */
async function updateProfileHandler(req: NextRequest, { user, supabase }: AuthContext) {
    try {
        const body = await req.json();
        const { credits_deduction, ...updates } = body;

        if (credits_deduction && typeof credits_deduction === 'number') {
            const { data: newBalance, error: rpcError } = await supabase
                .rpc('decrement_credits', { user_id: user.id, amount: credits_deduction });
            
            if (rpcError) {
                if (rpcError.message?.includes('INSUFFICIENT_CREDITS')) {
                    return NextResponse.json({ success: false, code: 'INSUFFICIENT_CREDITS', message: 'Insufficient credits' }, { status: 402 });
                }
                throw rpcError;
            }
            return NextResponse.json({ success: true, data: { remaining: newBalance } }, { status: 200 });
        }

        if (Object.keys(updates).length > 0) {
            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;
            return NextResponse.json({ success: true, data: data as Profile }, { status: 200 });
        }

        return NextResponse.json({ success: false, code: 'INVALID_INPUT', message: 'No updates provided' }, { status: 400 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('[Profile Update Error]', { userId: user.id, error: errorMessage });
        return NextResponse.json({ success: false, code: 'UPDATE_FAILED', message: errorMessage }, { status: 500 });
    }
}

export const POST = withAuthAndCredits(syncProfileHandler, { 
    actionName: 'Sync Profile', 
    requireAuth: true 
});

export const PATCH = withAuthAndCredits(updateProfileHandler, { 
    actionName: 'Update Profile', 
    requireAuth: true 
});
