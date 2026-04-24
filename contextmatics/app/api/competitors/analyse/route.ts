import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { generateText } from '@/lib/ai/providers';
import { logger, apiError } from '@/lib/logger';

async function competitorAnalyseHandler(req: NextRequest, { user, supabase, deductCredits }: AuthContext) {
    const route = '/api/competitors/analyse';
    
    try {
        const { url, content, handle } = await req.json();

        if (!content && !url) {
            return apiError('INVALID_INPUT', 'Content or URL is required', 400);
        }

        const prompt = `
            You are a Viral Content Strategist. Analyze the following competitor content and reverse-engineer their secret formula.
            
            Return ONLY a JSON object with:
            - hook_formula: The structure of their best hooks (e.g. [Observation] + [Contrarian Take])
            - writing_style: Tone, sentence length patterns, and formatting tricks.
            - psychological_triggers: Why does this work? (e.g. FOMO, Social Proof)
            - top_hooks: Analysis of 3 specific hooks from the input.
            - style_transfer_prompt: A meta-prompt to mimic this style.
            
            Competitor Content:
            ${content || '(URL provided: ' + url + ')'}
        `;

        const text = await generateText({
            routeType: 'competitor_analyse',
            prompt,
            jsonMode: true,
        });

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
            throw new Error("AI failed to generate a structured teardown.");
        }

        const teardown = JSON.parse(jsonMatch[0]);

        // Save to DB
        const { data, error } = await supabase
            .from('competitor_intel')
            .insert({
                user_id: user.id,
                handle: handle || 'Unknown',
                source_url: url,
                teardown_data: teardown
            })
            .select()
            .single();

        if (error) throw error;

        // Deduct Credits
        await deductCredits();

        return NextResponse.json({ success: true, analysis: data });

    } catch (error:any) {
        logger.error({ 
            route, 
            userId: user.id, 
            message: error instanceof Error ? error.message : 'Unknown error' 
        });
        return apiError(error.message || 'Failed to analyze competitor', 'ANALYSIS_FAILED', 500);
    }
}

export const POST = withAuthAndCredits(competitorAnalyseHandler, {
    requirePlan: 'business',
    requireCredits: 5,
    rateLimit: 5,
    rateLimitWindow: '3600 s',
    actionName: 'Competitor Intelligence Analysis'
});
