// Simple build script for Vercel deployment
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

// Set production environment
process.env.NODE_ENV = 'production';

console.log('Starting build process...');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

try {
  // Make the build script executable
  fs.chmodSync('./vercel-build.sh', '755');
  
  // Run the build script
  console.log('Running vercel-build.sh...');
  execSync('./vercel-build.sh', { stdio: 'inherit' });
  
  console.log('Build process completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
