import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { NameWalkthrough } from '../components/NameWalkthrough'
import { NameAssembly } from '../components/NameAssembly'
import { Celebration } from '../components/Celebration'
import { RewardOverlays } from '../components/RewardOverlays'
import { ProgressTick } from '../components/ProgressTick'
import { getProfile } from '../progress/profile'
import { isNameLessonDone, markNameLessonDone } from '../progress/nameLesson'
import { useCelebration } from '../rewards/useCelebration'
import { WRITE_NAME_FA, namePraise } from '../name/copy'
import './name.css'

/**
 * «نامِ خود را بنویس» — the lesson the whole app has been building towards: the
 * learner reads their own name, letter by letter, and then writes it. It exists
 * only for a learner who has a spelling; without one there is nothing here to
 * teach, and nothing anywhere that mentions it. Plan 006, step 5.
 */
export default function NameLesson() {
  const [profile] = useState(getProfile)
  const [cleared, setCleared] = useState(isNameLessonDone)
  const celebration = useCelebration()

  const { faSpelling, name } = profile
  if (!faSpelling) {
    return <Navigate to="/" replace />
  }

  /**
   * The name is finished. It is worth a full page the first time and nothing
   * after that — the lesson is as playable as the learner likes, and playing it
   * twice is practice, not a second wage. Read from storage rather than from
   * `cleared`, so a reload cannot pay for it again either.
   */
  function finish() {
    const paid = isNameLessonDone()
    markNameLessonDone()
    setCleared(true)
    celebration.cheer(paid ? 'replay' : 'page')
  }

  // The engine grants the reward; the name goes into the praise it is read out
  // with — «آفرین، سارا!» / "Flot, Sara!" — because that is the moment.
  const reward =
    celebration.reward && name
      ? { ...celebration.reward, praise: namePraise(faSpelling, name) }
      : celebration.reward

  return (
    <LessonSheet title="Skriv dit navn" bar={<BarLink to="/">Til forsiden</BarLink>}>
      <p className="name__eyebrow" lang="fa" dir="rtl">
        {WRITE_NAME_FA}
      </p>
      <p className="alphabet__lead">
        Dit navn, bogstav for bogstav. Se først hvordan hvert bogstav skifter form, når det binder
        til naboen. Sæt det så sammen selv.
      </p>

      <p className="name__preview" lang="fa" dir="rtl">
        {faSpelling}
      </p>

      <h2 className="alphabet__section-title">Bogstav for bogstav</h2>
      <NameWalkthrough spelling={faSpelling} />

      <NameAssembly spelling={faSpelling} onDone={finish} />

      {celebration.reward !== null && <Celebration reward={reward} tickLabel="Klaret" />}
      {cleared && celebration.reward === null && (
        <p className="name__done">
          <ProgressTick granted label="Klaret" />
          <span>Klaret</span>
        </p>
      )}
      <RewardOverlays celebration={celebration} />
    </LessonSheet>
  )
}
