#!/bin/bash

# Set production environment
export NODE_ENV=production

# Install libvips dependencies
echo "Installing libvips dependencies..."
apt-get update -y || true
apt-get install -y libvips-dev || true

# Fix permissions for prebuild-install
echo "Fixing permissions..."
chmod -R 755 node_modules/.bin/

# Build the frontend
echo "Building frontend..."
node_modules/.bin/webpack --mode production

# Build the server
echo "Building server..."
node_modules/.bin/tsc -p tsconfig.server.json

echo "Build completed successfully!"
