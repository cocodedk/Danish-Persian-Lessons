import { alphabetCatalog } from './alphabet'
import { bridgesCatalog } from './bridges'
import { conversationCatalog } from './conversation'
import { interfaceCatalog } from './interface'
import { namesCatalog } from './names'
import { allCountingCatalog } from './numbers'
import { rewardsCatalog } from './rewards'
import type { PersianEntry } from './types'
import { vocabularyCatalog } from './vocabulary'

export const catalogDomains = {
  alphabet: alphabetCatalog,
  bridges: bridgesCatalog,
  vocabulary: vocabularyCatalog,
  conversation: conversationCatalog,
  // allCountingCatalog is the 1–20 foundation (plan 016) plus the candidate
  // 21–99 rule rows (plan 017), which are drafts awaiting review.
  numbers: allCountingCatalog,
  interface: interfaceCatalog,
  names: namesCatalog,
  rewards: rewardsCatalog,
} satisfies Record<string, PersianEntry[]>

export const persianCatalog: PersianEntry[] = Object.values(catalogDomains).flat()
