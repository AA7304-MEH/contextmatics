import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    outDir: '.',
    assetsDir: 'assets',
    sourcemap: false,
  },
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  resolve: {
    alias: {
      '@': path.resolve('./src'),
    },
  },
})