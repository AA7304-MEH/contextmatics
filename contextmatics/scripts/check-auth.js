
import pg from 'pg';

const connectionString = 'postgresql://postgres.viidlufyjwdyelmezzjz:contestmatic%40admin@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres';

async function check() {
    console.log('🔍 Checking Database for Admin User...');
    const client = new pg.Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        // Check auth.users (requires postgres access which we have)
        const authRes = await client.query("SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'admin@com.com'");
        console.log('\n--- Auth System (auth.users) ---');
        if (authRes.rows.length === 0) {
            console.log('❌ User admin@com.com NOT FOUND in auth.users.');
        } else {
            console.log('✅ User exists in auth.users.');
            console.log('   ID:', authRes.rows[0].id);
            console.log('   Confirmed At:', authRes.rows[0].email_confirmed_at || 'NOT CONFIRMED ⚠️');
        }

        // Check public.profiles
        const profileRes = await client.query("SELECT * FROM public.profiles WHERE id IN (SELECT id FROM auth.users WHERE email = 'admin@com.com')");
        console.log('\n--- Application Database (public.profiles) ---');
        if (profileRes.rows.length === 0) {
            console.log('❌ No entry found in public.profiles for this user.');
        } else {
            console.log('✅ Profile found.');
            console.log('   Role:', profileRes.rows[0].role);
            console.log('   Plan:', profileRes.rows[0].plan);
            console.log('   Credits:', profileRes.rows[0].credits_remaining);
        }

    } catch (err) {
        console.error('❌ Error checking database:', err);
    } finally {
        await client.end();
    }
}

check();
