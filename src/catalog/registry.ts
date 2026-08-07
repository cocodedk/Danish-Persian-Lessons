import { alphabetCatalog } from './alphabet'
import { bridgesCatalog } from './bridges'
import { interfaceCatalog } from './interface'
import { namesCatalog } from './names'
import { rewardsCatalog } from './rewards'
import type { PersianEntry } from './types'
import { vocabularyCatalog } from './vocabulary'

export const catalogDomains = {
  alphabet: alphabetCatalog,
  bridges: bridgesCatalog,
  vocabulary: vocabularyCatalog,
  interface: interfaceCatalog,
  names: namesCatalog,
  rewards: rewardsCatalog,
} satisfies Record<string, PersianEntry[]>

export const persianCatalog: PersianEntry[] = Object.values(catalogDomains).flat()
