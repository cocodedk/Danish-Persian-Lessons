// The override list: a name people already write a particular way beats
// anything the rules could work out. See docs/plans/006-your-name.md step 1.
import { IRANIAN_NAMES } from './namesIranian'
import { DANISH_NAMES } from './namesDanish'

const OVERRIDES: Record<string, string> = { ...IRANIAN_NAMES, ...DANISH_NAMES }

/** Lookup key: case and punctuation are not part of a name. */
function key(latin: string): string {
  return latin.toLowerCase().replace(/[^a-zæøå]/g, '')
}

/** The agreed Persian spelling of `latin`, if the list knows the name. */
export function overrideFor(latin: string): string | undefined {
  return OVERRIDES[key(latin)]
}

/**
 * Every Persian spelling on the list, so the text-rule guard can walk the table
 * itself — an Arabic ك or ي typed into a name entry fails the test suite.
 */
export const NAME_OVERRIDE_FA_STRINGS: string[] = Object.values(OVERRIDES)

/**
 * Every Latin name the list knows, so a test can run the whole table back
 * through the engine — the decency guard walks what the app would really
 * offer, not only what the table stores.
 */
export const NAME_OVERRIDE_LATIN: string[] = Object.keys(OVERRIDES)

/** How many names the list covers. Asserted in the tests, quoted in the plan. */
export const OVERRIDE_COUNT = NAME_OVERRIDE_LATIN.length
