// Simple build script for Vercel deployment
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const { exec } = require('child_process');

// Set production environment
process.env.NODE_ENV = 'production';

console.log('Starting build process...');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

// Load webpack config
const webpackConfig = require('./webpack.config.js');

// Run webpack
console.log('Building frontend with webpack...');
webpack(webpackConfig, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error('Webpack build failed:');
    if (err) {
      console.error(err);
    }
    if (stats && stats.hasErrors()) {
      console.error(stats.toString({ colors: true }));
    }
    process.exit(1);
  }

  console.log('Webpack build completed successfully!');
  console.log(stats.toString({ colors: true }));

  // Compile TypeScript for server
  console.log('Compiling server TypeScript...');
  exec('node ./node_modules/typescript/lib/tsc.js -p tsconfig.server.json', (error, stdout, stderr) => {
    if (error) {
      console.error(`TypeScript compilation failed: ${error.message}`);
      console.error(stderr);
      process.exit(1);
    }
    
    console.log('TypeScript compilation completed successfully!');
    if (stdout) console.log(stdout);
    
    console.log('Build process completed!');
  });
});
