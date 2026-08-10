import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { ColorSwatch } from '../components/ColorSwatch'
import { LessonImage } from '../components/LessonImage'
import { BarLink, LessonSheet } from '../components/LessonSheet'
import { ProgressTick } from '../components/ProgressTick'
import { SpokenForms } from '../components/SpokenForms'
import { VoiceRecorder } from '../components/VoiceRecorder'
import { markHeard, markSpoken, speakingPractice } from '../progress/speaking'
import { findSpeakingPage, talkAudioReady } from '../speaking/lessons'
import './speaking.css'

export default function SpeakingPage() {
  const { lesson: lessonId = '', page: pageId = '' } = useParams()
  const found = findSpeakingPage(lessonId, pageId)
  const [practice, setPractice] = useState(() => (
    found ? speakingPractice(found.page.entry.id) : null
  ))
  const entryId = found?.page.entry.id

  useEffect(() => {
    if (entryId) setPractice(speakingPractice(entryId))
  }, [entryId])

  if (!talkAudioReady()) return <Navigate to="/opdag" replace />
  if (!found) return <Navigate to="/tal" replace />

  const { lesson, page, index } = found
  const previous = lesson.pages[index - 1]
  const next = lesson.pages[index + 1]

  function heard() {
    setPractice(markHeard(page.entry.id))
  }

  function spoken() {
    setPractice(markSpoken(page.entry.id))
  }

  return (
    <LessonSheet
      className="lesson--speaking"
      title={lesson.title}
      bar={(
        <>
          {previous && <BarLink to={`/tal/${lesson.id}/${previous.id}`}>Forrige</BarLink>}
          <BarLink to="/tal">Alle lektioner</BarLink>
          {next && <BarLink to={`/tal/${lesson.id}/${next.id}`}>Næste</BarLink>}
        </>
      )}
    >
      <p className="speaking-page__count">Side {index + 1} af {lesson.pages.length}</p>
      <article className="speaking-page">
        {page.swatch && <ColorSwatch color={page.swatch} size="large" />}
        {page.number && <div className="speaking-number" aria-hidden="true">{page.number}</div>}
        {page.imageEntryId && <LessonImage entryId={page.imageEntryId} eager />}
        <SpokenForms entry={page.entry} onHeard={heard} />
        <VoiceRecorder />
        <section className="speaking-page__practice" aria-label="Tal højt">
          <p>Sig det højt. Hør lyden igen. Lyder det ens?</p>
          {!practice?.spoken ? (
            <Button onClick={spoken}>Jeg har sagt det</Button>
          ) : (
            <p className="speaking-page__done">
              <ProgressTick granted label="Øvet højt" />
              <strong>Øvet højt</strong>
            </p>
          )}
        </section>
      </article>
    </LessonSheet>
  )
}
