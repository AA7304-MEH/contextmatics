#!/usr/bin/env node

/**
 * Pre-deployment verification script
 * Checks if the application is ready for production deployment
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🔍 Running deployment readiness check...\n');

const checks = [];

// Check if dist folder exists
if (existsSync('dist')) {
  checks.push({ name: 'Build output (dist folder)', status: '✅ PASS' });
} else {
  checks.push({ name: 'Build output (dist folder)', status: '❌ FAIL - Run npm run build' });
}

// Check if index.html exists in dist
if (existsSync('dist/index.html')) {
  checks.push({ name: 'HTML entry point', status: '✅ PASS' });
} else {
  checks.push({ name: 'HTML entry point', status: '❌ FAIL - Missing dist/index.html' });
}

// Check if assets folder exists
if (existsSync('dist/assets')) {
  checks.push({ name: 'Static assets', status: '✅ PASS' });
} else {
  checks.push({ name: 'Static assets', status: '❌ FAIL - Missing dist/assets' });
}

// Check package.json
try {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  if (pkg.scripts && pkg.scripts.build) {
    checks.push({ name: 'Build script', status: '✅ PASS' });
  } else {
    checks.push({ name: 'Build script', status: '❌ FAIL - Missing build script' });
  }
} catch (e) {
  checks.push({ name: 'Package.json', status: '❌ FAIL - Invalid package.json' });
}

// Check netlify.toml
if (existsSync('../netlify.toml')) {
  checks.push({ name: 'Netlify configuration', status: '✅ PASS' });
} else {
  checks.push({ name: 'Netlify configuration', status: '❌ FAIL - Missing netlify.toml' });
}

// Display results
console.log('📋 Deployment Readiness Report:\n');
checks.forEach(check => {
  console.log(`${check.status} ${check.name}`);
});

const failedChecks = checks.filter(check => check.status.includes('FAIL'));

if (failedChecks.length === 0) {
  console.log('\n🎉 All checks passed! Ready for deployment! 🚀');
  process.exit(0);
} else {
  console.log(`\n⚠️  ${failedChecks.length} check(s) failed. Please fix before deploying.`);
  process.exit(1);
}