
import fs from 'fs';
import path from 'path';

// Simple env parser
const parseEnv = (content) => {
    const env = {};
    content.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            env[key] = value;
        }
    });
    return env;
};

// Load env vars
const envPath = path.resolve(process.cwd(), '.env');
const envLocalPath = path.resolve(process.cwd(), '.env.local');

let envVars = {};
if (fs.existsSync(envPath)) {
    try {
        const content = fs.readFileSync(envPath, 'utf8');
        envVars = { ...envVars, ...parseEnv(content) };
    } catch (e) {
        console.error('Error reading .env:', e.message);
    }
}
if (fs.existsSync(envLocalPath)) {
    try {
        const content = fs.readFileSync(envLocalPath, 'utf8');
        envVars = { ...envVars, ...parseEnv(content) };
    } catch (e) {
        console.error('Error reading .env.local:', e.message);
    }
}

const razorpayKey = envVars.VITE_RAZORPAY_KEY_ID;
const paypalClientId = envVars.VITE_PAYPAL_CLIENT_ID;

console.log('Checking Payment Keys...');

if (!razorpayKey) {
    console.error('❌ Razorpay Key ID is MISSING.');
} else if (razorpayKey.includes('dummy') || razorpayKey.includes('your_razorpay')) {
    console.error('❌ Razorpay Key ID is a PLACEHOLDER.');
} else {
    console.log('✅ Razorpay Key ID found.');
}

if (!paypalClientId) {
    console.error('❌ PayPal Client ID is MISSING.');
} else if (paypalClientId.includes('dummy') || paypalClientId.includes('your_paypal')) {
    console.error('❌ PayPal Client ID is a PLACEHOLDER.');
} else {
    console.log('✅ PayPal Client ID found.');
}
