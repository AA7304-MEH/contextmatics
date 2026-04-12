import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const referralCode = cookieStore.get('referral_code')?.value;
  if (!referralCode) return NextResponse.json({ message: 'No referral code found' });

  try {
    // 1. Find the referrer
    const { data: referrer, error: referrerError } = await supabase
      .from('profiles')
      .select('id, credits_remaining, referral_credits_earned')
      .eq('referral_code', referralCode)
      .single();

    if (referrerError || !referrer) {
      return NextResponse.json({ message: 'Invalid referral code' });
    }

    // prevent self-referral
    if (referrer.id === user.id) {
        return NextResponse.json({ message: 'Self-referral not allowed' });
    }

    // 2. Check if this user was already referred
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_id', user.id)
      .single();

    if (existingReferral) {
        return NextResponse.json({ message: 'Already referred' });
    }

    // 3. Create referral record & Award credits
    const REWARD_AMOUNT = 50;

    // Transactional logic (approximated via multiple calls since we don't have stored procedures here)
    // In a real production app, this should be a single RPC call for atomicity.
    
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

    return NextResponse.json({ success: true, message: 'Referral processed successfully' });
  } catch (error: any) {
    console.error('Referral processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
