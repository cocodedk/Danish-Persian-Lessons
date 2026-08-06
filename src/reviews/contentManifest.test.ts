import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { persianCatalog } from '../catalog/registry'
import { allVocabWords } from '../lessons/vocab'
import { contentReviewManifest } from './contentManifest'

describe('content review export', () => {
  it('contains every catalog entry exactly once and exposes unresolved review work', () => {
    const ids = contentReviewManifest.rows.map((row) => row.id)
    expect(ids).toHaveLength(persianCatalog.length)
    expect(new Set(ids).size).toBe(ids.length)
    expect(contentReviewManifest.rows.filter((row) => row.audioStatus === 'missing').length).toBeGreaterThan(0)
    const byId = new Map(contentReviewManifest.rows.map((row) => [row.id, row]))
    expect(allVocabWords.every((word) => byId.get(word.entry.id)?.cueCoverage === 'contextual')).toBe(true)
    expect(contentReviewManifest.rows.some((row) => row.stressReviewRequired && !row.stressMarked)).toBe(true)
  })

  it('keeps the checked-in reviewer artifact synchronized with source data', () => {
    const path = join(process.cwd(), 'docs/reviews/content-review-manifest.json')
    const checkedIn = JSON.parse(readFileSync(path, 'utf8'))
    expect(checkedIn).toEqual(JSON.parse(JSON.stringify(contentReviewManifest)))
  })
})
