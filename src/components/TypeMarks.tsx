import { ZWNJ, SPACE } from '../keyboard/buffer'
import { markUp, type Divergence } from '../keyboard/diff'
import {
  TYPE_MISSING_SPACE_ENTRY,
  TYPE_EXTRA_SPACE_ENTRY,
  TYPE_MISSING_ZWNJ_ENTRY,
  TYPE_EXTRA_ZWNJ_ENTRY,
  TYPE_MISSING_LETTER_ENTRY,
  TYPE_WRONG_LETTER_ENTRY,
  TYPE_EXTRA_LETTER_ENTRY,
} from '../content/faStrings'
import type { PersianEntry } from '../catalog/types'
import { LearnerPersianInput } from './LearnerPersianInput'
import { PersianText } from './PersianText'
import { PronLine } from './PronLine'
import './TypeExercise.css'

/**
 * What the red mark means, in both languages. None of the three blames
 * anybody: they say what is on the paper, which is all a teacher's pen says
 * either — and they say it honestly: a space and a نیم‌فاصله have no
 * letterform, so neither is ever called "et andet bogstav" (critic round 1).
 * Ordinary-letter notes also use a complete bilingual entry, so the Danish
 * line never explains more than the Persian line says.
 */
export function noteFor({ kind, cellKind }: Divergence): { entry?: PersianEntry } {
  if (kind === 'match') return {}

  // A sign cell says everything through its own entry — the note IS the entry's
  // Danish line. 'wrong' and 'extra' both mean a stray sign on the paper.
  if (cellKind === 'space') {
    const entry = kind === 'missing' ? TYPE_MISSING_SPACE_ENTRY : TYPE_EXTRA_SPACE_ENTRY
    return { entry }
  }
  if (cellKind === 'zwnj') {
    const entry = kind === 'missing' ? TYPE_MISSING_ZWNJ_ENTRY : TYPE_EXTRA_ZWNJ_ENTRY
    return { entry }
  }

  const entry = kind === 'missing'
    ? TYPE_MISSING_LETTER_ENTRY
    : kind === 'wrong'
      ? TYPE_WRONG_LETTER_ENTRY
      : TYPE_EXTRA_LETTER_ENTRY
  return { entry }
}

/** The two signs that have no letterform: they are drawn, so they can be seen. */
function CellMark({ char }: { char: string }) {
  if (char === ZWNJ) return <span className="type__half" aria-hidden="true" />
  if (char === SPACE) return <span className="type__stroke" aria-hidden="true" />
  return <>{char}</>
}

/**
 * The teacher's marking: the attempt spelled out letter by letter, right to
 * left, with red on the first place it goes wrong and ink on everything before
 * it. One mark only — see src/keyboard/diff.ts. Nothing the learner earned is
 * touched, and the word they wrote stays on the line above, unedited.
 */
export function TypeMarks({ attempt, divergence }: { attempt: string; divergence: Divergence }) {
  const note = noteFor(divergence)
  return (
    <div className="type__feedback" role="status">
      <LearnerPersianInput as="ul" className="type__marks">
        {markUp(attempt, divergence).map((cell, at) => (
          <li
            key={at}
            className={`type__cell ${cell.marked ? 'type__cell--mark' : ''} ${
              cell.char === '' ? 'type__cell--empty' : ''
            }`}
          >
            <CellMark char={cell.char} />
          </li>
        ))}
      </LearnerPersianInput>
      <div className="type__again">
        {note.entry && <PersianText entry={note.entry} />}
        {note.entry && <PronLine {...note.entry.pron} />}
        {note.entry && <span lang="da">{note.entry.da}</span>}
      </div>
    </div>
  )
}
