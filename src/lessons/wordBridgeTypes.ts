import type { PersianEntry } from '../catalog/types'

export type WordBridgeCategory = 'family' | 'everyday' | 'numbers' | 'world' | 'memory'

export interface WordBridge {
  id: string
  titleDa: string
  entry: PersianEntry
  danish: string
  danishIpa?: string
  danishGlossDa: string
  category: WordBridgeCategory
  clueDa: string
  meaningDa: string
  historyDa: string
}
