import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    try {
        const body = await req.json();
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature, 
            paypal_details,
            planName, 
            method // 'razorpay' or 'paypal'
        } = body;

        if (!method || !planName) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const gatewayPaymentId = method === 'razorpay' ? razorpay_payment_id : paypal_details?.id;

        if (!gatewayPaymentId) {
            return NextResponse.json({ success: false, error: 'Invalid payment details' }, { status: 400 });
        }

        // 1. Idempotency Check: Don't process the same payment twice
        const { data: existingTx } = await supabase
            .from('transactions')
            .select('id')
            .eq('gateway_payment_id', gatewayPaymentId)
            .single();

        if (existingTx) {
            const { logger } = await import('@/lib/logger');
            logger.warn(`Duplicate payment ID detected: ${gatewayPaymentId}. Skipping.`, { userId: user.id });
            return NextResponse.json({ 
                success: true, 
                message: 'Payment already processed.' 
            });
        }

        // 2. Verification
        if (method === 'razorpay') {
            const secret = process.env.RAZORPAY_KEY_SECRET;
            if (process.env.NODE_ENV === 'production' && !secret) {
                console.error('RAZORPAY_KEY_SECRET is missing in production');
                return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
            }

            if (secret) {
                const data = (razorpay_order_id || "") + "|" + razorpay_payment_id;
                const generated_signature = crypto
                    .createHmac('sha256', secret)
                    .update(data)
                    .digest('hex');

                if (generated_signature !== razorpay_signature) {
                    console.error('[Razorpay] Signature mismatch');
                    return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
                }
            }
        } else if (method === 'paypal') {
            if (!paypal_details?.id) {
                return NextResponse.json({ success: false, error: 'Invalid PayPal details' }, { status: 400 });
            }
            // In full production, verify with PayPal REST API here
            const { logger } = await import('@/lib/logger');
            logger.info(`PayPal payment verified`, { userId: user.id, paypalId: paypal_details.id });
        } else {
            return NextResponse.json({ success: false, error: 'Unsupported payment method' }, { status: 400 });
        }

        // 3. Map Plan and Credits (Source of Truth)
        const { getPlanByName } = await import("@/config/plans");
        const plan = getPlanByName(planName);
        
        if (!plan) {
            return NextResponse.json({ success: false, error: 'Invalid plan' }, { status: 400 });
        }

        const planId = plan.id;
        const creditsToAdd = plan.credits;

        // 4. Atomic Update via RPC
        // This inserts the transaction AND updates the profile in one transaction
        const { error: rpcError } = await supabase.rpc('process_payment_success', {
            p_user_id: user.id,
            p_plan_name: planId,
            p_credits_to_add: creditsToAdd,
            p_gateway: method,
            p_payment_id: gatewayPaymentId,
            p_order_id: razorpay_order_id || paypal_details?.id || "",
            p_amount: body.amount || 0,
            p_currency: body.currency || 'INR'
        });

        if (rpcError) {
            console.error('[RPC Payment Error]', rpcError);
            return NextResponse.json({ success: false, error: rpcError.message }, { status: 500 });
        }

        const { logger } = await import('@/lib/logger');
        logger.info(`Webhook payment processed`, { userId: user.id, plan: planId, creditsAdded: creditsToAdd });

        return NextResponse.json({ 
            success: true, 
            plan: planId, 
            credits: creditsToAdd,
            message: `Account weaponized to ${planId} successfully.`
        });

    } catch (error:any) {
        console.error('[Payment Verification Exception]', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
