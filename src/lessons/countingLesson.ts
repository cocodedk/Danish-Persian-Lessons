import { countingNumbers } from './numbers'
import type { BeginnerNumber } from './numbers'
import { counting21to99Lesson } from './counting21to99'
import { counting100to900Lesson } from './counting100to900'

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
  /** The first and last number this lesson covers, read off `numbers` rather
   *  than typed, so the range and the rows can never disagree. */
  readonly range: readonly [start: number, end: number]
  numbers: BeginnerNumber[]
}

/**
 * The foundation's endpoints, taken from the rows themselves. Writing 1 and 20
 * here would be a second place the range lives; taking the first and last row
 * means resizing the list moves the range with it.
 */
const foundationRange = [
  countingNumbers[0].value,
  countingNumbers[countingNumbers.length - 1].value,
] as const

export const countingLesson: LessonDescriptor = {
  path: '/lesson/taelle',
  title: 'Tæl til tyve',
  summary: 'Sig tallene fra 1 til 20 på persisk',
  range: foundationRange,
  numbers: countingNumbers,
}

/**
 * What every counting lesson has in common, whatever kind of descriptor it is:
 * where it lives, what it is called, and where its range starts and stops. A
 * screen that only needs to order or announce the lessons needs nothing more.
 */
export interface CountingCurriculumEntry {
  readonly path: string
  readonly title: string
  readonly summary: string
  readonly range: readonly [start: number, end: number]
}

/**
 * The counting lessons in teaching order — the implementation's single source
 * for which lesson comes after which. These are the descriptor objects
 * themselves, not copies of their fields, so nothing here can drift from the
 * lesson it names. Adding a lesson means adding its descriptor to this array.
 *
 * The product decision about the four-stage counting curriculum lives in the
 * design documents; this array says only what is currently implemented on
 * this branch. Membership here is not release approval — a lesson listed
 * below is wired up in code, which says nothing about whether it has shipped.
 */
export const countingCurriculum: readonly CountingCurriculumEntry[] = [
  countingLesson,
  counting21to99Lesson,
  counting100to900Lesson,
]
