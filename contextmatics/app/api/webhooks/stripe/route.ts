import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import stripe from '@/lib/stripe';
import { supabase } from '@/lib/supabaseClient';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get('stripe-signature') as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret!);
    } catch (err: any) {
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const session = event.data.object as any;

    if (event.type === 'checkout.session.completed') {
        const userId = session.metadata.userId;
        const plan = session.metadata.plan;

        // Default credits based on plan
        let credits = 10;
        if (plan === 'pro') credits = 100;
        if (plan === 'business') credits = 500;

        const { error } = await supabase
            .from('profiles')
            .update({
                plan: plan,
                credits_remaining: credits,
                stripe_customer_id: session.customer,
            })
            .eq('id', userId);

        if (error) {
            console.error('[Supabase Update Error]', error);
            return new NextResponse('Internal Error', { status: 500 });
        }
    }

    return new NextResponse(null, { status: 200 });
}
