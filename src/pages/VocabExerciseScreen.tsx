import { useMemo } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { ChoiceExercise } from '../components/ChoiceExercise'
import { RewardOverlays } from '../components/RewardOverlays'
import { findVocabUnit } from '../lessons/vocab'
import {
  buildVocabQuestions,
  isVocabExerciseKind,
  VOCAB_EXERCISE_TITLES,
} from '../lessons/vocabExercises'
import { learnWord } from '../progress/vocab'
import { useCelebration } from '../rewards/useCelebration'
import './alphabet.css'
import './vocab.css'

/** One round of a vocabulary exercise. Leaving early costs nothing. */
export default function VocabExerciseScreen() {
  const { unit: unitId = '', kind = '' } = useParams()
  const questions = useMemo(
    () => (isVocabExerciseKind(kind) ? buildVocabQuestions(unitId, kind) : []),
    [unitId, kind],
  )
  const celebration = useCelebration()

  const unit = findVocabUnit(unitId)
  if (!unit || !isVocabExerciseKind(kind)) {
    return <Navigate to="/" replace />
  }

  return (
    <LessonSheet
      title={VOCAB_EXERCISE_TITLES[kind]}
      bar={<BarLink to={`/lesson/ord/${unit.id}`}>Til lektionen</BarLink>}
    >
      <p className="alphabet__note">
        Du kan stoppe når som helst. Det, du har klaret, bliver stående.
      </p>
      <ChoiceExercise
        questions={questions}
        // A word answered right is a word learned — and if it was the last one
        // missing, the unit pays its notebook page, once and only once.
        onCorrect={(wordId) => celebration.cheer(learnWord(unit, wordId))}
        onComplete={() => celebration.cheer('page')}
      />
      <RewardOverlays celebration={celebration} />
    </LessonSheet>
  )
}
