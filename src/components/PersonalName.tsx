import { nameLetters, OTHER_SIGN_DA } from '../name/forms'
import { NO_OWN_SOUND } from '../lessons/marks'
import { LearnerPersianInput } from './LearnerPersianInput'
import { PronLine } from './PronLine'
import { ReadingCueList } from './ReadingCues'
import { personalReadingCues } from '../name/readingCues'
import './PersonalName.css'

/** The learner's name as the app carries it: the Persian spelling they chose,
 * and the name as they wrote it — absent when only a spelling is stored. */
export interface PersonalName {
  spelling: string
  original?: string
}

export interface PersonalNameTextProps {
  spelling: string
  as?: 'span' | 'p'
  className?: string
  ariaHidden?: boolean
}

/** A learner's spelling is personal output, not catalog copy — it renders
 * through the learner-owned path. */
export function PersonalNameText({ spelling, as, className, ariaHidden }: PersonalNameTextProps) {
  return (
    <LearnerPersianInput as={as} className={className} ariaHidden={ariaHidden}>
      {spelling}
    </LearnerPersianInput>
  )
}

export function PersonalNameCompanion({
  spelling,
  original,
  className = '',
}: PersonalName & { className?: string }) {
  const cues = personalReadingCues(spelling)
  return (
    <section
      className="personal-name"
      aria-label={
        original ? `Dit navn ${original} med persiske bogstaver` : 'Dit navn med persiske bogstaver'
      }
    >
      <PersonalNameText
        spelling={spelling}
        as="p"
        className={`personal-name__spelling ${className}`}
      />
      {original && <p className="personal-name__original">{original}</p>}
      <ol className="personal-name__letters">
        {nameLetters(spelling).map((letter) => (
          <li key={letter.index}>
            <PersonalNameText spelling={letter.glyph} ariaHidden />
            <span>{letter.nameEntry?.da ?? letter.entry?.da ?? OTHER_SIGN_DA}</span>
            <PronLine {...(letter.nameEntry?.pron ?? NO_OWN_SOUND)} />
          </li>
        ))}
      </ol>
      {cues && <ReadingCueList cues={cues} label="Sådan læses dit navn i denne stavemåde" />}
    </section>
  )
}
