// Persian words this app must never hand a learner back as their own name.
//
// A transliteration engine spells sounds, and some sounds spell something else:
// Kirsten came out کیرستن, "X Æ A-12" came out «کس ا آ». Both are obscene to a
// Persian reader and neither was anybody's mistake to make but ours. So every
// suggestion is read once more before it is offered, and anything that reads
// crude is simply not offered — the letter bank takes over.
//
// Two match modes, because Persian words behave in two different ways here:
//
//   * PREFIX — the worst words are still the word when a name grows out of
//     them: کیرستن opens on کیر and is read that way, whatever follows. These
//     are matched against the START of a written part.
//   * WHOLE TOKEN — مرگ («død») inside مارگرته is nothing at all; مرگ standing
//     alone is death. These are matched against the whole part, never inside it,
//     or half the override table would fall (الکساندر carries کس in the middle
//     and is simply Alexander).
//
// Never «ک س»: splitting a word across a space does not make it a different
// word, it only makes it a worse suggestion. A filtered part offers nothing.

/** Crude whatever follows them — matched on the opening of a part. */
export const CRUDE_PREFIXES: string[] = ['کس', 'کیر', 'کون', 'گوز', 'شاش', 'چس']

/** Crude only as the whole word — matched against a complete part. */
export const CRUDE_WORDS: string[] = [
  'سکس',
  'کص',
  'کصکش',
  'کوس',
  'کونی',
  'جنده',
  'جاکش',
  'خایه',
  'گه',
  'گوه',
  'رید',
  'ریده',
  'خر',
  'سگ',
  'گاو',
  'بز',
  'کر',
  'زر',
  'مرگ',
  'دول',
  'دودول',
  'ممه',
  'نره',
  'زنا',
  'اسکل',
  'جق',
  'عن',
  'دیوث',
  'پفیوز',
]

/** A written word: whitespace and the ZWNJ both end one. */
const PART_BREAK = /[\s‌]+/

/**
 * Every crude word `text` hits, part by part — empty when there is nothing to
 * answer for. Returns the words themselves so a failing test can say which.
 */
export function crudeHits(text: string): string[] {
  const hits: string[] = []
  for (const part of text.split(PART_BREAK)) {
    if (part === '') continue
    for (const word of CRUDE_PREFIXES) {
      if (part.startsWith(word)) hits.push(word)
    }
    for (const word of CRUDE_WORDS) {
      if (part === word) hits.push(word)
    }
  }
  return hits
}

/** True when nothing in `text` reads crude, and it may be offered as a name. */
export function isDecent(text: string): boolean {
  return crudeHits(text).length === 0
}
