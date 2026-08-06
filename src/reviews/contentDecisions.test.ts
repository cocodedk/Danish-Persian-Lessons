import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { contentReviewManifest } from './contentManifest'

interface Decision {
  entryId: string
  reviewerId: string
  role: string
  decision: 'approve' | 'change' | 'reject'
  note?: string
  sourceCommit: string
  reviewedAt: string
}

describe('external content decisions', () => {
  it('accepts only attributable decisions for current manifest rows', () => {
    const path = join(process.cwd(), 'docs/reviews/content-review-decisions.json')
    const data = JSON.parse(readFileSync(path, 'utf8')) as { decisions: Decision[] }
    const ids = new Set(contentReviewManifest.rows.map((row) => row.id))
    const roles = new Set(['iranian-persian-1', 'iranian-persian-2', 'phonetics', 'danish'])
    for (const row of data.decisions) {
      expect(ids.has(row.entryId), row.entryId).toBe(true)
      expect(roles.has(row.role), row.role).toBe(true)
      expect(row.reviewerId.trim(), row.entryId).not.toBe('')
      expect(row.sourceCommit).toMatch(/^[0-9a-f]{7,40}$/)
      expect(Number.isNaN(Date.parse(row.reviewedAt))).toBe(false)
      if (row.decision !== 'approve') expect(row.note?.trim(), row.entryId).not.toBe('')
    }
  })
})
