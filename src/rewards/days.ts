// Day arithmetic for the streak. A "day" is a local calendar day — the learner's
// midnight, not UTC's — because that is the day they actually live in.

/** `YYYY-MM-DD` for the local calendar day `date` falls in. */
export function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/**
 * Whole days from `from` to `to`, both day keys. The keys are compared as UTC
 * midnights so a daylight-saving shift can never make a day 23 or 25 hours long.
 */
export function daysBetween(from: string, to: string): number {
  const MS_PER_DAY = 86_400_000
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / MS_PER_DAY)
}
