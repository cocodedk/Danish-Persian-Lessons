import { useMemo } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { ChoiceExercise } from '../components/ChoiceExercise'
import { buildQuestions, EXERCISE_TITLES } from '../lessons/exercises'
import type { ExerciseKind } from '../lessons/exercises'
import { markLetterDone } from '../progress/alphabet'
import './alphabet.css'

function isKind(value: string): value is ExerciseKind {
  return value === 'find' || value === 'match'
}

/** One round of an alphabet exercise. Leaving early costs nothing. */
export default function ExerciseScreen() {
  const { kind = '' } = useParams()
  const valid = isKind(kind)
  const questions = useMemo(() => (isKind(kind) ? buildQuestions(kind) : []), [kind])

  if (!valid) {
    return <Navigate to="/lesson/alphabet" replace />
  }

  function handleComplete() {
    // The seam plan 007's reward engine hooks into. Ticks are already granted
    // per question, so there is nothing this round still owes the learner.
  }

  return (
    <LessonSheet
      title={EXERCISE_TITLES[kind]}
      bar={<BarLink to="/lesson/alphabet">Til lektionen</BarLink>}
    >
      <p className="alphabet__note">
        Du kan stoppe når som helst. Det, du har klaret, bliver stående.
      </p>
      <ChoiceExercise
        questions={questions}
        onCorrect={markLetterDone}
        onComplete={handleComplete}
      />
    </LessonSheet>
  )
}
