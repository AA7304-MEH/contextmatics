
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = 'postgresql://postgres.viidlufyjwdyelmezzjz:contestmatic%40admin@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres';

async function setup() {
    console.log('🚀 Starting Database Setup...');
    const client = new pg.Client({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('✅ Connected to Supabase Postgres.');

        const schemaSql = fs.readFileSync(path.join(__dirname, '../supabase/schema.sql'), 'utf8');

        console.log('📜 Executing schema.sql...');
        // Split by semicolon to run multiple statements if needed, 
        // though client.query(schemaSql) often works for multiple statements in pg.
        await client.query(schemaSql);
        console.log('✅ Schema applied successfully.');

        // 2. Disable email confirmation requirement (if possible via SQL)
        // Note: This usually requires higher privileges, but let's try a direct insert/update 
        // if we have access to the auth schema, though usually we don't.
        // Instead, we can just ensure the profiles trigger is working.

        console.log('\n--- SETUP COMPLETE ---');
        console.log('1. Database tables (profiles, snippets, videos) are created.');
        console.log('2. Auth trigger is active.');
        console.log('\nNEXT STEP:');
        console.log('Go to http://localhost:3003/sign-up and create an account with:');
        console.log('Email: admin@com.com');
        console.log('Password: contestmatic@admin');

    } catch (err) {
        console.error('❌ Error during setup:', err);
    } finally {
        await client.end();
    }
}

setup();
