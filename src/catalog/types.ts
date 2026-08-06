export interface Pronunciation {
  /** Approachable Danish-friendly spelling of the Persian pronunciation. */
  da: string
  /** Standard Tehrani Persian IPA, stored without display brackets. */
  ipa: string
}

export type ReadingCueRole =
  | 'consonant'
  | 'long-vowel'
  | 'short-vowel'
  | 'written-vowel'
  | 'carrier'
  | 'silent'
  | 'whole'

/** One contextual step through a word. Offsets count Unicode code points in
 * `fa`; an unwritten short vowel has equal start/end offsets. */
export interface ReadingCue {
  start: number
  end: number
  display: string
  role: ReadingCueRole
  helpDa: string
  pron?: Pronunciation
}

export interface PersianEntry {
  /** Stable, globally unique id. Route ids may stay shorter and live beside it. */
  id: string
  kind: 'letter' | 'mark' | 'word' | 'phrase' | 'symbol'
  /** Plain Persian. UI phrases stay undiacriticized. */
  fa: string
  /** Teaching-only spelling with vowel marks. */
  faMarked?: string
  /** Danish letter name, meaning, translation, or sign explanation. */
  da: string
  pron: Pronunciation
  /** Contextual word reading, never inferred from isolated letter sounds. */
  readingCues?: ReadingCue[]
  /** Stable lookup key for an optional, reviewed human recording. */
  audioId?: string
  /** Why this entry has no recording when it intentionally carries no sound. */
  audioNotApplicable?: string
}

/** Keeps catalog declarations narrow without adding a runtime dependency. */
export function defineEntry<T extends PersianEntry>(entry: T): Readonly<T & { audioId?: string; readingCues?: ReadingCue[] }> {
  const readingCues = entry.readingCues ?? (
    entry.kind === 'word' || entry.kind === 'phrase'
      ? [{
          start: 0,
          end: [...entry.fa].length,
          display: entry.fa,
          role: 'whole' as const,
          helpDa: entry.kind === 'word' ? 'Læs hele ordet samlet' : 'Læs hele udtrykket samlet',
          pron: entry.pron,
        }]
      : undefined
  )
  const complete = { ...entry, ...(readingCues ? { readingCues } : {}) }
  return Object.freeze(entry.audioNotApplicable ? complete : { audioId: entry.id, ...complete })
}
