// Simple build verification script
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Checking build output...');

const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

if (!fs.existsSync(distPath)) {
  console.error('❌ dist directory not found');
  process.exit(1);
}

if (!fs.existsSync(indexPath)) {
  console.error('❌ index.html not found in dist');
  process.exit(1);
}

const indexContent = fs.readFileSync(indexPath, 'utf8');
if (!indexContent.includes('<div id="root">')) {
  console.error('❌ index.html missing root div');
  process.exit(1);
}

console.log('✅ Build output looks good!');
console.log('📁 Files in dist:');
fs.readdirSync(distPath).forEach(file => {
  const filePath = path.join(distPath, file);
  const stats = fs.statSync(filePath);
  console.log(`  ${file} (${Math.round(stats.size / 1024)}KB)`);
});