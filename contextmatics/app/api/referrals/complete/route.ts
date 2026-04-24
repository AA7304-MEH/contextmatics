import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { logger } from '@/lib/logger';
import { cookies } from 'next/headers';

async function referralCompleteHandler(_req: NextRequest, { user, supabase }: AuthContext) {
  const cookieStore = cookies();
  const referralCode = cookieStore.get('referral_code')?.value;
  
  if (!referralCode) {
    return NextResponse.json({ success: true, message: 'No referral code found' }, { status: 200 });
  }

  try {
    // 1. Find the referrer
    const { data: referrer, error: referrerError } = await supabase
      .from('profiles')
      .select('id, credits_remaining, referral_credits_earned')
      .eq('referral_code', referralCode)
      .single();

    if (referrerError || !referrer) {
      return NextResponse.json({ success: false, code: 'INVALID_CODE', message: 'Invalid referral code' }, { status: 400 });
    }

    // prevent self-referral
    if (referrer.id === user.id) {
        return NextResponse.json({ success: false, code: 'SELF_REFERRAL', message: 'Self-referral not allowed' }, { status: 400 });
    }

    // 2. Check if this user was already referred
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_id', user.id)
      .single();

    if (existingReferral) {
        return NextResponse.json({ success: false, code: 'ALREADY_REFERRED', message: 'Already referred' }, { status: 400 });
    }

    // 3. Create referral record & Award credits
    const REWARD_AMOUNT = 50;
    
    // a. Record referral
    await supabase.from('referrals').insert({
      referrer_id: referrer.id,
      referred_id: user.id,
      status: 'completed',
      credits_awarded: REWARD_AMOUNT
    });

    // b. Award Referrer
    await supabase.from('profiles').update({
        credits_remaining: (referrer.credits_remaining || 0) + REWARD_AMOUNT,
        referral_credits_earned: (referrer.referral_credits_earned || 0) + REWARD_AMOUNT
    }).eq('id', referrer.id);

    // c. Award Referred (Current User)
    const { data: currentUser } = await supabase.from('profiles').select('credits_remaining').eq('id', user.id).single();
    await supabase.from('profiles').update({
        credits_remaining: (currentUser?.credits_remaining || 0) + REWARD_AMOUNT,
        referred_by: referrer.id
    }).eq('id', user.id);

    // 4. Remove cookie
    cookieStore.delete('referral_code');

    return NextResponse.json({ success: true, message: 'Referral processed successfully' }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Referral processing error:', { userId: user.id, error: errorMessage });
    return NextResponse.json({ success: false, code: 'PROCESS_FAILED', message: 'Internal server error' }, { status: 500 });
  }
}

export const POST = withAuthAndCredits(referralCompleteHandler, {
  actionName: 'Complete Referral',
  requireAuth: true
});
