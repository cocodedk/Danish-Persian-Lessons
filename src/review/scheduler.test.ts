import { beforeEach, describe, expect, it } from 'vitest'
import { resetMemoryCache } from '../progress/storage'
import { markLetterDone } from '../progress/alphabet'
import {
  addLocalDays,
  dueReviewStates,
  introduceForReview,
  isRetained,
  recordReview,
  syncLegacyReview,
} from './scheduler'

const at = (day: string) => new Date(`${day}T12:00:00`)

describe('spaced review scheduler', () => {
  beforeEach(() => {
    localStorage.clear()
    resetMemoryCache()
  })

  it('migrates exposure as due, never as retained learning', () => {
    markLetterDone('be')
    const store = syncLegacyReview(at('2026-08-06'))
    expect(store.items['alphabet-letter-be']).toMatchObject({
      stage: 0,
      successfulRetrievals: 0,
      dueDay: '2026-08-06',
    })
  })

  it('uses increasing local-day intervals and advances at most once per day', () => {
    introduceForReview('x', at('2026-01-01'))
    expect(recordReview('x', 'correct', at('2026-01-01'))).toMatchObject({ stage: 1, dueDay: '2026-01-02' })
    expect(recordReview('x', 'correct', at('2026-01-01'))).toMatchObject({ stage: 1, dueDay: '2026-01-02' })
    expect(recordReview('x', 'correct', at('2026-01-02'))).toMatchObject({ stage: 2, dueDay: '2026-01-05' })
    expect(recordReview('x', 'correct', at('2026-01-05'))).toMatchObject({ stage: 3, dueDay: '2026-01-12' })
  })

  it('keeps a same-day recovery due tomorrow and never removes history', () => {
    introduceForReview('x', at('2026-01-01'))
    recordReview('x', 'correct', at('2026-01-01'))
    const wrong = recordReview('x', 'wrong', at('2026-01-02'))!
    const recovered = recordReview('x', 'correct', at('2026-01-02'))!
    expect(wrong.lapses).toBe(1)
    expect(recovered).toMatchObject({ stage: 1, dueDay: '2026-01-03', lapses: 1 })
    expect(recovered.successfulRetrievals).toBe(2)
  })

  it('derives retained only across different days including a three-day interval', () => {
    introduceForReview('x', at('2026-01-01'))
    const first = recordReview('x', 'correct', at('2026-01-01'))!
    const next = recordReview('x', 'correct', at('2026-01-04'))!
    expect(isRetained(first)).toBe(false)
    expect(isRetained(next)).toBe(true)
  })

  it('handles DST-safe calendar addition and does not hide work after rollback', () => {
    expect(addLocalDays('2026-03-28', 3)).toBe('2026-03-31')
    introduceForReview('x', at('2026-04-10'))
    expect(dueReviewStates(at('2026-04-01')).map((state) => state.entryId)).toContain('x')
  })

  it('remains bounded through a 45-day longitudinal fixture', () => {
    introduceForReview('x', at('2026-01-01'))
    for (let offset = 0; offset < 45; offset += 1) {
      const day = addLocalDays('2026-01-01', offset)
      if (dueReviewStates(at(day)).some((state) => state.entryId === 'x')) {
        recordReview('x', 'correct', at(day))
      }
    }
    const state = dueReviewStates(at('2026-02-15')).find((item) => item.entryId === 'x')
    expect(state).toBeUndefined()
  })

  it('normalizes corrupt fields without losing the item or creating an invalid stage', () => {
    localStorage.setItem('dpl.v1.review', JSON.stringify({
      schemaVersion: 1,
      value: {
        version: 99,
        items: {
          x: {
            entryId: 'wrong-id',
            introducedAt: 'not-a-day',
            successfulRetrievals: -20,
            successfulDays: ['bad', '2026-08-01', '2026-08-01'],
            stage: 400,
            dueDay: '2999-99-99',
            lapses: -2,
            lastAttempt: 'punished',
          },
        },
      },
    }))

    expect(dueReviewStates(at('2026-08-06'))).toContainEqual({
      entryId: 'x',
      introducedAt: '2026-08-06',
      successfulRetrievals: 0,
      successfulDays: ['2026-08-01'],
      stage: 6,
      dueDay: '2026-08-06',
      lapses: 0,
    })
  })

  it('keeps scheduler invariants through a deterministic ninety-day outcome matrix', () => {
    for (let item = 0; item < 20; item += 1) introduceForReview(`item-${item}`, at('2026-01-01'))
    for (let offset = 0; offset < 90; offset += 1) {
      const day = addLocalDays('2026-01-01', offset)
      for (const [index, state] of dueReviewStates(at(day)).entries()) {
        const outcome = (offset + index) % 7 === 0 ? 'wrong' : (offset + index) % 11 === 0 ? 'revealed' : 'correct'
        recordReview(state.entryId, outcome, at(day))
      }
      for (const state of dueReviewStates(at(day))) {
        expect(state.stage).toBeGreaterThanOrEqual(0)
        expect(state.stage).toBeLessThanOrEqual(6)
        expect(state.successfulRetrievals).toBeGreaterThanOrEqual(state.successfulDays.length)
        expect(state.lapses).toBeGreaterThanOrEqual(0)
      }
    }
  })
})
