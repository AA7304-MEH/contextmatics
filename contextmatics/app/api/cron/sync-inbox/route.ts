import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateText } from '@/lib/ai/providers';
import { logger } from '@/lib/logger';
import { buildEnhancedSystemPrompt } from '@/lib/ai/withVoiceFingerprint';
import { Profile } from '@/types/database';

export const dynamic = 'force-dynamic';

interface AyrshareComment {
  id: string;
  platform: string;
  text: string;
  username: string;
  createdAt?: string;
}

export async function GET(_req: NextRequest) {
    const route = '/api/cron/sync-inbox';
    const startTime = Date.now();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    let usersProcessed = 0;
    let commentsSynced = 0;
    const errors: { userId: string; error: string }[] = [];

    try {
        // 1. Get users with Ayrshare profiles
        const { data: users, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .not('ayrshare_customer_id', 'is', null);

        if (userError) throw userError;

        for (const user of (users || [])) {
            try {
                const profile = user as Profile;

                // 2. Fetch real comments from Ayrshare
                // Note: In a real multi-tenant scenario, we'd use the user's specific Ayrshare key or customer ID
                const response = await fetch('https://app.ayrshare.com/api/comments', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${process.env.AYRSHARE_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) continue;

                const body = await response.json() as { comments?: AyrshareComment[] };
                const comments = body.comments ?? [];

                // 3. Process each comment
                for (const comment of comments) {
                    // Check if exists
                    const { data: existing } = await supabase
                        .from('social_inbox')
                        .select('id')
                        .eq('user_id', profile.id)
                        .eq('comment_id', comment.id)
                        .maybeSingle();

                    if (!existing) {
                        const basePrompt = `Generate a 1-sentence contextual reply to this comment: "${comment.text}" from ${comment.username}. Keep it engaging and high-value.`;
                        const systemPrompt = buildEnhancedSystemPrompt(
                            basePrompt,
                            profile.brand_voice || null,
                            profile.preferred_language || 'english'
                        );

                        const aiReply = await generateText({
                            routeType: 'reply_suggest',
                            prompt: systemPrompt,
                        });
                        
                        const { error: upsertError } = await supabase.from('social_inbox').insert({
                            user_id: profile.id,
                            platform: comment.platform,
                            comment_id: comment.id,
                            commenter_handle: comment.username,
                            comment_text: comment.text,
                            status: 'unread',
                            ai_replies: [{ style: 'short_warm', text: aiReply.trim() }]
                        });

                        if (upsertError) throw upsertError;
                        commentsSynced++;
                    }
                }

                usersProcessed++;
            } catch (userErr: unknown) {
                const msg = userErr instanceof Error ? userErr.message : 'Unknown error';
                logger.error({ route, message: `Error processing user ${user.id}`, userId: user.id, data: { error: msg } });
                errors.push({ userId: user.id, error: msg });
            }
        }

        return NextResponse.json({ 
            success: true, 
            data: {
                usersProcessed,
                commentsSynced,
                duration_ms: Date.now() - startTime,
                errors: errors.length > 0 ? errors : null
            } 
        }, { status: 200 });

    } catch (globalErr: unknown) {
        const errorMessage = globalErr instanceof Error ? globalErr.message : 'Unknown error';
        logger.error({ route, message: 'Global Cron Error', data: { error: errorMessage } });
        return NextResponse.json({ success: false, code: 'CRON_FAILED', message: errorMessage }, { status: 500 });
    }
}
