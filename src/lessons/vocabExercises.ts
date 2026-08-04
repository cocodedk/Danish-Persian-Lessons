// The two vocabulary rounds, built from the unit data with the machinery the
// alphabet rounds already use (./exercises): four choices, exactly one right,
// the answer in a different slot each question, nothing shuffled. No new
// exercise type — plan 004 step 4.
import { arrange, CHOICE_COUNT } from './exercises'
import type { Choice, Question } from './exercises'
import { findVocabUnit } from './vocab'
import type { VocabWord } from './vocab'

export type VocabExerciseKind = 'ord' | 'par'

export const VOCAB_EXERCISE_TITLES: Record<VocabExerciseKind, string> = {
  ord: 'Find betydningen',
  par: 'Find ordet',
}

export function isVocabExerciseKind(value: string): value is VocabExerciseKind {
  return value === 'ord' || value === 'par'
}

/**
 * Two words are too alike to share a question when they mean the same thing or
 * sound the same — either one would answer the other's prompt. Persian has
 * plenty of هم‌آوا pairs waiting to be added (از/آز), so the rule lives here as
 * well as in the data test, and a future word cannot slip past it.
 */
function alike(a: VocabWord, b: VocabWord): boolean {
  return a.da === b.da || a.pron.ipa === b.pron.ipa || a.pron.da === b.pron.da
}

/**
 * Three words to choose against: the unit's next neighbours, wrapping around.
 *
 * Throws rather than silently handing back a short round: a unit too small,
 * or too full of هم‌آوا pairs, to fill `CHOICE_COUNT - 1` sound-safe
 * distractors would otherwise ship a three-choice question with nothing
 * telling a reader it is one choice short (accepted as a fresh concern in
 * plan 004's critic round 1, built rather than deferred).
 */
export function distractors(words: VocabWord[], index: number): VocabWord[] {
  const word = words[index]
  const pool: VocabWord[] = []
  for (let step = 1; step < words.length && pool.length < CHOICE_COUNT - 1; step += 1) {
    const other = words[(index + step) % words.length]
    if (!alike(other, word)) pool.push(other)
  }
  if (pool.length < CHOICE_COUNT - 1) {
    throw new Error(
      `distractors: "${word.id}" has only ${pool.length} sound-safe distractor(s) in its ` +
        `unit, needs ${CHOICE_COUNT - 1} — add words or widen the unit rather than ship a ` +
        'short round.',
    )
  }
  return pool
}

/** What a choice is printed with: the Danish meaning, or the bare Persian word. */
function choiceOf(word: VocabWord, kind: VocabExerciseKind): Choice {
  return { id: word.id, glyph: kind === 'ord' ? word.da : word.fa }
}

/**
 * One round for one unit. `ord` shows the vocalized word and asks what it
 * means; `par` names the meaning and asks which word it is. Both carry the
 * pronunciation twice, from the data — the sound is the bridge between the two.
 */
export function buildVocabQuestions(unitId: string, kind: VocabExerciseKind): Question[] {
  const unit = findVocabUnit(unitId)
  if (!unit) return []

  return unit.words.map((word, index) => ({
    id: `${kind}-${unit.id}-${word.id}`,
    itemId: word.id,
    promptDa: kind === 'ord' ? 'Hvad betyder ordet?' : `Hvilket ord betyder »${word.da}«?`,
    // The specimen carries its اِعراب; the choices in `par` do not — marks
    // belong on teaching specimens only (docs/design/ART-DIRECTION.md). Both
    // the plain and the marked spelling go along, so FaSpecimen can draw the
    // two-layer specimen instead of losing one side of a word marked above
    // and below (مَدرِسه) to the single gradient cut.
    ...(kind === 'ord' ? { promptFa: word.fa, promptFaMarked: word.faMarked } : {}),
    sound: word.pron,
    choices: arrange(
      choiceOf(word, kind),
      distractors(unit.words, index).map((other) => choiceOf(other, kind)),
      index,
    ),
    answerId: word.id,
    choiceLang: kind === 'ord' ? ('da' as const) : ('fa' as const),
  }))
}
