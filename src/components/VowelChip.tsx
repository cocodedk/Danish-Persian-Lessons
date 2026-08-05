import type { PersianEntry } from '../catalog/types'
import { PersianText } from './PersianText'
import { PronLine } from './PronLine'
import './VowelChip.css'

export interface VowelChipProps {
  entry: PersianEntry
}

/**
 * A teaching specimen chip: one Naskh letter with its vowel mark in the
 * teacher's red, over an optional pronunciation caption. The mark's side is
 * read off the glyph itself, so lesson data only ever carries the letter.
 */
export function VowelChip({ entry }: VowelChipProps) {
  return (
    <div className="vowel-chip">
      <PersianText entry={entry} marked as="p" className="vowel-chip__glyph" />
      <PronLine {...entry.pron} />
    </div>
  )
}
