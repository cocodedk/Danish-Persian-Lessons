import { ZWNJ, SPACE } from '../keyboard/buffer'
import { markUp, type Divergence } from '../keyboard/diff'
import { TRY_AGAIN_FA } from '../content/faStrings'
import './TypeExercise.css'

/**
 * What the red mark means, in one plain line. None of the three blames anybody:
 * they say what is on the paper, which is all a teacher's pen says either.
 */
const NOTE: Record<Divergence['kind'], string> = {
  wrong: 'Her står et andet bogstav.',
  missing: 'Her mangler et bogstav.',
  extra: 'Her er et bogstav for meget.',
  match: '',
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
          {TRY_AGAIN_FA}
        </span>
        <span lang="da">{NOTE[divergence.kind]} Prøv igen, du mister ingenting.</span>
      </p>
    </div>
  )
}
