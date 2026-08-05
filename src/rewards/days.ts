// Day arithmetic for the streak. A "day" is a local calendar day — the learner's
// midnight, not UTC's — because that is the day they actually live in.

/** `YYYY-MM-DD` for the local calendar day `date` falls in. */
export function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

const DAY_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/**
 * True only for a real `YYYY-MM-DD` key. `dayKey` trusts whatever `getMonth`/
 * `getDate`/`getFullYear` hand back; a wholly invalid `Date` makes all three
 * `NaN` (`"NaN-NaN-NaN"`), but a `Date` *subclass* can lie about just one of
 * them and still pass a `getTime()` check, producing a half-corrupt key like
 * `"2026-NaN-03"`. Checking the produced string closes the hole at the class,
 * not the instance: it does not matter which getter lied, or whether it was
 * overridden at all — only whether what came out looks like a day.
 */
export function isValidDayKey(key: string): boolean {
  return DAY_KEY_PATTERN.test(key)
}

/**
 * Whole days from `from` to `to`, both day keys. The keys are compared as UTC
 * midnights so a daylight-saving shift can never make a day 23 or 25 hours long.
 */
export function daysBetween(from: string, to: string): number {
  const MS_PER_DAY = 86_400_000
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / MS_PER_DAY)
}
