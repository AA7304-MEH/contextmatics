import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPlanByName } from "@/config/plans";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
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
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { planName, currency } = await req.json();

        if (!planName) {
            return NextResponse.json({ error: "Plan name is required" }, { status: 400 });
        }

        // 1. Env Check (Build Safety)
        const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keyId || !keySecret) {
             console.error("[Create Order] Missing Razorpay credentials");
             return NextResponse.json({ error: "Payment gateway misconfigured." }, { status: 500 });
        }

        // 2. Validate Plan & Price (Source of Truth)
        const plan = getPlanByName(planName);
        if (!plan) {
            return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 });
        }

        const price = (currency === 'INR') ? plan.priceINR : plan.priceUSD;
        if (price === 0 && plan.id !== 'free') {
             return NextResponse.json({ error: "Price mismatch for selected currency" }, { status: 400 });
        }

        // 3. Initialize Razorpay (Runtime Dynamic Import)
        const Razorpay = (await import("razorpay")).default;
        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret
        });

        // 3. Create Order
        const amount = Math.round(price * 100); // Smallest unit (paise/cents)
        const order = await razorpay.orders.create({
            amount,
            currency: currency || 'INR',
            receipt: `receipt_${user.id.slice(0, 8)}_${Date.now()}`,
            notes: {
                userId: user.id,
                planName: plan.id,
                credits: plan.credits
            }
        });

        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        });

    } catch (error:any) {
        console.error("[Create Order Error]", error);
        return NextResponse.json({ 
            error: "Failed to create payment order", 
            details: error.message 
        }, { status: 500 });
    }
}
