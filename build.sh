#!/bin/bash
set -e

# Install dependencies if needed
npm install

# Build the project
npx vite build