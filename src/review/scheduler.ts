import { getAlphabetProgress } from '../progress/alphabet'
import { getVocabProgress } from '../progress/vocab'
import { readJSON, writeJSON } from '../progress/storage'
import { daysBetween } from '../rewards/days'
import { specimens } from '../lessons/alphabet'
import { vowelMarks } from '../lessons/vowelMarks'
import { vocabUnits } from '../lessons/vocab'
import { addLocalDays, reviewDay, validReviewDay } from './days'

export { addLocalDays } from './days'

export type ReviewOutcome = 'wrong' | 'revealed' | 'correct'

export interface ReviewState {
  entryId: string
  introducedAt: string
  successfulRetrievals: number
  successfulDays: string[]
  stage: 0 | 1 | 2 | 3 | 4 | 5 | 6
  dueDay: string
  lapses: number
  lastAttempt?: ReviewOutcome
  lastAttemptDay?: string
}

interface ReviewStore {
  version: 1
  items: Record<string, ReviewState>
}

const KEY = 'review'
export const REVIEW_INTERVALS = [0, 1, 3, 7, 14, 30, 60] as const
export const REVIEW_MAX_TASKS = 12
export const REVIEW_DUE_LIMIT = 8

function stageOf(value: unknown): ReviewState['stage'] {
  const stage = typeof value === 'number' ? Math.floor(value) : 0
  return Math.max(0, Math.min(6, stage)) as ReviewState['stage']
}

function normalizeState(entryId: string, raw: Partial<ReviewState>, fallbackDay: string): ReviewState {
  const introducedAt = validReviewDay(raw.introducedAt) ? raw.introducedAt : fallbackDay
  const dueDay = validReviewDay(raw.dueDay) ? raw.dueDay : fallbackDay
  const successfulDays = Array.isArray(raw.successfulDays)
    ? [...new Set(raw.successfulDays.filter(validReviewDay))].sort()
    : []
  const lastAttempt = ['wrong', 'revealed', 'correct'].includes(raw.lastAttempt ?? '')
    ? raw.lastAttempt
    : undefined
  return {
    entryId,
    introducedAt,
    successfulRetrievals: Math.max(0, Math.floor(Number(raw.successfulRetrievals) || 0)),
    successfulDays,
    stage: stageOf(raw.stage),
    dueDay,
    lapses: Math.max(0, Math.floor(Number(raw.lapses) || 0)),
    ...(lastAttempt ? { lastAttempt } : {}),
    ...(validReviewDay(raw.lastAttemptDay) ? { lastAttemptDay: raw.lastAttemptDay } : {}),
  }
}

function readStore(fallbackDay: string): ReviewStore {
  const raw = readJSON<Partial<ReviewStore>>(KEY, {})
  const rows = raw.items && typeof raw.items === 'object' ? raw.items : {}
  const items = Object.fromEntries(
    Object.entries(rows).map(([id, state]) => [id, normalizeState(id, state, fallbackDay)]),
  )
  return { version: 1, items }
}

function legacyEntryIds(): string[] {
  const alphabet = getAlphabetProgress()
  const letters = alphabet.letters
    .map((id) => specimens[id]?.entry.id)
    .filter((id): id is string => Boolean(id))
  const marks = alphabet.marks
    .map((id) => vowelMarks.find((mark) => mark.id === id)?.entry.id)
    .filter((id): id is string => Boolean(id))
  const words = vocabUnits.flatMap((unit) => {
    const seen = getVocabProgress(unit.id).words
    return unit.words.filter((word) => seen.includes(word.id)).map((word) => word.entry.id)
  })
  return [...new Set([...letters, ...marks, ...words])]
}

export function syncLegacyReview(now: Date = new Date()): ReviewStore {
  const key = reviewDay(now)
  const fallback = key ?? '1970-01-01'
  const store = readStore(fallback)
  if (!key) return store
  let changed = false
  for (const entryId of legacyEntryIds()) {
    if (store.items[entryId]) continue
    store.items[entryId] = {
      entryId,
      introducedAt: key,
      successfulRetrievals: 0,
      successfulDays: [],
      stage: 0,
      dueDay: key,
      lapses: 0,
    }
    changed = true
  }
  if (changed) writeJSON<ReviewStore>(KEY, store)
  return store
}

export function introduceForReview(entryId: string, now: Date = new Date()): ReviewState | null {
  const key = reviewDay(now)
  if (!key) return null
  const store = syncLegacyReview(now)
  const existing = store.items[entryId]
  if (existing) return existing
  const state: ReviewState = {
    entryId,
    introducedAt: key,
    successfulRetrievals: 0,
    successfulDays: [],
    stage: 0,
    dueDay: key,
    lapses: 0,
  }
  store.items[entryId] = state
  writeJSON<ReviewStore>(KEY, store)
  return state
}

export function recordReview(
  entryId: string,
  outcome: ReviewOutcome,
  now: Date = new Date(),
): ReviewState | null {
  const key = reviewDay(now)
  if (!key) return null
  const store = syncLegacyReview(now)
  const current = store.items[entryId] ?? introduceForReview(entryId, now)
  if (!current) return null
  let next: ReviewState
  if (outcome !== 'correct') {
    next = {
      ...current,
      dueDay: addLocalDays(key, 1),
      lapses: current.lapses + (outcome === 'wrong' ? 1 : 0),
      lastAttempt: outcome,
      lastAttemptDay: key,
    }
  } else {
    const alreadySucceededToday = current.successfulDays.includes(key)
    const recoveringToday =
      current.lastAttemptDay === key &&
      (current.lastAttempt === 'wrong' || current.lastAttempt === 'revealed')
    const stage = alreadySucceededToday || recoveringToday
      ? current.stage
      : (Math.min(6, current.stage + 1) as ReviewState['stage'])
    next = {
      ...current,
      successfulRetrievals: current.successfulRetrievals + 1,
      successfulDays: alreadySucceededToday
        ? current.successfulDays
        : [...current.successfulDays, key].sort(),
      stage,
      dueDay: recoveringToday
        ? addLocalDays(key, 1)
        : addLocalDays(key, REVIEW_INTERVALS[stage]),
      lastAttempt: 'correct',
      lastAttemptDay: key,
    }
  }
  store.items[entryId] = next
  writeJSON<ReviewStore>(KEY, store)
  return next
}

export function reviewStates(now: Date = new Date()): ReviewState[] {
  const key = reviewDay(now)
  if (!key) return []
  return Object.values(syncLegacyReview(now).items).map((state) => {
    const tooFarAhead = daysBetween(key, state.dueDay) > REVIEW_INTERVALS.at(-1)!
    const clockBeforeIntroduction = daysBetween(key, state.introducedAt) > 0
    return tooFarAhead || clockBeforeIntroduction ? { ...state, dueDay: key } : state
  })
}

export function dueReviewStates(now: Date = new Date()): ReviewState[] {
  const key = reviewDay(now)
  if (!key) return []
  return reviewStates(now)
    .filter((state) => state.dueDay <= key)
    .sort((a, b) => a.dueDay.localeCompare(b.dueDay) || a.entryId.localeCompare(b.entryId))
}

export function isRetained(state: ReviewState): boolean {
  if (state.successfulDays.length < 2) return false
  return state.successfulDays.some((day, index) =>
    state.successfulDays.slice(index + 1).some((later) => daysBetween(day, later) >= 3),
  )
}
