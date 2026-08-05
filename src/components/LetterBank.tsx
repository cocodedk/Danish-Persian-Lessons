import type { Tile } from '../name/bank'
import { useState } from 'react'
import { LETTERS_ENTRY } from '../name/copy'
import type { PersianEntry } from '../catalog/types'
import { PersianText } from './PersianText'
import { PersonalNameText } from './PersonalName'
import { CompactPhraseRow, DetailStrip, letterLessonPath } from './EntryRenderers'
import './LetterBank.css'

export interface LetterBankProps {
  tiles: Tile[]
  onPick: (tile: Tile) => void
  /** What this tray of letters is for, in one Danish line. */
  label: string
  /** Tiles already used. They stay on the page, quiet — nothing is taken away. */
  usedKeys?: string[]
}

/**
 * A tray of letters to tap. It is a Persian sequence, so it fills from the
 * right, and every tile is a 44px target labelled with the letter's Danish
 * name — the same name the alphabet lesson taught it under.
 */
export function LetterBank({ tiles, onPick, label, usedKeys = [] }: LetterBankProps) {
  const [selected, setSelected] = useState<PersianEntry | null>(null)
  return (
    <div className="letter-bank">
      <div className="letter-bank__label">
        <CompactPhraseRow entry={LETTERS_ENTRY} />
        <span lang="da">{label}</span>
      </div>
      <ul className="letter-bank__tray" dir="rtl">
        {tiles.map((tile) => {
          const used = usedKeys.includes(tile.key)
          return (
            <li key={tile.key}>
              <button
                type="button"
                className={`letter-bank__tile ${used ? 'letter-bank__tile--used' : ''}`}
                onClick={() => {
                  onPick(tile)
                  if (tile.entry) setSelected(tile.entry)
                }}
                disabled={used}
                aria-label={tile.nameDa}
              >
                {tile.entry ? (
                  <PersianText entry={tile.entry} display={tile.glyph} ariaHidden />
                ) : (
                  <PersonalNameText spelling={tile.glyph} ariaHidden />
                )}
              </button>
            </li>
          )
        })}
      </ul>
      {selected && <DetailStrip entry={selected} to={letterLessonPath(selected.id)} />}
    </div>
  )
}
