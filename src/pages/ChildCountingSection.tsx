// The workshop's counting shelf (plan 017).
//
// One door per counting lesson, in the order `countingCurriculum` states —
// never a copy of a lesson's fields. Route, title, summary and range are read
// off the descriptor and the progress line off the curriculum adapter, so the
// workshop can never disagree with the lesson it points at, and adding a
// lesson to the curriculum adds a door here without touching this file.
import { Link } from 'react-router-dom'
import { PersianText } from '../components/PersianText'
import { countingCurriculum, countingLesson } from '../lessons/countingLesson'
import type { CountingCurriculumEntry } from '../lessons/countingLesson'
import { countingCurriculumProgressLine } from '../progress/countingCurriculum'
import './ChildNumbers.css'

/**
 * One counting lesson as a card the child can open.
 *
 * Only the foundation shows Persian, and only its own first row: the digit in
 * the badge and the first number word beside the title. The rule lesson's
 * Persian, dansk lydskrift and IPA are candidate drafts that no reviewer has
 * approved, so this card shows none of them — its badge carries the plain
 * number its range starts at, and its meta line says the range without
 * claiming how any of it is said. Neither card promises listening: only the
 * first ten numbers have recorded audio.
 */
function CountingLessonLink({ entry }: { entry: CountingCurriculumEntry }) {
  const [start, end] = entry.range
  const foundation = entry === countingLesson ? countingLesson : null
  const first = foundation?.numbers[0]
  return (
    <Link className="child-numbers__lesson" to={entry.path}>
      {first ? (
        <PersianText entry={first.digit} className="child-number__digit" ariaHidden />
      ) : (
        <span className="child-number__digit" aria-hidden="true">{start}</span>
      )}
      <span>
        {first && <PersianText entry={first.word} marked />}
        <strong>{entry.title}</strong>
        <span>{entry.summary}</span>
        <span>
          {foundation
            ? `${foundation.numbers.length} tal fra ${start} til ${end}`
            : `Tal fra ${start} til ${end}`}
        </span>
        <span>{countingCurriculumProgressLine(entry)}</span>
      </span>
    </Link>
  )
}

/** The whole counting shelf: one heading, then the curriculum in its order. */
export function ChildCountingSection() {
  return (
    <section className="child-numbers" aria-labelledby="child-numbers-title">
      <h2 id="child-numbers-title">Tal på persisk</h2>
      {countingCurriculum.map((entry) => (
        <CountingLessonLink entry={entry} key={entry.path} />
      ))}
    </section>
  )
}

export default ChildCountingSection
