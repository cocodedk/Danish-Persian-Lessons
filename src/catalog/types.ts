export interface Pronunciation {
  /** Approachable Danish-friendly spelling of the Persian pronunciation. */
  da: string
  /** Standard Tehrani Persian IPA, stored without display brackets. */
  ipa: string
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
}

/** Keeps catalog declarations narrow without adding a runtime dependency. */
export function defineEntry<T extends PersianEntry>(entry: T): Readonly<T> {
  return Object.freeze(entry)
}
