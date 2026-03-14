import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const { content, format } = await req.json();

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey.includes('dummy')) {
            // Handle mock/demo mode on server side
            return NextResponse.json({
                text: `[DEMO MODE] This is server-side simulated content for ${format}. Please provide a valid GEMINI_API_KEY in environment variables for real generation.`,
                isDemo: true
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        let prompt = "";
        switch (format) {
            case "Blog Post":
                prompt = `Repurpose the following content into a comprehensive blog post. Use a professional yet engaging tone. Structure it with a catchy title, introduction, main body with headings, and a conclusion.\n\nContent:\n${content}`;
                break;
            case "Twitter Thread":
                prompt = `Repurpose the following content into a viral Twitter (X) thread. Create 5-10 tweets. Number them (e.g., 1/8). Start with a strong hook. Use emojis where appropriate.\n\nContent:\n${content}`;
                break;
            case "Email Newsletter":
                prompt = `Repurpose the following content into an engaging email newsletter. Include a subject line, a warm greeting, the main value proposition, and a call to action.\n\nContent:\n${content}`;
                break;
            case "LinkedIn Post":
                prompt = `Repurpose the following content into a professional LinkedIn post. Focus on thought leadership and industry insights. Use appropriate hashtags and spacing for readability.\n\nContent:\n${content}`;
                break;
            case "Summary":
                prompt = `Provide a concise summary of the following content. Capture the key points and main takeaways in bullet points.\n\nContent:\n${content}`;
                break;
            default:
                prompt = `Repurpose the following content into ${format}:\n\n${content}`;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return NextResponse.json({ text: response.text() });

    } catch (error) {
        console.error('AI Content Generation Error:', error);
        return NextResponse.json({
            error: 'AI Content Generation failed.',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
