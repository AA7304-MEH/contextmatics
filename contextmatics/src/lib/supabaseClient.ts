import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

// Safely create Supabase client to avoid top-level crashes
const supabaseUrl = env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = env.SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(
    supabaseUrl,
    supabaseKey
);

if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    console.error('CRITICAL: Supabase environment variables missing! Application will likely fail.');
}
