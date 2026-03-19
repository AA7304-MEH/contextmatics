import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { embeddedAICore } from '@/services/embeddedAICore';
import { ollamaService } from '@/services/ollamaService';
import { gradioService } from '@/services/gradioService';

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/chat";

export async function POST(req: NextRequest) {
    try {
        const { content, format } = await req.json();

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        console.log('[AI Repurpose] Key found:', apiKey ? `${apiKey.substring(0, 6)}...` : 'NONE');
        console.log('[AI Repurpose] Request format:', format);

        if (!apiKey || apiKey.includes('dummy') || apiKey.length < 10) {
            // Handle mock/demo mode on server side
            return NextResponse.json({
                text: `[DEMO MODE] This is server-side simulated content for ${format}. Please provide a valid GEMINI_API_KEY in environment variables for real generation.`,
                isDemo: true
            });
        }

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

        let resultText = "";

        // 0. Ollama (Self-Powered Local/Remote Model - Primary for this user)
        try {
            console.log(`[AI Repurpose] Attempting with Ollama (${OLLAMA_URL})...`);
            const result = await ollamaService.chat(aiPrompt, "You are a professional content repurposing assistant. Your output should be clean, structured, and ready to use. Output only the repurposed content.");
            if (result && result.length > 20) {
                console.log(`[AI Repurpose] Success with Ollama`);
                return NextResponse.json({ text: result, provider: 'ollama' });
            }
        } catch (ollamaErr: any) {
            console.warn(`[AI Repurpose] Ollama failed (timeout or offline), falling back...`);
        }

        // 0.5 Gradio (HuggingFace Hosted Gemma 2 - High Quality)
        try {
            console.log(`[AI Repurpose] Attempting with Gradio (Gemma 2)...`);
            const chatPrompt = `You are a professional content repurposing assistant. Your output should be clean, structured, and ready to use. Output only the repurposed content.\n\nTask: ${aiPrompt}`;
            const result = await gradioService.predictText(chatPrompt);
            if (result && result.length > 20) {
                console.log(`[AI Repurpose] Success with Gradio`);
                return NextResponse.json({ text: result, provider: 'gradio' });
            }
        } catch (gradioErr: any) {
            console.warn(`[AI Repurpose] Gradio failed, falling back...`);
        }
        
        // 1. Try OpenAI (Primary - User requested "Powerful Model")
        const openAiKey = process.env.OPENAI_API_KEY;
        if (openAiKey && !openAiKey.includes('dummy') && openAiKey.length > 20) {
            const openAiModels = ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"];
            for (const modelName of openAiModels) {
                try {
                    console.log(`[AI Repurpose] Attempting with OpenAI model: ${modelName}`);
                    const openai = new OpenAI({ apiKey: openAiKey });
                    const completion = await openai.chat.completions.create({
                        model: modelName,
                        messages: [
                            { role: "system", content: "You are a professional content repurposing assistant. Your output should be clean, structured, and ready to use." },
                            { role: "user", content: aiPrompt }
                        ],
                        temperature: 0.7,
                    });
                    resultText = completion.choices[0].message.content || "";
                    if (resultText) {
                        console.log(`[AI Repurpose] Success with OpenAI ${modelName}`);
                        return NextResponse.json({ text: resultText });
                    }
                } catch (err: any) {
                    console.warn(`[AI Repurpose] OpenAI ${modelName} failed:`, err.message);
                }
            }
        }

        // 2. Fallback to Gemini (Secondary)
        if (apiKey && !apiKey.includes('dummy') && apiKey.length > 10) {
            const genAI = new GoogleGenerativeAI(apiKey);
            const modelsToTry = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro"];

            for (const modelName of modelsToTry) {
                try {
                    console.log(`[AI Repurpose] Attempting with model: ${modelName}`);
                    const model = genAI.getGenerativeModel({ model: modelName });
                    const result = await model.generateContent(aiPrompt);
                    if (result) {
                        const response = await result.response;
                        resultText = response.text();
                        console.log(`[AI Repurpose] Success with model: ${modelName}`);
                        return NextResponse.json({ text: resultText });
                    }
                } catch (err: any) {
                    console.warn(`[AI Repurpose] Model ${modelName} failed:`, err.message);
                }
            }
        }

        // 3. Embedded AI Core (Ultimate Fallback - "Supercharged" Local Processing)
        console.log('[AI Repurpose] Activating Embedded AI Core V2 (Local Processing)...');
        const embeddedResult = embeddedAICore.repurpose(content, format);
        return NextResponse.json(embeddedResult);

    } catch (error: any) {
        console.error('AI Content Generation Error Details:', {
            message: error.message,
            status: error.status,
            statusText: error.statusText,
            stack: error.stack
        });
        return NextResponse.json({
            error: 'AI Content Generation failed.',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
