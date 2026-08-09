import { alphabetCatalog } from './alphabet'
import { bridgesCatalog } from './bridges'
import { conversationCatalog } from './conversation'
import { interfaceCatalog } from './interface'
import { namesCatalog } from './names'
import { numberCatalog } from './numbers'
import { rewardsCatalog } from './rewards'
import type { PersianEntry } from './types'
import { vocabularyCatalog } from './vocabulary'

export const catalogDomains = {
  alphabet: alphabetCatalog,
  bridges: bridgesCatalog,
  vocabulary: vocabularyCatalog,
  conversation: conversationCatalog,
  numbers: numberCatalog,
  interface: interfaceCatalog,
  names: namesCatalog,
  rewards: rewardsCatalog,
} satisfies Record<string, PersianEntry[]>

export const persianCatalog: PersianEntry[] = Object.values(catalogDomains).flat()
