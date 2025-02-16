import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: import.meta.env.VITE_APP_HOST,
    port: import.meta.env.VITE_APP_PORT,
    proxy: {
      '/api': {
        target: 'https://backend-production-e7c9.up.railway.app',
        changeOrigin: true,
        secure: false,
      }
    }
    
}
})
