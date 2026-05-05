export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { generateText } from '@/lib/ai/providers';
import { logger } from '@/lib/logger';
import { buildEnhancedSystemPrompt } from '@/lib/ai/withVoiceFingerprint';
import { Profile, HookLibraryItem, ContentPlan } from '@/types/database';

async function contentOsPlanHandler(req: NextRequest, { user, supabase, deductCredits }: AuthContext) {
    const route = '/api/content-os/plan';
    
    try {
        const { focus, language = 'english' } = await req.json();

        // 1. Fetch User Profile
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError || !profileData) {
            return NextResponse.json({ success: false, code: 'PROFILE_NOT_FOUND', message: 'User profile not found.' }, { status: 404 });
        }

        const profile = profileData as Profile;

        // 2. Fetch Viral Hooks for inspiration (Random 5)
        const { data: hooksData } = await supabase
            .from('hook_library')
            .select('*')
            .eq('language', language)
            .limit(5);

        const hooks = (hooksData || []) as HookLibraryItem[];

        const basePrompt = `
            Create a high-impact 7-day content plan for a ${profile.niche || 'Digital Entrepreneur'}.
            Focus: ${focus || 'General Brand Growth'}
            
            For each day, provide:
            - Platform (Twitter, LinkedIn, Instagram)
            - Headline/Hook (Use these for inspiration: ${hooks.map(h => h.hook_template).join(' | ')})
            - Core Message
            - Suggested Visual
            
            Return a JSON array of 7 objects. Exact fields: day (1-7), platform, hook, message, visual_suggestion.
        `;

        const systemPrompt = buildEnhancedSystemPrompt(
            basePrompt,
            profile.brand_voice,
            language
        );

        const text = await generateText({
            routeType: 'content_plan',
            prompt: systemPrompt,
            jsonMode: true,
        });

        const jsonMatch = text.match(/\[[\s\S]*\]/);
        
        if (!jsonMatch) {
            throw new Error("AI failed to generate a structured content plan.");
        }

        const planData = JSON.parse(jsonMatch[0]);

        // 3. Save to database
        const { data: plan, error: planError } = await supabase
            .from('content_plans')
            .insert({
                user_id: user.id,
                week_start: new Date().toISOString(),
                plan: planData,
                status: 'pending'
            })
            .select()
            .single();

        if (planError) throw planError;

        await deductCredits();

        return NextResponse.json({ success: true, data: plan as ContentPlan }, { status: 200 });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Content OS Planning failed', { route, userId: user.id, error: errorMessage });
        return NextResponse.json({ 
            success: false, 
            code: 'PLANNING_FAILED', 
            message: errorMessage
        }, { status: 500 });
    }
}

export const POST = withAuthAndCredits(contentOsPlanHandler, {
    requirePlan: 'pro',
    requireCredits: 7,
    rateLimit: 2,
    rateLimitWindow: '3600 s',
    actionName: 'Generate Content Plan'
});
