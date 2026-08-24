// The two rule lessons whose worked examples reuse a base row they already
// teach — 500 in 100-900, and 1.000 and 5.000 in tusinder — and whose build
// targets are four-digit numbers a Danish reader writes with a full stop.
// Lesson 2 (21-99) has neither shape, so it is covered by
// countingRuleExercises.test.ts and countingRuleBuildQuestions.test.ts alone.
//
// Every Persian form, lydskrift and IPA these rows carry is a candidate draft
// pending Gate A. Nothing here asserts that any of them is right; what is
// asserted is that each row is asked about once, that the choices stay
// sound-safe, and that a prompt prints the number without spelling the answer.
import { describe, it, expect } from 'vitest'
import {
  buildRuleBuildQuestions,
  buildRuleRecognitionQuestions,
} from './countingRuleExercises'
import { counting100to900Lesson } from './counting100to900'
import { countingThousandsLesson } from './countingThousands'
import { formatCountingNumber } from './countingDisplay'
import { CHOICE_COUNT } from './exercises'
import type { RuleLessonDescriptor } from './countingRuleTypes'

const KINDS = ['betydning', 'tal'] as const

/** The rows a lesson may ask about, once each, in first-occurrence order:
 *  bases first, then the examples that are not already one of them. */
function expectedOwnedIds(lesson: RuleLessonDescriptor): string[] {
  const seen = new Set<string>()
  return [
    ...lesson.baseForms.map((base) => base.entry),
    ...lesson.examples.map((example) => example.entry),
  ]
    .filter((entry) => entry.id.startsWith(lesson.idPrefix))
    .filter((entry) => !seen.has(entry.id) && seen.add(entry.id))
    .map((entry) => entry.id)
}

const LESSONS = [
  {
    lesson: counting100to900Lesson,
    name: 'regnereglen 100-900',
    /** 500 is a base *and* the first worked example: it is the same row. */
    reusedBaseValues: [500],
    order: [
      'counting-100900-hundrede-100',
      'counting-100900-hundrede-200',
      'counting-100900-hundrede-300',
      'counting-100900-hundrede-400',
      'counting-100900-hundrede-500',
      'counting-100900-hundrede-600',
      'counting-100900-hundrede-700',
      'counting-100900-hundrede-800',
      'counting-100900-hundrede-900',
      'counting-100900-tal-107',
      'counting-100900-tal-315',
      'counting-100900-tal-642',
      'counting-100900-tal-999',
    ],
    prompts: {
      208: 'Byg tallet 208',
      350: 'Byg tallet 350',
      416: 'Byg tallet 416',
      861: 'Byg tallet 861',
    },
  },
  {
    lesson: countingThousandsLesson,
    name: 'regnereglen tusinder',
    /** Both the thousand word alone and the 5.000 multiplier are worked. */
    reusedBaseValues: [1000, 5000],
    order: [
      'counting-tusinder-tusind',
      'counting-tusinder-tusinde-2000',
      'counting-tusinder-tusinde-3000',
      'counting-tusinder-tusinde-4000',
      'counting-tusinder-tusinde-5000',
      'counting-tusinder-tusinde-6000',
      'counting-tusinder-tusinde-7000',
      'counting-tusinder-tusinde-8000',
      'counting-tusinder-tusinde-9000',
      'counting-tusinder-tal-1300',
      'counting-tusinder-tal-1042',
      'counting-tusinder-tal-1007',
      'counting-tusinder-tal-9999',
    ],
    prompts: {
      2088: 'Byg tallet 2.088',
      3105: 'Byg tallet 3.105',
      5642: 'Byg tallet 5.642',
      8371: 'Byg tallet 8.371',
    },
  },
] as const

describe.each(LESSONS)('$name', ({ lesson, reusedBaseValues, order, prompts }) => {
  // The premise: these lessons really do work an example through a row they
  // already own as a base. If a descriptor stops doing that, the dedupe below
  // is no longer being tested and this test must be revisited, not deleted.
  it('works some of its own base rows through as examples', () => {
    for (const value of reusedBaseValues) {
      const base = lesson.baseForms.find((row) => row.value === value)
      const example = lesson.examples.find((row) => row.value === value)
      expect(base, `${value}`).toBeDefined()
      expect(example, `${value}`).toBeDefined()
      expect(example!.entry.id).toBe(base!.entry.id)
    }
  })

  it('asks about every row it owns exactly once, in first-occurrence order', () => {
    for (const kind of KINDS) {
      const questions = buildRuleRecognitionQuestions(lesson, kind)
      expect(questions.map((q) => q.itemId), kind).toEqual([...order])
      expect(questions.map((q) => q.itemId), kind).toEqual(expectedOwnedIds(lesson))
      // Nothing can collide as a render key or pay progress twice.
      expect(new Set(questions.map((q) => q.id)).size, kind).toBe(questions.length)
      expect(new Set(questions.map((q) => q.itemId)).size, kind).toBe(questions.length)
    }
  })

  it('asks one question, not two, about a base it also works as an example', () => {
    for (const kind of KINDS) {
      const questions = buildRuleRecognitionQuestions(lesson, kind)
      for (const value of reusedBaseValues) {
        const id = lesson.baseForms.find((row) => row.value === value)!.entry.id
        expect(questions.filter((q) => q.itemId === id), `${kind}/${value}`).toHaveLength(1)
      }
    }
  })

  it('offers four sound-safe choices, one of them the answer, and no duplicate', () => {
    for (const kind of KINDS) {
      for (const q of buildRuleRecognitionQuestions(lesson, kind)) {
        expect(q.choices, q.id).toHaveLength(CHOICE_COUNT)
        expect(new Set(q.choices.map((c) => c.id)).size, q.id).toBe(CHOICE_COUNT)
        expect(new Set(q.choices.map((c) => c.glyph)).size, q.id).toBe(CHOICE_COUNT)
        expect(q.choices.filter((c) => c.id === q.answerId), q.id).toHaveLength(1)
        // `alike` is internal, so its three fields are checked here directly:
        // no two choices may share a meaning or either pronunciation aid.
        for (const field of [
          (index: number) => q.choices[index].entry.da,
          (index: number) => q.choices[index].entry.pron.ipa,
          (index: number) => q.choices[index].entry.pron.da,
        ]) {
          const said = q.choices.map((_, index) => field(index))
          expect(new Set(said).size, `${q.id}/${said.join('|')}`).toBe(CHOICE_COUNT)
        }
      }
    }
  })

  it('prints every build target as Danish writes it, and spells no answer', () => {
    const questions = buildRuleBuildQuestions(lesson)
    expect(questions.map((q) => q.targetValue)).toEqual(lesson.targets.map((t) => t.value))
    for (const q of questions) {
      expect(q.promptDa, q.id).toBe(`Byg tallet ${formatCountingNumber(q.targetValue)}`)
      expect(q.promptDa, q.id).toBe(prompts[q.targetValue as keyof typeof prompts])
      // Four digits are grouped, so the ungrouped writing must be absent;
      // two- and three-digit targets are unchanged and print as themselves.
      if (q.targetValue >= 1000) expect(q.promptDa, q.id).not.toContain(String(q.targetValue))
      const secrets = [q.entry, ...q.parts]
        .flatMap((row) => [row.fa, row.faMarked, row.pron.da, row.pron.ipa, row.da])
        .filter((secret): secret is string => Boolean(secret))
      for (const secret of secrets) expect(q.promptDa, `${q.id}/${secret}`).not.toContain(secret)
    }
  })
})
