const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '.env.vercel');
if (!fs.existsSync(envFile)) {
  console.error('.env.vercel not found');
  process.exit(1);
}

const content = fs.readFileSync(envFile, 'utf8');
const lines = content.split('\n');

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  
  const [key, ...rest] = trimmed.split('=');
  const value = rest.join('=');
  
  if (key && value) {
    console.log(`Adding ${key} to Vercel...`);
    try {
      // Use echoing the value to stdin to avoid shell escape issues
      execSync(`echo "${value}" | vercel env add ${key} production --yes`, { stdio: 'inherit' });
    } catch (err) {
      console.warn(`Failed to add ${key}: ${err.message}`);
    }
  }
}

console.log('Environment sync completed!');
