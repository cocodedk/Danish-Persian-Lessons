// The two alphabet exercises, built from the letter data — no question is
// written by hand, so a data fix reaches the exercises for free.
//
// Everything here is deterministic: the distractors, their order, and the slot
// the right answer sits in. Nothing shuffles, so a test can name what it sees
// and a learner who comes back tomorrow meets the same round.
import { letters, specimens, teachingOrder } from './alphabet'
import { sameBodyAs } from './strokes'
import type { Pron } from './types'
import type { PersianEntry } from '../catalog/types'

export type ExerciseKind = 'find' | 'match'

export interface Choice {
  /** The letter this choice belongs to. */
  id: string
  entry: PersianEntry
  /** What is printed on the choice: a glyph, or one positional form of it. */
  glyph: string
}

export interface Question {
  id: string
  /** The item a correct answer completes: a letter here, a word in plan 004. */
  itemId: string
  entry: PersianEntry
  /** Danish prompt, du-form. */
  promptDa: string
  /** True when the question shows its Persian specimen (rendered from `entry`);
   *  absent when the Persian IS the thing being asked for. */
  showsFa?: boolean
  /** False when the pronunciation itself would disclose a conceptual answer. */
  showsPron?: boolean
  choices: Choice[]
  answerId: string
  /** What language the choices are written in. Persian unless stated otherwise. */
  choiceLang?: 'fa' | 'da'
}

/** Four choices per question — shared with the vocabulary rounds (plan 004). */
export const CHOICE_COUNT = 4
const LETTER_ORDER = letters.map((letter) => letter.id)

type Position = 'initial' | 'medial' | 'final'

const POSITION_DA: Record<Position, string> = {
  initial: 'først i et ord',
  medial: 'midt i et ord',
  final: 'sidst i et ord',
}

/**
 * Two specimens sound alike when they share either half of the pronunciation —
 * the IPA or the Danish anchor. Persian spells one sound several ways (ذ ز ض ظ,
 * ث س ص, ت ط, ح ه, ق غ), and a question may never offer two answers to itself.
 */
function soundsAlike(a: Pron, b: Pron): boolean {
  return a.ipa === b.ipa || a.da === b.da
}

/**
 * Three letters to choose against. Letters that share a body come first — the
 * useful confusion is ب against ت, never ب against ل — then the neighbours in
 * `order` fill up whatever is left. Homophones are skipped in both passes: ص
 * next to س would be a second right answer, not a distractor.
 */
function distractorIds(id: string, count: number, order: string[]): string[] {
  const sound = specimens[id].sound
  const usable = (other: string) => other !== id && !soundsAlike(specimens[other].sound, sound)
  const pool = sameBodyAs(id).filter(usable).slice(0, count)
  const start = order.indexOf(id)
  for (let step = 1; pool.length < count; step += 1) {
    const candidate = order[(start + step) % order.length]
    if (usable(candidate) && !pool.includes(candidate)) pool.push(candidate)
  }
  return pool
}

/** Puts the right answer in a different slot each question, without randomness. */
export function arrange<T>(answer: T, distractors: T[], slot: number): T[] {
  const choices: T[] = [...distractors]
  choices.splice(slot % (distractors.length + 1), 0, answer)
  return choices
}

/** "Find tegnet": a Danish sound anchor, four glyphs, one of them right. */
function findQuestions(): Question[] {
  // Plain alef is a contextual vowel carrier, not one stable sound. Asking
  // which sign “says” its placeholder role would teach the contradiction this
  // round is meant to test, so it is learned through words instead.
  return teachingOrder.filter((id) => id !== 'alef').map((id, index) => {
    const specimen = specimens[id]
    const distractors = distractorIds(id, CHOICE_COUNT - 1, teachingOrder).map((other) => ({
      id: other,
      entry: specimens[other].entry,
      glyph: specimens[other].glyph,
    }))
    return {
      id: `find-${id}`,
      itemId: id,
      entry: specimen.entry,
      promptDa: 'Hvilket tegn siger denne lyd?',
      choices: arrange({ id, entry: specimen.entry, glyph: specimen.glyph }, distractors, index),
      answerId: id,
    }
  })
}

/** "Match formerne": one isolated letter, four positional forms, one of them its own. */
function matchQuestions(): Question[] {
  return letters.map((letter, index) => {
    const position: Position = letter.joinsLeft
      ? index % 2 === 0
        ? 'medial'
        : 'initial'
      : 'final'
    const distractors = distractorIds(letter.id, CHOICE_COUNT - 1, LETTER_ORDER).map((other) => {
      const source = letters[LETTER_ORDER.indexOf(other)]
      return { id: other, entry: source.entry, glyph: source.forms[position] }
    })
    return {
      id: `match-${letter.id}`,
      itemId: letter.id,
      entry: letter.entry,
      promptDa: `Hvordan ser bogstavet ud ${POSITION_DA[position]}?`,
      showsFa: true,
      choices: arrange({ id: letter.id, entry: letter.entry, glyph: letter.forms[position] }, distractors, index),
      answerId: letter.id,
    }
  })
}

export function buildQuestions(kind: ExerciseKind): Question[] {
  return kind === 'find' ? findQuestions() : matchQuestions()
}

export const EXERCISE_TITLES: Record<ExerciseKind, string> = {
  find: 'Find tegnet',
  match: 'Match formerne',
}
