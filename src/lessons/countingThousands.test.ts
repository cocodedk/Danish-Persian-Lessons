import { describe, expect, it } from 'vitest'
import {
  countingThousandsLesson,
  examples,
  targets,
  thousand,
  thousands,
} from './countingThousands'
import { joiner } from './counting21to99'
import { countingNumbers } from './numbers'
import type { RuleComposition } from './countingRuleTypes'

const ID_PREFIX = 'counting-tusinder-'
const PERSIAN_SCRIPT = /[؀-ۿ]/
const compositions: RuleComposition[] = [...examples, ...targets]

function foundationWord(value: number) {
  return countingNumbers.find((number) => number.value === value)!.word
}

// Every Persian form, meaning, dansk lydskrift and IPA touched here is a
// candidate draft pending Gate A. These tests check shape, identity and
// derivation — they say nothing about whether a form is correct or approved.

describe('regnereglen tusinder: route, range and boundaries', () => {
  it('owns the tusinder route, the 1.000-9.999 range and its two identities', () => {
    expect(countingThousandsLesson.path).toBe('/lesson/taelle/tusinder')
    expect(countingThousandsLesson.range).toEqual([1000, 9999])
    expect(countingThousandsLesson.idPrefix).toBe(ID_PREFIX)
    expect(countingThousandsLesson.storageKey).toBe('counting.tusinder')
  })

  it('builds on the 100-900 rule', () => {
    expect(countingThousandsLesson.buildsOn.path).toBe('/lesson/taelle/100-900')
    expect(countingThousandsLesson.buildsOn.labelDa).toContain('100-900')
  })

  it('states both boundaries in plain Danish and promises no lesson above 9.999', () => {
    // docs/specs/AAA-COUNTING-CURRICULUM-SPEC.md § 3.3: 10.000 and up are out
    // of the curriculum, so the upper note must not point at a next lesson.
    const notes = countingThousandsLesson.boundaryNotes
    expect(notes).toHaveLength(2)
    expect(notes[0]).toContain('999')
    expect(notes[0]).toContain('1.000')
    expect(notes[1]).toContain('9.999')
    expect(notes[1]).toContain('10.000')
    expect(notes[1]).not.toContain('næste lektion')
    for (const note of notes) expect(note, note).not.toMatch(PERSIAN_SCRIPT)
  })

  it('teaches a rule instead of enumerating the range', () => {
    expect(compositions.length).toBeLessThan(20)
    expect(countingThousandsLesson.rule).not.toMatch(PERSIAN_SCRIPT)
    expect(countingThousandsLesson.summary).not.toMatch(PERSIAN_SCRIPT)
    expect(countingThousandsLesson.joiner).toBe(joiner)
  })
})

describe('regnereglen tusinder: the nine base forms', () => {
  it('lists every thousand from 1000 to 9000 exactly once, in order', () => {
    expect(thousands.map(({ value }) => value))
      .toEqual([1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000])
    expect(countingThousandsLesson.baseForms).toBe(thousands)
  })

  it('says one thousand with the thousand word itself, not a copy of it', () => {
    const one = thousands.find(({ value }) => value === 1000)!
    expect(one.entry).toBe(thousand)
    expect(one.sources).toEqual([thousand])
    expect(thousand.kind).toBe('word')
    expect(thousand.id).toBe(`${ID_PREFIX}tusind`)
  })

  it('reads every multiplier 2-9 off a foundation unit and the thousand word', () => {
    for (const base of thousands.filter(({ value }) => value > 1000)) {
      const unit = base.value / 1000
      // Identity into the other modules' objects: a copied row fails here.
      expect(base.sources, String(base.value)).toHaveLength(2)
      expect(base.sources[0], String(base.value)).toBe(foundationWord(unit))
      expect(base.sources[1], String(base.value)).toBe(thousand)
      expect(base.entry.id).toBe(`${ID_PREFIX}tusinde-${base.value}`)
      expect(base.entry.kind).toBe('phrase')
    }
  })

  it('derives all four language fields of a multiplier from its two sources', () => {
    for (const { value, entry, sources } of thousands.filter((base) => base.value > 1000)) {
      const said = String(value)
      expect(entry.fa, said).toBe(sources.map((part) => part.fa).join(' '))
      expect(entry.faMarked, said)
        .toBe(sources.map((part) => part.faMarked ?? part.fa).join(' '))
      expect(entry.pron.da, said).toBe(sources.map((part) => part.pron.da).join(' '))
      expect(entry.pron.ipa, said).toBe(sources.map((part) => part.pron.ipa).join(' '))
      expect(entry.da, said).toBe(sources.map((part) => part.da).join(' '))
    }
  })
})

describe('regnereglen tusinder: worked examples and unseen targets', () => {
  it('covers every § 3.1 case: 1000 alone, a multiplier, and each remainder kind', () => {
    expect(examples.map(({ value }) => value)).toEqual([1000, 5000, 1300, 1042, 1007, 9999])
    expect(countingThousandsLesson.examples).toBe(examples)
    const alone = examples.find(({ value }) => value === 1000)!
    expect(alone.entry).toBe(thousand)
    expect(alone.parts).toEqual([thousand])
    // A round multiplier is spoken alone too: its one part is its base row.
    const five = examples.find(({ value }) => value === 5000)!
    expect(five.parts).toHaveLength(1)
    expect(five.entry).toBe(thousands.find(({ value }) => value === 5000)!.entry)
    // A hundreds rest, a 21-99 rest and a 1-20 rest.
    expect(examples.find(({ value }) => value === 1300)!.parts).toHaveLength(3)
    expect(examples.find(({ value }) => value === 1042)!.parts).toHaveLength(5)
    expect(examples.find(({ value }) => value === 1007)!.parts[2]).toBe(foundationWord(7))
  })

  it('stops at 9999 and never composes a number outside the range', () => {
    expect(examples.at(-1)!.value).toBe(9999)
    for (const { value } of compositions) {
      expect(value).toBeGreaterThanOrEqual(countingThousandsLesson.range[0])
      expect(value).toBeLessThanOrEqual(countingThousandsLesson.range[1])
    }
  })

  it('keeps at least four build targets out of the worked examples', () => {
    expect(targets.length).toBeGreaterThanOrEqual(4)
    expect(targets.map(({ value }) => value)).toEqual([2088, 3105, 5642, 8371])
    const shown = new Set(examples.map(({ value }) => value))
    for (const { value } of targets) expect(shown.has(value)).toBe(false)
    expect(countingThousandsLesson.targets).toBe(targets)
  })
})
