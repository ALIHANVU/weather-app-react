import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react({
      // Оптимизация загрузки React
      babel: {
        plugins: [
          'babel-plugin-transform-react-remove-prop-types',
          '@babel/plugin-transform-react-constant-elements',
          '@babel/plugin-transform-react-inline-elements'
        ]
      }
    }),
    // Визуализация размера бандла
    visualizer({
      filename: './build-stats.html',
      open: false
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Алиасы для быстрой навигации
      "@components": path.resolve(__dirname, "./src/components"),
      "@utils": path.resolve(__dirname, "./src/utils")
    },
  },
  server: {
    // Настройки dev-сервера
    port: 5173,
    host: true,
    strictPort: true,
    hmr: {
      overlay: true
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    // Настройки продакшн сборки
    sourcemap: false, // Убираем source map
    minify: 'esbuild', // Быстрая минификация
    rollupOptions: {
      output: {
        // Разделение кода
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react';
            }
            if (id.includes('framer-motion')) {
              return 'framer';
            }
            return 'vendor';
          }
        }
      }
    },
    // Оптимизация производительности
    chunkSizeWarningLimit: 1000, // Увеличиваем лимит предупреждений о размере чанка
    cssCodeSplit: true, // Разделение CSS
    assetsInlineLimit: 4096 // Встраивание маленьких файлов
  },
  optimizeDeps: {
    // Предварительная компиляция зависимостей
    include: [
      'react', 
      'react-dom', 
      'framer-motion',
      '@radix-ui/react-dialog',
      'lucide-react'
    ],
    // Исключения для пропуска
    exclude: [
      'react-router-dom'
    ]
  }
})
