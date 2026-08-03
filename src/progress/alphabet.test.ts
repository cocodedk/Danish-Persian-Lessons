import { describe, it, expect, beforeEach } from 'vitest'
import {
  getAlphabetProgress,
  markLetterDone,
  markVowelDone,
  markOrientationSeen,
  doneCount,
  ALPHABET_TOTAL,
} from './alphabet'

beforeEach(() => {
  window.localStorage.clear()
})

describe('alphabet progress', () => {
  it('starts empty, with orientation unseen', () => {
    expect(getAlphabetProgress()).toEqual({ letters: [], marks: [], orientationSeen: false })
    expect(doneCount(getAlphabetProgress())).toBe(0)
  })

  it('counts the 32 letters, آ and the six vowel marks as the whole lesson', () => {
    expect(ALPHABET_TOTAL).toBe(39)
  })

  it('keeps a tick once granted, and never grants it twice', () => {
    markLetterDone('be')
    markLetterDone('be')
    markLetterDone('alef-madde')
    expect(getAlphabetProgress().letters).toEqual(['be', 'alef-madde'])
  })

  it('keeps letters and marks apart but counts them together', () => {
    markLetterDone('be')
    markVowelDone('zebar')
    const progress = getAlphabetProgress()
    expect(progress.letters).toEqual(['be'])
    expect(progress.marks).toEqual(['zebar'])
    expect(doneCount(progress)).toBe(2)
  })

  it('survives a reload — nothing is ever taken away', () => {
    markLetterDone('be')
    markVowelDone('zir')
    markOrientationSeen()
    // A fresh read is what a reload does.
    expect(getAlphabetProgress()).toEqual({
      letters: ['be'],
      marks: ['zir'],
      orientationSeen: true,
    })
  })

  it('remembers that orientation was seen without touching the ticks', () => {
    markLetterDone('dal')
    markOrientationSeen()
    expect(getAlphabetProgress().letters).toEqual(['dal'])
    expect(getAlphabetProgress().orientationSeen).toBe(true)
  })

  it('treats a damaged record as an empty one rather than crashing', () => {
    window.localStorage.setItem(
      'dpl.v1.alphabet',
      JSON.stringify({ schemaVersion: 1, value: { letters: 'nope' } }),
    )
    expect(getAlphabetProgress()).toEqual({ letters: [], marks: [], orientationSeen: false })
    markLetterDone('be')
    expect(getAlphabetProgress().letters).toEqual(['be'])
  })
})
