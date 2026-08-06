import { describe, expect, it } from 'vitest'
import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { pronunciationAudio } from './manifest'
import { persianCatalog } from '../catalog/registry'

describe('human pronunciation manifest', () => {
  it('accepts only reviewed, local, consented Persian recordings', () => {
    const ids = pronunciationAudio.map((row) => row.entryId)
    expect(new Set(ids).size).toBe(ids.length)
    for (const row of pronunciationAudio) {
      expect(row.locale).toBe('fa-IR')
      expect(row.file).toMatch(/^\/audio\/[a-z0-9/-]+\.(?:mp3|m4a|ogg)$/)
      expect(row.file).not.toMatch(/^https?:/)
      expect(new Set(row.reviewedBy).size).toBeGreaterThanOrEqual(2)
      expect(row.consentRef.trim()).not.toBe('')
      expect(row.license.trim()).not.toBe('')
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
      expect(entry?.audioId, row.entryId).toBe(row.entryId)
      expect([entry?.fa, entry?.faMarked], row.entryId).toContain(row.transcript)
    }
  })
})
