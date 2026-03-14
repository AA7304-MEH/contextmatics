
import pg from 'pg';

const connectionString = 'postgresql://postgres.viidlufyjwdyelmezzjz:contestmatic%40admin@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres';

async function verifyTables() {
    console.log('🚀 Verifying Database Tables and Permissions...');
    const client = new pg.Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        // 1. Check if profiles table exists and its structure
        const tableCheck = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'profiles'
        `);
        console.log('\n--- Profiles Table Structure ---');
        if (tableCheck.rows.length === 0) {
            console.log('❌ Table "profiles" DOES NOT EXIST.');
        } else {
            tableCheck.rows.forEach(row => console.log(`   ${row.column_name}: ${row.data_type}`));
        }

        // 2. Check if the trigger exists
        const triggerCheck = await client.query(`
            SELECT trigger_name 
            FROM information_schema.triggers 
            WHERE event_object_table = 'users' AND trigger_name = 'on_auth_user_created'
        `);
        // Note: auth.users triggers might not show up here easily, check pg_trigger
        const pgTriggerCheck = await client.query(`
            SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created'
        `);
        console.log('\n--- Trigger Status ---');
        if (pgTriggerCheck.rows.length === 0) {
            console.log('❌ Trigger "on_auth_user_created" NOT FOUND.');
        } else {
            console.log('✅ Trigger exists.');
        }

        // 3. Test a simple select on profiles
        console.log('\n--- Testing Select on Profiles ---');
        const selectTest = await client.query("SELECT COUNT(*) FROM public.profiles");
        console.log(`✅ Profiles count: ${selectTest.rows[0].count}`);

    } catch (err) {
        console.error('❌ Database Verification Error:', err);
    } finally {
        await client.end();
    }
}

verifyTables();
