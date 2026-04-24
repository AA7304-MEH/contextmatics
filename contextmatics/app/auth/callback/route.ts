import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (!code) {
    return NextResponse.redirect(`${origin}/sign-in?error=no_code`);
  }

  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !user) {
    logger.error('/auth/callback exchange failed', { error: error?.message });
    return NextResponse.redirect(`${origin}/sign-in?error=auth_failed`);
  }

  // Check if profile already exists
  const { data: existingProfile, error: profileError } = await supabase
    .from('profiles')
    .select('id, onboarding_completed')
    .eq('id', user.id)
    .single();

  if (profileError && profileError.code === 'PGRST116') {
    // New user — create profile
    const refCode = searchParams.get('ref');
    let referredBy: string | null = null;

    if (refCode) {
      const { data: referrer } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', refCode)
        .single();
      referredBy = referrer?.id ?? null;
    }

    const { error: insertError } = await supabase.from('profiles').insert({
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? null,
      referred_by: referredBy,
      onboarding_completed: false,
    });

    if (insertError) {
      logger.error('/auth/callback profile creation failed', {
        userId: user.id,
        error: insertError.message,
      });
    }

    return NextResponse.redirect(`${origin}/onboarding`);
  }

  if (!existingProfile?.onboarding_completed) {
    return NextResponse.redirect(`${origin}/onboarding`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
