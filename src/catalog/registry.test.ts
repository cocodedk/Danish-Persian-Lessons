import { describe, expect, it } from 'vitest'
import { catalogDomains, persianCatalog } from './registry'
import { withoutMarks } from '../lessons/marks'
import { findPersianTextViolations } from '../lessons/textRules'

describe('the typed Persian catalog', () => {
  it('has globally unique stable ids and complete companions', () => {
    const ids = persianCatalog.map((entry) => entry.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const entry of persianCatalog) {
      expect(entry.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      expect(entry.fa.trim(), entry.id).not.toBe('')
      expect(entry.da.trim(), entry.id).not.toBe('')
      expect(entry.pron.da.trim(), entry.id).not.toBe('')
      expect(entry.pron.ipa.trim(), entry.id).not.toBe('')
      expect(entry.pron.ipa, entry.id).not.toMatch(/^\[|\]$/)
      if (entry.pron.ipa === '∅') {
        expect(entry.audioId, entry.id).toBeUndefined()
        expect(entry.audioNotApplicable?.trim(), entry.id).not.toBe('')
      } else {
        expect(entry.audioId, entry.id).toBe(entry.id)
        expect(entry.audioNotApplicable, entry.id).toBeUndefined()
      }
    }
  })

  it('keeps contextual reading cue spans inside their written entry', () => {
    for (const entry of persianCatalog) {
      if (entry.kind === 'word' || entry.kind === 'phrase') {
        expect(entry.readingCues?.length, entry.id).toBeGreaterThan(0)
      }
      const length = [...entry.fa].length
      for (const cue of entry.readingCues ?? []) {
        expect(cue.start, entry.id).toBeGreaterThanOrEqual(0)
        expect(cue.end, entry.id).toBeGreaterThanOrEqual(cue.start)
        expect(cue.end, entry.id).toBeLessThanOrEqual(length)
        if (cue.start === cue.end) expect(cue.role, entry.id).toBe('short-vowel')
        expect(cue.display.trim(), entry.id).not.toBe('')
        expect(cue.helpDa.trim(), entry.id).not.toBe('')
      }
    }
  })

  it('keeps code points, Persian numerals, ZWNJ, and faMarked honest', () => {
    for (const entry of persianCatalog) {
      expect(findPersianTextViolations(entry.fa), entry.id).toEqual([])
      if (entry.faMarked) {
        expect(findPersianTextViolations(entry.faMarked), entry.id).toEqual([])
        expect(withoutMarks(entry.faMarked), entry.id).toBe(entry.fa)
      }
      if (/[۰-۹]/u.test(entry.fa)) expect(entry.kind, entry.id).toBe('symbol')
      expect(entry.fa, entry.id).not.toMatch(/\s\u200c|\u200c\s/u)
    }
  })

  it('keeps UI and name phrases undiacriticized', () => {
    for (const entry of [...catalogDomains.interface, ...catalogDomains.names]) {
      expect(entry.faMarked, entry.id).toBeUndefined()
    }
  })
})
