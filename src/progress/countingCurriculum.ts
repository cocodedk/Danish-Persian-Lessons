// Which progress store belongs to which counting lesson (plan 017).
//
// The curriculum array in `../lessons/countingLesson` says what the counting
// lessons *are*: their route, their title, their range. It says nothing about
// where a learner's progress through them is kept, and it should not — the
// foundation counts number words in its own store, each rule lesson counts the
// parts it teaches in a store of its own, and none of them knows the others
// exist. The keys are the stores' business; none is restated here.
//
// This module is the one place those two halves are joined: given a curriculum
// entry, it answers how far the learner has come and out of how many. Every
// screen that wants that answer asks here, so the mapping from lesson to store
// exists once. Nothing is copied down — ranges, titles and routes stay on the
// descriptors, totals are read off the descriptor or the store, and the counts
// are read at call time so a line rendered after a mark shows the mark.
import { countingLesson } from '../lessons/countingLesson'
import type { CountingCurriculumEntry } from '../lessons/countingLesson'
import { counting21to99Lesson } from '../lessons/counting21to99'
import { counting100to900Lesson } from '../lessons/counting100to900'
import { countingThousandsLesson } from '../lessons/countingThousands'
import { countingDoneCount } from './counting'
import {
  counting21to99Progress,
  counting100to900Progress,
  countingThousandsProgress,
} from './countingRules'

/**
 * How far through one counting lesson the learner has come. `noun` is what the
 * lesson counts in Danish — the foundation counts `tal`, the rule lesson counts
 * the `dele` of the rule it teaches, and neither is a number of the other.
 */
export interface CountingCurriculumProgress {
  readonly done: number
  readonly total: number
  readonly noun: string
}

/**
 * One entry's progress, read fresh from its own store.
 *
 * Dispatch is on descriptor identity: these are the very objects the curriculum
 * array holds, so an entry either *is* one of the implemented lessons or is
 * something this module has never been told about. A lesson that is planned but
 * not yet wired to a store must fail here, loudly, rather than quietly report
 * zero of zero — a silent zero would read on screen as "nothing learned yet",
 * which is a lie about a lesson that cannot be learned at all.
 */
export function countingCurriculumProgress(
  entry: CountingCurriculumEntry,
): CountingCurriculumProgress {
  if (entry === countingLesson) {
    return {
      done: countingDoneCount(),
      total: countingLesson.numbers.length,
      noun: 'tal',
    }
  }
  if (entry === counting21to99Lesson) {
    return {
      done: counting21to99Progress.doneCount(),
      total: counting21to99Progress.ids.length,
      noun: 'dele',
    }
  }
  if (entry === counting100to900Lesson) {
    return {
      done: counting100to900Progress.doneCount(),
      total: counting100to900Progress.ids.length,
      noun: 'dele',
    }
  }
  if (entry === countingThousandsLesson) {
    return {
      done: countingThousandsProgress.doneCount(),
      total: countingThousandsProgress.ids.length,
      noun: 'dele',
    }
  }
  throw new Error(`Ingen fremskridtslager kender lektionen "${entry.path}"`)
}

/**
 * The same answer as one line of Danish, in the wording the counting screens
 * already use: honest about what the number means. It is not a claim that the
 * learner has mastered anything — only that these rows have been shown or
 * practised, which is what the stores actually record.
 */
export function countingCurriculumProgressLine(entry: CountingCurriculumEntry): string {
  const { done, total, noun } = countingCurriculumProgress(entry)
  return `${done} af ${total} ${noun} gennemgået eller øvet`
}
