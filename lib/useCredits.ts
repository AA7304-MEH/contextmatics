import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function useCredits(userId: string, cost: number): Promise<number> {
    // 1. Fetch current credits
    const { data: profile, error: fetchError } = await supabaseAdmin
        .from('profiles')
        .select('credits_remaining')
        .eq('id', userId)
        .single();

    if (fetchError || !profile) {
        throw { code: 'PROFILE_NOT_FOUND' };
    }

    if (profile.credits_remaining < cost) {
        throw { code: 'INSUFFICIENT_CREDITS', remaining: profile.credits_remaining };
    }

    // 2. Decrement atomically via RPC
    const { data: newBalance, error: rpcError } = await supabaseAdmin
        .rpc('decrement_credits', { user_id: userId, amount: cost });

    if (rpcError) {
        if (rpcError.message?.includes('INSUFFICIENT_CREDITS')) {
            throw { code: 'INSUFFICIENT_CREDITS', remaining: profile.credits_remaining };
        }
        console.error('RPC Error decrementing credits:', rpcError);
        throw { code: 'INTERNAL_ERROR' };
    }

    return newBalance as number;
}
