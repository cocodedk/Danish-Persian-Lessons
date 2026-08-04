import type { CSSProperties } from 'react'
import { LetterForms } from './LetterForms'
import { nameLetters } from '../name/forms'
import { formNote, FORM_LABEL } from '../name/copy'
import { assembledPrefix } from '../name/bank'
import './NameWalkthrough.css'

export interface NameWalkthroughProps {
  spelling: string
}

/**
 * The learner's name written out one letter at a time: the name as far as it
 * has grown, the four forms the letter can take, and the one line that says why
 * it took this one. Numbered, because the order is the lesson — and the steps
 * ink in one after the other unless the learner asked for less motion, in which
 * case the same numbered steps simply stand there.
 */
export function NameWalkthrough({ spelling }: NameWalkthroughProps) {
  return (
    <ol className="name-walk">
      {nameLetters(spelling).map((letter, at) => (
        <li
          key={letter.index}
          className="name-walk__step"
          style={{ '--step': at } as CSSProperties}
        >
          <p className="name-walk__count">
            Bogstav {at + 1}: {letter.nameDa} står {FORM_LABEL[letter.form]}
          </p>
          <p className="name-walk__grown" lang="fa" dir="rtl">
            {assembledPrefix(spelling, at + 1)}
          </p>
          <p className="name-walk__note">{formNote(letter)}</p>
          <LetterForms forms={letter.forms} joinsLeft={letter.joinsLeft} />
        </li>
      ))}
    </ol>
  )
}
