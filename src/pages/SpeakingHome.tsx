import { Link, Navigate } from 'react-router-dom'
import { ColorSwatch } from '../components/ColorSwatch'
import { LessonImage } from '../components/LessonImage'
import { PersianText } from '../components/PersianText'
import { RuledSection } from '../components/RuledSection'
import { allSpeakingPractice } from '../progress/speaking'
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
                  ) : first.number ? (
                    <div className="speaking-number speaking-number--small" aria-hidden="true">{first.number}</div>
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
          </div>
        </section>
      </RuledSection>
    </main>
  )
}
