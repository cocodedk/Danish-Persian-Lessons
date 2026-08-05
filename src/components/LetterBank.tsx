import type { Tile } from '../name/bank'
import { LETTERS_FA } from '../name/copy'
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
  return (
    <div className="letter-bank">
      <p className="letter-bank__label">
        <span lang="fa" dir="rtl" className="letter-bank__label-fa">
          {LETTERS_FA}
        </span>
        <span lang="da">{label}</span>
      </p>
      <ul className="letter-bank__tray" dir="rtl">
        {tiles.map((tile) => {
          const used = usedKeys.includes(tile.key)
          return (
            <li key={tile.key}>
              <button
                type="button"
                className={`letter-bank__tile ${used ? 'letter-bank__tile--used' : ''}`}
                onClick={() => onPick(tile)}
                disabled={used}
                aria-label={tile.nameDa}
              >
                <span lang="fa" dir="rtl" aria-hidden="true">
                  {tile.glyph}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
