import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Проксирование API-запросов на Vercel API Routes
      // или на локальный сервер разработки
      '/api': {
        target: process.env.NODE_ENV === 'development' 
          ? 'http://localhost:3000' 
          : 'https://weather-app-react-29m2.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path,
      }
    }
  }
})
