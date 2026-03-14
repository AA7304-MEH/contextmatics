
import pg from 'pg';

const connectionString = 'postgresql://postgres.viidlufyjwdyelmezzjz:contestmatic%40admin@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres';

async function forceCreateAdmin() {
    console.log('🚀 Force-Creating Admin User via SQL...');
    const client = new pg.Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ Connected to Database.');

        const email = 'admin@com.com';
        const password = 'contestmatic@admin';

        // 1. Check if user already exists
        const checkRes = await client.query("SELECT id FROM auth.users WHERE email = $1", [email]);
        if (checkRes.rows.length > 0) {
            console.log('ℹ️ User already exists. Updating password and confirming...');
            await client.query(`
                UPDATE auth.users 
                SET encrypted_password = crypt($1, gen_salt('bf')),
                    email_confirmed_at = now(),
                    updated_at = now(),
                    raw_user_meta_data = '{"full_name": "Admin User"}'
                WHERE email = $2
            `, [password, email]);
        } else {
            console.log('📝 Creating new admin user record...');
            const userId = '00000000-0000-0000-0000-000000000001'; // Fixed ID for admin for simplicity or gen_random_uuid()

            // We'll use gen_random_uuid() to be safe
            await client.query(`
                INSERT INTO auth.users (
                    id, instance_id, email, encrypted_password, email_confirmed_at, 
                    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, confirmation_token
                ) VALUES (
                    gen_random_uuid(), '00000000-0000-0000-0000-000000000000', $1, 
                    crypt($2, gen_salt('bf')), now(), 
                    '{"provider":"email","providers":["email"]}', '{"full_name": "Admin User"}',
                    now(), now(), 'authenticated', ''
                ) RETURNING id
            `, [email, password]);

            console.log('✅ User inserted into auth.users.');

            // Also need to insert into auth.identities to prevent login issues
            const newUser = await client.query("SELECT id FROM auth.users WHERE email = $1", [email]);
            const uid = newUser.rows[0].id;

            await client.query(`
                INSERT INTO auth.identities (
                    id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, provider_id
                ) VALUES (
                    $1, $1, $2, 'email', now(), now(), now(), $1
                ) ON CONFLICT DO NOTHING
            `, [uid, JSON.stringify({ sub: uid, email: email })]);

            console.log('✅ Identity linked.');

            // The trigger should handle public.profiles, but let's be sure
            await client.query(`
                INSERT INTO public.profiles (id, username, full_name, plan, credits_remaining, role)
                VALUES ($1, 'admin', 'Admin User', 'enterprise', 999999, 'admin')
                ON CONFLICT (id) DO UPDATE SET role = 'admin', plan = 'enterprise', credits_remaining = 999999
            `, [uid]);

            console.log('✅ Profile finalized.');
        }

        console.log('\n✨ DONE! You can now log in at http://localhost:3003/sign-in');
        console.log('Email: admin@com.com');
        console.log('Password: contestmatic@admin');

    } catch (err) {
        console.error('❌ Error creating admin:', err);
    } finally {
        await client.end();
    }
}

forceCreateAdmin();
