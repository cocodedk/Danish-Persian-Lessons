// A written name in, ranked Persian spellings out. Pure — this module is the
// one place that decides how a name is spelled, and it decides the same way
// every time. See docs/plans/006-your-name.md step 1.
import { overrideFor } from './overrides'
import { ruleSpellings, cleanPart } from './rules'

/** Whatever a person may type between two names: space, hyphen, apostrophe. */
const PART_BREAK = /[\s\-‐–—'’]+/

const MAX_SUGGESTIONS = 3

function dedupe(spellings: string[]): string[] {
  return [...new Set(spellings)].filter(Boolean)
}

/** One part of a name, best spelling first: the list, then the rules. */
function partSpellings(part: string): string[] {
  const override = overrideFor(part)
  return dedupe([...(override ? [override] : []), ...ruleSpellings(part)])
}

/**
 * Ranked Persian spellings of `raw`, best first, at most three. Empty when
 * there is no letter to work with — a name field with only digits in it gets
 * no suggestion rather than an error.
 *
 * A compound name is spelled part by part and joined with one plain space:
 * «Anne-Mette» is two names, so it never takes a ZWNJ.
 */
export function suggestSpellings(raw: string): string[] {
  const whole = overrideFor(raw)
  const parts = raw.split(PART_BREAK).map(cleanPart).filter(Boolean)
  const perPart = parts.map(partSpellings).filter((list) => list.length > 0)
  if (perPart.length === 0) return whole ? [whole] : []

  const depth = Math.max(...perPart.map((list) => list.length))
  const joined: string[] = []
  for (let rank = 0; rank < depth; rank += 1) {
    joined.push(perPart.map((list) => list[Math.min(rank, list.length - 1)]).join(' '))
  }

  return dedupe([...(whole ? [whole] : []), ...joined]).slice(0, MAX_SUGGESTIONS)
}
