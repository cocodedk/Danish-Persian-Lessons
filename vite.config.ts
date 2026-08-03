/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The literal project path below is intentionally the one sanctioned place for
// it outside the GitHub Actions workflows (see CLAUDE.md).
export default defineConfig({
  base: '/Danish-Persian-Lessons/app/',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Stylesheets stay stubbed in tests, except `?raw` imports: jsdom computes
    // no layout, so the rules that carry design decisions (the logical margin
    // line, the reduced-motion fallback) are guarded by reading CSS source.
    css: { include: [/\?raw/] },
  },
})
