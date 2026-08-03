// The single source of truth for every lesson the app knows about. The
// Persian text-rule guard walks this array, so lesson content is checked
// automatically the moment it lands here.
import type { Lesson } from './types'
import { letters } from './alphabet'
import { vowelMarks } from './vowelMarks'

export const ALPHABET_LESSON_ID = 'alphabet'

export const lessons: Lesson[] = [
  { id: ALPHABET_LESSON_ID, kind: 'alphabet', items: [...letters, ...vowelMarks] },
]
