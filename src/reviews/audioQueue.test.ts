import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { contentReviewManifest } from './contentManifest'
import { audioRecordingQueue } from './audioQueue'

describe('audio recording handoff', () => {
  it('contains every missing spoken form with a unique local draft target', () => {
    const missing = contentReviewManifest.rows.filter((row) => row.audioStatus === 'missing')
    expect(audioRecordingQueue.status).toBe('draft-awaiting-native-review')
    expect(audioRecordingQueue.rows).toHaveLength(missing.length)
    // Plan 016 added the ten number words 11–20 (128 + 10); plan 017 added the
    // sixteen candidate 21–99 rule rows, still awaiting review (138 + 16), then
    // the seventeen candidate 100–900 rule rows, also unreviewed (154 + 17).
    expect(audioRecordingQueue.rows).toHaveLength(171)
    expect(new Set(audioRecordingQueue.rows.map((row) => row.clipId)).size).toBe(missing.length)
    expect(new Set(audioRecordingQueue.rows.map((row) => row.expectedDraft)).size).toBe(missing.length)
    expect(audioRecordingQueue.rows.filter((row) => row.scope === 'talk')).toHaveLength(0)
    for (const row of audioRecordingQueue.rows) {
      const source = missing.find((candidate) => candidate.id === row.entryId)!
      expect(row.transcript).toBe(source.faMarked ?? source.fa)
      expect(row.synthesisText).toBe(row.transcript)
      expect(row.expectedDraft).toBe(`.audio/work/${row.clipId}.mp3`)
      expect(row.requiredTakeReview).toEqual(['native-persian'])
    }
  })

  it('keeps the checked-in queue synchronized with the catalog', () => {
    const path = join(process.cwd(), 'docs/reviews/audio-recording-queue.json')
    const checkedIn = JSON.parse(readFileSync(path, 'utf8'))
    expect(checkedIn).toEqual(JSON.parse(JSON.stringify(audioRecordingQueue)))
  })
})
