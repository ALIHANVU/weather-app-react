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
      // Проксирование API-запросов на локальный сервер разработки
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Отправка запроса к:', req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Получен ответ для:', req.url, 'статус:', proxyRes.statusCode);
          });
        }
      }
    },
    cors: true,
    port: 5173,
    host: true,
    open: true,
    hmr: {
      overlay: true
    }
  },
  build: {
    sourcemap: true,
    // Используем esbuild вместо terser
    minify: 'esbuild',
    // Удаляем настройки terser
    // terserOptions: {
    //   compress: {
    //     drop_console: false,
    //     drop_debugger: true
    //   }
    // }
  }
})
