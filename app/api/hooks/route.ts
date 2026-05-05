import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { logger, apiError } from '@/lib/logger';

async function hooksHandler(request: NextRequest, { user, supabase }: AuthContext) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const platform = searchParams.get('platform');

    let query = supabase
      .from('hook_library')
      .select('*')
      .order('viral_score', { ascending: false });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    if (platform && platform !== 'All') {
      query = query.eq('platform', platform);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, data });

  } catch (error:any) {
    logger.error('hook-library fetch failed', { userId: user.id, error: error.message });
    return apiError('Failed to fetch hooks', 'HOOKS_FAILED', 500);
  }
}

export const GET = withAuthAndCredits(hooksHandler, { actionName: 'hook-library-list' });
