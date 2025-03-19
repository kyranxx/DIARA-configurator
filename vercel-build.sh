#!/bin/bash

# Set production environment
export NODE_ENV=production

# Fix permissions for prebuild-install
echo "Fixing permissions..."
chmod -R 755 node_modules/.bin/ || true

# Build the frontend
echo "Building frontend..."
node_modules/.bin/webpack --mode production --config webpack.config.cjs

# Build the server
echo "Building server..."
node_modules/.bin/tsc -p tsconfig.server.json

echo "Build completed successfully!"
