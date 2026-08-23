import { Link, Navigate } from 'react-router-dom'
import { ColorSwatch } from '../components/ColorSwatch'
import { LessonImage } from '../components/LessonImage'
import { PersianText } from '../components/PersianText'
import { RuledSection } from '../components/RuledSection'
import { countingCurriculum, countingLesson } from '../lessons/countingLesson'
import type { CountingCurriculumEntry } from '../lessons/countingLesson'
import { allSpeakingPractice } from '../progress/speaking'
import { countingCurriculumProgressLine } from '../progress/countingCurriculum'
import { requiredTalkClipIds, speakingLessons, talkAudioReady } from '../speaking/lessons'
import './speaking.css'

export default function SpeakingHome() {
  if (!talkAudioReady()) return <Navigate to="/opdag" replace />
  const practice = allSpeakingPractice()
  const heard = practice.filter((row) => row.heard > 0).length
  const spoken = practice.filter((row) => row.spoken > 0).length

  return (
    <main className="speaking-home" lang="da">
      <RuledSection>
        <header className="speaking-home__header">
          <p>Hør. Sig det. Hør dig selv.</p>
          <h1>Lær at tale persisk</h1>
          <p>Start med korte ord og sætninger. Skriften er med, men du skal ikke kunne læse den.</p>
          {(heard > 0 || spoken > 0) && <p>{heard} hørt · {spoken} øvet højt</p>}
        </header>
        <Link className="speaking-sound-exercise" to="/lydovelse">
          <span aria-hidden="true">🔊</span>
          <div>
            <h2>Øv alle lyde</h2>
            <p>Find et ord. Hør det. Sig det højt.</p>
            <strong>{requiredTalkClipIds.length} lyde</strong>
          </div>
        </Link>
        <section aria-labelledby="speaking-lessons-title">
          <h2 id="speaking-lessons-title">Vælg en lille lektion</h2>
          <div className="speaking-lessons">
            {speakingLessons.map((lesson) => {
              const first = lesson.pages[0]
              return (
                <Link
                  className="speaking-lesson-card"
                  key={lesson.id}
                  to={`/tal/${lesson.id}/${first.id}`}
                >
                  {first.swatch ? (
                    <ColorSwatch color={first.swatch} size="large" />
                  ) : (
                    <LessonImage entryId={first.imageEntryId ?? first.entry.id} size="thumbnail" />
                  )}
                  <div>
                    <PersianText entry={first.entry} marked />
                    <h3>{lesson.title}</h3>
                    <p>{lesson.summary}</p>
                    <strong>{lesson.pages.length} korte sider</strong>
                  </div>
                </Link>
              )
            })}
            {countingCurriculum.map((entry) => (
              <CountingCard entry={entry} key={entry.path} />
            ))}
          </div>
        </section>
      </RuledSection>
    </main>
  )
}

/**
 * One counting lesson on the talk shelf, as a door to the course route that
 * owns it. Everything on the card — where it goes, what it is called, what it
 * says and which numbers it covers — is read off the curriculum descriptor, so
 * the shelf can never disagree with the lesson it points at.
 *
 * Only the foundation shows a Persian preview, and only of its own first row.
 * The rule lesson's Persian, lydskrift and IPA are candidate drafts that no
 * reviewer has approved, so the shelf shows none of it: the badge carries the
 * lesson's first number alone, which fits the fixed badge, and the text meta
 * says the full range without claiming how any of it is said.
 */
function CountingCard({ entry }: { entry: CountingCurriculumEntry }) {
  const [start, end] = entry.range
  const foundation = entry === countingLesson ? countingLesson : null
  return (
    <Link className="speaking-lesson-card" to={entry.path}>
      <div className="speaking-number speaking-number--small" aria-hidden="true">
        {foundation ? foundation.numbers[0].value : start}
      </div>
      <div>
        {foundation && <PersianText entry={foundation.numbers[0].word} marked />}
        <h3>{entry.title}</h3>
        <p>{entry.summary}</p>
        <strong>
          {foundation
            ? `${foundation.numbers.length} tal fra ${start} til ${end}`
            : `Tal fra ${start} til ${end}`}
        </strong>
        <p>{countingCurriculumProgressLine(entry)}</p>
      </div>
    </Link>
  )
}
