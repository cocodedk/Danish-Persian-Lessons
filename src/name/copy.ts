// What the app says about the learner's own name, in both languages. Kept in
// one file so the Persian text-rule guard can walk it and a reader can hear the
// whole tone at once. See docs/plans/006-your-name.md steps 2, 5 and 6.
import { HAMZE_YE_ENTRY, nameLetters, type FormKey, type NameLetter } from './forms'
import { defineEntry } from '../catalog/types'

export const SPELLING_TITLE_ENTRY = defineEntry({ id: 'names-spelling-title', kind: 'phrase', fa: 'نام به فارسی', da: 'Navn på persisk', pron: { da: 'nåm be fårsi', ipa: 'nɒːm be fɒːɾsiː' } })
export const SPELLING_PICK_ENTRY = defineEntry({ id: 'names-spelling-pick', kind: 'phrase', fa: 'کدام را دوست داری؟', da: 'Hvilken kan du lide?', pron: { da: 'kodåm rå dust dåri?', ipa: 'kodɒːm ɾɒː duːst dɒːɾiː' } })

/** The mini-lesson's own title, as the plan writes it. */
export const WRITE_NAME_ENTRY = defineEntry({ id: 'names-write-name', kind: 'phrase', fa: 'نام خود را بنویس', da: 'Skriv dit eget navn', pron: { da: 'nåme khod rå benevis', ipa: 'nɒːme xod ɾɒː beneviːs' } })
export const ASSEMBLE_ENTRY = defineEntry({ id: 'names-assemble', kind: 'phrase', fa: 'نام را دوباره درست کن', da: 'Lav navnet igen', pron: { da: 'nåm rå dobåre dorost kon', ipa: 'nɒːm ɾɒː dobɒːɾe doɾost kon' } })

/** What the tray of tappable letters is, over both banks. */
export const LETTERS_ENTRY = defineEntry({ id: 'names-letters-label', kind: 'word', fa: 'حرف‌ها', da: 'Bogstaverne', pron: { da: 'harfhå', ipa: 'hæɾfhɒː' } })

/**
 * The other thing a wrong tap can be: not a letter waiting its turn, but a
 * letter that is not in this name at all. «دوباره» is the right word for the
 * first and a small lie for the second — a learner told to try again looks for
 * the same letter twice. So this line says which it was, and where to look.
 */
export const NOT_IN_NAME_ENTRY = defineEntry({ id: 'names-not-in-name', kind: 'phrase', fa: 'این حرف در نام تو نیست. دوباره نگاه کن.', da: 'Det bogstav er ikke i dit navn. Kig igen.', pron: { da: 'in harf dar nåme to nist. dobåre negåh kon.', ipa: 'iːn hæɾf dæɾ nɒːme to niːst dobɒːɾe negɒːh kon' } })

/** A common-word prompt for a correct name letter tapped too early. */
export const LATER_IN_NAME_ENTRY = defineEntry({ id: 'names-letter-later', kind: 'phrase', fa: 'این حرف را بعد بزن.', da: 'Tryk på dette bogstav senere.', pron: { da: 'in harf rå ba’d bezan', ipa: 'iːn hæɾf ɾɒː bæʔd bezæn' } })

/** The promise in the settings corner, said in both languages. */
export const PRIVACY_ENTRY = defineEntry({ id: 'names-privacy', kind: 'phrase', fa: 'نام فقط در این دستگاه است.', da: 'Navnet er kun på denne enhed.', pron: { da: 'nåm faghat dar in dastgåh ast', ipa: 'nɒːm fæɢæt dæɾ iːn dæstɡɒːh æst' } })

export const NAME_ENTRIES = [
  SPELLING_TITLE_ENTRY,
  SPELLING_PICK_ENTRY,
  WRITE_NAME_ENTRY,
  ASSEMBLE_ENTRY,
  LETTERS_ENTRY,
  NOT_IN_NAME_ENTRY,
  LATER_IN_NAME_ENTRY,
  PRIVACY_ENTRY,
  HAMZE_YE_ENTRY,
]

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
 * The Persian this module composes at runtime — the Danish form notes that
 * print a Persian form inside them. Walked by the text-rule guard; the entries
 * themselves are the registry guard's job. سارا covers the free-standing
 * forms, مته the bound ones.
 */
export const NAME_FA_STRINGS: string[] = [
  ...[...nameLetters('سارا'), ...nameLetters('مته')].map(formNote),
]
