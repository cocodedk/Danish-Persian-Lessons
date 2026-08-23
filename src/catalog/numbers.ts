import { counting100to900Catalog } from '../lessons/counting100to900'
import { counting21to99Catalog } from '../lessons/counting21to99'
import { countingThousandsCatalog } from '../lessons/countingThousands'
import { countingCatalog } from '../lessons/numbers'
import type { PersianEntry } from './types'

export { numberCatalog, countingCatalog } from '../lessons/numbers'

/**
 * Every counting entry the catalog registers: the reviewed-scope 1–20
 * foundation first, then the 21–99 rule lesson's candidate rows, then the
 * 100–900 rule lesson's candidate rows, then the thousands rule lesson's
 * candidate rows. The order is append-only so existing ids and generated
 * review-row order stay put, and each lesson contributes only its own rows —
 * rows it merely references stay with their own module, so no entry is
 * registered twice.
 */
export const allCountingCatalog: PersianEntry[] = [
  ...countingCatalog,
  ...counting21to99Catalog,
  ...counting100to900Catalog,
  ...countingThousandsCatalog,
]
