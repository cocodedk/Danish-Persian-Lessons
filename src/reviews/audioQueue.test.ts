import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { contentReviewManifest } from './contentManifest'
import { audioRecordingQueue } from './audioQueue'

describe('audio recording handoff', () => {
  it('contains every and only missing pronounceable entry with a unique local target', () => {
    const missing = contentReviewManifest.rows.filter((row) => row.audioStatus === 'missing')
    expect(audioRecordingQueue.status).toBe('draft-awaiting-content-approval')
    expect(audioRecordingQueue.rows).toHaveLength(missing.length)
    expect(audioRecordingQueue.rows).toHaveLength(176)
    expect(new Set(audioRecordingQueue.rows.map((row) => row.entryId)).size).toBe(missing.length)
    expect(new Set(audioRecordingQueue.rows.map((row) => row.expectedFile)).size).toBe(missing.length)
    for (const row of audioRecordingQueue.rows) {
      const source = missing.find((candidate) => candidate.id === row.entryId)!
      expect(row.transcript).toBe(source.faMarked ?? source.fa)
      expect(row.expectedFile).toBe(`/audio/${row.entryId}.mp3`)
      expect(row.requiredTakeReview).toEqual(['iranian-persian-2', 'phonetics'])
    }
  })

  it('keeps the checked-in queue synchronized with the catalog', () => {
    const path = join(process.cwd(), 'docs/reviews/audio-recording-queue.json')
    const checkedIn = JSON.parse(readFileSync(path, 'utf8'))
    expect(checkedIn).toEqual(JSON.parse(JSON.stringify(audioRecordingQueue)))
  })
})
