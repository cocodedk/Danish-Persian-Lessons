import { vocabUnits } from '../lessons/vocab'
import type { PersianEntry } from './types'

export const vocabularyCatalog: PersianEntry[] = vocabUnits.flatMap((unit) => [
  unit.titleEntry,
  ...unit.words.map((word) => word.entry),
])
