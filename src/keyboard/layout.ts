// The key map. Letter placement follows the standard Persian layout's order —
// ض ص ث ق ف غ ع ه خ ح ج چ · ش س ی ب ل ا ت ن م ک گ · ظ ط ز ر ذ د پ و — reflowed
// into six rows of six so every key can be at least 44×44px on a 360px screen
// (docs/plans/005-persian-keyboard.md, Acceptance box 1). ژ sits beside ز and آ
// beside ا, where the standard layout hides them under a shift this keyboard
// does not have.
//
// Nothing here spells a letter's name or draws its glyph a second time: both
// come from the alphabet data, which is the single source (CLAUDE.md).
import { specimens } from '../lessons/alphabet'
import { ZWNJ, SPACE, type KeyKind } from './buffer'

export interface KeyDef {
  /** A letter id from the alphabet data, or one of the three sign keys. */
  id: string
  kind: KeyKind
  /** What the key writes into the buffer. Empty for backspace. */
  glyph: string
  /** The key's accessible name — for a letter, its Danish name as taught. */
  label: string
  /** The Danish sound hint shown under a letter key's glyph. Absent for the
   *  three sign keys, which keep their own caption instead. */
  hint?: string
}

/**
 * آ is on the board although it is not one of the 32: the primer's first word
 * is آب, and a keyboard that cannot write it cannot run this lesson at all.
 * The alphabet lesson already teaches it as a specimen of its own.
 */
const ROW_IDS: string[][] = [
  ['zad', 'sad', 'se', 'ghaf', 'fe', 'gheyn'],
  ['eyn', 'he', 'khe', 'he-jimi', 'jim', 'che'],
  ['shin', 'sin', 'ye', 'be', 'lam', 'alef'],
  ['alef-madde', 'te', 'nun', 'mim', 'kaf', 'gaf'],
  ['za', 'ta', 'ze', 'zhe', 're', 'zal'],
  ['dal', 'pe', 'vav', 'space', 'zwnj', 'backspace'],
]

/**
 * The three keys that write no letter. They sit at the left end of the bottom
 * row — the far end of a right-to-left row, and the corner a thumb reaches
 * first.
 */
const SIGN_KEYS: Record<string, KeyDef> = {
  space: { id: 'space', kind: 'separator', glyph: SPACE, label: 'mellemrum' },
  zwnj: { id: 'zwnj', kind: 'separator', glyph: ZWNJ, label: 'halvt mellemrum' },
  backspace: { id: 'backspace', kind: 'backspace', glyph: '', label: 'slet sidste tegn' },
}

function keyFor(id: string): KeyDef {
  const sign = SIGN_KEYS[id]
  if (sign) return sign

  const specimen = specimens[id]
  // Loud on purpose: a mistyped id would otherwise ship a blank key that
  // writes nothing and says nothing.
  if (!specimen) throw new Error(`keyboard layout: no letter "${id}" in the alphabet data`)
  // Same discipline for the hint: a letter key without its Danish sound hint
  // would ship a silently blank cap instead of failing the build.
  if (!specimen.latinHint) throw new Error(`keyboard layout: letter "${id}" has no latinHint`)
  return {
    id,
    kind: 'letter',
    glyph: specimen.glyph,
    label: specimen.name.da,
    hint: specimen.latinHint,
  }
}

export const KEYBOARD_ROWS: KeyDef[][] = ROW_IDS.map((row) => row.map(keyFor))

export const KEYBOARD_KEYS: KeyDef[] = KEYBOARD_ROWS.flat()

/** Every code point this keyboard can write — letters, the ZWNJ, the space. */
const TYPEABLE = new Set(KEYBOARD_KEYS.filter((key) => key.glyph).map((key) => key.glyph))

/**
 * True when `text` can be written on this keyboard at all. One name in the app's
 * own list cannot be — لوئیزه spells Louise with ئ, a sign outside the 32 that
 * no lesson here teaches — and an exercise that asks for a letter the board does
 * not have is a dead end. The capstone stays dormant for such a name instead
 * (docs/plans/005-persian-keyboard.md, deviation 3).
 */
export function canType(text: string): boolean {
  return [...text].every((char) => TYPEABLE.has(char))
}
