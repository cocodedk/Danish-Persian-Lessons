// Progress through the write-your-name mini-lesson: `dpl.v1.name-lesson`.
// Add-only, like every other store here: once the name has been written, that
// stays true — even if the learner later changes the spelling.
import { readJSON, writeJSON } from './storage'

const KEY = 'name-lesson'

interface NameLessonProgress {
  done: boolean
}

export function isNameLessonDone(): boolean {
  return readJSON<Partial<NameLessonProgress>>(KEY, {}).done === true
}

export function markNameLessonDone(): void {
  writeJSON<NameLessonProgress>(KEY, { done: true })
}
