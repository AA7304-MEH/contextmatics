import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext, ApiHandler } from '@/lib/api-utils';
import { generateText } from '@/lib/ai/providers';
import { logger } from '@/lib/logger';
import { SocialInboxItem, VoiceFingerprint } from '@/types/database';

async function inboxHandler(request: NextRequest, { user, supabase, deductCredits }: AuthContext) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action'); // 'list' | 'suggest' | 'reply'

    if (action === 'suggest') {
      const { text, platform } = await request.json();

      // Fetch Active Voice Fingerprint
      const { data: activeFPData } = await supabase
        .from('voice_fingerprints')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      const activeFP = activeFPData as VoiceFingerprint | null;

      const prompt = `
Generate a personalized, engaging reply to this social media message.
PLATFORM: ${platform}
MESSAGE: "${text}"

${activeFP ? `USER VOICE FINGERPRINT:\n${JSON.stringify(activeFP.fingerprint, null, 2)}` : 'Tone: Professional & Helpful'}

Reply Rules:
- Stay true to the user's voice
- Keep it concise (max 2-3 sentences)
- If it's a compliment, show gratitude
- If it's a question, be helpful
- Encourage further engagement

Return only the suggested text.
      `;

      const suggestion = await generateText({
        routeType: 'reply_suggest',
        prompt,
      });

      // Deduct 1 credit for suggestion
      await deductCredits();

      return NextResponse.json({ success: true, data: { suggestion: suggestion.trim() } }, { status: 200 });
    }

    if (action === 'reply') {
      const { messageId } = await request.json();
      
      // In production, this would call Ayrshare's reply API
      // For now, we update the local status
      const { data } = await supabase
        .from('social_inbox')
        .update({ status: 'replied' })
        .eq('id', messageId)
        .eq('user_id', user.id)
        .select()
        .single();

      return NextResponse.json({ success: true, data: data as SocialInboxItem }, { status: 200 });
    }

    // Default: List messages
    const { data: messages, error } = await supabase
      .from('social_inbox')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: (messages || []) as SocialInboxItem[] }, { status: 200 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('audience inbox action failed', { userId: user.id, error: errorMessage });
    return NextResponse.json({ success: false, code: 'INBOX_FAILED', message: errorMessage }, { status: 500 });
  }
}

export const GET = withAuthAndCredits(inboxHandler as ApiHandler, { actionName: 'audience-inbox-list' });
export const POST = withAuthAndCredits(inboxHandler as ApiHandler, { requireCredits: 1, actionName: 'audience-inbox-suggest' });
