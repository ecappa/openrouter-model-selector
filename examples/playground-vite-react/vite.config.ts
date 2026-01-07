import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Use workspace sources for local dev (no need to re-install the file: dependency for types)
      '@cappasoft/openrouter-model-selector': path.resolve(__dirname, '../../packages/openrouter-model-selector/src/index.ts'),
      '@cappasoft/openrouter-model-selector/styles.css': path.resolve(__dirname, '../../packages/openrouter-model-selector/src/styles.css'),
      '@cappasoft/openrouter-models': path.resolve(__dirname, '../../packages/openrouter-models/src/index.ts'),
    },
  },
  server: {
    fs: {
      // Allow importing from the monorepo root (/packages/*)
      allow: [path.resolve(__dirname, '../../')],
    },
  },
})


