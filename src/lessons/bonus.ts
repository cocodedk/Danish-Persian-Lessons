// The bonus round a gift opens. No new lesson content: it is three questions
// off the "Find tegnet" round the learner already knows, taken from a
// different place in the alphabet for each gift so a second gift is a second
// set. Deterministic, like every other question in this app.
import { buildQuestions } from './exercises'
import type { Question } from './exercises'

export const BONUS_LENGTH = 3

/** `ordinal` counts gifts from one. */
export function bonusQuestions(ordinal: number): Question[] {
  const all = buildQuestions('find')
  const start = ((ordinal - 1) * BONUS_LENGTH) % all.length
  return Array.from({ length: BONUS_LENGTH }, (_, step) => all[(start + step) % all.length])
}
