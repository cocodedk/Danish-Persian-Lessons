// The two counting rounds (plan 016), built from the 1–20 data with the
// machinery the vocabulary rounds already use (./exercises): four choices,
// exactly one right, the answer in a different slot each question, nothing
// shuffled. No new exercise type.
import { arrange, CHOICE_COUNT } from './exercises'
import type { Choice, Question } from './exercises'
import { countingNumbers } from './numbers'
import type { BeginnerNumber } from './numbers'

export type CountingExerciseKind = 'betydning' | 'tal'

export const COUNTING_EXERCISE_TITLES: Record<CountingExerciseKind, string> = {
  betydning: 'Find betydningen',
  tal: 'Find tallet',
}

export function isCountingExerciseKind(value: string): value is CountingExerciseKind {
  return value === 'betydning' || value === 'tal'
}

/** Two numbers never share a question when either could answer the other. */
function alike(a: BeginnerNumber, b: BeginnerNumber): boolean {
  return (
    a.word.da === b.word.da ||
    a.word.pron.ipa === b.word.pron.ipa ||
    a.word.pron.da === b.word.pron.da
  )
}

/** Three neighbours from the full 1–20 list, wrapping around; sound-safe. */
function distractors(rows: BeginnerNumber[], index: number): BeginnerNumber[] {
  const row = rows[index]
  const pool: BeginnerNumber[] = []
  for (let step = 1; step < rows.length && pool.length < CHOICE_COUNT - 1; step += 1) {
    const other = rows[(index + step) % rows.length]
    if (!alike(other, row)) pool.push(other)
  }
  if (pool.length < CHOICE_COUNT - 1) {
    throw new Error(`countingExercises: "${row.word.id}" has too few sound-safe distractors.`)
  }
  return pool
}

/** What a choice is printed with: the Danish number name, or the Persian word. */
function choiceOf(row: BeginnerNumber, kind: CountingExerciseKind): Choice {
  return { id: row.word.id, entry: row.word, glyph: kind === 'betydning' ? row.word.da : row.word.fa }
}

export function buildCountingQuestions(kind: CountingExerciseKind): Question[] {
  return countingNumbers.map((row, index) => ({
    id: `${kind}-${row.word.id}`,
    itemId: row.word.id,
    entry: row.word,
    promptDa:
      kind === 'betydning'
        ? 'Hvilket tal er det?'
        : `Hvilket ord betyder »${row.word.da}«?`,
    // `betydning` shows the vocalized specimen but hides the pronunciation —
    // it would spell the answer. `tal` hides the specimen while active; the
    // reveal after the attempt always carries everything (plan 010).
    ...(kind === 'betydning' ? { showsFa: true, showsPron: false } : {}),
    choices: arrange(
      choiceOf(row, kind),
      distractors(countingNumbers, index).map((other) => choiceOf(other, kind)),
      index,
    ),
    answerId: row.word.id,
    choiceLang: kind === 'betydning' ? ('da' as const) : ('fa' as const),
  }))
}
