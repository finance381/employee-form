import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path matches GitHub Pages project URL: finance381.github.io/employee-form/
export default defineConfig({
  base: '/employee-form/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Small, hash-versioned bundle. No PWA, no service worker — this app must
    // open in the OS browser cleanly, no standalone mode ever.
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
