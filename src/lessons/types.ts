// Shared lesson data shapes. No data files yet — populated by plans 003/004.

/** How a teaching item is said: dansk lydskrift first, then IPA. Rendered by PronLine. */
export interface Pron {
  da: string
  ipa: string
}

/** A letter's or mark's sound: the Danish word it is anchored to, plus IPA. */
export interface Pronunciation {
  anchorDa: string
  ipa: string
}

/** A single Persian letter and its four positional forms. */
export interface Letter {
  glyph: string
  name: { fa: string; da: string }
  forms: {
    isolated: string
    initial: string
    medial: string
    final: string
  }
  joinsLeft: boolean
  sound: Pronunciation
}

/** A vowel mark (زبر/زیر/پیش or a long vowel). */
export interface VowelMark {
  glyph: string
  name: { fa: string; da: string }
  sound: Pronunciation
}

/** A Persian/Danish word pair, as shown in the split-screen specimen. */
export interface WordCard {
  fa: string
  /** The diacriticized variant to render instead of `fa`, if any. Whatever is
   *  rendered gets its vowel marks in --red — see src/lessons/marks.ts. */
  faMarked?: string
  da: string
  pron: Pron
}

export type LessonKind = 'alphabet' | 'vocab'

export interface Lesson {
  id: string
  kind: LessonKind
  items: Array<Letter | VowelMark | WordCard>
}
