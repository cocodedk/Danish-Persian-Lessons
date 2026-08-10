import { describe, expect, it } from 'vitest'
import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { pronunciationAudio, pronunciationAudioUrl } from './manifest'
import { persianCatalog } from '../catalog/registry'
import { spokenFormsFor } from '../catalog/types'

describe('pronunciation audio manifest', () => {
  it('accepts only reviewed, local Persian audio with explicit provenance', () => {
    const ids = pronunciationAudio.map((row) => row.clipId)
    expect(new Set(ids).size).toBe(ids.length)
    for (const row of pronunciationAudio) {
      expect(row.locale).toBe('fa-IR')
      expect(row.file).toMatch(/^\/audio\/[a-z0-9-]+\.[a-f0-9]{12}\.(?:mp3|m4a|ogg)$/)
      expect(row.file).not.toMatch(/^https?:/)
      expect(new Set(row.reviewedBy).size).toBeGreaterThanOrEqual(1)
      expect(row.license.trim()).not.toBe('')
      if (row.source === 'human') expect(row.consentRef.trim()).not.toBe('')
      else expect(row.modelSha256).toMatch(/^[a-f0-9]{64}$/)
      expect(row.durationMs).toBeGreaterThan(0)
      expect(row.channels).toBe(1)
      expect(row.integratedLufs).toBeGreaterThanOrEqual(-22)
      expect(row.integratedLufs).toBeLessThanOrEqual(-18)
      expect(row.truePeakDbtp).toBeLessThanOrEqual(-1)
      expect(row.loudnessReportRef).toMatch(/^docs\/reviews\/audio\/[^.].*\.json$/)
      expect(existsSync(join(process.cwd(), row.loudnessReportRef)), row.entryId).toBe(true)
      const file = join(process.cwd(), 'public', row.file.slice(1))
      expect(existsSync(file), row.entryId).toBe(true)
      if (existsSync(file) && statSync(file).size > 100_000) {
        expect(row.sizeException?.trim(), row.entryId).not.toBe('')
      }
      const entry = persianCatalog.find((candidate) => candidate.id === row.entryId)
      expect(entry, row.entryId).toBeDefined()
      const form = entry && spokenFormsFor(entry).find((candidate) => candidate.audioId === row.clipId)
      expect(form, row.clipId).toBeDefined()
      expect([form?.fa, form?.faMarked], row.clipId).toContain(row.transcript)
    }
  })

  it('uses the app base path for public audio files', () => {
    expect(pronunciationAudioUrl(
      '/audio/example.mp3', '/Danish-Persian-Lessons/app/',
    )).toBe('/Danish-Persian-Lessons/app/audio/example.mp3')
  })
})
