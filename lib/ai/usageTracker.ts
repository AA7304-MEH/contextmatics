import { Redis } from '@upstash/redis';
import { logger } from '@/lib/logger';

let redis: Redis | null = null;

function getRedis() {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
        // Fallback for build time if needed
        return null; 
    }
    redis = new Redis({ url, token });
  }
  return redis;
}

export type Provider = 'groq' | 'gemini_flash' | 'gemini_pro' | 'huggingface' | 'fal';

export async function trackUsage(provider: Provider, tokens: number = 1): Promise<void> {
  try {
    const redis = getRedis();
    if (!redis) return;
    const today = new Date().toISOString().split('T')[0];
    const key = `usage:${provider}:${today}`;
    await redis.incrby(key, tokens);
    await redis.expire(key, 86400 * 7);
  } catch (err) {
    logger.warn({ route: 'usageTracker', message: `Failed to track usage for ${provider}`, data: err as any });
  }
}

export async function getDailyUsage(): Promise<Record<Provider, number>> {
  const redis = getRedis();
  if (!redis) return { groq: 0, gemini_flash: 0, gemini_pro: 0, huggingface: 0, fal: 0 };

  const today = new Date().toISOString().split('T')[0];
  const providers: Provider[] = ['groq', 'gemini_flash', 'gemini_pro', 'huggingface', 'fal'];

  try {
    const values = await Promise.all(
      providers.map(p => redis.get<number>(`usage:${p}:${today}`))
    );

    return Object.fromEntries(
      providers.map((p, i) => [p, values[i] ?? 0])
    ) as Record<Provider, number>;
  } catch (err) {
    logger.error({ route: 'usageTracker', message: 'Failed to fetch daily usage', data: err as any });
    return {
      groq: 0,
      gemini_flash: 0,
      gemini_pro: 0,
      huggingface: 0,
      fal: 0
    };
  }
}

// Free tier limits per day
export const FREE_TIER_LIMITS: Record<Provider, number> = {
  groq: 14400,          // requests/day
  gemini_flash: 1500,   // requests/day (free tier)
  gemini_pro: 50,       // requests/day (2 RPM = ~50/day safely)
  huggingface: 1000,    // requests/day
  fal: 100,             // keep low — this one costs money after credit
};

export async function isNearLimit(provider: Provider): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;

  try {
    const today = new Date().toISOString().split('T')[0];
    const used = await redis.get<number>(`usage:${provider}:${today}`) ?? 0;
    const limit = FREE_TIER_LIMITS[provider];
    const nearLimit = used > limit * 0.8;
    if (nearLimit) {
      logger.warn({ route: 'usageTracker', message: `${provider} at ${Math.round(used/limit*100)}% of daily limit` });
    }
    return nearLimit;
  } catch (err) {
    logger.warn({ route: 'usageTracker', message: 'Failed to check if near limit', data: err as any });
    return false;
  }
}
