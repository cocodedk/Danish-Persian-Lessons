// Shared lesson data shapes. The data itself lives in src/lessons/alphabet.ts
// and src/lessons/vowelMarks.ts.

/**
 * How a teaching item is said, always twice: dansk lydskrift first, then IPA
 * (standard Tehrani). Rendered by PronLine. For a word the Danish half is the
 * lydskrift ("åb"); for a letter or a mark it is the Danish sound anchor
 * (`a i "kat"`). One type for both — see docs/plans/003-alphabet-lesson.md step 2.
 */
export interface Pron {
  da: string
  ipa: string
}

/** One pen path in a stroke-order drawing. Dots are strokes too — short ticks. */
export interface Stroke {
  /** SVG path data in the 0 0 100 100 viewBox; the pen moves right to left. */
  d: string
  kind: 'stroke' | 'dot'
}

/** A drawable teaching glyph: one shape, one sound, one stroke sequence. */
export interface Specimen {
  /** Stable ascii id — used in routes (#/lesson/alphabet/bogstav/:id) and progress. */
  id: string
  glyph: string
  name: { fa: string; da: string }
  sound: Pron
  /** Pen paths in drawing order: every 'stroke' before every 'dot'. */
  strokes: Stroke[]
}

/** A single Persian letter and its four positional forms. */
export interface Letter extends Specimen {
  forms: {
    isolated: string
    initial: string
    medial: string
    final: string
  }
  /** False for the seven letters that never join to the left: ا د ذ ر ز ژ و. */
  joinsLeft: boolean
  /** One Danish line for the letters that surprise a reader (ی, ه, ا). */
  hint?: string
  /**
   * آ — alef carrying the madde. The same letter body plus one stroke, its own
   * sound, and the first thing taught (the primer opens on آب).
   */
  madde?: Specimen
}

/** A vowel mark (زبر/زیر/پیش) or a long vowel (آ او ای). */
export interface VowelMark {
  id: string
  glyph: string
  name: { fa: string; da: string }
  sound: Pron
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
