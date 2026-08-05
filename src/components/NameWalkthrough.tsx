import type { CSSProperties } from 'react'
import { LetterForms } from './LetterForms'
import { PronLine } from './PronLine'
import { nameLetters } from '../name/forms'
import { formNote, FORM_LABEL } from '../name/copy'
import { assembledPrefix } from '../name/bank'
import './NameWalkthrough.css'
import { PersonalNameText } from './PersonalName'

export interface NameWalkthroughProps {
  spelling: string
}

/**
 * The learner's name written out one letter at a time: the name as far as it
 * has grown, how the letter is said, the four forms it can take, and the one
 * line that says why it took this one. Numbered, because the order is the
 * lesson — and the steps ink in one after the other unless the learner asked
 * for less motion, in which case the same numbered steps simply stand there.
 *
 * The pronunciation is the alphabet lesson's own — lydskrift and IPA read
 * straight off the letter data, never a sound invented for this screen.
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
          {letter.sound && <PronLine {...letter.sound} />}
          <PersonalNameText
            spelling={assembledPrefix(spelling, at + 1)}
            as="p"
            className="name-walk__grown"
          />
          <p className="name-walk__note">{formNote(letter)}</p>
          <LetterForms forms={letter.forms} joinsLeft={letter.joinsLeft} entry={letter.entry} />
        </li>
      ))}
    </ol>
  )
}
