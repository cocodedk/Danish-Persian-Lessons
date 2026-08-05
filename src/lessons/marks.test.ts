import { describe, it, expect } from 'vitest'
import { markSide } from './marks'

describe('markSide', () => {
  it('reads زبر and پیش as marks written above the letter', () => {
    expect(markSide('اَ')).toBe('above')
    expect(markSide('اُ')).toBe('above')
  })

  it('reads زیر as a mark written below the letter', () => {
    expect(markSide('اِ')).toBe('below')
  })

  it('treats the madde of آ as an above-the-line mark, precomposed or not', () => {
    expect(markSide('آب')).toBe('above')
    // Built from explicit escapes: alef + combining madde + be is the
    // decomposed spelling of the same word and looks identical on screen.
    expect(markSide('\u0627\u0653\u0628')).toBe('above')
  })

  it('reports no mark for undiacriticized Persian', () => {
    expect(markSide('کتاب')).toBe('none')
    expect(markSide('اب')).toBe('none')
  })

  it('reports the above side when a word is marked on both sides', () => {
    // زیر under the kaf and زبر over the te: one gradient, one cut.
    expect(markSide('کِتَاب')).toBe('above')
  })
})
