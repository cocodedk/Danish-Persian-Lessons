import { describe, expect, it } from 'vitest'
import {
  countingThousandsCatalog,
  examples,
  targets,
  thousand,
  thousands,
} from './countingThousands'
import { joiner, tens } from './counting21to99'
import { hundreds } from './counting100to900'
import { countingNumbers } from './numbers'
import { findPersianTextViolations } from './textRules'
import type { RuleComposition } from './countingRuleTypes'

const ID_PREFIX = 'counting-tusinder-'
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

function thousandEntry(value: number) {
  return thousands.find((base) => base.value === value)!.entry
}

/** The parts the rule says `value` is spoken with, rebuilt here from the
 *  lessons it builds on — so the module cannot satisfy this by agreeing with
 *  itself. Below one hundred the chain is lesson 2's own. */
function belowHundred(rest: number) {
  if (rest <= 20) return [foundationWord(rest)]
  if (rest % 10 === 0) return [tenEntry(rest)]
  return [tenEntry(Math.floor(rest / 10) * 10), joiner, foundationWord(rest % 10)]
}

function expectedParts(value: number) {
  const parts = [thousandEntry(Math.floor(value / 1000) * 1000)]
  const rest = value % 1000
  if (rest === 0) return parts
  parts.push(joiner)
  if (rest < 100) return [...parts, ...belowHundred(rest)]
  parts.push(hundredEntry(Math.floor(rest / 100) * 100))
  if (rest % 100 === 0) return parts
  return [...parts, joiner, ...belowHundred(rest % 100)]
}

// Candidate content throughout: these tests check identity, derivation and
// text rules, never that a form is correct or approved (Gate A owns that).

describe('regnereglen tusinder: reused parts and derived wholes', () => {
  it('reuses lesson 3, lesson 2 and the foundation by identity, never by copy', () => {
    for (const { value, parts } of compositions) {
      const expected = expectedParts(value)
      expect(parts, String(value)).toHaveLength(expected.length)
      expected.forEach((part, index) => expect(parts[index], `${value}[${index}]`).toBe(part))
      // Only the leading thousand row belongs to this lesson.
      for (const part of parts.slice(1)) expect(part.id.startsWith(ID_PREFIX)).toBe(false)
    }
  })

  it('repeats the one bindeled through the longer chains', () => {
    const joiners = (composition: RuleComposition) =>
      composition.parts.filter((part) => part === joiner).length
    expect(joiners(examples.find(({ value }) => value === 9999)!)).toBe(3)
    expect(joiners(targets.find(({ value }) => value === 8371)!)).toBe(3)
    expect(joiners(targets.find(({ value }) => value === 5642)!)).toBe(3)
    expect(joiners(targets.find(({ value }) => value === 3105)!)).toBe(2)
    expect(joiners(targets.find(({ value }) => value === 2088)!)).toBe(2)
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

describe('regnereglen tusinder: catalog identities', () => {
  it('owns only counting-tusinder- rows and never re-registers a reused part', () => {
    for (const entry of countingThousandsCatalog) {
      expect(entry.id.startsWith(ID_PREFIX), entry.id).toBe(true)
    }
    expect(countingThousandsCatalog).not.toContain(joiner)
    for (const base of hundreds) expect(countingThousandsCatalog).not.toContain(base.entry)
    for (const base of tens) expect(countingThousandsCatalog).not.toContain(base.entry)
    for (const number of countingNumbers) {
      expect(countingThousandsCatalog).not.toContain(number.word)
    }
  })

  it('holds the nine thousands and one entry per composed whole, each id unique', () => {
    expect(countingThousandsCatalog).toHaveLength(thousands.length + wholes.length)
    for (const base of thousands) expect(countingThousandsCatalog).toContain(base.entry)
    for (const { entry } of wholes) expect(countingThousandsCatalog).toContain(entry)
    const ids = countingThousandsCatalog.map((entry) => entry.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toContain(`${ID_PREFIX}tusind`)
    expect(ids).toContain(`${ID_PREFIX}tusinde-9000`)
    expect(ids).toContain(`${ID_PREFIX}tal-9999`)
    expect(countingThousandsCatalog).toContain(thousand)
  })
})

describe('regnereglen tusinder: text rules and pronunciation', () => {
  it('uses Persian code points only: no Arabic kaf/yeh, no ASCII digits', () => {
    for (const entry of countingThousandsCatalog) {
      for (const fa of [entry.fa, entry.faMarked ?? entry.fa]) {
        expect(findPersianTextViolations(fa), entry.id).toEqual([])
      }
    }
  })

  it('gives every candidate row a meaning, dansk lydskrift and IPA', () => {
    for (const entry of countingThousandsCatalog) {
      expect(entry.fa, entry.id).toMatch(PERSIAN_SCRIPT)
      expect(entry.faMarked ?? entry.fa, entry.id).not.toBe('')
      expect(entry.da, entry.id).not.toBe('')
      expect(entry.da, entry.id).not.toMatch(PERSIAN_SCRIPT)
      expect(entry.pron.da, entry.id).not.toBe('')
      expect(entry.pron.ipa, entry.id).not.toBe('')
      // The catalog stores IPA without display brackets; renderers add them.
      expect(entry.pron.ipa, entry.id).not.toMatch(/^\[|\]$/)
    }
  })
})
