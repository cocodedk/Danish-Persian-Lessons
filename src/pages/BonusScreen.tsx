import { useMemo } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { ChoiceExercise } from '../components/ChoiceExercise'
import { RewardOverlays } from '../components/RewardOverlays'
import { bonusQuestions } from '../lessons/bonus'
import { markLetterDone } from '../progress/alphabet'
import { useCelebration } from '../rewards/useCelebration'
import { GIFT_FA } from '../rewards/copy'
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

  if (!Number.isInteger(ordinal) || ordinal < 1) {
    return <Navigate to="/lesson/alphabet" replace />
  }

  return (
    <LessonSheet
      title="Bonusøvelse"
      bar={<BarLink to="/lesson/alphabet">Til lektionen</BarLink>}
    >
      <p className="alphabet__lead-fa" lang="fa" dir="rtl">
        {GIFT_FA}
      </p>
      <p className="alphabet__note">
        Tre spørgsmål, du kender formen på. Du kan lukke gaven når som helst — den koster
        ingenting at lade ligge.
      </p>
      <ChoiceExercise
        questions={questions}
        onCorrect={(letterId) => {
          markLetterDone(letterId)
          return celebration.cheer('answer')
        }}
        onComplete={() => celebration.cheer('page')}
      />
      <RewardOverlays celebration={celebration} />
    </LessonSheet>
  )
}
