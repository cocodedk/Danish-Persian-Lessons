import { describe, expect, it } from 'vitest'
import {
  counting100to900Catalog,
  counting100to900Lesson,
  examples,
  hundreds,
  targets,
} from './counting100to900'
import { joiner, tens } from './counting21to99'
import { countingNumbers } from './numbers'
import { findPersianTextViolations } from './textRules'
import type { RuleComposition } from './countingRuleTypes'

const ID_PREFIX = 'counting-100900-'
const PERSIAN_SCRIPT = /[؀-ۿ]/
const compositions: RuleComposition[] = [...examples, ...targets]
const wholes = compositions.filter(({ parts }) => parts.length > 1)

function foundationWord(value: number) {
  return countingNumbers.find((number) => number.value === value)!.word
}

function tenEntry(value: number) {
  return tens.find((base) => base.value === value)!.entry
}

function hundredEntry(value: number) {
  return hundreds.find((base) => base.value === value)!.entry
}

/** The parts the rule says `value` is spoken with, rebuilt from the lessons it
 *  builds on — so the module cannot satisfy this by agreeing with itself. */
function expectedParts(value: number) {
  const parts = [hundredEntry(Math.floor(value / 100) * 100)]
  const rest = value % 100
  if (rest === 0) return parts
  parts.push(joiner)
  if (rest <= 20) parts.push(foundationWord(rest))
  else if (rest % 10 === 0) parts.push(tenEntry(rest))
  else parts.push(tenEntry(Math.floor(rest / 10) * 10), joiner, foundationWord(rest % 10))
  return parts
}

// Every Persian form, meaning, dansk lydskrift and IPA asserted here is a
// candidate draft pending Gate A. These tests check shape, identity and text
// rules — they say nothing about whether a form is correct or approved.

describe('regnereglen 100-900: route, label and range', () => {
  it('keeps the 100-900 label on the route while declaring the 100-999 range', () => {
    // docs/specs/AAA-COUNTING-CURRICULUM-SPEC.md § 3.2: the pairing is intended.
    expect(counting100to900Lesson.path).toBe('/lesson/taelle/100-900')
    expect(counting100to900Lesson.title).toContain('100-900')
    expect(counting100to900Lesson.range).toEqual([100, 999])
    expect(counting100to900Lesson.idPrefix).toBe(ID_PREFIX)
    expect(counting100to900Lesson.storageKey).toBe('counting.100-900')
  })

  it('builds on the 21-99 rule', () => {
    expect(counting100to900Lesson.buildsOn.path).toBe('/lesson/taelle/21-99')
    expect(counting100to900Lesson.buildsOn.labelDa).toContain('21-99')
  })

  it('lists every hundred from 100 to 900 exactly once, in order', () => {
    expect(hundreds.map(({ value }) => value)).toEqual([100, 200, 300, 400, 500, 600, 700, 800, 900])
    expect(counting100to900Lesson.baseForms).toBe(hundreds)
  })

  it('teaches a rule instead of enumerating the range', () => {
    expect(compositions.length).toBeLessThan(20)
    expect(counting100to900Lesson.rule).not.toMatch(PERSIAN_SCRIPT)
    expect(counting100to900Lesson.summary).not.toMatch(PERSIAN_SCRIPT)
  })

  it('states both boundaries in plain Danish, with no Persian and no 1.000 form', () => {
    const notes = counting100to900Lesson.boundaryNotes
    expect(notes).toHaveLength(2)
    expect(notes[0]).toContain('99')
    expect(notes[0]).toContain('100')
    expect(notes[1]).toContain('999')
    expect(notes[1]).toContain('1.000')
    for (const note of notes) {
      expect(note, note).not.toMatch(PERSIAN_SCRIPT)
      expect(note).not.toBe('')
    }
  })
})

describe('regnereglen 100-900: worked examples and unseen targets', () => {
  it('works a round hundred, a 1-20 rest, a teen rest, a 21-99 rest and 999', () => {
    expect(examples.map(({ value }) => value)).toEqual([500, 107, 315, 642, 999])
    expect(counting100to900Lesson.examples).toBe(examples)
    // A round hundred is spoken alone: its one part is the base row itself.
    const round = examples.find(({ value }) => value === 500)!
    expect(round.parts).toEqual([hundredEntry(500)])
    expect(round.entry).toBe(hundredEntry(500))
    // A rest from lektionen 1-20, both as an enter and as a teenager.
    expect(examples.find(({ value }) => value === 107)!.parts[2]).toBe(foundationWord(7))
    expect(examples.find(({ value }) => value === 315)!.parts[2]).toBe(foundationWord(15))
    // A rest built with lektionen 21-99's own rule: ti, bindeled, enter.
    expect(examples.find(({ value }) => value === 642)!.parts).toHaveLength(5)
  })

  it('stops at 999 and never composes 1000', () => {
    expect(examples.at(-1)!.value).toBe(999)
    for (const { value } of compositions) {
      expect(value).toBeGreaterThanOrEqual(counting100to900Lesson.range[0])
      expect(value).toBeLessThanOrEqual(counting100to900Lesson.range[1])
    }
    for (const entry of counting100to900Catalog) expect(entry.id).not.toContain('1000')
  })

  it('keeps at least four build targets out of the worked examples', () => {
    expect(targets.length).toBeGreaterThanOrEqual(4)
    expect(targets.map(({ value }) => value)).toEqual([208, 350, 416, 861])
    const shown = new Set(examples.map(({ value }) => value))
    for (const { value } of targets) expect(shown.has(value)).toBe(false)
    expect(counting100to900Lesson.targets).toBe(targets)
  })
})

describe('regnereglen 100-900: reused parts and derived wholes', () => {
  it('reuses lesson 2 and the foundation by identity, never by copy', () => {
    expect(counting100to900Lesson.joiner).toBe(joiner)
    for (const { value, parts } of compositions) {
      // Identity, not equality: a copied row would pass toEqual and fail here.
      const expected = expectedParts(value)
      expect(parts, String(value)).toHaveLength(expected.length)
      expected.forEach((part, index) => expect(parts[index], `${value}[${index}]`).toBe(part))
      for (const part of parts.slice(1)) expect(part.id.startsWith(ID_PREFIX)).toBe(false)
    }
  })

  it('derives every whole number from its ordered parts', () => {
    for (const { entry, parts } of wholes) {
      expect(entry.kind).toBe('phrase')
      expect(entry.fa).toBe(parts.map((part) => part.fa).join(' '))
      expect(entry.faMarked).toBe(parts.map((part) => part.faMarked ?? part.fa).join(' '))
      expect(entry.pron.da).toBe(parts.map((part) => part.pron.da).join(' '))
      expect(entry.pron.ipa).toBe(parts.map((part) => part.pron.ipa).join(' '))
    }
  })
})

describe('regnereglen 100-900: catalog identities', () => {
  it('owns only counting-100900- rows and never re-registers a reused part', () => {
    for (const entry of counting100to900Catalog) expect(entry.id.startsWith(ID_PREFIX)).toBe(true)
    expect(counting100to900Catalog).not.toContain(joiner)
    for (const base of tens) expect(counting100to900Catalog).not.toContain(base.entry)
    for (const number of countingNumbers) expect(counting100to900Catalog).not.toContain(number.word)
  })

  it('holds the nine hundreds and one entry per composed whole, each id unique', () => {
    expect(counting100to900Catalog).toHaveLength(hundreds.length + wholes.length)
    for (const base of hundreds) expect(counting100to900Catalog).toContain(base.entry)
    for (const { entry } of wholes) expect(counting100to900Catalog).toContain(entry)
    const ids = counting100to900Catalog.map((entry) => entry.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toContain(`${ID_PREFIX}hundrede-100`)
    expect(ids).toContain(`${ID_PREFIX}tal-999`)
  })
})

describe('regnereglen 100-900: text rules and pronunciation', () => {
  it('uses Persian code points only: no Arabic kaf/yeh, no ASCII digits', () => {
    for (const entry of counting100to900Catalog) {
      for (const fa of [entry.fa, entry.faMarked ?? entry.fa]) {
        expect(findPersianTextViolations(fa), entry.id).toEqual([])
      }
    }
  })

  it('gives every candidate row a meaning, dansk lydskrift and IPA', () => {
    for (const entry of counting100to900Catalog) {
      expect(entry.fa, entry.id).toMatch(PERSIAN_SCRIPT)
      expect(entry.faMarked ?? entry.fa, entry.id).not.toBe('')
      expect(entry.da, entry.id).not.toBe('')
      expect(entry.pron.da, entry.id).not.toBe('')
      expect(entry.pron.ipa, entry.id).not.toBe('')
      // The catalog stores IPA without display brackets; renderers add them.
      expect(entry.pron.ipa, entry.id).not.toMatch(/^\[|\]$/)
    }
  })
})
