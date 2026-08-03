// Persian text-rule guard (CLAUDE.md "Persian text rules"): every fa string in
// the app must use Persian code points only, never the Arabic-form kaf/yeh,
// and never ASCII digits.

const ARABIC_KAF = 'ك' // ك — forbidden; use ک (U+06A9)
const ARABIC_YEH = 'ي' // ي — forbidden; use ی (U+06cc)
const ASCII_DIGIT = /[0-9]/

/** Returns a human-readable violation for every text-rule break found in `text`. */
export function findPersianTextViolations(text: string): string[] {
  const violations: string[] = []

  if (text.includes(ARABIC_KAF)) {
    violations.push('contains Arabic ك (U+0643); use Persian ک (U+06A9)')
  }
  if (text.includes(ARABIC_YEH)) {
    violations.push('contains Arabic ي (U+064A); use Persian ی (U+06CC)')
  }
  if (ASCII_DIGIT.test(text)) {
    violations.push('contains an ASCII digit; use Persian digits ۰–۹ (U+06F0–06F9)')
  }

  return violations
}

export function isValidPersianText(text: string): boolean {
  return findPersianTextViolations(text).length === 0
}
