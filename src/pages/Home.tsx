import { useState } from 'react'
import { SplitCard } from '../components/SplitCard'
import { NameCapture } from '../components/NameCapture'
import { SettingsCorner } from '../components/SettingsCorner'
import { getProfile, setProfile, hasProfileRecord, clearName } from '../progress/profile'
import { DEMO_WORD } from '../content/demoWord'
import { FA_GREETING, daGreeting } from '../content/greetings'

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

  return (
    <main className="home">
      <SplitCard
        word={DEMO_WORD}
        faGreeting={FA_GREETING}
        daGreeting={daGreeting(profile.name)}
      />
      <SettingsCorner
        name={profile.name}
        onSave={handleNameSave}
        onDelete={handleNameDelete}
      />
    </main>
  )
}
