// A written name in, ranked Persian spellings out. Pure — this module is the
// one place that decides how a name is spelled, and it decides the same way
// every time. See docs/plans/006-your-name.md step 1.
import { overrideFor } from './overrides'
import { ruleSpellings, cleanPart } from './rules'
import { isDecent } from './blocklist'

/** Whatever a person may type between two names: space, hyphen, apostrophe. */
const PART_BREAK = /[\s\-‐–—'’]+/

const MAX_SUGGESTIONS = 3

/** One or two letters is an initial, not a name: «X Æ A» is nobody's spelling. */
const INITIAL_LENGTH = 2

function dedupe(spellings: string[]): string[] {
  return [...new Set(spellings)].filter(Boolean)
}

/**
 * One part of a name, best spelling first — and never a word the learner would
 * not want to be called (blocklist.ts).
 *
 * A name the override list knows is spelled the one way the list spells it. The
 * list is not a first guess among several: putting محمد at the top of a list
 * whose other lines are rule-made near-misses invites a learner to pick a
 * misspelling of their own name, so the rules are not consulted at all here.
 */
function partSpellings(part: string): string[] {
  const override = overrideFor(part)
  return dedupe(override ? [override] : ruleSpellings(part)).filter(isDecent)
}

/**
 * Ranked Persian spellings of `raw`, best first, at most three. Empty when
 * there is no letter to work with, when a part is an initial rather than a
 * name, or when a part has nothing decent left to offer — a name field the
 * engine cannot answer honestly gets no suggestion rather than a bad one, and
 * the screen hands the learner the letter bank instead.
 *
 * A compound name is spelled part by part and joined with one plain space:
 * «Anne-Mette» is two names, so it never takes a ZWNJ.
 */
export function suggestSpellings(raw: string): string[] {
  const parts = raw.split(PART_BREAK).map(cleanPart).filter(Boolean)
  if (parts.length === 0) return []

  // Initials spell nothing. Read as sounds they turn into words of their own —
  // X alone was «کس» — and no reading of one letter is anybody's name. Unless
  // the list knows the name: a short name that is really a name is spelled.
  if (parts.some((part) => part.length <= INITIAL_LENGTH && !overrideFor(part))) return []

  const perPart = parts.map(partSpellings)
  // Nothing decent for one part means nothing for the whole name: half a name
  // is worse than none, and «ک س» is the same word with a gap in it.
  if (perPart.some((list) => list.length === 0)) return []

  const depth = Math.max(...perPart.map((list) => list.length))
  const joined: string[] = []
  for (let rank = 0; rank < depth; rank += 1) {
    joined.push(perPart.map((list) => list[Math.min(rank, list.length - 1)]).join(' '))
  }

  // A compound the list knows as one word — Alireza → علیرضا — is offered
  // beside the same name written as two, never instead of it.
  const whole = overrideFor(raw)
  return dedupe([...(whole ? [whole] : []), ...joined])
    .filter(isDecent)
    .slice(0, MAX_SUGGESTIONS)
}
