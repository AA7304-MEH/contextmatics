import { createBrowserClient } from '@supabase/ssr';
import { env } from '../config/env';

// Add placeholder values for build-time safety
const supabaseUrl = env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = env.SUPABASE_ANON_KEY || 'placeholder';

// Create a browser-safe Supabase client that syncs cookies with the server
export const supabase = createBrowserClient(supabaseUrl, supabaseKey);

if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    console.error('CRITICAL: Supabase environment variables missing!');
}
