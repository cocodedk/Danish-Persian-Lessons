import { CountingRuleScreen } from './CountingRuleScreen'
import { CountingRuleExerciseScreen } from './CountingRuleExerciseScreen'
import { countingThousandsLesson } from '../lessons/countingThousands'
import { countingThousandsProgress } from '../progress/countingRules'

/**
 * Lesson 4, "Regnereglen tusinder", as routes (plan 017, fixpoint C). Like
 * lesson 3 it is nothing but a descriptor and a store handed to the generic
 * screens lesson 2 already runs. The lesson borrows its joiner from 21-99 and
 * builds on 100-900, and both of those live in the descriptor — so this file
 * stays the same three lines the other rule lessons are, and no teaching can
 * drift into the routing layer.
 */

/** The lesson page at `/lesson/taelle/tusinder`. */
export function CountingThousandsScreen() {
  return <CountingRuleScreen lesson={countingThousandsLesson} store={countingThousandsProgress} />
}

/** Lesson 4's rounds at `/lesson/taelle/tusinder/ovelse/:kind`. */
export function CountingThousandsExerciseScreen() {
  return (
    <CountingRuleExerciseScreen
      lesson={countingThousandsLesson}
      store={countingThousandsProgress}
    />
  )
}
