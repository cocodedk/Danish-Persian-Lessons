// Shared lesson data shapes. No data files yet — populated by plans 003/004.

/** Dansk lydskrift + IPA — every teaching item carries pronunciation twice, from data. */
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
  /** True when the word carries a diacritic/madde that renders in --red. */
  faMarked?: boolean
  da: string
  pron: { da: string; ipa: string }
}

export type LessonKind = 'alphabet' | 'vocab'

export interface Lesson {
  id: string
  kind: LessonKind
  items: Array<Letter | VowelMark | WordCard>
}
