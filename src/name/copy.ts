// What the app says about the learner's own name, in both languages. Kept in
// one file so the Persian text-rule guard can walk it and a reader can hear the
// whole tone at once. See docs/plans/006-your-name.md steps 2, 5 and 6.
import { nameLetters, OTHER_SIGN_FA, type FormKey, type NameLetter } from './forms'
import { PRAISE } from '../rewards/copy'
import type { Praise } from '../rewards/types'

export const SPELLING_TITLE_FA = 'نامت به فارسی'
export const SPELLING_PICK_FA = 'کدام را می‌پسندی؟'

/** The mini-lesson's own title, as the plan writes it. */
export const WRITE_NAME_FA = 'نامِ خود را بنویس'
export const ASSEMBLE_FA = 'نامت را دوباره بچین'

/** What the tray of tappable letters is, over both banks. */
export const LETTERS_FA = 'حرف‌ها'

/**
 * The other thing a wrong tap can be: not a letter waiting its turn, but a
 * letter that is not in this name at all. «دوباره» is the right word for the
 * first and a small lie for the second — a learner told to try again looks for
 * the same letter twice. So this line says which it was, and where to look.
 */
export const NOT_IN_NAME_FA = 'این حرف در نامِ تو نیست. دوباره نگاه کن.'
export const NOT_IN_NAME_DA = 'Det bogstav er ikke i dit navn. Kig igen.'

/** …and the one for a letter that IS in the name, further along. */
export const LATER_IN_NAME_DA = 'Det bogstav kommer et andet sted i navnet. Prøv igen, du mister ingenting.'

/** The promise in the settings corner, said in both languages. */
export const PRIVACY_FA = 'نامت فقط روی همین دستگاه می‌ماند.'
export const PRIVACY_DA = 'Navnet gemmes kun på din telefon og sendes aldrig videre.'

/**
 * Praise that says the name out loud: «آفرین، سارا!» / "Flot, Sara!" — always
 * the آفرین line (plan 009's row 1), so it carries that line's own pron
 * rather than inventing one for a phrase that includes a name.
 */
export function namePraise(faSpelling: string, name: string): Praise {
  return { fa: `آفرین، ${faSpelling}!`, da: `Flot, ${name}!`, pron: PRAISE[0].pron }
}

/** The same four words the alphabet lesson labels the forms with. */
export const FORM_LABEL: Record<FormKey, string> = {
  isolated: 'alene',
  initial: 'først',
  medial: 'midt',
  final: 'sidst',
}

/** One Danish line about what this letter's neighbours do to its shape. */
export function formNote(letter: NameLetter): string {
  const { nameDa, formGlyph } = letter
  switch (letter.form) {
    case 'initial':
      return `${nameDa} binder videre til bogstavet efter: ${formGlyph}`
    case 'medial':
      return `${nameDa} er bundet til begge sider: ${formGlyph}`
    case 'final':
      return `${nameDa} er bundet til bogstavet før: ${formGlyph}`
    default:
      return `${nameDa} står frit — hverken før eller efter binder til den: ${formGlyph}`
  }
}

/**
 * Every Persian string this module can produce, including the Danish lines that
 * print a Persian form inside them — walked by the text-rule guard. سارا covers
 * the free-standing forms, مته the bound ones.
 */
export const NAME_FA_STRINGS: string[] = [
  SPELLING_TITLE_FA,
  SPELLING_PICK_FA,
  WRITE_NAME_FA,
  ASSEMBLE_FA,
  LETTERS_FA,
  PRIVACY_FA,
  NOT_IN_NAME_FA,
  OTHER_SIGN_FA,
  namePraise('سارا', 'Sara').fa,
  ...[...nameLetters('سارا'), ...nameLetters('مته')].map(formNote),
]
