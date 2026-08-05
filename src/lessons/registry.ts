// The single source of truth for every lesson the app knows about. The
// Persian text-rule guard walks this array, so lesson content is checked
// automatically the moment it lands here.
import type { Lesson } from './types'
import { letters } from './alphabet'
import { vowelMarks } from './vowelMarks'
import { vocabUnits } from './vocab'

export const ALPHABET_LESSON_ID = 'alphabet'

/** The registry id of a vocabulary unit — `vocab-1` for unit «۱». */
export function vocabLessonId(unitId: string): string {
  return `vocab-${unitId}`
}

export const lessons: Lesson[] = [
  { id: ALPHABET_LESSON_ID, kind: 'alphabet', items: [...letters, ...vowelMarks] },
  ...vocabUnits.map(
    (unit): Lesson => ({ id: vocabLessonId(unit.id), kind: 'vocab', items: unit.words }),
  ),
]
