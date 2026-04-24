import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { buildEnhancedSystemPrompt } from '@/lib/ai/withVoiceFingerprint';
import { logger, apiError } from '@/lib/logger';

async function contentOsGenerateHandler(req: NextRequest, { user, supabase, deductCredits }: AuthContext) {
    const route = '/api/content-os/generate';
    try {
        const { niche, startDate, platforms = ['Twitter', 'LinkedIn', 'Instagram'], language = 'english' } = await req.json();

        if (!niche) {
            return apiError('Niche is required', 'INVALID_INPUT', 400);
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            logger.error({ message: 'Gemini API key missing', route, userId: user.id });
            return apiError('Gemini API key not configured', 'CONFIG_ERROR', 500);
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('voice_fingerprint, preferred_language')
            .eq('id', user.id)
            .single();

        if (profileError) {
            logger.error({ message: profileError.message, route, userId: user.id });
        }

        const voiceFingerprint = profile?.voice_fingerprint;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

        const basePrompt = `
            Generate a comprehensive weekly content plan (7 days) for a creator in the "${niche}" niche.
            For each day, provide content ideas for these platforms: ${platforms.join(', ')}.
            
            Return a JSON object with a field "plan" which is an array of 7 objects (one for each day). Each object should have:
            - day (Day 1, Day 2, etc.)
            - focus (Overall topic/theme for the day)
            - posts (Array of objects, one for each platform. Each post object has: platform, headline, description, type (e.g., educational, story, promotional))
            
            Ensure the plan is strategic, engaging, and flows well throughout the week.
        `;

        const finalPrompt = buildEnhancedSystemPrompt(
            basePrompt,
            voiceFingerprint ? JSON.stringify(voiceFingerprint) : null,
            language || profile?.preferred_language || 'english'
        );

        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        const text = response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("AI failed to generate a structured content plan");
        }

        const data = JSON.parse(jsonMatch[0]);

        // Save to DB
        const { data: savedPlan, error: saveError } = await supabase
            .from('content_plans')
            .insert({
                user_id: user.id,
                week_start: startDate || new Date().toISOString().split('T')[0],
                plan_data: data.plan,
                status: 'draft'
            })
            .select()
            .single();

        if (saveError) throw saveError;

        // Deduct credits
        await deductCredits();

        return NextResponse.json(savedPlan);
    } catch (error:any) {
        logger.error({ 
            message: error.message, 
            route, 
            userId: user.id, 
            data: { stack: error.stack }
        });
        return apiError(error.message || 'Failed to generate content plan', 'GENERATION_FAILED', 500);
    }
}

export const POST = withAuthAndCredits(contentOsGenerateHandler, {
    requireCredits: 5, // Planning a whole week costs 5 credits
    actionName: 'Generate Content OS Plan'
});
