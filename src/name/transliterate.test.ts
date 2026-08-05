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
    const suggestions = suggestSpellings('Lærke')
    expect(suggestions[0]).toBe('لرکه')
    expect(suggestions.length).toBeGreaterThan(1)
    expect(new Set(suggestions).size).toBe(suggestions.length)
    expect(suggestions.length).toBeLessThanOrEqual(3)
  })

  it('offers the long-vowel reading as an alternative the learner may prefer', () => {
    expect(suggestSpellings('Lærke')).toContain('لارکه')
  })

  it('a name the list knows is spelled that one way, with no near-miss beside it', () => {
    // A learner must not be able to pick a misspelling of their own name off a
    // list this app wrote. Where the table speaks, the rules stay quiet.
    expect(suggestSpellings('Mohammad')).toEqual(['محمد'])
    expect(suggestSpellings('Mette')).toEqual(['مته'])
    expect(suggestSpellings('Søren')).toEqual(['سورن'])
    expect(suggestSpellings('Ali')).toEqual(['علی'])
  })

  it('spells the same Persian name from every Latin spelling of it', () => {
    for (const written of ['Mohammad', 'Mohamed', 'Mohammed', 'Muhammad']) {
      expect(suggestSpellings(written), written).toEqual(['محمد'])
    }
    for (const written of ['Hossein', 'Hussein', 'Hosein']) {
      expect(suggestSpellings(written), written).toEqual(['حسین'])
    }
    for (const written of ['Sara', 'Sarah']) {
      expect(suggestSpellings(written), written).toEqual(['سارا'])
    }
    for (const written of ['Fatemeh', 'Fateme', 'Fatima']) {
      expect(suggestSpellings(written), written).toEqual(['فاطمه'])
    }
    for (const written of ['Yasmin', 'Yasmine', 'Jasmin']) {
      expect(suggestSpellings(written), written).toEqual(['یاسمین'])
    }
  })

  it('spells the names whose faithful spelling read as something else', () => {
    // Decency beats phonetics: کیرستن, سینه and the مرگ that opens مرگریته are
    // all correct readings of the sounds and none of them is offered.
    expect(suggestSpellings('Kirsten')).toEqual(['کرستن'])
    expect(suggestSpellings('Signe')).toEqual(['سیگنه'])
    expect(suggestSpellings('Margrethe')).toEqual(['مارگرته'])
    expect(suggestSpellings('Karen Margrethe')).toEqual(['کارن مارگرته'])
  })

  it('never throws on nonsense, and says nothing rather than something wrong', () => {
    // Initials are not a name. X on its own used to come back as a crude word;
    // no reading of one letter is anybody's spelling, so none is offered and
    // the screen hands the learner the letter bank instead.
    expect(() => suggestSpellings('X Æ A-12')).not.toThrow()
    expect(suggestSpellings('X Æ A-12')).toEqual([])
    expect(suggestSpellings('X')).toEqual([])
    expect(suggestSpellings('B J')).toEqual([])
    // A name with an x in it and no entry on the list: the sound table does not
    // map x at all, so there is nothing honest to offer.
    expect(suggestSpellings('Xander')).toEqual([])
    expect(suggestSpellings('Alexander')).toEqual(['الکساندر'])
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

  it('every fixture that is a name is spelled; the one that is initials is not', () => {
    for (const name of GUARD_FIXTURE_NAMES) {
      const expected = name === 'X Æ A-12' ? 0 : 1
      expect(suggestSpellings(name).length, name).toBeGreaterThanOrEqual(expected)
      if (expected === 0) expect(suggestSpellings(name), name).toEqual([])
    }
  })

  it('every suggestion for every fixture name is valid Persian text', () => {
    for (const name of GUARD_FIXTURE_NAMES) {
      const suggestions = suggestSpellings(name)
      for (const suggestion of suggestions) {
        expect(findPersianTextViolations(suggestion), `${name} → ${suggestion}`).toEqual([])
        expect(suggestion, name).not.toMatch(LATIN)
        expect(suggestion.trim(), name).toBe(suggestion)
      }
    }
  })
})
