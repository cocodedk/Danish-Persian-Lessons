// How counting numbers are written for a Danish reader (plan 017).
//
// Descriptor ranges stay numeric — they are the range authority, and arithmetic
// on them must keep working. This module owns the one step after that: turning
// such a number, or a whole range, into the string a card shows. Every
// human-facing counting number on the shelves goes through here, so the
// thousands lesson can never say «1000» on one screen and «1.000» on another.

/**
 * One counting number as Danish writes it: thousands separated by a full stop.
 * 21 and 999 are unchanged, 1000 becomes 1.000 and 9999 becomes 9.999.
 *
 * The grouping is done here rather than by `Intl.NumberFormat` so the output is
 * the same on every machine that builds the app, whatever locale data its
 * runtime happens to carry. Only the non-negative integers of the counting
 * curriculum are in scope.
 */
export function formatCountingNumber(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/**
 * A descriptor's range as the half-sentence a card puts after its own opening
 * word — «fra 1.000 til 9.999». The card supplies the framing («Tal …», «20 tal
 * …»); the numbers themselves are never formatted anywhere else.
 */
export function formatCountingRange(range: readonly [start: number, end: number]): string {
  return `fra ${formatCountingNumber(range[0])} til ${formatCountingNumber(range[1])}`
}
