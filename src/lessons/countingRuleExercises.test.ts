import { describe, it, expect } from 'vitest'
import {
  buildRuleRecognitionQuestions,
  isRuleRecognitionKind,
  RULE_RECOGNITION_TITLES,
} from './countingRuleExercises'
import { counting21to99Lesson } from './counting21to99'
import { CHOICE_COUNT } from './exercises'

const KINDS = ['betydning', 'tal'] as const
const lesson = counting21to99Lesson
const PREFIX = 'counting-2199-'

const targetIds = new Set(lesson.targets.map((target) => target.entry.id))
const ownedRows = [
  ...lesson.baseForms.map((base) => base.entry),
  ...lesson.examples.map((example) => example.entry),
].filter((entry) => entry.id.startsWith(PREFIX))

describe('rule-lesson recognition rounds', () => {
  it('knows its two choice kinds', () => {
    expect(isRuleRecognitionKind('betydning')).toBe(true)
    expect(isRuleRecognitionKind('tal')).toBe(true)
    expect(isRuleRecognitionKind('byg')).toBe(false)
    expect(Object.keys(RULE_RECOGNITION_TITLES)).toEqual(['betydning', 'tal'])
  })

  // The prefix decides what this lesson may ask about at all, and the lesson
  // states it rather than leaving it to be inferred from one row's id.
  it('owns exactly the contracted item-id prefix, and says so itself', () => {
    expect(lesson.idPrefix).toBe(PREFIX)
    expect(lesson.storageKey).toBe('counting.21-99')
  })

  it('asks about every row it owns, and about nothing it only references', () => {
    for (const kind of KINDS) {
      const questions = buildRuleRecognitionQuestions(lesson, kind)
      expect(questions.map((q) => q.itemId)).toEqual(ownedRows.map((entry) => entry.id))
      for (const q of questions) expect(q.itemId.startsWith(PREFIX), q.id).toBe(true)
      // The foundation's twenty is referenced, never re-taught or re-scored.
      expect(questions.some((q) => q.itemId === 'number-20-word')).toBe(false)
      // The joining element is a piece of a number, not an answer.
      expect(questions.some((q) => q.itemId === lesson.joiner.id)).toBe(false)
      expect(questions.some((q) => q.choices.some((c) => c.id === lesson.joiner.id))).toBe(false)
    }
  })

  it('never spends a byg target as a question or a choice', () => {
    for (const kind of KINDS) {
      for (const q of buildRuleRecognitionQuestions(lesson, kind)) {
        expect(targetIds.has(q.itemId), q.id).toBe(false)
        for (const choice of q.choices) expect(targetIds.has(choice.id), q.id).toBe(false)
      }
    }
  })

  it('offers four distinct choices with exactly one right answer', () => {
    for (const kind of KINDS) {
      for (const q of buildRuleRecognitionQuestions(lesson, kind)) {
        expect(q.choices, q.id).toHaveLength(CHOICE_COUNT)
        expect(new Set(q.choices.map((c) => c.id)).size, q.id).toBe(CHOICE_COUNT)
        expect(q.choices.filter((c) => c.id === q.answerId), q.id).toHaveLength(1)
        expect(q.answerId).toBe(q.itemId)
      }
    }
  })

  it('keeps every round sound-safe: no wrong choice answers the question too', () => {
    for (const kind of KINDS) {
      for (const q of buildRuleRecognitionQuestions(lesson, kind)) {
        for (const choice of q.choices) {
          if (choice.id === q.answerId) continue
          expect(choice.entry.da, `${q.id}/${choice.id}`).not.toBe(q.entry.da)
          expect(choice.entry.pron.ipa, `${q.id}/${choice.id}`).not.toBe(q.entry.pron.ipa)
          expect(choice.entry.pron.da, `${q.id}/${choice.id}`).not.toBe(q.entry.pron.da)
        }
      }
    }
  })

  it('moves the answer around the four slots', () => {
    for (const kind of KINDS) {
      const slots = buildRuleRecognitionQuestions(lesson, kind).map((q) =>
        q.choices.findIndex((c) => c.id === q.answerId),
      )
      expect(new Set(slots).size, kind).toBe(CHOICE_COUNT)
    }
  })

  it('hides what would answer the question while the attempt is active', () => {
    for (const q of buildRuleRecognitionQuestions(lesson, 'betydning')) {
      expect(q.showsFa).toBe(true)
      expect(q.showsPron).toBe(false)
      expect(q.choiceLang).toBe('da')
    }
    for (const q of buildRuleRecognitionQuestions(lesson, 'tal')) {
      expect(q.showsFa).toBeUndefined()
      expect(q.choiceLang).toBe('fa')
      expect(q.promptDa).not.toContain(q.entry.fa)
      expect(q.promptDa).not.toContain(q.entry.pron.da)
    }
  })

  it('carries its own descriptor entry on every question and choice', () => {
    const byId = new Map(
      [
        ...lesson.baseForms.map((base) => base.entry),
        ...lesson.examples.map((example) => example.entry),
      ].map((entry) => [entry.id, entry]),
    )
    for (const kind of KINDS) {
      for (const q of buildRuleRecognitionQuestions(lesson, kind)) {
        expect(q.entry, q.id).toBe(byId.get(q.itemId))
        for (const choice of q.choices) {
          expect(choice.entry, `${q.id}/${choice.id}`).toBe(byId.get(choice.id))
          expect(choice.glyph, `${q.id}/${choice.id}`).toBe(
            kind === 'betydning' ? choice.entry.da : choice.entry.fa,
          )
        }
      }
    }
  })

  it('builds the same round every time', () => {
    for (const kind of KINDS) {
      expect(buildRuleRecognitionQuestions(lesson, kind)).toEqual(
        buildRuleRecognitionQuestions(lesson, kind),
      )
    }
  })
})
