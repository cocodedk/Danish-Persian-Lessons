import { CountingRuleScreen } from './CountingRuleScreen'
import { CountingRuleExerciseScreen } from './CountingRuleExerciseScreen'
import { counting100to900Lesson } from '../lessons/counting100to900'
import { counting100to900Progress } from '../progress/countingRules'

/**
 * Lesson 3, "Regnereglen 100-900", as routes (plan 017, fixpoint B). The
 * screens are the generic ones lesson 2 already uses; all this file does is
 * hand them the descriptor and the store that make them lesson 3. No teaching
 * lives here, so nothing about the rule can drift between the two lessons.
 */

/** The lesson page at `/lesson/taelle/100-900`. */
export function Counting100to900Screen() {
  return <CountingRuleScreen lesson={counting100to900Lesson} store={counting100to900Progress} />
}

/** Lesson 3's rounds at `/lesson/taelle/100-900/ovelse/:kind`. */
export function Counting100to900ExerciseScreen() {
  return (
    <CountingRuleExerciseScreen lesson={counting100to900Lesson} store={counting100to900Progress} />
  )
}
