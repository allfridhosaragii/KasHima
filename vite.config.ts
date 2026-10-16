import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  base: '/KasHima/',
  build: { target: 'es2022', cssCodeSplit: true, sourcemap: false, rollupOptions: { output: { manualChunks: { vendor: ['react','react-dom','react-router-dom'] } } } },
})
