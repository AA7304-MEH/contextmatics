import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { embeddedAICore } from '@/services/embeddedAICore';
import { ollamaService } from '@/services/ollamaService';
import { withAuthAndCredits } from '@/lib/api-utils';



export async function videoScriptCore(topic: string, style: string, purpose: string, targetDuration: number) {
    const apiKey = process.env.GEMINI_API_KEY;
    const sceneCount = Math.max(3, Math.ceil(targetDuration / 5));

    const aiPrompt = `You are a professional faceless video scriptwriter. Create a ${targetDuration}-second script about: "${topic}"
Style: ${style} | Purpose: ${purpose}

Return ONLY valid JSON with this structure:
{
  "title": "string",
  "keyPoints": ["string"],
  "scenes": [
    {
      "text": "narration (max 15 words)",
      "visualDescription": "cinematic description",
      "duration": 4,
      "shotType": "Close-up|Wide|Dynamic",
      "motionIntent": "Zoom|Pan|Static",
      "vfx": "none|glitch|grain"
    }
  ]
}

Generate exactly ${sceneCount} scenes.`;

    // 0. Ollama (Primary)
    try {
        const result = await ollamaService.chat(aiPrompt, "You are a professional video scriptwriter. Return ONLY valid JSON matching the schema. No markdown.");
        if (result) {
            const cleanResult = result.replace(/^```json/i, '').replace(/```$/i, '').trim();
            const parsed = JSON.parse(cleanResult);
            return { ...parsed, provider: 'ollama' };
        }
    } catch (ollamaErr: any) {
        console.warn(`[AI Video Script] Ollama failed, falling back...`);
    }

    // 1. OpenAI (Paid Fallback)
    const openAiKey = process.env.OPENAI_API_KEY;
    if (openAiKey && openAiKey.length > 20) {
        try {
            const openai = new OpenAI({ apiKey: openAiKey });
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: aiPrompt }],
                response_format: { type: "json_object" },
                temperature: 0.7,
            });
            const resultText = completion.choices[0].message.content || "";
            if (resultText) return JSON.parse(resultText);
        } catch (err: any) {
            console.warn(`[AI Video Script] OpenAI failed:`, err.message);
        }
    }

    // 2. Gemini Fallback
    if (apiKey && apiKey.length > 10) {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(aiPrompt);
            if (result) {
                const text = (await result.response).text().trim();
                const cleanText = text.replace(/^```json/i, '').replace(/```$/i, '').trim();
                return JSON.parse(cleanText);
            }
        } catch (err: any) {
            console.warn(`[AI Video Script] Gemini failed:`, err.message);
        }
    }

    // 3. Embedded AI Core (Ultimate Fallback)
    return embeddedAICore.generateVideoScript(topic, style);
}

async function videoScriptHandler(req: NextRequest, { deductCredits }: any) {
    const { topic, style, purpose, targetDuration } = await req.json();

    if (!topic) {
        return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const result = await videoScriptCore(topic, style, purpose, targetDuration);
    
    await deductCredits();
    
    return NextResponse.json(result);
}

export const POST = withAuthAndCredits(videoScriptHandler, { 
    requireCredits: 2, 
    actionName: 'Generate Video Script' 
});
