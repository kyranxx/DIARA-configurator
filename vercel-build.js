const { execSync } = require('child_process');
const path = require('path');

// Ensure we're in production mode
process.env.NODE_ENV = 'production';

try {
  // Clean the dist directory
  execSync('rimraf dist', { stdio: 'inherit' });

  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Run the production build
  console.log('Building the application...');
  execSync('cross-env NODE_ENV=production webpack --mode production', { stdio: 'inherit' });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
