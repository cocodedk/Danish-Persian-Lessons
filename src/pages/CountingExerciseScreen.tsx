import { useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { ChoiceExercise } from '../components/ChoiceExercise'
import { RewardOverlays } from '../components/RewardOverlays'
import {
  buildCountingQuestions,
  isCountingExerciseKind,
  COUNTING_EXERCISE_TITLES,
} from '../lessons/countingExercises'
import { learnCountingItem } from '../progress/counting'
import { useCelebration } from '../rewards/useCelebration'
import './vocab.css'

/** One round of the counting exercises. Leaving early costs nothing. */
export default function CountingExerciseScreen() {
  const { kind = '' } = useParams()
  const questions = useMemo(
    () => (isCountingExerciseKind(kind) ? buildCountingQuestions(kind) : []),
    [kind],
  )
  const celebration = useCelebration()

  if (!isCountingExerciseKind(kind)) {
    return <Navigate to="/kursus" replace />
  }

  return (
    <LessonSheet
      title={COUNTING_EXERCISE_TITLES[kind]}
      bar={<BarLink to="/lesson/taelle">Til lektionen</BarLink>}
      className="lesson--task"
    >
      <p className="alphabet__note">
        Du kan stoppe når som helst. Det, du har øvet, bliver stående.
      </p>
      <ChoiceExercise
        questions={questions}
        // A number answered right is a number learned — and the twentieth
        // one pays the lesson's notebook page, once and only once.
        onCorrect={(itemId) => celebration.cheer(learnCountingItem(itemId))}
        // Finishing the round therefore has no page of its own to pay: it
        // always replays — same praise, same tick, never a second payout.
        onComplete={() => celebration.cheer('replay')}
      />
      <RewardOverlays celebration={celebration} />
    </LessonSheet>
  )
}
