import { NextRequest, NextResponse } from 'next/server';
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { buildEnhancedSystemPrompt } from '@/lib/ai/withVoiceFingerprint';

export const maxDuration = 30;

const handler = async (req: NextRequest, { user, supabase, deductCredits }: AuthContext) => {
  const { prompt, language = 'english', platform = 'social media' } = await req.json();

  // 1. Fetch fingerprint
  const { data: fingerprintData } = await supabase
    .from('voice_fingerprints')
    .select('generation_instructions')
    .eq('user_id', user.id)
    .single();

  const systemPrompt = buildEnhancedSystemPrompt(
    "Write an engaging, platform-optimized post.",
    fingerprintData?.generation_instructions || null,
    language
  );

  const result = streamText({
    model: google('models/gemini-1.5-pro'),
    system: systemPrompt,
    prompt: prompt,
    onFinish: async (event) => {
      // 2. Deduct credit after success
      await deductCredits();

      // 3. Save to DB
      await supabase.from('snippets').insert({
        user_id: user.id,
        content: event.text,
        platform,
        content_type: 'post',
        language,
        credits_used: 1,
      });
    }
  });

  // NextResponse is technically compatible with the stream response structure
  return result.toTextStreamResponse() as unknown as NextResponse;
};

export const POST = withAuthAndCredits(handler, {
  actionName: 'ai_generate',
  requireAuth: true,
  requireCredits: 1,
  rateLimit: 10
});
