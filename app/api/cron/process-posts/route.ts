import { env } from "@/config/env";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/**
 * Vercel Cron Job: Processes the scheduled_posts queue
 */
export async function GET(req: NextRequest) {
    // 1. Authorization Check
    const authHeader = req.headers.get('authorization');
    if (env.isProduction && authHeader !== `Bearer ${env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized access denied." }, { status: 401 });
    }

    // 2. Env Check (Build Safety)
    const supabaseUrl = env.SUPABASE_URL;
    const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
    const ayrshareApiKey = env.AYRSHARE_API_KEY;

    if (!supabaseUrl || !serviceRoleKey || !ayrshareApiKey) {
        console.error("[Cron] Missing critical configuration.");
        return NextResponse.json({ error: "Service configuration error." }, { status: 500 });
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
            return NextResponse.json({ message: "No pending posts found." });
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
            } catch (err: any) {
                console.error(`[Cron] Post FAILED (ID: ${post.id}):`, err.message);
                await supabaseAdmin
                    .from('scheduled_posts')
                    .update({ status: 'failed', updated_at: new Date().toISOString() })
                    .eq('id', post.id);
                results.push({ id: post.id, status: 'failed', error: err.message });
            }
        }

        return NextResponse.json({
            processed: posts.length,
            results
        });

    } catch (error: any) {
        console.error("[Cron Job Error]", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
