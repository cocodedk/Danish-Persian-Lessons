import { describe, it, expect } from 'vitest'
import { suggestSpellings } from './transliterate'
import { ruleSpellings } from './rules'
import { GUARD_FIXTURE_NAMES } from './guardFixtures'
import { findPersianTextViolations } from '../lessons/textRules'

/** The golden table from docs/plans/006-your-name.md, Acceptance line 1. */
const GOLDEN: Array<[string, string]> = [
  ['Babak', 'بابک'],
  ['Sara', 'سارا'],
  ['Mette', 'مته'],
  ['Søren', 'سورن'],
  ['Anna', 'آنا'],
  ['Ali', 'علی'],
  ['Lærke', 'لرکه'],
]

const LATIN = /[A-Za-zÆØÅæøå]/

describe('name transliteration', () => {
  it.each(GOLDEN)('spells %s as %s', (latin, expected) => {
    expect(suggestSpellings(latin)[0]).toBe(expected)
  })

  it('takes ع from the override list, which the rules alone can never produce', () => {
    // ع ص ط only exist in names of Arabic origin — no Danish sound maps to them.
    expect(ruleSpellings('Ali')).not.toContain('علی')
    expect(suggestSpellings('Ali')[0]).toBe('علی')
    expect(suggestSpellings('Reza')[0]).toBe('رضا')
    expect(suggestSpellings('Fatemeh')[0]).toBe('فاطمه')
  })

  it('spells Lærke from the rules alone — it is not on the override list', () => {
    expect(ruleSpellings('Lærke')[0]).toBe('لرکه')
  })

  it('looks names up regardless of case and surrounding space', () => {
    for (const written of ['babak', 'BABAK', 'BaBaK', '  Babak  ', '\tBabak\n']) {
      expect(suggestSpellings(written)[0]).toBe('بابک')
    }
  })

  it('spells a compound name part by part, joined by one plain space', () => {
    expect(suggestSpellings('Anne-Mette')[0]).toBe('آنه مته')
    expect(suggestSpellings('Anne Mette')[0]).toBe('آنه مته')
    // A plain space, never a ZWNJ: these are two names, not one joined word.
    expect(suggestSpellings('Anne-Mette')[0]).not.toContain('‌')
  })

  it('ranks: the first suggestion is the best one, and they are all different', () => {
    const suggestions = suggestSpellings('Søren')
    expect(suggestions[0]).toBe('سورن')
    expect(suggestions.length).toBeGreaterThan(1)
    expect(new Set(suggestions).size).toBe(suggestions.length)
    expect(suggestions.length).toBeLessThanOrEqual(3)
  })

  it('offers the long-vowel reading as an alternative the learner may prefer', () => {
    expect(suggestSpellings('Lærke')).toContain('لارکه')
    expect(suggestSpellings('Mette')).toContain('میته')
  })

  it('never throws on nonsense, and offers what it can', () => {
    expect(() => suggestSpellings('X Æ A-12')).not.toThrow()
    const suggestions = suggestSpellings('X Æ A-12')
    for (const suggestion of suggestions) {
      expect(findPersianTextViolations(suggestion)).toEqual([])
      expect(suggestion).not.toMatch(LATIN)
    }
  })

  it('returns nothing at all when there is nothing to transliterate', () => {
    for (const nothing of ['', '   ', '12', '!!!', '‌']) {
      expect(suggestSpellings(nothing)).toEqual([])
    }
  })

  it('handles æ ø å everywhere in the word without dropping the rest', () => {
    expect(suggestSpellings('Søren')[0]).toBe('سورن')
    expect(suggestSpellings('Åge')[0]).toBe('اوگه')
    expect(suggestSpellings('Bæk')[0]).toBe('بک')
    expect(suggestSpellings('Ærø')[0]).toBe('ارو')
  })

  it('every suggestion for every fixture name is valid Persian text', () => {
    for (const name of GUARD_FIXTURE_NAMES) {
      const suggestions = suggestSpellings(name)
      expect(suggestions.length, name).toBeGreaterThan(0)
      for (const suggestion of suggestions) {
        expect(findPersianTextViolations(suggestion), `${name} → ${suggestion}`).toEqual([])
        expect(suggestion, name).not.toMatch(LATIN)
        expect(suggestion.trim(), name).toBe(suggestion)
      }
    }
  })
})
