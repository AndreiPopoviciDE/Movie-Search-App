import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { copyFileSync } from 'fs';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-robots-txt',
      apply: 'build',
      closeBundle() {
        const src = resolve(__dirname, 'robots.txt');
        const dest = resolve(__dirname, 'dist', 'robots.txt');
        copyFileSync(src, dest);
      },
    },
    viteCompression({ algorithm: 'gzip' }),
    viteCompression({ algorithm: 'brotliCompress' }),
  ],
  test: {
    globals: true,
    environment: 'jsdom', // Required for DOM testing
    setupFiles: './src/setupTests.ts', // Optional: Add setup file for global configurations
  },
  build: {
    rollupOptions: {
      output: {
        // Ensure assets are placed correctly
        assetFileNames: '[name].[ext]',
      },
    },
  },
});
