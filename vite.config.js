import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://talentflowhr-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  define: {
    'process.env': {}
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
  }
})