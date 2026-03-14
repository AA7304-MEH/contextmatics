
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

const connectionString = 'postgresql://postgres.viidlufyjwdyelmezzjz:contestmatic%40admin@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres';
const supabaseUrl = 'https://viidlufyjwdyelmezzjz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpaWRsdWZ5andkeWVsbWV6emp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1Mzg1MTQsImV4cCI6MjA4ODExNDUxNH0.hnY7cAytN3Qo-Ks8TuRr9ULF1WtLOIhDePp44x6Hutk';

const email = 'admin@com.com';
const password = 'contestmatic@admin';

async function resetAndTest() {
    console.log('🚀 Starting Deep Auth Diagnostic...');

    const pgClient = new pg.Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await pgClient.connect();
        console.log('✅ Connected to Postgres.');

        // 1. Delete existing admin to start fresh
        console.log('🧹 Deleting existing admin user...');
        await pgClient.query("DELETE FROM auth.users WHERE email = $1", [email]);
        console.log('✅ Stale user data cleared.');

        // 2. Test Supabase API Connection
        console.log('🔗 Testing Supabase API connection...');
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        console.log('📝 Attempting Official Sign Up via API...');
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: 'Admin User',
                    username: 'admin'
                }
            }
        });

        if (error) {
            console.error('❌ Sign Up Error:', error.message);
            if (error.message.includes('over_email_send_rate_limit')) {
                console.log('💡 TIP: You hit a rate limit. Wait a minute or check Supabase settings.');
            }
        } else {
            console.log('✅ Sign Up Successful via API!');
            console.log('   User ID:', data.user?.id);
            console.log('   Confirmation Sent:', data.user?.confirmation_sent_at);

            // 3. Confirm email via SQL (since trigger should have handled it, but let's be double sure)
            console.log('⚖️ Confirming email in DB...');
            await pgClient.query("UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = $1", [email]);
            console.log('✅ Email marked as confirmed.');

            // 4. Test Sign In
            console.log('🔑 Testing Sign In with new password...');
            const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

            if (signInError) {
                console.error('❌ Sign In Failed:', signInError.message);
            } else {
                console.log('🎉 SUCCESS! Login working perfectly.');
            }
        }

    } catch (err) {
        console.error('💥 Fatal Diagnostic Error:', err);
    } finally {
        await pgClient.end();
    }
}

resetAndTest();
