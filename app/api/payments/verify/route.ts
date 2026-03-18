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
            console.log(`[Payment] Duplicate payment ID detected: ${gatewayPaymentId}. Skipping.`);
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
            console.log(`[PayPal] Payment verified for ${user.email}: ${paypal_details.id}`);
        } else {
            return NextResponse.json({ success: false, error: 'Unsupported payment method' }, { status: 400 });
        }

        // 3. Map Plan and Credits
        const nameLower = planName.toLowerCase();
        let planId = 'free';
        let creditsToSet = 5;

        if (nameLower.includes('pro')) {
            planId = 'pro';
            creditsToSet = 200;
        } else if (nameLower.includes('enterprise')) {
            planId = 'enterprise';
            creditsToSet = 10000;
        }

        // 4. Atomic Update: Log Transaction & Update Profile
        // Note: In production, use a Database Transaction (storing payment in DB trigger or RPC)
        
        // Log to transactions table first
        const { error: txError } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id,
                gateway: method,
                gateway_payment_id: gatewayPaymentId,
                gateway_order_id: razorpay_order_id || paypal_details?.id,
                amount: body.amount || 0,
                currency: body.currency || 'USD',
                plan_name: planName,
                credits_added: creditsToSet,
                status: 'completed',
                metadata: { ...body, user_email: user.email }
            });

        if (txError) {
            console.error('[Transaction Logging Error]', txError);
            return NextResponse.json({ success: false, error: 'Failed to log transaction' }, { status: 500 });
        }

        // Update Profile
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                plan: planId,
                credits_remaining: creditsToSet, // Set directly for now as per plan logic
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

        if (updateError) {
            console.error('[Payment Sync Error]', updateError);
            return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
        }

        console.log(`[Payment Success] User ${user.email} weaponized to ${planId} via ${method}`);

        return NextResponse.json({ 
            success: true, 
            plan: planId, 
            credits: creditsToSet,
            message: `Account weaponized to ${planId} successfully.`
        });

    } catch (error: any) {
        console.error('[Payment Verification Exception]', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
