import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits } from '@/lib/api-utils';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

async function generateAIHandler(req: NextRequest, { user, supabase, deductCredits }: any) {
  try {
    const { topic, platform, tone, brandVoice, contentType, length, advancedInfo, workspace_id } = await req.json();

    if (!topic || !platform) {
      return NextResponse.json({ error: 'Topic and platform are required' }, { status: 400 });
    }

    const aiPrompt = `You are an expert copywriter. Write a ${length || 'medium'} length ${contentType || 'post'} for ${platform} about: "${topic}".
Tone: ${brandVoice ? 'Brand Voice: ' + brandVoice : tone || 'Professional'}
Advanced Instructions: ${advancedInfo || 'None'}`;

    let streamResult;
    let usingProvider = 'gemini';

    const googleToken = process.env.GEMINI_API_KEY;
    const openaiToken = process.env.OPENAI_API_KEY;

    if (googleToken && googleToken.length > 20) {
      const google = createGoogleGenerativeAI({ apiKey: googleToken });
      streamResult = await streamText({
        model: google('models/gemini-1.5-pro-latest'),
        prompt: aiPrompt,
        onFinish: async ({ text }) => {
            await deductCredits();
            await supabase.from('snippets').insert({
                user_id: user.id,
                workspace_id: workspace_id || null,
                content: text,
                platform,
                title: topic.substring(0, 50),
                type: 'text'
            });
        }
      });
    } else if (openaiToken && openaiToken.length > 20) {
      usingProvider = 'openai';
      const openai = createOpenAI({ apiKey: openaiToken });
      streamResult = await streamText({
        model: openai('gpt-4o-mini'),
        prompt: aiPrompt,
        onFinish: async ({ text }) => {
            await deductCredits();
            await supabase.from('snippets').insert({
                user_id: user.id,
                workspace_id: workspace_id || null,
                content: text,
                platform,
                title: topic.substring(0, 50),
                type: 'text'
            });
        }
      });
    } else {
        throw new Error("No AI providers configured.");
    }

    return streamResult.toDataStreamResponse();
  } catch (error: any) {
    console.error('Text generation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate text' }, { status: 500 });
  }
}

export const POST = withAuthAndCredits(generateAIHandler, {
  requireCredits: 1,
  actionName: 'Generate Text'
});
