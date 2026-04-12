import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits } from '@/lib/api-utils';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

async function generateAllHandler(req: NextRequest, { user, supabase, deductCredits }: any) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const googleToken = process.env.GEMINI_API_KEY;
    const openaiToken = process.env.OPENAI_API_KEY;

    if (!googleToken && !openaiToken) {
        throw new Error("No AI providers configured.");
    }

    const generateText = async (promptSnippet: string) => {
        const fullPrompt = `${promptSnippet}\n\nContent Source:\n${content.substring(0, 10000)}`;
        if (googleToken && googleToken.length > 20) {
            const genAI = new GoogleGenerativeAI(googleToken);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(fullPrompt);
            return result.response.text();
        } else {
            const openai = new OpenAI({ apiKey: openaiToken });
            const result = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: fullPrompt }],
            });
            return result.choices[0].message.content || '';
        }
    };

    // Parallel extraction
    const [twitter, linkedin, newsletter] = await Promise.all([
        generateText("Repurpose the following content into a viral Twitter/X thread. Maximum 5-6 tweets. Number them. Use a catchy hook."),
        generateText("Repurpose the following content into a highly engaging LinkedIn post. Use good formatting, a hook, and clear professional takeaways. Add line breaks."),
        generateText("Repurpose the following content into a high-value Email Newsletter. Subject line first, then an engaging body that summarizes the key value.")
    ]);

    await deductCredits();

    // Save to snippets silently
    await Promise.all([
        supabase.from('snippets').insert({ user_id: user.id, content: twitter, platform: 'Twitter', type: 'text', title: 'Viral Thread' }),
        supabase.from('snippets').insert({ user_id: user.id, content: linkedin, platform: 'LinkedIn', type: 'text', title: 'LinkedIn Post' }),
        supabase.from('snippets').insert({ user_id: user.id, content: newsletter, platform: 'Email', type: 'text', title: 'Newsletter' })
    ]);

    return NextResponse.json({ twitter, linkedin, newsletter });
  } catch (error: any) {
    console.error('Parallel Repurpose error:', error);
    return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 });
  }
}

export const POST = withAuthAndCredits(generateAllHandler, {
  requireCredits: 3, // Costs 3 credits because it generates 3 items
  actionName: 'Repurpose Parallel'
});
