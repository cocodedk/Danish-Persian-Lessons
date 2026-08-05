// The interface domain's Persian entries. Every entry here is walked by the
// catalog registry guard (src/catalog/registry.test.ts) via catalog/interface.ts.
import { NAME_FA_STRINGS } from '../name/copy'
import { defineEntry } from '../catalog/types'

export const CAPTURE_PROMPT_ENTRY = defineEntry({ id: 'interface-capture-prompt', kind: 'phrase', fa: 'نام تو چیست؟', da: 'Hvad hedder du?', pron: { da: 'nåme to tjist?', ipa: 'nɒːme to tʃiːst' } })
export const LESSON_PLACEHOLDER_ENTRY = defineEntry({ id: 'interface-lesson-placeholder', kind: 'phrase', fa: 'این درس هنوز آماده نیست.', da: 'Denne lektion er ikke klar endnu.', pron: { da: 'in dars hanuz åmåde nist', ipa: 'iːn dæɾs hænuːz ʔɒːmɒːde niːst' } })

/** A wrong answer costs nothing and says so — ART-DIRECTION "Celebration". */
export const TRY_AGAIN_ENTRY = defineEntry({ id: 'interface-try-again', kind: 'word', fa: 'دوباره', da: 'Prøv igen', pron: { da: 'dobåre', ipa: 'dobɒːɾe' } })

/** The نیم‌فاصله's own name — on its key cap and in the marking, single-sourced
 * (plan 005, critic round 1). */
export const ZWNJ_NAME_ENTRY = defineEntry({ id: 'interface-zwnj-name', kind: 'symbol', fa: 'نیم‌فاصله', da: 'halvt mellemrum', pron: { da: 'nim-fåsele', ipa: 'niːm fɒːsele' } })

/**
 * The typing marking, said honestly when the divergent cell is a space or a
 * نیم‌فاصله rather than a letter — "et andet bogstav" is simply wrong for a
 * sign with no letterform (src/components/TypeMarks.tsx).
 */
export const TYPE_MISSING_SPACE_ENTRY = defineEntry({ id: 'interface-missing-space', kind: 'phrase', fa: 'اینجا یک فاصله جا افتاده.', da: 'Her mangler et mellemrum.', pron: { da: 'indjå jek fåsele djå oftåde', ipa: 'iːndʒɒː jek fɒːsele dʒɒː ʔoftɒːde' } })
export const TYPE_EXTRA_SPACE_ENTRY = defineEntry({ id: 'interface-extra-space', kind: 'phrase', fa: 'اینجا یک فاصله اضافه نوشته شده.', da: 'Her står et mellemrum for meget.', pron: { da: 'indjå jek fåsele ezåfe nevesjte sjode', ipa: 'iːndʒɒː jek fɒːsele ʔezɒːfe neveʃte ʃode' } })
export const TYPE_MISSING_ZWNJ_ENTRY = defineEntry({ id: 'interface-missing-zwnj', kind: 'phrase', fa: 'اینجا یک نیم‌فاصله جا افتاده.', da: 'Her mangler et halvt mellemrum.', pron: { da: 'indjå jek nim-fåsele djå oftåde', ipa: 'iːndʒɒː jek niːm fɒːsele dʒɒː ʔoftɒːde' } })
export const TYPE_EXTRA_ZWNJ_ENTRY = defineEntry({ id: 'interface-extra-zwnj', kind: 'phrase', fa: 'اینجا یک نیم‌فاصله اضافه نوشته شده.', da: 'Her står et halvt mellemrum for meget.', pron: { da: 'indjå jek nim-fåsele ezåfe nevesjte sjode', ipa: 'iːndʒɒː jek niːm fɒːsele ʔezɒːfe neveʃte ʃode' } })

/** The two typing rounds (plan 005): the unit's words, and the capstone. */
export const TYPE_WORDS_ENTRY = defineEntry({ id: 'interface-type-words', kind: 'phrase', fa: 'کلمه‌ها را بنویس', da: 'Skriv ordene', pron: { da: 'kalemehå rå benevis', ipa: 'kælemehɒː ɾɒː beneviːs' } })
export const TYPE_NAME_ENTRY = defineEntry({ id: 'interface-type-name', kind: 'phrase', fa: 'نام خودت را بنویس', da: 'Skriv dit eget navn', pron: { da: 'nåme khodet rå benevis', ipa: 'nɒːme xodet ɾɒː beneviːs' } })

/** The margin badge on a letter the learner's own name is spelled with (plan 006). */
export const NAME_LETTER_ENTRY = defineEntry({ id: 'interface-name-letter', kind: 'phrase', fa: 'این حرف در نام توست', da: 'Dette bogstav er i dit navn', pron: { da: 'in harf dar nåme tost', ipa: 'iːn hæɾf dæɾ nɒːme tost' } })

/** The same warm note on a whole word (plan 004) — one shared letter, or several. */
export const NAME_LETTER_IN_WORD_ENTRY = defineEntry({ id: 'interface-name-letter-in-word', kind: 'phrase', fa: 'حرفی از نام تو در این کلمه هست', da: 'Et bogstav fra dit navn er i dette ord', pron: { da: 'harfi az nåme to dar in kaleme hast', ipa: 'hæɾfiː ʔæz nɒːme to dæɾ iːn kæleme hæst' } })
export const NAME_LETTERS_IN_WORD_ENTRY = defineEntry({ id: 'interface-name-letters-in-word', kind: 'phrase', fa: 'حرف‌هایی از نام تو در این کلمه هست', da: 'Bogstaver fra dit navn er i dette ord', pron: { da: 'harfhåji az nåme to dar in kaleme hast', ipa: 'hæɾfhɒːjiː ʔæz nɒːme to dæɾ iːn kæleme hæst' } })

export const INTERFACE_ENTRIES = [
  CAPTURE_PROMPT_ENTRY,
  LESSON_PLACEHOLDER_ENTRY,
  TRY_AGAIN_ENTRY,
  ZWNJ_NAME_ENTRY,
  TYPE_MISSING_SPACE_ENTRY,
  TYPE_EXTRA_SPACE_ENTRY,
  TYPE_MISSING_ZWNJ_ENTRY,
  TYPE_EXTRA_ZWNJ_ENTRY,
  TYPE_WORDS_ENTRY,
  TYPE_NAME_ENTRY,
  NAME_LETTER_ENTRY,
  NAME_LETTER_IN_WORD_ENTRY,
  NAME_LETTERS_IN_WORD_ENTRY,
]

/**
 * Persian the catalog registry cannot vouch for: strings composed at runtime
 * around Persian fragments (the name module's form notes). Everything
 * defineEntry-owned is walked by src/catalog/registry.test.ts instead.
 */
export const PERSIAN_UI_STRINGS: string[] = [...NAME_FA_STRINGS]
