import { ZWNJ, SPACE } from '../keyboard/buffer'
import { markUp, type Divergence } from '../keyboard/diff'
import {
  TRY_AGAIN_ENTRY,
  TYPE_MISSING_SPACE_ENTRY,
  TYPE_EXTRA_SPACE_ENTRY,
  TYPE_MISSING_ZWNJ_ENTRY,
  TYPE_EXTRA_ZWNJ_ENTRY,
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
 * Where the cell is an ordinary letter, «دوباره» alone still carries the
 * Persian half — there is nothing else true to say about which letter it is.
 */
export function noteFor({ kind, cellKind }: Divergence): { entry?: PersianEntry; da: string } {
  if (kind === 'match') return { da: '' }

  // A sign cell says everything through its own entry — the note IS the entry's
  // Danish line. 'wrong' and 'extra' both mean a stray sign on the paper.
  if (cellKind === 'space') {
    const entry = kind === 'missing' ? TYPE_MISSING_SPACE_ENTRY : TYPE_EXTRA_SPACE_ENTRY
    return { entry, da: entry.da }
  }
  if (cellKind === 'zwnj') {
    const entry = kind === 'missing' ? TYPE_MISSING_ZWNJ_ENTRY : TYPE_EXTRA_ZWNJ_ENTRY
    return { entry, da: entry.da }
  }

  // An ordinary letter: «دوباره» alone carries the Persian half — there is
  // nothing else true to say about which letter it is.
  const da =
    kind === 'missing'
      ? 'Her mangler et bogstav.'
      : kind === 'wrong'
        ? 'Her står et andet bogstav.'
        : 'Her er et bogstav for meget.'
  return { entry: TRY_AGAIN_ENTRY, da }
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
        <span lang="da">{note.da} Prøv igen, du mister ingenting.</span>
      </div>
    </div>
  )
}
