import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { BarLink } from '../components/LessonSheet'
import { TypeExercise } from '../components/TypeExercise'
import { RewardOverlays } from '../components/RewardOverlays'
import { getProfile } from '../progress/profile'
import { typeWordDone, payRound } from '../progress/typing'
import { canType } from '../keyboard/layout'
import { useCelebration } from '../rewards/useCelebration'
import { TYPE_NAME_ENTRY } from '../content/faStrings'
import { PersonalNameText } from '../components/PersonalName'
import './type.css'

/** The one item this round has, and the key its progress is kept under. */
export const NAME_TASK = 'name'

/**
 * «نامِ خودت را بنویس» — the capstone. Everything the app has taught comes to
 * one screen: the letters, their joined shapes, and a keyboard to write them
 * on. It exists only for a learner who has a Persian spelling that this
 * keyboard can actually write; without one there is no screen and nothing
 * anywhere that mentions it (gate 8 — dormant, never a nag).
 */
export default function TypeNameScreen() {
  const [profile] = useState(getProfile)
  const celebration = useCelebration()

  const { faSpelling, name } = profile
  if (!faSpelling || !canType(faSpelling)) {
    return <Navigate to="/" replace />
  }

  return (
    <TypeExercise
      title="Tast dit navn"
      eyebrowEntry={TYPE_NAME_ENTRY}
      bar={<BarLink to="/">Til forsiden</BarLink>}
      tasks={[
        {
          id: NAME_TASK,
          promptDa: 'Skriv dit navn med persiske bogstaver',
          answer: faSpelling,
          personalName: { spelling: faSpelling, original: name },
        },
      ]}
      onCorrect={() => celebration.cheer(typeWordDone(NAME_TASK, NAME_TASK))}
      onComplete={() => celebration.cheer(payRound(NAME_TASK))}
      help={
        // Your own name is never a riddle. It is one tap away, and taking it
        // costs nothing — the exercise is the writing, not the remembering.
        <details className="type__help">
          <summary>Se, hvordan dit navn staves</summary>
          <PersonalNameText spelling={faSpelling} as="p" className="type__help-fa" />
        </details>
      }
      doneLine="Du skrev dit eget navn med persiske bogstaver."
      overlays={<RewardOverlays celebration={celebration} />}
    />
  )
}
