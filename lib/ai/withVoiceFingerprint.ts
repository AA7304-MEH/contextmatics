import { createClient } from '@/utils/supabase/server';

const HINGLISH_INSTRUCTION = "Mix Hindi and English naturally. Use English for technical or modern terms, and Hindi for emotional or conversational connectors. Keep it Hinglish, not pure Hindi.";

export async function withVoiceFingerprint(userId: string, basePrompt: string, enabled: boolean = true): Promise<string> {
  if (!enabled) return basePrompt;
  const supabase = createClient();
  const { data } = await supabase.from('voice_fingerprints').select('generation_instructions').eq('user_id', userId).single();
  if (!data?.generation_instructions) return basePrompt;
  
  return buildEnhancedSystemPrompt(basePrompt, data.generation_instructions);
}

export function buildEnhancedSystemPrompt(
  basePrompt: string,
  voiceInstructions: string | null,
  language: string = 'english'
): string {
  const parts: string[] = [];
  
  if (voiceInstructions) {
    parts.push(`VOICE INSTRUCTIONS:\n${voiceInstructions}`);
  }
  
  if (language === 'hinglish') {
    parts.push(`LANGUAGE: Write in Hinglish (Hindi+English mix, Roman script only). ${HINGLISH_INSTRUCTION}`);
  } else if (language !== 'english' && language) {
    parts.push(`LANGUAGE: Write in ${language}. Sound like a native speaker, not a translation.`);
  }
  
  parts.push(`PLATFORM INSTRUCTIONS:\n${basePrompt}`);
  
  return parts.join('\n\n');
}
