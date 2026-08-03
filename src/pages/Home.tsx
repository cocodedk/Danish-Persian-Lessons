import { useState } from 'react'
import { RuledSection } from '../components/RuledSection'
import { SplitCard } from '../components/SplitCard'
import { LessonCard } from '../components/LessonCard'
import { NameCapture } from '../components/NameCapture'
import { SettingsCorner } from '../components/SettingsCorner'
import { getProfile, setProfile, hasProfileRecord, clearName } from '../progress/profile'
import { getAlphabetProgress, doneCount, ALPHABET_TOTAL } from '../progress/alphabet'
import { DEMO_WORD } from '../content/demoWord'
import { FA_GREETING, daGreeting } from '../content/greetings'
import './Home.css'

export default function Home() {
  const [profile, setProfileState] = useState(() => getProfile())
  const [needsCapture, setNeedsCapture] = useState(() => !hasProfileRecord())

  function handleNameSubmit(name: string) {
    const trimmed = name.trim()
    const next = trimmed ? { ...profile, name: trimmed } : { ...profile }
    setProfile(next)
    setProfileState(next)
    setNeedsCapture(false)
  }

  function handleSkip() {
    // Persist the profile as-is (even empty) so the app never asks again.
    setProfile(profile)
    setNeedsCapture(false)
  }

  function handleNameSave(name: string) {
    const trimmed = name.trim()
    const next = { ...profile, name: trimmed || undefined }
    setProfile(next)
    setProfileState(next)
  }

  function handleNameDelete() {
    clearName()
    setProfileState(getProfile())
  }

  if (needsCapture) {
    return <NameCapture onSubmit={handleNameSubmit} onSkip={handleSkip} />
  }

  const cleared = doneCount(getAlphabetProgress())

  return (
    <main className="home">
      <RuledSection>
        <SplitCard
          word={DEMO_WORD}
          faGreeting={FA_GREETING}
          daGreeting={daGreeting(profile.name)}
        />
        <h2 className="home__lessons" lang="da">
          Lektioner
        </h2>
        <LessonCard
          number={1}
          title="Alfabetet"
          summary="32 bogstaver, formerne og de seks vokaltegn"
          progress={`${cleared} af ${ALPHABET_TOTAL} klaret`}
          to="/lesson/alphabet"
        />
      </RuledSection>
      <SettingsCorner
        name={profile.name}
        onSave={handleNameSave}
        onDelete={handleNameDelete}
      />
    </main>
  )
}
