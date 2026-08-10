import { beforeEach, describe, expect, it } from 'vitest'
import { allSpeakingPractice, markHeard, markSpoken, speakingPractice } from './speaking'

beforeEach(() => window.localStorage.clear())

describe('speaking practice', () => {
  it('starts empty and stores heard and spoken work separately', () => {
    expect(speakingPractice('word-ab')).toEqual({ entryId: 'word-ab', heard: 0, spoken: 0 })

    markHeard('word-ab', new Date('2026-08-10T10:00:00Z'))
    markHeard('word-ab', new Date('2026-08-10T10:01:00Z'))
    markSpoken('word-ab', new Date('2026-08-10T10:02:00Z'))

    expect(speakingPractice('word-ab')).toEqual({
      entryId: 'word-ab',
      heard: 2,
      spoken: 1,
      lastHeardAt: '2026-08-10T10:01:00.000Z',
      lastSpokenAt: '2026-08-10T10:02:00.000Z',
    })
  })

  it('does not infer speaking work from any existing reading progress', () => {
    window.localStorage.setItem('dpl.v1.vocab.1', JSON.stringify({ words: ['ab'] }))
    expect(allSpeakingPractice()).toEqual([])
  })
})
