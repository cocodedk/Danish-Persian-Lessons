import { keyExists, readJSON, writeJSON } from './storage'

export type JourneyChoice = 'speak' | 'words' | 'script'

interface JourneyPreference {
  choice?: unknown
}

const KEY = 'journey'
const LEGACY_COURSE_KEYS = [
  'profile',
  'alphabet',
  'rewards',
  'settings',
  'name-lesson',
  'puzzles',
  'vocab.1',
  'vocab.2',
  'vocab.3',
  'typing.1',
  'typing.2',
  'typing.3',
  'typing.name',
]

export function getJourneyChoice(): JourneyChoice | undefined {
  const { choice } = readJSON<JourneyPreference>(KEY, {})
  if (choice === 'speak' || choice === 'words' || choice === 'script') return choice
  if (choice === 'child') return 'words'
  if (choice === 'course') return 'script'
  return undefined
}

export function setJourneyChoice(choice: JourneyChoice): void {
  writeJSON<JourneyPreference>(KEY, { choice })
}

/** Keeps learners with pre-journey course records on their familiar front door. */
export function hasCourseHistory(): boolean {
  return LEGACY_COURSE_KEYS.some(keyExists)
}
