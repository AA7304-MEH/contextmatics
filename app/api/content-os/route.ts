import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { logger } from '@/lib/logger';
import { ContentPlan } from '@/types/database';

/**
 * GET: Fetch the current active content plan
 */
async function getPlanHandler(_request: NextRequest, { user, supabase }: AuthContext) {
  try {
    const { data, error } = await supabase
      .from('content_plans')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'scheduled') // 'scheduled' is the active state in our updated logic
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ success: true, data: data as ContentPlan | null }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('GET content-os plan failed', { userId: user.id, error: errorMessage });
    return NextResponse.json({ success: false, code: 'FETCH_FAILED', message: errorMessage }, { status: 500 });
  }
}

export const GET = withAuthAndCredits(getPlanHandler, { actionName: 'content-os-fetch' });
