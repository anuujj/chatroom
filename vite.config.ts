import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/chatroom/', 
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
    }
  }
})
