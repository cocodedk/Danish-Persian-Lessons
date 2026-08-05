import { ZWNJ, SPACE } from '../keyboard/buffer'
import { markUp, type Divergence } from '../keyboard/diff'
import {
  TRY_AGAIN_FA,
  TYPE_MISSING_SPACE_FA,
  TYPE_EXTRA_SPACE_FA,
  TYPE_MISSING_ZWNJ_FA,
  TYPE_EXTRA_ZWNJ_FA,
  TYPE_MISSING_ZWNJ_DA,
  TYPE_EXTRA_ZWNJ_DA,
} from '../content/faStrings'
import './TypeExercise.css'

/**
 * What the red mark means, in both languages. None of the three blames
 * anybody: they say what is on the paper, which is all a teacher's pen says
 * either — and they say it honestly: a space and a نیم‌فاصله have no
 * letterform, so neither is ever called "et andet bogstav" (critic round 1).
 * Where the cell is an ordinary letter, «دوباره» alone still carries the
 * Persian half — there is nothing else true to say about which letter it is.
 */
export function noteFor({ kind, cellKind }: Divergence): { da: string; fa: string } {
  if (kind === 'match') return { da: '', fa: '' }

  if (kind === 'missing') {
    if (cellKind === 'space') return { da: 'Her mangler et mellemrum.', fa: TYPE_MISSING_SPACE_FA }
    if (cellKind === 'zwnj') return { da: TYPE_MISSING_ZWNJ_DA, fa: TYPE_MISSING_ZWNJ_FA }
    return { da: 'Her mangler et bogstav.', fa: TRY_AGAIN_FA }
  }

  // 'wrong' or 'extra': the red mark shows what was actually typed, so the
  // note names that — a stray space or نیم‌فاصله, never "et andet bogstav".
  if (cellKind === 'space') return { da: 'Her står et mellemrum for meget.', fa: TYPE_EXTRA_SPACE_FA }
  if (cellKind === 'zwnj') return { da: TYPE_EXTRA_ZWNJ_DA, fa: TYPE_EXTRA_ZWNJ_FA }
  return kind === 'wrong'
    ? { da: 'Her står et andet bogstav.', fa: TRY_AGAIN_FA }
    : { da: 'Her er et bogstav for meget.', fa: TRY_AGAIN_FA }
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
      <ul className="type__marks" dir="rtl" lang="fa">
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
      </ul>
      <p className="type__again">
        <span lang="fa" dir="rtl">
          {note.fa}
        </span>
        <span lang="da">{note.da} Prøv igen, du mister ingenting.</span>
      </p>
    </div>
  )
}
