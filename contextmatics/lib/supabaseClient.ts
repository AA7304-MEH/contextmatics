import { createBrowserClient } from '@supabase/ssr';
import { env } from '../config/env';

// Create a browser-safe Supabase client that syncs cookies with the server
export const supabase = createBrowserClient(
    env.SUPABASE_URL || '',
    env.SUPABASE_ANON_KEY || ''
);

if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    console.error('CRITICAL: Supabase environment variables missing!');
}
