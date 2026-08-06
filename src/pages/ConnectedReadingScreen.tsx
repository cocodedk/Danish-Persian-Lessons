import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { PersianText } from '../components/PersianText'
import { PronLine } from '../components/PronLine'
import { OptionalAudioControl } from '../components/OptionalAudioControl'
import { ChallengeReveal, FullTeachingCard } from '../components/EntryRenderers'
import { Button } from '../components/Button'
import { Celebration } from '../components/Celebration'
import { findConnectedReading, readingFunctionEntries } from '../lessons/connectedReading'
import { introduceForReview, recordReview } from '../review/scheduler'
import { celebrate } from '../rewards/engine'
import type { Reward } from '../rewards/types'
import { useRevealInView } from '../components/useRevealInView'
import '../components/ReviewSession.css'

export default function ConnectedReadingScreen() {
  const { unit = '', reading: readingId = '' } = useParams()
  const reading = findConnectedReading(unit, readingId)
  const [marked, setMarked] = useState(true)
  const [started, setStarted] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [reward, setReward] = useState<Reward | null>(null)
  const feedbackRef = useRevealInView(revealed || selected !== null)

  if (!reading) return <Navigate to="/" replace />
  const supportEntries = reading.taughtEntryIds.map((id) => readingFunctionEntries.find((entry) => entry.id === id)!)
  const attempted = selected !== null
  const correct = selected === reading.question.answerDa

  function reveal() {
    setMarked(true)
    setRevealed(true)
    recordReview(reading!.entry.id, 'revealed')
  }

  function beginRetrieval() {
    introduceForReview(reading!.entry.id)
    setStarted(true)
    setMarked(false)
  }

  function answer(choice: string) {
    if (attempted) return
    setSelected(choice)
    const right = choice === reading!.question.answerDa
    if (!right) recordReview(reading!.entry.id, 'wrong')
    else if (!revealed) recordReview(reading!.entry.id, 'correct')
    if (right) setReward(celebrate('answer'))
  }

  return (
    <LessonSheet className="lesson--task" title={reading.kind === 'microtext' ? 'Læs en lille tekst' : 'Læs et lille udtryk'} bar={<BarLink to={`/lesson/ord/${unit}`}>Til lektionen</BarLink>}>
      <p className="alphabet__lead">Læs først med vokaltegn. Prøv derefter den almindelige persiske skrift.</p>
      <section className="reading-transfer">
        <section className="reading-transfer__support" aria-labelledby="reading-support-title">
          <h2 id="reading-support-title">Før du læser</h2>
          <p>Her er {supportEntries.length === 1 ? 'det lille ord eller tegn' : 'de små ord og tegn'}, teksten bruger.</p>
          <div className="reading-transfer__support-grid">
            {supportEntries.map((entry) => <FullTeachingCard entry={entry} key={entry.id} />)}
          </div>
        </section>
        <PersianText entry={reading.entry} marked={marked} as="p" className="puzzle__word" />
        <PronLine {...reading.entry.pron} />
        <OptionalAudioControl audioId={reading.entry.audioId} />
        <div className="puzzle__actions">
          {!started && <Button onClick={beginRetrieval}>Prøv uden vokaltegn</Button>}
          {started && !marked && <Button variant="quiet" onClick={reveal}>Vis vokaltegn og hjælp</Button>}
        </div>
        {started && (
          <>
            <h2>{reading.question.promptDa}</h2>
            <ul className="review-session__choices">
              {reading.question.choicesDa.map((choice) => (
                <li key={choice}>
                  <button type="button" lang="da" aria-pressed={selected === choice} className={selected === choice ? 'review-session__choice--selected' : ''} onClick={() => answer(choice)}>
                    {choice}
                    {selected === choice && <strong>{correct ? '✓ Rigtigt' : 'Valgt'}</strong>}
                  </button>
                </li>
              ))}
            </ul>
            <div ref={feedbackRef} className="review-session__feedback" role="status" aria-live="polite">
              {revealed && !attempted && <ChallengeReveal entry={reading.entry} />}
              {attempted && !correct && <ChallengeReveal entry={reading.entry} />}
              {correct && <Celebration reward={reward} tickLabel="Forstået" />}
            </div>
          </>
        )}
      </section>
    </LessonSheet>
  )
}
