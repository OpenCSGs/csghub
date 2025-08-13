import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  test: {
    setupFiles: ['./setupTests.js'],
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    // deps: {
    //   inline: ['element-plus'],
    // },
    server: {
      deps: {
        inline: ['element-plus', 'vue-i18n', 'pinia'],
      }
    },
  }
})