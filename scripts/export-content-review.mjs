import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const server = await createServer({
  appType: 'custom',
  logLevel: 'silent',
  server: { middlewareMode: true },
})

try {
  const module = await server.ssrLoadModule('/src/reviews/contentManifest.ts')
  const target = fileURLToPath(new URL('../docs/reviews/content-review-manifest.json', import.meta.url))
  writeFileSync(target, `${JSON.stringify(module.contentReviewManifest, null, 2)}\n`)
  process.stdout.write(`Wrote ${module.contentReviewManifest.rows.length} review rows to ${target}\n`)
} finally {
  await server.close()
}
