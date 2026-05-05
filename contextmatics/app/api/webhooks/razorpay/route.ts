import { createHmac } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const PLAN_CREDITS: Record<string, number> = {
  free: 30,
  pro: 500,
  business: 2000,
  enterprise: -1, // -1 means unlimited
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('x-razorpay-signature');
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  // Cryptographically verify signature
  const expectedSignature = createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  if (expectedSignature !== signature) {
    logger.error({ route: 'webhooks/razorpay', message: 'Invalid signature — possible spoofed request' });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === 'payment.captured') {
    const payment = event.payload?.payment?.entity;
    if (!payment) {
      return NextResponse.json({ error: 'Invalid payment payload' }, { status: 400 });
    }

    const userId = payment.notes?.user_id;
    const plan = (payment.notes?.plan ?? 'pro').toLowerCase();

    if (!userId) {
      logger.error({ route: 'webhooks/razorpay', message: 'No user_id in payment notes' });
      return NextResponse.json({ error: 'No user_id in payment notes' }, { status: 400 });
    }

    // Use service-role client — webhook has no browser cookies
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      logger.error({ route: 'webhooks/razorpay', message: 'Missing Supabase service credentials' });
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const credits = PLAN_CREDITS[plan] ?? 500;
    const isUnlimited = credits === -1;

    const updateData: Record<string, unknown> = {
      plan,
      plan_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!isUnlimited) {
      updateData.credits_remaining = credits;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      logger.error({ route: 'webhooks/razorpay', message: error.message, userId });
      return NextResponse.json({ error: 'DB update failed' }, { status: 500 });
    }

    logger.info({
      route: 'webhooks/razorpay',
      message: `Payment captured: ${plan} for ${userId}`,
      userId,
    });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
