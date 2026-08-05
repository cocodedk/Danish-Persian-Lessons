import { describe, it, expect } from 'vitest'
import { buildVocabQuestions, distractors, isVocabExerciseKind } from './vocabExercises'
import type { VocabExerciseKind } from './vocabExercises'
import { vocabUnits, allVocabWords } from './vocab'
import type { VocabWord } from './vocab'
import { withoutMarks } from './marks'

const KINDS: VocabExerciseKind[] = ['ord', 'par']
const rounds = vocabUnits.flatMap((unit) =>
  KINDS.map((kind) => ({ unit, kind, questions: buildVocabQuestions(unit.id, kind) })),
)
const everyQuestion = rounds.flatMap((round) => round.questions)

function wordOf(id: string) {
  return allVocabWords.find((word) => word.id === id)!
}

describe('vocabulary exercises', () => {
  it('asks about every word in the unit once, in book order, both rounds', () => {
    for (const { unit, kind, questions } of rounds) {
      expect(
        questions.map((question) => question.itemId),
        `${kind}-${unit.id}`,
      ).toEqual(unit.words.map((word) => word.id))
    }
  })

  it('names no unit and no round for a URL that names neither', () => {
    expect(buildVocabQuestions('9', 'ord')).toEqual([])
    expect(isVocabExerciseKind('ord')).toBe(true)
    expect(isVocabExerciseKind('find')).toBe(false)
  })

  it('gives every question four distinct choices, one of them right', () => {
    for (const question of everyQuestion) {
      expect(question.choices, question.id).toHaveLength(4)
      expect(new Set(question.choices.map((choice) => choice.id)).size, question.id).toBe(4)
      expect(new Set(question.choices.map((choice) => choice.glyph)).size, question.id).toBe(4)
      expect(
        question.choices.some((choice) => choice.id === question.answerId),
        question.id,
      ).toBe(true)
    }
  })

  it('extends the unique-answer invariant to words: exactly one choice answers the prompt', () => {
    for (const question of everyQuestion) {
      const asked = wordOf(question.itemId)
      const answers = question.choices.filter((choice) => {
        const candidate = wordOf(choice.id)
        return (
          candidate.da === asked.da ||
          candidate.pron.ipa === asked.pron.ipa ||
          candidate.pron.da === asked.pron.da
        )
      })
      expect(
        answers.map((choice) => choice.id),
        question.id,
      ).toEqual([question.answerId])
    }
  })

  it('never offers a هم‌آوا word as a distractor — a same-sounding pair would be a second right answer', () => {
    for (const question of everyQuestion) {
      const asked = wordOf(question.itemId)
      for (const choice of question.choices) {
        if (choice.id === question.answerId) continue
        expect(wordOf(choice.id).pron.ipa, `${question.id} / ${choice.id}`).not.toBe(asked.pron.ipa)
      }
    }
  })

  it('says every prompt twice — dansk lydskrift and IPA — from the word data', () => {
    for (const question of everyQuestion) {
      expect(question.entry.pron, question.id).toEqual(wordOf(question.itemId).pron)
    }
  })

  it('shows the vocalized specimen when it shows Persian, and bare words in the choices', () => {
    for (const { kind, questions } of rounds) {
      for (const question of questions) {
        const word = wordOf(question.itemId)
        if (kind === 'ord') {
          expect(question.showsFa, question.id).toBe(true)
          expect(question.choiceLang).toBe('da')
          expect(question.choices.map((choice) => choice.glyph)).toContain(word.da)
        } else {
          expect(question.showsFa, question.id).toBeUndefined()
          expect(question.promptDa, question.id).toContain(word.da)
          expect(question.choiceLang).toBe('fa')
          // اِعراب belongs on specimens only — the choices are bare words.
          for (const choice of question.choices) {
            expect(withoutMarks(choice.glyph), choice.glyph).toBe(choice.glyph)
          }
        }
      }
    }
  })

  it('does not park the answer in the same slot every time', () => {
    const slots = buildVocabQuestions('1', 'ord').map((question) =>
      question.choices.findIndex((choice) => choice.id === question.answerId),
    )
    expect(new Set(slots).size).toBe(4)
  })

  it('is deterministic — the same round every time', () => {
    for (const { unit, kind, questions } of rounds) {
      expect(buildVocabQuestions(unit.id, kind)).toEqual(questions)
    }
  })

  it('throws rather than silently shipping a round short of distractors', () => {
    // Three هم‌آوا clones of one real word leave the target zero non-alike
    // neighbours — one short of the three `CHOICE_COUNT - 1` needs.
    const target = wordOf('ab')
    const clone = (id: string): VocabWord => ({ ...target, id })
    const tooFew = [target, clone('ab2'), clone('ab3'), clone('ab4')]
    expect(() => distractors(tooFew, 0)).toThrow(/distractor/i)
  })

  it('never actually falls short in the real units — every word has room to spare', () => {
    for (const unit of vocabUnits) {
      for (let index = 0; index < unit.words.length; index += 1) {
        expect(() => distractors(unit.words, index), `${unit.id}/${unit.words[index].id}`).not.toThrow()
      }
    }
  })
})
