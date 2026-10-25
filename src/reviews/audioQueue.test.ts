import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { findPronunciationAudio } from '../audio/manifest'
import { persianCatalog } from '../catalog/registry'
import { contentReviewManifest } from './contentManifest'
import { audioRecordingQueue } from './audioQueue'

describe('audio recording handoff', () => {
  it('contains every missing spoken form with a unique local draft target', () => {
    const missing = contentReviewManifest.rows.filter((row) => row.audioStatus === 'missing')
    const unapproved = audioRecordingQueue.rows.filter((row) => !findPronunciationAudio(row.clipId))
    expect(audioRecordingQueue.status).toBe('draft-awaiting-native-review')
    expect(unapproved).toHaveLength(missing.length)
    const total = audioRecordingQueue.rows.length
    expect(new Set(audioRecordingQueue.rows.map((row) => row.clipId)).size).toBe(total)
    expect(new Set(audioRecordingQueue.rows.map((row) => row.expectedDraft)).size).toBe(total)
    expect(audioRecordingQueue.rows.filter((row) => row.scope === 'talk')).toHaveLength(0)
    for (const row of audioRecordingQueue.rows) {
      const source = contentReviewManifest.rows.find((candidate) => candidate.id === row.entryId)!
      const entry = persianCatalog.find((candidate) => candidate.id === row.entryId)!
      expect(row.transcript).toBe(source.faMarked ?? source.fa)
      expect(row.synthesisText).toBe(entry.synthesisText ?? row.transcript)
      expect(row.expectedDraft).toBe(`.audio/work/${row.clipId}.mp3`)
      expect(row.requiredTakeReview).toEqual(['native-persian'])
    }
  })

  it('queues an approved clip again only when its synthesis text changed', () => {
    const rerecords = audioRecordingQueue.rows.filter((row) => findPronunciationAudio(row.clipId))
    for (const row of rerecords) {
      const approved = findPronunciationAudio(row.clipId)!
      expect(approved.source, row.clipId).toBe('piper')
      expect(approved.transcript, row.clipId).toBe(row.transcript)
      if (approved.source === 'piper') expect(approved.synthesisText, row.clipId).not.toBe(row.synthesisText)
    }
  })

  it('reads a composed number with the damma on its ten and without the joiner', () => {
    const approved = findPronunciationAudio('counting-2199-tal-32')!
    expect(approved.transcript).toBe('سی و دو')
    if (approved.source === 'piper') expect(approved.synthesisText).toBe('سیُ دو')
    else expect.fail('counting-2199-tal-32 is a Piper clip')
  })

  it('keeps the checked-in queue synchronized with the catalog', () => {
    const path = join(process.cwd(), 'docs/reviews/audio-recording-queue.json')
    const checkedIn = JSON.parse(readFileSync(path, 'utf8'))
    expect(checkedIn).toEqual(JSON.parse(JSON.stringify(audioRecordingQueue)))
  })
})
