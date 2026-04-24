import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { embeddedAICore } from '@/services/embeddedAICore';
import { ollamaService } from '@/services/ollamaService';
import { gradioService } from '@/services/gradioService';
import { withAuthAndCredits } from '@/lib/api-utils';
import { buildEnhancedSystemPrompt } from '@/lib/ai/withVoiceFingerprint';


async function repurposeHandler(req: NextRequest, { user, supabase, deductCredits }:any) {
    const { content, format, language = 'english' } = await req.json();

    if (!content) {
        return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    let aiPrompt = "";
    switch (format) {
        case "Blog Post":
            aiPrompt = `Repurpose the following content into a comprehensive blog post. Use a professional yet engaging tone. Structure it with a catchy title, introduction, main body with headings, and a conclusion.\n\nContent:\n${content}`;
            break;
        case "Twitter Thread":
            aiPrompt = `Repurpose the following content into a viral Twitter (X) thread. Create 5-10 tweets. Number them (e.g., 1/8). Start with a strong hook. Use emojis where appropriate.\n\nContent:\n${content}`;
            break;
        case "Email Newsletter":
            aiPrompt = `Repurpose the following content into an engaging email newsletter. Include a subject line, a warm greeting, the main value proposition, and a call to action.\n\nContent:\n${content}`;
            break;
        case "LinkedIn Post":
            aiPrompt = `Repurpose the following content into a professional LinkedIn post. Focus on thought leadership and industry insights. Use appropriate hashtags and spacing for readability.\n\nContent:\n${content}`;
            break;
        case "Summary":
            aiPrompt = `Provide a concise summary of the following content. Capture the key points and main takeaways in bullet points.\n\nContent:\n${content}`;
            break;
        default:
            aiPrompt = `Repurpose the following content into ${format}:\n\n${content}`;
    }

    // Fetch voice fingerprint from profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('voice_fingerprint')
        .eq('id', user.id)
        .single();

    const voiceFingerprint = profile?.voice_fingerprint;

    // Build the enhanced prompt
    const finalPrompt = buildEnhancedSystemPrompt(
        aiPrompt,
        voiceFingerprint ? JSON.stringify(voiceFingerprint) : null,
        language
    );

    let resultText = "";
    let provider = "";

    // 0. Ollama (Local/Remote - Primary)
    try {
        const result = await ollamaService.chat(finalPrompt, "You are a professional content repurposing assistant. Output only the repurposed content.");
        if (result && result.length > 20) {
            resultText = result;
            provider = 'ollama';
        }
    } catch (ollamaErr:any) {
        // Fallback
    }

    // 0.5 Gradio (Secondary Free)
    if (!resultText) {
        try {
            const chatPrompt = `You are a professional content repurposing assistant. Output only the repurposed content.\n\nTask: ${aiPrompt}`;
            const result = await gradioService.predictText(chatPrompt);
            if (result && result.length > 20) {
                resultText = result;
                provider = 'gradio';
            }
        } catch (gradioErr:any) {
            // Fallback
        }
    }
    
    // 1. OpenAI (Primary Paid)
    if (!resultText) {
        const openAiKey = process.env.OPENAI_API_KEY;
        if (openAiKey && openAiKey.length > 20) {
            try {
                const openai = new OpenAI({ apiKey: openAiKey });
                const completion = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: finalPrompt }],
                    temperature: 0.7,
                });
                resultText = completion.choices[0].message.content || "";
                provider = 'openai';
            } catch (err:any) {
                // Fallback
            }
        }
    }

    // 2. Fallback to Gemini
    if (!resultText && apiKey && apiKey.length > 10) {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(finalPrompt);
            if (result) {
                resultText = (await result.response).text();
                provider = 'gemini';
            }
        } catch (err:any) {
            // Fallback
        }
    }

    // 3. Embedded AI Core (Ultimate Fallback)
    if (!resultText) {
        const embeddedResult = embeddedAICore.repurpose(content, format);
        resultText = embeddedResult.text;
        provider = 'embedded';
    }

    // Mandatory: Deduct credits after successful AI call
    await deductCredits();

    return NextResponse.json({ text: resultText, provider });
}

export const POST = withAuthAndCredits(repurposeHandler, { 
    requireCredits: 1, 
    actionName: 'Repurpose Content' 
});
