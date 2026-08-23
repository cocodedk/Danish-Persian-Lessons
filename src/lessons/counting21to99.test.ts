import { describe, expect, it } from 'vitest'
import { counting21to99Lesson, counting21to99Catalog, examples, joiner, targets, tens } from './counting21to99'
import { countingNumbers } from './numbers'
import { findPersianTextViolations } from './textRules'
import type { RuleComposition } from './countingRuleTypes'

const ID_PREFIX = 'counting-2199-'
const PERSIAN_SCRIPT = /[؀-ۿ]/
const compositions: RuleComposition[] = [...examples, ...targets]

function foundationWord(value: number) {
  return countingNumbers.find((number) => number.value === value)!.word
}

// Every Persian form, meaning, dansk lydskrift and IPA asserted here is a
// candidate draft pending Gate A. These tests check shape, identity and text
// rules — they say nothing about whether a form is correct or approved.

describe('regnereglen 21-99: route and range', () => {
  it('sits at the contracted route and links back to the foundation', () => {
    expect(counting21to99Lesson.path).toBe('/lesson/taelle/21-99')
    expect(counting21to99Lesson.buildsOn.path).toBe('/lesson/taelle')
    expect(counting21to99Lesson.buildsOn.labelDa).toContain('1-20')
    expect(counting21to99Lesson.range).toEqual([21, 99])
  })

  it('lists every ten from 20 to 90 exactly once, in order', () => {
    expect(tens.map(({ value }) => value)).toEqual([20, 30, 40, 50, 60, 70, 80, 90])
    expect(counting21to99Lesson.baseForms).toBe(tens)
  })

  it('teaches a rule instead of enumerating the range', () => {
    expect(compositions.length).toBeLessThan(20)
    expect(counting21to99Lesson.rule).not.toMatch(PERSIAN_SCRIPT)
    expect(counting21to99Lesson.joiner).toBe(joiner)
  })

  it('states both range boundaries in plain Danish, with no Persian', () => {
    const notes = counting21to99Lesson.boundaryNotes
    expect(notes).toHaveLength(2)
    // Downward: the foundation's twenty against the first number built here.
    expect(notes[0]).toContain('20')
    expect(notes[0]).toContain('21')
    // Upward: the last number built here against the next lesson's hundred.
    expect(notes[1]).toContain('99')
    expect(notes[1]).toContain('100')
    for (const note of notes) {
      expect(note, note).not.toMatch(PERSIAN_SCRIPT)
      expect(note).not.toBe('')
    }
  })
})

describe('regnereglen 21-99: worked examples and unseen targets', () => {
  it('works exactly 21, 31, 48 and 99', () => {
    expect(examples.map(({ value }) => value)).toEqual([21, 31, 48, 99])
    expect(counting21to99Lesson.examples).toBe(examples)
  })

  it('keeps the build targets out of the worked examples', () => {
    expect(targets.map(({ value }) => value)).toEqual([42, 57, 68, 73])
    const shown = new Set(examples.map(({ value }) => value))
    for (const { value } of targets) expect(shown.has(value)).toBe(false)
    expect(counting21to99Lesson.targets).toBe(targets)
  })

  it('shows the joiner with more than one unit', () => {
    const units = new Set(examples.map(({ parts }) => parts[2].id))
    expect(units.size).toBeGreaterThan(1)
  })
})

describe('regnereglen 21-99: composition parts', () => {
  it('orders every composite as ten, joiner, unit', () => {
    for (const { value, parts } of compositions) {
      expect(parts).toHaveLength(3)
      expect(parts[0]).toBe(tens.find((base) => base.value === Math.floor(value / 10) * 10)!.entry)
      expect(parts[1]).toBe(joiner)
      expect(parts[2]).toBe(foundationWord(value % 10))
    }
  })

  it('reuses the foundation objects rather than copying rows', () => {
    expect(tens[0].entry).toBe(foundationWord(20))
    for (const { value, parts } of compositions) {
      // Identity, not equality: a copied row would pass toEqual and fail here.
      expect(parts[2]).toBe(foundationWord(value % 10))
      expect(parts[2].id).toBe(`number-${value % 10}-word`)
    }
  })

  it('gives every composite one catalog entry spelled by its parts', () => {
    for (const { entry, parts } of compositions) {
      expect(entry.kind).toBe('phrase')
      expect(entry.fa).toBe(parts.map((part) => part.fa).join(' '))
      expect(entry.faMarked).toBe(parts.map((part) => part.faMarked ?? part.fa).join(' '))
    }
  })
})

describe('regnereglen 21-99: catalog identities', () => {
  it('prefixes every new id with counting-2199- and leaves reused ids alone', () => {
    for (const entry of counting21to99Catalog) expect(entry.id.startsWith(ID_PREFIX)).toBe(true)
    expect(tens[0].entry.id.startsWith(ID_PREFIX)).toBe(false)
    for (const { parts } of compositions) expect(parts[2].id.startsWith(ID_PREFIX)).toBe(false)
  })

  it('keeps every id unique', () => {
    const ids = counting21to99Catalog.map((entry) => entry.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toContain(`${ID_PREFIX}bindeled`)
    expect(ids).toContain(`${ID_PREFIX}ti-30`)
    expect(ids).toContain(`${ID_PREFIX}tal-99`)
  })

  it('adds sixteen candidate entries: the joiner, seven tens and eight numbers', () => {
    expect(counting21to99Catalog).toHaveLength(1 + 7 + compositions.length)
  })
})

describe('regnereglen 21-99: text rules and pronunciation', () => {
  it('uses Persian code points only: no Arabic kaf/yeh, no ASCII digits', () => {
    for (const entry of counting21to99Catalog) {
      for (const fa of [entry.fa, entry.faMarked ?? entry.fa]) {
        expect(findPersianTextViolations(fa), entry.id).toEqual([])
      }
    }
  })

  it('gives every candidate row a meaning, dansk lydskrift and IPA', () => {
    for (const entry of counting21to99Catalog) {
      expect(entry.fa, entry.id).not.toBe('')
      expect(entry.faMarked ?? entry.fa, entry.id).not.toBe('')
      expect(entry.da, entry.id).not.toBe('')
      expect(entry.pron.da, entry.id).not.toBe('')
      expect(entry.pron.ipa, entry.id).not.toBe('')
      // The catalog stores IPA without display brackets; renderers add them.
      expect(entry.pron.ipa, entry.id).not.toMatch(/^\[|\]$/)
    }
  })
})
