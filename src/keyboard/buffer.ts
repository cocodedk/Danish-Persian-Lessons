// What the on-screen keyboard writes into. Pure string in, pure string out.
//
// The one idea worth knowing: **the string IS the buffer**. Persian letters
// change shape according to their neighbours, and the browser's own text
// shaping already does that — بابا typed as four separate letters renders
// joined without a line of help from here. Any joining logic in this file
// would be a second, worse implementation of something the platform does
// correctly. So there is none. See docs/plans/005-persian-keyboard.md step 2.

/** نیم‌فاصله (U+200C): the half-space that separates without breaking the word. */
export const ZWNJ = '‌'

export const SPACE = ' '

/** What a key does, independent of which key it is (src/keyboard/layout.ts). */
export type KeyKind = 'letter' | 'separator' | 'backspace'

/**
 * The two signs that only mean something between two letters: the نیم‌فاصله and
 * the plain space of a compound name. Neither can open a buffer and neither can
 * follow the other — a leading or doubled separator is invisible on screen and
 * would fail a comparison the learner has no way to see.
 */
const SEPARATORS = new Set([ZWNJ, SPACE])

function lastCodePoint(buffer: string): string | undefined {
  return [...buffer].at(-1)
}

export function appendLetter(buffer: string, glyph: string): string {
  return buffer + glyph
}

/** A ZWNJ or a space: never leading, never doubled, never after the other one. */
export function appendSeparator(buffer: string, separator: string): string {
  const last = lastCodePoint(buffer)
  if (last === undefined || SEPARATORS.has(last)) return buffer
  return buffer + separator
}

/**
 * One code point off the end — including a lone ZWNJ, which is one press and
 * one deletion, not an invisible one that has to be pressed twice.
 */
export function backspace(buffer: string): string {
  return [...buffer].slice(0, -1).join('')
}

/** What one key press does. The keyboard component knows nothing beyond this. */
export function press(buffer: string, kind: KeyKind, glyph: string): string {
  switch (kind) {
    case 'letter':
      return appendLetter(buffer, glyph)
    case 'separator':
      return appendSeparator(buffer, glyph)
    case 'backspace':
      return backspace(buffer)
  }
}
