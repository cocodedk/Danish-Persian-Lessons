import { useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { ChoiceExercise } from '../components/ChoiceExercise'
import { CompositionExercise } from '../components/CompositionExercise'
import { RewardOverlays } from '../components/RewardOverlays'
import type { RuleLessonDescriptor } from '../lessons/countingRuleTypes'
import {
  buildRuleBuildQuestions,
  buildRuleRecognitionQuestions,
  isRuleRecognitionKind,
  RULE_BUILD_TITLE,
  RULE_RECOGNITION_TITLES,
} from '../lessons/countingRuleExercises'
import { counting21to99Lesson } from '../lessons/counting21to99'
import { counting21to99Progress } from '../progress/countingRules'
import type { CountingRuleStore } from '../progress/countingRules'
import { useCelebration } from '../rewards/useCelebration'
import './vocab.css'

/**
 * One round of any rule lesson (plan 017, fixpoint A item 3). The route's
 * `:kind` decides which: `betydning` and `tal` are recognition rounds on
 * ChoiceExercise, `byg` is the assembly on CompositionExercise. Anything else
 * is not a round this lesson reserves, so it goes back to the lesson page
 * without leaving a step in the history to fall back into.
 *
 * CANDIDATE CONTENT. Every form these rounds print is a candidate draft
 * awaiting human review, not a reviewed or release-ready form.
 *
 * What a right answer pays is entirely the store's to say: it answers with the
 * event the id has earned — an `answer` for a row already cleared, an `item`
 * for a first claim, and the lesson's single `page` when the last row lands.
 * Finishing the round mints nothing on top of that, so closing a round the
 * learner has played before cannot pay a second page.
 */
export interface CountingRuleExerciseScreenProps {
  lesson: RuleLessonDescriptor
  store: CountingRuleStore
}

export function CountingRuleExerciseScreen({ lesson, store }: CountingRuleExerciseScreenProps) {
  const { kind = '' } = useParams()
  const questions = useMemo(
    () => (isRuleRecognitionKind(kind) ? buildRuleRecognitionQuestions(lesson, kind) : []),
    [kind, lesson],
  )
  const builds = useMemo(() => (kind === 'byg' ? buildRuleBuildQuestions(lesson) : []), [kind, lesson])
  const celebration = useCelebration()

  if (!isRuleRecognitionKind(kind) && kind !== 'byg') {
    return <Navigate to={lesson.path} replace />
  }

  /** A row cleared here is paid exactly what this lesson's store says it is
   *  worth, and a row the lesson does not own is paid nothing at all. */
  function pay(itemId: string) {
    const event = store.learn(itemId)
    return event ? celebration.cheer(event) : undefined
  }

  return (
    <LessonSheet
      title={isRuleRecognitionKind(kind) ? RULE_RECOGNITION_TITLES[kind] : RULE_BUILD_TITLE}
      bar={<BarLink to={lesson.path}>Til lektionen</BarLink>}
      className="lesson--task"
    >
      <p className="alphabet__note" lang="da">
        Du kan stoppe når som helst. Det, du har øvet, bliver stående.
      </p>
      {isRuleRecognitionKind(kind) ? (
        <ChoiceExercise
          questions={questions}
          onCorrect={pay}
          // The last question has already paid whatever it was worth; closing
          // the round is not a second completion.
          onComplete={() => undefined}
        />
      ) : (
        <CompositionExercise
          questions={builds}
          onCorrect={pay}
          onComplete={() => undefined}
        />
      )}
      <RewardOverlays celebration={celebration} />
    </LessonSheet>
  )
}

/** Lesson 2's rounds at `/lesson/taelle/21-99/ovelse/:kind`. */
export default function Counting21to99ExerciseScreen() {
  return (
    <CountingRuleExerciseScreen lesson={counting21to99Lesson} store={counting21to99Progress} />
  )
}
