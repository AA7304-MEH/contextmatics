import { NextRequest, NextResponse } from 'next/server';
import { env } from "@/config/env";
import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

/**
 * Vercel Cron Job: Processes the scheduled_posts queue
 */
export async function GET(req: NextRequest) {
    // 1. Authorization Check
    const authHeader = req.headers.get('authorization');
    if (env.isProduction && authHeader !== `Bearer ${env.CRON_SECRET}`) {
        return NextResponse.json({ success: false, code: 'UNAUTHORIZED', message: "Unauthorized access denied." }, { status: 401 });
    }

    // 2. Env Check (Build Safety)
    const supabaseUrl = env.SUPABASE_URL;
    const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
    const ayrshareApiKey = env.AYRSHARE_API_KEY;

    if (!supabaseUrl || !serviceRoleKey || !ayrshareApiKey) {
        logger.error("[Cron] Missing critical configuration.");
        return NextResponse.json({ success: false, code: 'CONFIG_ERROR', message: "Service configuration error." }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    try {
        // 1. Fetch pending posts
        const { data: posts, error: fetchError } = await supabaseAdmin
            .from('scheduled_posts')
            .select('*')
            .eq('status', 'draft')
            .lte('scheduled_at', new Date().toISOString());

        if (fetchError) throw fetchError;

        if (!posts || posts.length === 0) {
            return NextResponse.json({ success: true, message: "No pending posts found." }, { status: 200 });
        }

        const results = [];

        // 2. Process each post
        for (const post of posts) {
            try {
                const response = await fetch("https://api.ayrshare.com/api/post", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${ayrshareApiKey}`
                    },
                    body: JSON.stringify({
                        post: post.content,
                        platforms: post.platforms,
                    })
                });

                const result = await response.json();

                if (response.ok && result.status === 'success') {
                    await supabaseAdmin
                        .from('scheduled_posts')
                        .update({ status: 'published', updated_at: new Date().toISOString() })
                        .eq('id', post.id);
                    results.push({ id: post.id, status: 'published' });
                } else {
                    throw new Error(result.message || "Ayrshare error");
                }
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : 'Unknown error';
                logger.error(`[Cron] Post FAILED (ID: ${post.id}):`, { error: msg });
                await supabaseAdmin
                    .from('scheduled_posts')
                    .update({ status: 'failed', updated_at: new Date().toISOString() })
                    .eq('id', post.id);
                results.push({ id: post.id, status: 'failed', error: msg });
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                processed: posts.length,
                results
            }
        }, { status: 200 });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error("[Cron Job Error]", { error: errorMessage });
        return NextResponse.json({ success: false, code: 'CRON_FAILED', message: errorMessage }, { status: 500 });
    }
}
