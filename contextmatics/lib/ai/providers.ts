import { Groq } from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fal } from '@fal-ai/client';
import { trackUsage } from './usageTracker';
import { withRetry } from './rateLimit';
import * as fs from 'fs';

let groq: Groq | null = null;
let gemini: GoogleGenerativeAI | null = null;

function getGroq() {
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'dummy' });
  }
  return groq;
}

function getGemini() {
  if (!gemini) {
    gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy');
  }
  return gemini;
}

type RouteType = 
  | 'social_post' | 'thread' | 'hook_score' | 'reply_suggest'
  | 'long_form' | 'repurpose' | 'translate' | 'video_script' | 'monetise' | 'competitor_analyse'
  | 'voice_analysis' | 'content_plan';

export interface GenerateTextOptions {
  routeType: RouteType;
  prompt: string;
  systemPrompt?: string;
  jsonMode?: boolean;
}

async function callGroq(model: string, options: GenerateTextOptions): Promise<string> {
  const messages:any[] = [];
  if (options.systemPrompt) {
    messages.push({ role: 'system', content: options.systemPrompt });
  }
  messages.push({ role: 'user', content: options.prompt });

  const groqClient = getGroq();
  const completion = await groqClient.chat.completions.create({
    model,
    messages,
    response_format: options.jsonMode ? { type: 'json_object' } : { type: 'text' },
  });

  await trackUsage('groq');
  return completion.choices[0]?.message?.content || '';
}

async function callGemini(modelName: string, options: GenerateTextOptions): Promise<string> {
  const geminiClient = getGemini();
  const model = geminiClient.getGenerativeModel({ 
    model: modelName,
    systemInstruction: options.systemPrompt,
    generationConfig: options.jsonMode ? { responseMimeType: "application/json" } : {}
  });

  const result = await model.generateContent(options.prompt);
  await trackUsage(modelName === 'gemini-1.5-flash' ? 'gemini_flash' : 'gemini_pro');
  return result.response.text();
}

export async function generateText(options: GenerateTextOptions): Promise<string> {
  const retryOpts = { maxRetries: 2, baseDelayMs: 1000, taskName: options.routeType };

  const tryGroqFallbackChain = async (models: ('groq' | 'gemini_flash' | 'gemini_pro')[]) => {
    let lastError:any;
    for (const model of models) {
      try {
        if (model === 'groq') {
          return await withRetry(() => callGroq('llama-3.3-70b-versatile', options), retryOpts);
        } else if (model === 'gemini_flash') {
          return await withRetry(() => callGemini('gemini-1.5-flash', options), retryOpts);
        } else if (model === 'gemini_pro') {
          return await withRetry(() => callGemini('gemini-1.5-pro', options), retryOpts);
        }
      } catch (err) {
        lastError = err;
        console.warn(`Fallback triggered: ${model} failed for ${options.routeType}`);
      }
    }
    throw lastError;
  };

  if (['social_post', 'thread', 'hook_score', 'reply_suggest'].includes(options.routeType)) {
    return tryGroqFallbackChain(['groq', 'gemini_flash', 'gemini_pro']);
  }
  if (['long_form', 'repurpose', 'translate', 'video_script', 'monetise', 'competitor_analyse'].includes(options.routeType)) {
    return tryGroqFallbackChain(['gemini_flash', 'groq', 'gemini_pro']);
  }
  if (['voice_analysis', 'content_plan'].includes(options.routeType)) {
    return tryGroqFallbackChain(['gemini_pro', 'gemini_flash', 'groq']);
  }

  throw new Error(`Unknown routeType: ${options.routeType}`);
}

export async function transcribeAudio(audioBuffer: Buffer | fs.ReadStream): Promise<string> {
  let file:any;
  if (Buffer.isBuffer(audioBuffer)) {
    file = new File([new Uint8Array(audioBuffer)], 'audio.mp3', { type: 'audio/mp3' });
  } else {
    file = audioBuffer;
  }

  const retryOpts = { maxRetries: 2, baseDelayMs: 1000, taskName: 'transcribe' };

  try {
    return await withRetry(async () => {
      const groqClient = getGroq();
      const response = await groqClient.audio.transcriptions.create({
        file,
        model: 'whisper-large-v3',
      });
      await trackUsage('groq');
      return response.text;
    }, retryOpts);
  } catch (err) {
    console.warn(`Fallback triggered: whisper-large-v3 failed, trying turbo`);
    return await withRetry(async () => {
      const groqClient = getGroq();
      const response = await groqClient.audio.transcriptions.create({
        file,
        model: 'whisper-large-v3-turbo',
      });
      await trackUsage('groq');
      return response.text;
    }, retryOpts);
  }
}

export async function generateImage(prompt: string): Promise<string> {
  const retryOpts = { maxRetries: 2, baseDelayMs: 1000, taskName: 'image' };

  const tryHF = async (model: string) => {
    const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!res.ok) {
      throw new Error(`HF API error: ${res.status}`);
    }

    const buffer = await res.arrayBuffer();
    await trackUsage('huggingface');
    return `data:${res.headers.get('content-type')};base64,${Buffer.from(buffer).toString('base64')}`;
  };

  try {
    return await withRetry(() => tryHF('black-forest-labs/FLUX.1-schnell'), retryOpts);
  } catch (err) {
    console.warn(`Fallback triggered: HF FLUX failed, trying SDXL`);
    return await withRetry(() => tryHF('stabilityai/stable-diffusion-xl-base-1.0'), retryOpts);
  }
}

export async function generateVideo(_prompt: string, imageUrl?: string): Promise<string> {
  const retryOpts = { maxRetries: 2, baseDelayMs: 1000, taskName: 'video' };
  try {
    return await withRetry(async () => {
      const result:any = await fal.subscribe("fal-ai/fast-svd", {
        input: { image_url: imageUrl },
      });
      await trackUsage('fal');
      return result.video?.url || '';
    }, retryOpts);
  } catch (err) {
    throw new Error('Video generation temporarily unavailable');
  }
}

export async function getProviderStatus(): Promise<Record<string, { available: boolean; latencyMs: number }>> {
  const checks = await Promise.allSettled([
    pingGroq(),
    pingGeminiFlash(),
    pingHuggingFace(),
  ]);

  return {
    groq: checks[0].status === 'fulfilled' ? checks[0].value : { available: false, latencyMs: 0 },
    gemini_flash: checks[1].status === 'fulfilled' ? checks[1].value : { available: false, latencyMs: 0 },
    huggingface: checks[2].status === 'fulfilled' ? checks[2].value : { available: false, latencyMs: 0 },
  };
}

async function pingGroq(): Promise<{ available: boolean; latencyMs: number }> {
  const start = Date.now();
  const groqClient = getGroq();
  await groqClient.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: 'hi' }],
    max_tokens: 1,
  });
  return { available: true, latencyMs: Date.now() - start };
}

async function pingGeminiFlash(): Promise<{ available: boolean; latencyMs: number }> {
  const start = Date.now();
  const geminiClient = getGemini();
  const model = geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
  await model.generateContent('hi');
  return { available: true, latencyMs: Date.now() - start };
}

async function pingHuggingFace(): Promise<{ available: boolean; latencyMs: number }> {
  const start = Date.now();
  const res = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell', {
    method: 'GET',
    headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
  });
  return { available: res.ok, latencyMs: Date.now() - start };
}
