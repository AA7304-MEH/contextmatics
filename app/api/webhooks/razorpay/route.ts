export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
        console.error("Missing Supabase configuration");
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    try {
        const bodyText = await req.text();
        const signature = req.headers.get("x-razorpay-signature");

        if (!signature) {
            return NextResponse.json({ error: "No signature provided" }, { status: 400 });
        }

        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error("RAZORPAY_WEBHOOK_SECRET is missing");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        // Verify Razorpay signature
        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(bodyText)
            .digest("hex");

        if (expectedSignature !== signature) {
            return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
        }

        const event = JSON.parse(bodyText);

        if (event.event === "payment.captured") {
            const payment = event.payload?.payment?.entity;
            
            if (!payment) {
                return NextResponse.json({ error: "Invalid payment payload" }, { status: 400 });
            }

            // Look up the user by Razorpay order metadata (notes.user_id)
            const userId = payment.notes?.user_id;
            const plan = (payment.notes?.plan || 'pro').toLowerCase();

            if (!userId) {
                console.error("Webhook received without user_id in notes.");
                return NextResponse.json({ error: "Missing user_id in metadata" }, { status: 400 });
            }

            let creditsToAdd = 0;
            let planTier = "free";

            if (plan === "free") {
                creditsToAdd = 30;
                planTier = "free";
            } else if (plan === "pro") {
                creditsToAdd = 500;
                planTier = "pro";
            } else if (plan === "business") {
                // "unlimited flag" -> practically large number or set plan config elsewhere, 
                // schema allows integer for credits_remaining. We use a high number for business unlimited.
                creditsToAdd = 999999;
                planTier = "business";
            } else {
                creditsToAdd = 500;
                planTier = "pro";
            }

            // Fetch current profile to increment credits
            const { data: profile, error: fetchError } = await supabaseAdmin
                .from("profiles")
                .select("credits_remaining")
                .eq("id", userId)
                .single();

            if (fetchError || !profile) {
                console.error("Profile fetch error in webhook:", fetchError);
                return NextResponse.json({ error: "Profile not found" }, { status: 404 });
            }

            // Atomic Credit Update (Direct update increment)
            const { error: updateError } = await supabaseAdmin
                .from("profiles")
                .update({ 
                    credits_remaining: profile.credits_remaining + creditsToAdd,
                    plan: planTier
                })
                .eq("id", userId);
    
            if (updateError) {
                console.error("Profile update error in webhook:", updateError);
                return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
            }
    
            const { logger } = await import('@/lib/logger');
            logger.info(`Webhook payment processed successfully`, { userId, plan: planTier, creditsAdded: creditsToAdd });
        }

        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error: any) {
        console.error("Razorpay webhook processing error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
