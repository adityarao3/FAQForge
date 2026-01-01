#!/bin/bash
# Vercel build script

# Install root dependencies
npm install

# Build frontend
cd frontend
npm install
npm run build
cd ..

echo "Build completed successfully!"
