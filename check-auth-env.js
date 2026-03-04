
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load env vars
const envPath = path.resolve(process.cwd(), '.env');
const envLocalPath = path.resolve(process.cwd(), '.env.local');

let envVars = {};
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  envVars = { ...envVars, ...envConfig };
}
if (fs.existsSync(envLocalPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envLocalPath));
  envVars = { ...envVars, ...envConfig };
}

const key = envVars.VITE_CLERK_PUBLISHABLE_KEY || envVars.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

console.log('Checking Clerk Key...');
if (!key) {
  console.error('❌ Clerk Publishable Key is MISSING.');
} else {
  const isDevMode = false; // Assuming we want to check for real keys
  const isValidFormat = /^pk_(test|live)_.{20,}$/.test(key);
  const isPlaceholder = key.includes('dummy') || key.includes('your_clerk');
  
  if (isPlaceholder) {
    console.error('❌ Clerk Key is a PLACEHOLDER (dummy/test_dummy).');
  } else if (!isValidFormat) {
    console.error('❌ Clerk Key has INVALID FORMAT.');
  } else {
    console.log('✅ Clerk Key format looks VALID.');
  }
}
