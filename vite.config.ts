/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const appVersion = (process.env.GITHUB_SHA || '000000000000').slice(0, 12)

// The literal project path below is intentionally the one sanctioned place for
// it outside the GitHub Actions workflows (see CLAUDE.md).
export default defineConfig({
  base: '/Danish-Persian-Lessons/app/',
  define: {
    __DPL_APP_VERSION__: JSON.stringify(appVersion),
  },
  plugins: [
    react(),
    {
      name: 'app-version-file',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'version.js',
          source: `window.__DPL_LATEST_VERSION__=${JSON.stringify(appVersion)};\n`,
        })
      },
    },
  ],
  build: {
    outDir: 'dist',
  },
  test: {
    environment: 'jsdom',
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    setupFiles: ['./src/test/setup.ts'],
    // Stylesheets stay stubbed in tests, except `?raw` imports: jsdom computes
    // no layout, so the rules that carry design decisions (the logical margin
    // line, the reduced-motion fallback) are guarded by reading CSS source.
    css: { include: [/\?raw/] },
  },
})
