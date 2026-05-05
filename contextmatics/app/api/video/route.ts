import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

/**
 * GET: Fetch all videos for the user
 */
async function getVideosHandler(_request: NextRequest, { user, supabase }: AuthContext) {
    try {
        const { data, error } = await supabase
            .from('videos')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('GET videos failed', { userId: user.id, error: errorMessage });
        return NextResponse.json({ success: false, code: 'FETCH_FAILED', message: errorMessage }, { status: 500 });
    }
}

export const GET = withAuthAndCredits(getVideosHandler, { 
    actionName: 'Fetch Videos', 
    requireAuth: true 
});
