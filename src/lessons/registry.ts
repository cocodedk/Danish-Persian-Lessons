// The single source of truth for every lesson the app knows about. Empty for
// plan 001 — no lesson content yet (that's plans 003/004). The text-rule
// guard test walks this array, so future lessons are checked automatically.
import type { Lesson } from './types'

export const lessons: Lesson[] = []
