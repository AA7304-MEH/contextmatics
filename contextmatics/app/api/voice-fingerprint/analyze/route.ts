import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { generateText } from '@/lib/ai/providers';
import { logger } from '@/lib/logger';
import { VoiceFingerprint } from '@/types/database';

async function analyzeVoiceHandler(request: NextRequest, { user, supabase, deductCredits }: AuthContext) {
  try {
    const { samples } = await request.json();

    if (!samples || !Array.isArray(samples) || samples.length < 3) {
      return NextResponse.json({ success: false, code: 'INVALID_INPUT', message: 'At least 3 writing samples are required' }, { status: 400 });
    }

    const validSamples = samples.filter(s => typeof s === 'string' && s.length >= 50);
    if (validSamples.length < 3) {
      return NextResponse.json({ success: false, code: 'SAMPLES_TOO_SHORT', message: 'Samples must be at least 50 characters each' }, { status: 400 });
    }

    const analysisPrompt = `
Analyze these ${validSamples.length} social media posts and extract the 
author's unique voice fingerprint. Return ONLY a valid JSON object:
{
  "tone": "string describing overall tone",
  "intensity": number from 1-10,
  "vocabulary_level": "simple" | "intermediate" | "advanced",
  "sentence_structure": "description of sentence patterns",
  "signature_phrases": ["phrase1", "phrase2", "phrase3"],
  "formatting_style": "description of formatting habits",
  "opening_pattern": "how posts typically open",
  "cta_style": "how posts typically end/call to action",
  "topics": ["topic1", "topic2"],
  "avoid": ["thing to never do1", "thing to never do2"]
}

Posts to analyze:
${validSamples.map((s, i) => `[POST ${i+1}]\n${s}`).join('\n\n')}
    `;

    const text = await generateText({
      routeType: 'voice_analysis',
      prompt: analysisPrompt,
      jsonMode: true,
    });
    
    let jsonString = text;
    if (text.includes('```json')) {
      jsonString = text.split('```json')[1].split('```')[0].trim();
    } else if (text.includes('```')) {
      jsonString = text.split('```')[1].split('```')[0].trim();
    }

    const fingerprintData = JSON.parse(jsonString);

    // Update existing fingerprints for this user to is_active=false
    await supabase
      .from('voice_fingerprints')
      .update({ is_active: false })
      .eq('user_id', user.id);

    // Insert new fingerprint
    const { data: newFingerprint, error: insertError } = await supabase
      .from('voice_fingerprints')
      .insert({
        user_id: user.id,
        generation_instructions: JSON.stringify(fingerprintData), // Using generations_instructions for storage as per current schema
        fingerprint: fingerprintData,
        voice_score: fingerprintData.intensity || 5,
        samples_count: validSamples.length,
        analyzed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Deduct credits (Analysing voice costs 2 credits)
    await deductCredits();

    return NextResponse.json({ success: true, data: newFingerprint as VoiceFingerprint }, { status: 200 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('voice-fingerprint analyze failed', { 
      route: '/api/voice-fingerprint/analyze', userId: user.id, error: errorMessage 
    });
    return NextResponse.json({ success: false, code: 'ANALYSIS_FAILED', message: errorMessage }, { status: 500 });
  }
}

export const POST = withAuthAndCredits(analyzeVoiceHandler, {
  requireCredits: 2,
  actionName: 'voice-fingerprint-analyze'
});
