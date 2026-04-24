import { generateText } from '@/lib/ai/providers';
import { embeddedAICore } from '@/services/embeddedAICore';
import { ollamaService } from '@/services/ollamaService';

export async function videoScriptCore(topic: string, style: string, purpose: string, targetDuration: number) {
    const sceneCount = Math.max(3, Math.ceil(targetDuration / 5));

    const aiPrompt = `You are a professional faceless video scriptwriter. Create a ${targetDuration}-second script about: "${topic}"
Style: ${style} | Purpose: ${purpose}

Return ONLY valid JSON with this structure:
{
  "title": "string",
  "keyPoints": ["string"],
  "scenes": [
    {
      "text": "narration (max 15 words)",
      "visualDescription": "cinematic description",
      "duration": 4,
      "shotType": "Close-up|Wide|Dynamic",
      "motionIntent": "Zoom|Pan|Static",
      "vfx": "none|glitch|grain"
    }
  ]
}

Generate exactly ${sceneCount} scenes.`;

    // 0. Ollama (Primary — local dev)
    try {
        const result = await ollamaService.chat(aiPrompt, "You are a professional video scriptwriter. Return ONLY valid JSON matching the schema. No markdown.");
        if (result) {
            const cleanResult = result.replace(/^```json/i, '').replace(/```$/i, '').trim();
            const parsed = JSON.parse(cleanResult);
            return { ...parsed, provider: 'ollama' };
        }
    } catch (ollamaErr: unknown) {
        // Fallback silenced
    }

    // 1. Centralised providers (Groq → Gemini fallback chain)
    try {
        const text = await generateText({
            routeType: 'video_script',
            prompt: aiPrompt,
            jsonMode: true,
        });
        if (text) {
            const cleanText = text.replace(/^```json/i, '').replace(/```$/i, '').trim();
            return JSON.parse(cleanText);
        }
    } catch (err: unknown) {
        // Fallback silenced
    }

    // 2. Embedded AI Core (Ultimate Fallback)
    return embeddedAICore.generateVideoScript(topic, style);
}
