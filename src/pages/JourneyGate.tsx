import { Navigate, useNavigate } from 'react-router-dom'
import { RuledSection } from '../components/RuledSection'
import { LessonImage } from '../components/LessonImage'
import { PersianText } from '../components/PersianText'
import { Button } from '../components/Button'
import { childMissions } from '../child/missions'
import { getJourneyChoice, hasCourseHistory, setJourneyChoice } from '../progress/journey'
import { talkAudioReady } from '../speaking/lessons'
import './JourneyGate.css'

export default function JourneyGate() {
  const navigate = useNavigate()
  const choice = getJourneyChoice()
  const speakingReady = talkAudioReady()
  const firstMission = childMissions.find(({ imageEntryId }) => imageEntryId) ?? childMissions[0]

  if (choice) {
    const target = choice === 'speak' && speakingReady
      ? '/tal' : choice === 'words' ? '/opdag' : '/kursus'
    return <Navigate to={target} replace />
  }
  if (hasCourseHistory()) return <Navigate to="/kursus" replace />
  if (speakingReady) return <Navigate to="/tal" replace />

  function choose(next: 'words' | 'script') {
    setJourneyChoice(next)
    navigate(next === 'words' ? '/opdag' : '/kursus')
  }

  return (
    <main className="journey-gate" lang="da">
      <RuledSection>
        <div className="journey-gate__layout">
          <header className="journey-gate__intro">
            <p className="journey-gate__eyebrow">Dansk og persisk i samme notesbog</p>
            <h1>Persisk på din måde</h1>
            <p>Begynd med noget, du kan lave med det samme.</p>
          </header>

          <section className="journey-gate__invitation" aria-label="Første persiske ord">
            {firstMission.imageEntryId && <LessonImage entryId={firstMission.imageEntryId} eager />}
            <div className="journey-gate__word">
              <PersianText entry={firstMission.word.entry} marked />
              <span>{firstMission.word.da}</span>
            </div>
            <Button onClick={() => choose('words')}>Lav et persisk ord</Button>
          </section>

          <section className="journey-gate__course" aria-label="Hele kurset">
            <p>Vil du se alfabetet, udtalen og alle noterne?</p>
            <Button variant="quiet" onClick={() => choose('script')}>
              Åbn kursus og noter
            </Button>
          </section>
        </div>
      </RuledSection>
    </main>
  )
}
