import { counting21to99Catalog } from '../lessons/counting21to99'
import { countingCatalog } from '../lessons/numbers'
import type { PersianEntry } from './types'

export { numberCatalog, countingCatalog } from '../lessons/numbers'

/**
 * Every counting entry the catalog registers: the reviewed-scope 1–20
 * foundation first, then the 21–99 rule lesson's candidate rows appended. The
 * order is append-only so existing ids and generated review-row order stay put.
 */
export const allCountingCatalog: PersianEntry[] = [...countingCatalog, ...counting21to99Catalog]
