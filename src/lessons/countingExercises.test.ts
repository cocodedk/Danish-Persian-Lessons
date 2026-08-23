import { describe, it, expect } from 'vitest'
import { buildCountingQuestions, isCountingExerciseKind, COUNTING_EXERCISE_TITLES } from './countingExercises'
import { countingNumbers } from './numbers'

describe('counting exercise rounds', () => {
  it('knows its two kinds', () => {
    expect(isCountingExerciseKind('betydning')).toBe(true)
    expect(isCountingExerciseKind('tal')).toBe(true)
    expect(isCountingExerciseKind('andre')).toBe(false)
    expect(Object.keys(COUNTING_EXERCISE_TITLES)).toEqual(['betydning', 'tal'])
  })

  it('builds one question per number for each kind', () => {
    for (const kind of ['betydning', 'tal'] as const) {
      const questions = buildCountingQuestions(kind)
      expect(questions).toHaveLength(20)
      expect(new Set(questions.map((q) => q.id)).size).toBe(20)
    }
  })

  it('hides what would answer the question while the attempt is active', () => {
    for (const q of buildCountingQuestions('betydning')) {
      // Danish choices + visible pronunciation would give the answer away.
      expect(q.showsFa).toBe(true)
      expect(q.showsPron).toBe(false)
      expect(q.choiceLang).toBe('da')
    }
    for (const q of buildCountingQuestions('tal')) {
      expect(q.showsFa).toBeUndefined()
      expect(q.choiceLang).toBe('fa')
    }
  })

  it('keeps every round sound-safe: no choice sounds like the answer', () => {
    for (const kind of ['betydning', 'tal'] as const) {
      for (const q of buildCountingQuestions(kind)) {
        const answer = countingNumbers.find(({ word }) => word.id === q.itemId)!
        expect(q.choices.some((c) => c.id === q.answerId), q.id).toBe(true)
        expect(new Set(q.choices.map((c) => c.id)).size, q.id).toBe(4)
        for (const choice of q.choices) {
          if (choice.id !== q.answerId) {
            const other = countingNumbers.find(({ word }) => word.id === choice.id)!
            expect(other.word.pron.ipa, q.id).not.toBe(answer.word.pron.ipa)
          }
        }
      }
    }
  })

  // The catalog entry is what renders the specimen, its help and its two
  // pronunciations — an undefined one would show an empty card, so every
  // question and every choice is pinned to the exact entry from the data.
  it('carries the catalog entry itself on every question and choice', () => {
    for (const kind of ['betydning', 'tal'] as const) {
      for (const q of buildCountingQuestions(kind)) {
        const answer = countingNumbers.find(({ word }) => word.id === q.itemId)!
        expect(q.entry, q.id).toBe(answer.word)
        expect(q.entry.pron.ipa, q.id).toBeTruthy()
        for (const choice of q.choices) {
          const row = countingNumbers.find(({ word }) => word.id === choice.id)!
          expect(choice.entry, `${q.id}/${choice.id}`).toBe(row.word)
          expect(choice.glyph, `${q.id}/${choice.id}`).toBe(
            kind === 'betydning' ? row.word.da : row.word.fa,
          )
        }
      }
    }
  })
})
