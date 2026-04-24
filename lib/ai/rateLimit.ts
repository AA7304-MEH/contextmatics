import { logger } from '@/lib/logger';

interface RetryOptions {
  maxRetries: number;
  baseDelayMs: number;
  taskName: string;
  userId?: string;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const { maxRetries, baseDelayMs, taskName, userId } = options;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isRateLimit = error instanceof Error &&
        (error.message.includes('429') || error.message.includes('rate') || error.message.includes('quota'));

      if (isRateLimit && attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        logger.warn({ route: taskName, userId, message: `Rate limited. Retry ${attempt}/${maxRetries} in ${delay}ms` });
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      throw error;
    }
  }
  throw new Error(`${taskName} failed after ${maxRetries} retries`);
}
