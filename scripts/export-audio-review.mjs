import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } })

try {
  const module = await server.ssrLoadModule('/src/reviews/audioQueue.ts')
  const target = fileURLToPath(new URL('../docs/reviews/audio-recording-queue.json', import.meta.url))
  writeFileSync(target, `${JSON.stringify(module.audioRecordingQueue, null, 2)}\n`)
  process.stdout.write(`Wrote ${module.audioRecordingQueue.rows.length} recording rows to ${target}\n`)
} finally {
  await server.close()
}
