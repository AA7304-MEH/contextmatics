import { createClient } from '@/utils/supabase/server';
import { logger } from '@/lib/logger';
export interface CreditResult { success: boolean; remaining: number; }
export async function useCredits(userId: string, amount: number): Promise<CreditResult> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('decrement_credits', { user_id: userId, amount });
  if (error) {
    logger.error({ route: 'useCredits', userId, message: error.message });
    throw { code: 'INSUFFICIENT_CREDITS', remaining: 0 };
  }
  return { success: true, remaining: data };
}
