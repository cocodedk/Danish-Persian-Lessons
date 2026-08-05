import { useMemo } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { ChoiceExercise } from '../components/ChoiceExercise'
import { RewardOverlays } from '../components/RewardOverlays'
import { bonusQuestions } from '../lessons/bonus'
import { markLetterDone } from '../progress/alphabet'
import { useCelebration } from '../rewards/useCelebration'
import { GIFT_ENTRY } from '../rewards/copy'
import { CompactPhraseRow } from '../components/EntryRenderers'
import './alphabet.css'

/**
 * The gift, opened: three questions from the round the learner already knows.
 * It pays like any other exercise, and walking out of it pays nothing back —
 * a present with a bill attached would not be a present.
 */
export default function BonusScreen() {
  const { n = '' } = useParams()
  const ordinal = Number(n)
  const questions = useMemo(() => (ordinal > 0 ? bonusQuestions(ordinal) : []), [ordinal])
  const celebration = useCelebration()
  // Matches the id `giftFor` mints (`g${ordinal}`) — revisiting this same
  // round after it has already paid out still plays, but pays nothing new.
  const giftId = `g${ordinal}`

  if (!Number.isInteger(ordinal) || ordinal < 1) {
    return <Navigate to="/lesson/alphabet" replace />
  }

  return (
    <LessonSheet
      title="Bonusøvelse"
      bar={<BarLink to="/lesson/alphabet">Til lektionen</BarLink>}
    >
      <CompactPhraseRow entry={GIFT_ENTRY} />
      <p className="alphabet__note">
        Tre spørgsmål, du kender formen på. Du kan lukke gaven når som helst. Den koster
        ingenting at lade ligge.
      </p>
      <ChoiceExercise
        questions={questions}
        onCorrect={(letterId) => {
          markLetterDone(letterId)
          return celebration.cheer('answer', giftId)
        }}
        onComplete={() => celebration.cheer('page', giftId)}
      />
      <RewardOverlays celebration={celebration} />
    </LessonSheet>
  )
}
