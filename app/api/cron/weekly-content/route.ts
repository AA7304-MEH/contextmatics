export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { sendEmail, generateWeeklyPlanHtml } from '@/lib/email';
import { generateText } from '@/lib/ai/providers';
import { buildEnhancedSystemPrompt } from '@/lib/ai/withVoiceFingerprint';
import { Profile, ContentPlan } from '@/types/database';

const CRON_SECRET = process.env.CRON_SECRET || 'phase2_cron_secret_77';

export async function GET(req: NextRequest) {
    const route = '/api/cron/weekly-content';
    const startTime = Date.now();
    const authHeader = req.headers.get('authorization');

    if (authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ success: false, code: 'UNAUTHORIZED', message: 'Invalid cron secret' }, { status: 401 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { data: usersData, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .not('brand_voice', 'is', null);

        if (userError) throw userError;

        const users = usersData as Profile[];
        const results = [];

        for (const user of users) {
             try {
                const basePrompt = `Create a 7-day content strategy for a ${user.niche || 'Digital Entrepreneur'}. Focus on high growth. Generate a JSON array of 7 objects.`;
                const systemPrompt = buildEnhancedSystemPrompt(
                    basePrompt,
                    user.brand_voice,
                    user.preferred_language
                );

                const text = await generateText({
                    routeType: 'content_plan',
                    prompt: systemPrompt,
                    jsonMode: true,
                });

                const jsonMatch = text.match(/\[[\s\S]*\]/);
                
                if (jsonMatch) {
                    const planData = JSON.parse(jsonMatch[0]);

                    const { data: plan, error: insertError } = await supabase
                        .from('content_plans')
                        .insert({
                            user_id: user.id,
                            week_start: new Date().toISOString().split('T')[0],
                            plan: planData,
                            status: 'pending'
                        })
                        .select()
                        .single();

                    if (insertError) throw insertError;

                    // 4. Send Email
                    await sendEmail({
                        to: user.email,
                        subject: "Your Weekly Content OS Strategy is Ready! ✨",
                        html: generateWeeklyPlanHtml(user.full_name || 'Creator', planData)
                    });

                    results.push({ userId: user.id, success: true, planId: (plan as ContentPlan).id });
                }

             } catch (err: unknown) {
                 const msg = err instanceof Error ? err.message : 'Unknown error';
                 logger.error(`Cron user failure: ${msg}`, { route, userId: user.id });
                 results.push({ userId: user.id, success: false, error: msg });
             }
        }

        const duration = Date.now() - startTime;
        return NextResponse.json({ 
            success: true, 
            data: {
                processed: results.length,
                successCount: results.filter(r => r.success).length,
                duration_ms: duration
            } 
        }, { status: 200 });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Global Cron Failure:', { route, error: errorMessage });
        return NextResponse.json({ success: false, code: 'CRON_FAILED', message: errorMessage }, { status: 500 });
    }
}
