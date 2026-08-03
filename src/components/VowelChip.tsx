import type { Pron } from '../lessons/types'
import { penMarkClass } from './penMark'
import { PronLine } from './PronLine'
import '../styles/pen.css'
import './VowelChip.css'

export interface VowelChipProps {
  /** The letter carrying the mark, e.g. «اَ» — from lesson data. */
  glyph: string
  /** Dansk lydskrift + IPA, when the lesson supplies them. */
  caption?: Pron
}

/**
 * A teaching specimen chip: one Naskh letter with its vowel mark in the
 * teacher's red, over an optional pronunciation caption. The mark's side is
 * read off the glyph itself, so lesson data only ever carries the letter.
 */
export function VowelChip({ glyph, caption }: VowelChipProps) {
  return (
    <div className="vowel-chip">
      <p className={penMarkClass('vowel-chip__glyph', glyph)} lang="fa" dir="rtl">
        {glyph}
      </p>
      {caption && <PronLine da={caption.da} ipa={caption.ipa} />}
    </div>
  )
}
