import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RuledSection } from '../components/RuledSection'
import { SplitCard } from '../components/SplitCard'
import { LessonCard } from '../components/LessonCard'
import { NameCapture } from '../components/NameCapture'
import { SettingsCorner } from '../components/SettingsCorner'
import { StreakLine } from '../components/StreakLine'
import { RewardShelf } from '../components/RewardShelf'
import { getProfile, setProfile, hasProfileRecord, clearName } from '../progress/profile'
import { getAlphabetProgress, doneCount, ALPHABET_TOTAL } from '../progress/alphabet'
import { isNameLessonDone } from '../progress/nameLesson'
import { vocabUnits } from '../lessons/vocab'
import { unitDoneCount } from '../progress/vocab'
import { getRewards } from '../rewards/engine'
import { DEMO_WORD } from '../content/demoWord'
import { faGreeting, daGreeting } from '../content/greetings'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  const [profile, setProfileState] = useState(() => getProfile())
  const [needsCapture, setNeedsCapture] = useState(() => !hasProfileRecord())

  function handleNameSubmit(name: string) {
    const trimmed = name.trim()
    const next = trimmed ? { ...profile, name: trimmed } : { ...profile }
    setProfile(next)
    setProfileState(next)
    setNeedsCapture(false)
    // A name that was just given goes straight on to its Persian spelling —
    // the one screen where the learner meets themselves in Persian letters.
    if (trimmed) navigate('/dit-navn')
  }

  function handleSkip() {
    // Persist the profile as-is (even empty) so the app never asks again.
    setProfile(profile)
    setNeedsCapture(false)
  }

  function handleNameSave(name: string) {
    const trimmed = name.trim()
    // A different name is a different spelling: keeping the old one would leave
    // the greeting, the badges and the mini-lesson spelling somebody else.
    const kept = trimmed && trimmed !== profile.name ? undefined : profile.faSpelling
    const next = { ...profile, name: trimmed || undefined, faSpelling: trimmed ? kept : undefined }
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
  const rewards = getRewards()
  // The name lesson only exists for a learner who has a spelling, so the word
  // units number themselves after whatever is actually on the page.
  const firstWordNumber = profile.faSpelling ? 3 : 2

  return (
    <main className="home">
      <RuledSection>
        <SplitCard
          word={DEMO_WORD}
          faGreeting={faGreeting(profile.faSpelling)}
          daGreeting={daGreeting(profile.name)}
        />
        <StreakLine streak={rewards.streak} />
        <RewardShelf level={rewards.level} stickers={rewards.stickers} />
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
        {/* Only a learner who has a Persian spelling has this lesson at all. */}
        {profile.faSpelling && (
          <LessonCard
            number={2}
            title="Dit navn"
            summary="Læs og skriv dit eget navn med persiske bogstaver"
            progress={isNameLessonDone() ? 'Klaret' : 'Klar, når du er'}
            to="/lesson/navn"
          />
        )}
        {vocabUnits.map((unit, index) => (
          <LessonCard
            key={unit.id}
            number={firstWordNumber + index}
            title={unit.title}
            summary={unit.summary}
            progress={`${unitDoneCount(unit)} af ${unit.words.length} ord klaret`}
            to={`/lesson/ord/${unit.id}`}
          />
        ))}
      </RuledSection>
      <SettingsCorner
        name={profile.name}
        faSpelling={profile.faSpelling}
        onSave={handleNameSave}
        onDelete={handleNameDelete}
      />
    </main>
  )
}
