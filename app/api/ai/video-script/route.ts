import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { embeddedAICore } from '@/services/embeddedAICore';
import { ollamaService } from '@/services/ollamaService';

export async function POST(req: NextRequest) {
    try {
        const { topic, style, purpose, targetDuration } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey.includes('dummy')) {
            return NextResponse.json({ 
                error: 'GEMINI_API_KEY is not configured or in dummy mode.',
                isDemo: true 
            }, { status: 503 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const sceneCount = Math.max(3, Math.ceil(targetDuration / 5));

        const aiPrompt = `You are a professional faceless video scriptwriter for TikTok, Instagram Reels, and YouTube Shorts.

Create a ${targetDuration}-second faceless video script about: "${topic}"
Style: ${style} | Purpose: ${purpose}

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "title": "catchy video title",
  "keyPoints": ["point1", "point2", "point3"],
  "scenes": [
    {
      "text": "narration text for this scene (max 15 words)",
      "visualDescription": "what the viewer sees (be specific, cinematic)",
      "duration": 4,
      "shotType": "Close-up",
      "motionIntent": "Slow zoom in",
      "visualMotif": "descriptive style label",
      "vfx": "none"
    }
  ]
}

Rules:
- Generate exactly ${sceneCount} scenes
- shotType must be one of: Close-up, Wide, Establishing, Dynamic, Overhead, POV, Tracking
- motionIntent must be one of: Slow zoom in, Quick pan, Parallax scroll, Static, Dolly out, Tilt up, Orbit
- vfx must be one of: light leaks, particle burst, glitch, film grain, chromatic aberration, none
- Scene durations should sum to approximately ${targetDuration} seconds
- First scene must be a hook that grabs attention
- Last scene should be a CTA
- Text should be punchy, conversational, and viral-worthy`;

        let resultText = "";

        // 0. Ollama (Self-Powered Local/Remote Model - Primary for this user)
        try {
            console.log(`[AI Video Script] Attempting with Ollama (${OLLAMA_URL})...`);
            const result = await ollamaService.chat(aiPrompt, "You are a professional faceless video scriptwriter. You MUST return ONLY a valid JSON object matching the requested schema. No markdown, no intro/outro.");
            if (result) {
                // The result might have markdown code blocks, strip them
                const cleanResult = result.replace(/^```json/i, '').replace(/```$/i, '').trim();
                try {
                    const parsed = JSON.parse(cleanResult);
                    console.log(`[AI Video Script] Success with Ollama`);
                    return NextResponse.json({ ...parsed, provider: 'ollama' });
                } catch (parseErr) {
                    console.warn(`[AI Video Script] Ollama JSON parse failed, trying fallback...`);
                }
            }
        } catch (ollamaErr: any) {
            console.warn(`[AI Video Script] Ollama failed (timeout or offline), falling back...`);
        }

        // 1. Try OpenAI (Primary - User requested "Powerful Model")
        const openAiKey = process.env.OPENAI_API_KEY;
        if (openAiKey && !openAiKey.includes('dummy') && openAiKey.length > 20) {
            const openAiModels = ["gpt-4o", "gpt-4o-mini"];
            for (const modelName of openAiModels) {
                try {
                    console.log(`[AI Video Script] Attempting with OpenAI model: ${modelName}`);
                    const openai = new OpenAI({ apiKey: openAiKey });
                    const completion = await openai.chat.completions.create({
                        model: modelName,
                        messages: [
                            { role: "system", content: "You are a professional faceless video scriptwriter. You MUST return ONLY a valid JSON object matching the requested schema." },
                            { role: "user", content: aiPrompt }
                        ],
                        response_format: { type: "json_object" },
                        temperature: 0.7,
                    });
                    resultText = completion.choices[0].message.content || "";
                    if (resultText) {
                        console.log(`[AI Video Script] Success with OpenAI ${modelName}`);
                        try {
                            const parsed = JSON.parse(resultText);
                            return NextResponse.json(parsed);
                        } catch (e) {
                            console.warn(`[AI Video Script] OpenAI ${modelName} JSON parse failed, trying fallback...`);
                        }
                    }
                } catch (err: any) {
                    console.warn(`[AI Video Script] OpenAI ${modelName} failed:`, err.message);
                }
            }
        }

        // 2. Fallback to Gemini (Secondary)
        if (apiKey && !apiKey.includes('dummy') && apiKey.length > 10) {
            const genAI = new GoogleGenerativeAI(apiKey);
            const modelsToTry = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro"];

            for (const modelName of modelsToTry) {
                try {
                    console.log(`[AI Video Script] Attempting with model: ${modelName}`);
                    const model = genAI.getGenerativeModel({ model: modelName });
                    const result = await model.generateContent(aiPrompt);
                    if (result) {
                        const response = await result.response;
                        resultText = response.text().trim();
                        console.log(`[AI Video Script] Success with model: ${modelName}`);
                        break;
                    }
                } catch (err: any) {
                    console.warn(`[AI Video Script] Model ${modelName} failed:`, err.message);
                }
            }
        }

        // 3. Embedded AI Core (Ultimate Fallback - "Supercharged" Local Processing)
        console.log('[AI Video Script] Activating Embedded AI Core V2 (Local Processing)...');
        const embeddedScript = embeddedAICore.generateVideoScript(topic, style);
        return NextResponse.json(embeddedScript);

    } catch (error) {
        console.error('AI Script Generation Error:', error);
        return NextResponse.json({
            error: 'AI Script Generation failed.',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
