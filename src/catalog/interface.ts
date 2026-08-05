import { INTERFACE_ENTRIES } from '../content/faStrings'
import { GREETING_ENTRY, GREETING_WITH_NAME_ENTRY } from '../content/greetings'
import { KIT_SHEET_ENTRY } from '../content/kitSamples'
import { ORIENTATION_ENTRIES } from '../content/orientation'
import type { PersianEntry } from './types'

export const interfaceCatalog: PersianEntry[] = [
  GREETING_ENTRY,
  GREETING_WITH_NAME_ENTRY,
  KIT_SHEET_ENTRY,
  ...INTERFACE_ENTRIES,
  ...ORIENTATION_ENTRIES,
]
