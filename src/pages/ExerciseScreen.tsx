import { useMemo } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { ChoiceExercise } from '../components/ChoiceExercise'
import { RewardOverlays } from '../components/RewardOverlays'
import { buildQuestions, EXERCISE_TITLES } from '../lessons/exercises'
import type { ExerciseKind } from '../lessons/exercises'
import { markLetterDone } from '../progress/alphabet'
import { useCelebration } from '../rewards/useCelebration'
import './alphabet.css'

function isKind(value: string): value is ExerciseKind {
  return value === 'find' || value === 'match'
}

/** One round of an alphabet exercise. Leaving early costs nothing. */
export default function ExerciseScreen() {
  const { kind = '' } = useParams()
  const valid = isKind(kind)
  const questions = useMemo(() => (isKind(kind) ? buildQuestions(kind) : []), [kind])
  const celebration = useCelebration()

  if (!valid) {
    return <Navigate to="/lesson/alphabet" replace />
  }

  return (
    <LessonSheet
      title={EXERCISE_TITLES[kind]}
      bar={<BarLink to="/lesson/alphabet">Til lektionen</BarLink>}
      className="lesson--task"
    >
      <p className="alphabet__note">
        Du kan stoppe når som helst. Det, du har øvet, bliver stående.
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
