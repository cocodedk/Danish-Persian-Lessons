import { specimens } from '../lessons/alphabet'
import { laterMarks, vowelMarks } from '../lessons/vowelMarks'
import type { PersianEntry } from './types'

const specimenEntries = Object.values(specimens).flatMap((item) => [item.entry, item.nameEntry])
const markEntries = [...vowelMarks, ...laterMarks].flatMap((item) => [item.entry, item.nameEntry])

export const alphabetCatalog: PersianEntry[] = [...specimenEntries, ...markEntries]
