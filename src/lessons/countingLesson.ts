import { countingNumbers } from './numbers'
import type { BeginnerNumber } from './numbers'

/**
 * "Tæl til tyve" as the app knows it: the one place the counting lesson's
 * route, its Danish title, its one-line summary on the forside and the rows
 * it teaches are written down. The rows are `countingNumbers` itself — never
 * a copy — so the twenty on the lesson page and the twenty on the forside are
 * the same twenty, and the count is read off the list rather than typed.
 */
export interface LessonDescriptor {
  path: string
  title: string
  summary: string
  numbers: BeginnerNumber[]
}

export const countingLesson: LessonDescriptor = {
  path: '/lesson/taelle',
  title: 'Tæl til tyve',
  summary: 'Sig tallene fra 1 til 20 på persisk',
  numbers: countingNumbers,
}
