import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { generateText } from '@/lib/ai/providers';
import { logger } from '@/lib/logger';
import { VoiceFingerprint } from '@/types/database';

async function brandVoiceAnalyseHandler(req: NextRequest, { user, supabase, deductCredits }: AuthContext) {
  const route = '/api/brand-voice/analyse';
  
  try {
    const { samples } = await req.json();

    if (!samples || !Array.isArray(samples) || samples.length < 3) {
      return NextResponse.json({ 
        success: false,
        code: 'INVALID_INPUT',
        message: 'At least 3 writing samples are required' 
      }, { status: 400 });
    }

    const prompt = `
      Analyse these writing samples and extract a detailed voice fingerprint. 
      Return a JSON object with these exact fields:
      sentence_style (string), 
      vocabulary_level (string - e.g. "Simple", "Academic", "Streetwise"), 
      emoji_usage (string), 
      hook_style (string), 
      tone_percentages (object with inspiring, educational, entertaining, conversational, authoritative each 0-100), 
      signature_phrases (array of 3-5 strings), 
      cta_style (string), 
      voice_summary (exactly 2 sentences), 
      voice_score (0-100), 
      generation_instructions (a detailed paragraph telling an AI exactly how to write in this person's style — this is the most important field).

      Writing Samples:
      ${samples.join('\n\n---\n\n')}
    `;

    const text = await generateText({
      routeType: 'voice_analysis',
      prompt,
      jsonMode: true,
    });
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI failed to generate a structured voice fingerprint");
    }

    const fingerprint: VoiceFingerprint = JSON.parse(jsonMatch[0]);

    // Update Profile
    const { error: updateError } = await supabase.from('profiles').update({
      voice_fingerprint: fingerprint,
      voice_analyzed_at: new Date().toISOString()
    }).eq('id', user.id);

    if (updateError) throw updateError;

    // Deduct Credits (Analysis costs 2 credits)
    await deductCredits();

    return NextResponse.json({ success: true, fingerprint });
  } catch (error:any) {
    logger.error({ 
      route,
      userId: user.id, 
      message: error.message, 
      data: { stack: error.stack }
    });
    
    return NextResponse.json({ success: false, code: 'ANALYSIS_FAILED', message: error.message || 'Failed to analyse brand voice' }, { status: 500 });
  }
}

export const POST = withAuthAndCredits(brandVoiceAnalyseHandler, {
  requireCredits: 2,
  actionName: 'Analyse Brand Voice'
});
