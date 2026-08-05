// Persian digits ۰–۹ (U+06F0–06F9). Script knowledge, so it lives beside the
// text rules rather than in a component — CLAUDE.md forbids ASCII digits in
// any Persian string, and this is the one place that conversion happens.

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

export function toPersianDigits(value: number): string {
  return String(value).replace(/\d/g, (digit) => FA_DIGITS[Number(digit)])
}
