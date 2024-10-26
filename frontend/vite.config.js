import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig((configEnv) => {
  return {
    plugins: [vue()],
    build: {
      rollupOptions: {
        input: getHtmlEntryFiles('src'),
        output: {
          manualChunks(id) {
            // console.log('Processing:', id);
            if (id.includes('node_modules')) {
              if (id.includes('lodash')) {
                return 'lodash';
              }
              if (id.includes('element-plus')) {
                return 'element-plus';
              }
              if (id.includes('highlight.js')) {
                return 'highlightjs';
              }
              return 'vendor'
            }
            if (id.includes('src/components')) {
              return 'components'
            }
          }
        }
      },
      emptyOutDir: true,
      sourcemap: configEnv.mode === 'development',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: configEnv.mode !== 'development', // Remove console logs
          drop_debugger: configEnv.mode !== 'development' // Remove debugger statements
        }
      }
    },
    resolve: {
      alias: {
        'vue': 'vue/dist/vue.esm-bundler.js',
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
})

function getHtmlEntryFiles(srcDir) {
  const entry = {}

  function traverseDir(currentDir) {
    const files = fs.readdirSync(currentDir)

    files.forEach((file) => {
      const filePath = path.join(currentDir, file)
      const isDirectory = fs.statSync(filePath).isDirectory()

      if (isDirectory) {
        // If it's a directory, recursively traverse it
        traverseDir(filePath)
      } else if (path.extname(file) === '.html') {
        // If it's an HTML file, add it to the entry object
        const name = path.relative(srcDir, filePath).replace(/\..*$/, '')
        entry[name] = filePath
      }
    })
  }

  traverseDir(srcDir)

  return entry
}
