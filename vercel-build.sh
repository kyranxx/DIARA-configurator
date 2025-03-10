#!/bin/bash

# Set production environment
export NODE_ENV=production

# Build the frontend
echo "Building frontend..."
node_modules/.bin/webpack --mode production

# Build the server
echo "Building server..."
node_modules/.bin/tsc -p tsconfig.server.json

echo "Build completed successfully!"
