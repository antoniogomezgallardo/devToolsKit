#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build process...');
console.log('Node version:', process.version);
console.log('Working directory:', process.cwd());

// Clean dist directory
console.log('🧹 Cleaning dist directory...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}

// Ensure node_modules/.bin/vite is executable
const viteBin = path.join(process.cwd(), 'node_modules', '.bin', 'vite');
const viteJs = path.join(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');

console.log('🔧 Checking Vite installation...');
console.log('Vite binary path:', viteBin);
console.log('Vite js path:', viteJs);

try {
  // Try to make vite executable
  if (process.platform !== 'win32') {
    execSync(`chmod +x "${viteBin}"`, { stdio: 'inherit' });
  }
} catch (error) {
  console.log('Warning: Could not chmod vite binary:', error.message);
}

// Build using Node directly
console.log('🏗️ Building with Vite...');

try {
  // Method 1: Try using the vite binary directly
  console.log('Method 1: Using vite binary...');
  execSync(`node "${viteJs}" build`, { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.log('Method 1 failed, trying method 2...');
  
  try {
    // Method 2: Import and run vite programmatically
    console.log('Method 2: Using programmatic API...');
    
    const vite = require('vite');
    
    (async () => {
      const config = {
        base: '/',
        build: {
          outDir: 'dist',
          emptyOutDir: true,
          sourcemap: false,
          minify: 'esbuild',
        },
        logLevel: 'info'
      };
      
      await vite.build(config);
      console.log('✅ Build completed successfully with programmatic API!');
    })().catch(err => {
      console.error('❌ Programmatic build failed:', err);
      process.exit(1);
    });
    
  } catch (error2) {
    console.error('❌ All build methods failed:', error2);
    console.error('Original error:', error.message);
    process.exit(1);
  }
}