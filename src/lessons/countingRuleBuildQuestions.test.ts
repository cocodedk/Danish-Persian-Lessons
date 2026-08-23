import { describe, it, expect } from 'vitest'
import { buildRuleBuildQuestions, isBuildSolved } from './countingRuleExercises'
import { counting21to99Lesson } from './counting21to99'
import { defineEntry } from '../catalog/types'
import type { PersianEntry } from '../catalog/types'
import type { RuleLessonDescriptor } from './countingRuleTypes'

// The `byg` round's pool and its acceptance rule. Every Persian form named or
// invented here is a candidate draft pending Gate A: these tests check the
// assembly model, never whether a form is approved.

const lesson = counting21to99Lesson
const PREFIX = 'counting-2199-'
const exampleIds = new Set(lesson.examples.map((example) => example.entry.id))

/** Code-point order, the same explicit comparator the pool is built with. */
function byId(a: string, b: string): number {
  if (a === b) return 0
  return a < b ? -1 : 1
}

describe('rule-lesson byg round', () => {
  const questions = buildRuleBuildQuestions(lesson)

  it("makes one assembly per unseen target, under this lesson's own ids", () => {
    expect(questions.map((q) => q.itemId)).toEqual(lesson.targets.map((t) => t.entry.id))
    expect(questions).toHaveLength(lesson.targets.length)
    for (const q of questions) {
      expect(q.itemId.startsWith(PREFIX), q.id).toBe(true)
      expect(exampleIds.has(q.itemId), q.id).toBe(false)
    }
  })

  it('keeps the correct parts in spoken order: tier, bindeled, enter', () => {
    const tenIds = new Set(lesson.baseForms.map((base) => base.entry.id))
    for (const q of questions) {
      expect(q.parts, q.id).toHaveLength(3)
      expect(tenIds.has(q.parts[0].id), q.id).toBe(true)
      expect(q.parts[1].id, q.id).toBe(lesson.joiner.id)
      // The unit is the foundation's own row, referenced rather than copied.
      expect(q.parts[2].id, q.id).toMatch(/^number-\d+-word$/)
      expect(q.parts.map((p) => p.fa).join(' '), q.id).toBe(q.entry.fa)
    }
  })

  it('offers every correct part plus distinct, plausible distractors', () => {
    for (const q of questions) {
      for (const part of q.parts) {
        expect(q.tokens.some((token) => token.entryId === part.id), `${q.id}/${part.id}`).toBe(true)
      }
      expect(q.tokens).toHaveLength(q.parts.length + 2)
      // Every offered occurrence carries its own id, safe as a render key.
      expect(new Set(q.tokens.map((t) => t.id)).size, q.id).toBe(q.tokens.length)
      // Two *different* rows writing the same thing would make a second
      // assembly right; this lesson's assemblies need no row twice at all.
      const entryIds = new Set(q.tokens.map((t) => t.entryId))
      expect(entryIds.size, q.id).toBe(q.tokens.length)
      expect(new Set(q.tokens.map((t) => t.entry.fa)).size, q.id).toBe(entryIds.size)
      for (const token of q.tokens) expect(token.glyph, `${q.id}/${token.id}`).toBe(token.entry.fa)
    }
  })

  it('orders the pool by id, so no layout discloses the sequence', () => {
    for (const q of questions) {
      const ids = q.tokens.map((t) => t.id)
      expect(ids, q.id).toEqual([...ids].sort(byId))
      expect(q.tokens.map((t) => t.entryId), q.id).not.toEqual(q.parts.map((p) => p.id))
    }
    expect(buildRuleBuildQuestions(lesson)).toEqual(questions)
  })

  it('accepts the parts in spoken order and nothing else', () => {
    for (const q of questions) {
      const placed = q.parts.map((p) => q.tokens.find((t) => t.entryId === p.id)!.id)
      expect(isBuildSolved(q, placed), q.id).toBe(true)
      expect(isBuildSolved(q, [...placed].reverse()), q.id).toBe(false)
      expect(isBuildSolved(q, placed.slice(0, 2)), q.id).toBe(false)
      expect(isBuildSolved(q, [...placed.slice(0, 2), q.tokens[0].id]), q.id).toBe(false)
    }
  })

  it('never puts the answer in the prompt', () => {
    for (const q of questions) {
      const secrets = [q.entry, ...q.parts]
        .flatMap((row) => [row.fa, row.faMarked, row.pron.da, row.pron.ipa])
        .filter((secret): secret is string => Boolean(secret))
      for (const secret of secrets) expect(q.promptDa, `${q.id}/${secret}`).not.toContain(secret)
      expect(q.promptDa).toBe(`Byg tallet ${q.targetValue}`)
    }
  })
})

// A stand-in for the longer chains lessons 3 and 4 compose, where the joining
// element — and here the unit too — is said twice in one number. No released
// lesson has this shape yet; the pool must carry it regardless.

function entry(id: string, fa: string, da: string): PersianEntry {
  return defineEntry({ id, kind: 'word', fa, da, pron: { da, ipa: da } })
}

const SYNTH_PREFIX = 'synth-'
const synthJoiner = entry(`${SYNTH_PREFIX}bindeled`, 'و', 'og')
const base100 = entry(`${SYNTH_PREFIX}base-100`, 'صد', 'hundrede')
const base200 = entry(`${SYNTH_PREFIX}base-200`, 'دویست', 'to hundrede')
const unitOne = entry(`${SYNTH_PREFIX}enter-1`, 'یک', 'en')
const unitTwo = entry(`${SYNTH_PREFIX}enter-2`, 'دو', 'to')

/** [hundrede, og, en, og, en] — the joiner twice, and the same unit twice. */
const repeatedParts: readonly PersianEntry[] = [base100, synthJoiner, unitOne, synthJoiner, unitOne]

const synthLesson: RuleLessonDescriptor = {
  path: '/lesson/taelle/syntetisk',
  title: 'Syntetisk regellektion',
  summary: 'Kun til test: en regel der gentager bindeleddet',
  range: [100, 222],
  rule: 'Sig grundformen, så bindeleddet og enteren, to gange.',
  buildsOn: { labelDa: 'tallene 1-20', path: '/lesson/taelle' },
  boundaryNotes: ['Nedad slutter denne testregel ved 100, opad ved 222.'],
  idPrefix: SYNTH_PREFIX,
  storageKey: 'counting.syntetisk',
  joiner: synthJoiner,
  baseForms: [
    { value: 100, entry: base100 },
    { value: 200, entry: base200 },
  ],
  examples: [
    {
      value: 102,
      entry: entry(`${SYNTH_PREFIX}tal-102`, 'صد و دو', 'hundrede og to'),
      parts: [base100, synthJoiner, unitTwo],
    },
  ],
  targets: [
    {
      value: 111,
      entry: entry(`${SYNTH_PREFIX}tal-111`, 'صد و یک و یک', 'hundrede og en og en'),
      parts: repeatedParts,
    },
  ],
}

describe('rule-lesson byg round with a repeated joining element', () => {
  const [question] = buildRuleBuildQuestions(synthLesson)
  const occurrencesOf = (entryId: string) =>
    question.tokens.filter((token) => token.entryId === entryId)

  it('offers the joiner and the unit as many times as the answer needs them', () => {
    expect(question.tokens).toHaveLength(repeatedParts.length + 2)
    expect(occurrencesOf(synthJoiner.id)).toHaveLength(2)
    expect(occurrencesOf(unitOne.id)).toHaveLength(2)
    expect(occurrencesOf(base100.id)).toHaveLength(1)
    // The two distractors, one of each kind, are offered once each.
    expect(occurrencesOf(base200.id)).toHaveLength(1)
    expect(occurrencesOf(unitTwo.id)).toHaveLength(1)
  })

  it('gives every occurrence its own id, so nothing can share a render key', () => {
    const ids = question.tokens.map((token) => token.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const token of question.tokens) {
      expect(token.id, token.entryId).toContain(token.entryId)
      expect(token.glyph, token.id).toBe(token.entry.fa)
    }
    // Repeated occurrences are the same row, and say the same thing.
    const [first, second] = occurrencesOf(synthJoiner.id)
    expect(first.id).not.toBe(second.id)
    expect(first.entry).toBe(second.entry)
  })

  it('lays the pool out in one deterministic, answer-blind order', () => {
    const ids = question.tokens.map((token) => token.id)
    expect(ids).toEqual([...ids].sort(byId))
    expect(buildRuleBuildQuestions(synthLesson)).toEqual([question])
  })

  it('keeps the answer as the entry sequence the target was built from', () => {
    expect(question.parts).toBe(repeatedParts)
    expect(question.parts.map((part) => part.id))
      .toEqual([base100.id, synthJoiner.id, unitOne.id, synthJoiner.id, unitOne.id])
  })

  it('accepts either occurrence in either slot, and still refuses a wrong order', () => {
    const [joinerA, joinerB] = occurrencesOf(synthJoiner.id)
    const [unitA, unitB] = occurrencesOf(unitOne.id)
    const hundred = occurrencesOf(base100.id)[0]
    const placed = [hundred.id, joinerA.id, unitA.id, joinerB.id, unitB.id]
    expect(isBuildSolved(question, placed)).toBe(true)
    // Swapping the two identical joiners — and the two identical units — is
    // the same number said the same way, so it is the same right answer.
    expect(isBuildSolved(question, [hundred.id, joinerB.id, unitB.id, joinerA.id, unitA.id]))
      .toBe(true)
    expect(isBuildSolved(question, [hundred.id, unitA.id, joinerA.id, joinerB.id, unitB.id]))
      .toBe(false)
    // One token cannot fill two slots: the pool's multiplicity is the limit.
    expect(isBuildSolved(question, [hundred.id, joinerA.id, unitA.id, joinerA.id, unitB.id]))
      .toBe(false)
    expect(isBuildSolved(question, placed.slice(0, 4))).toBe(false)
  })
})
