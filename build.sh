#!/bin/bash
set -e

echo "Starting build process..."

# Ensure dependencies are installed
echo "Installing dependencies..."
npm ci --only=production --silent

# Install vite globally if not available
echo "Ensuring Vite is available..."
npm install -g vite@latest

# Build the project using global vite
echo "Building project with Vite..."
vite build

echo "Build completed successfully!"