import { vocabUnits } from '../lessons/vocab'
import type { PersianEntry } from './types'
import { connectedReadings, readingFunctionEntries } from '../lessons/connectedReading'

export const vocabularyCatalog: PersianEntry[] = vocabUnits.flatMap((unit) => [
  unit.titleEntry,
  ...unit.words.map((word) => word.entry),
])

vocabularyCatalog.push(...readingFunctionEntries, ...connectedReadings.map((reading) => reading.entry))
