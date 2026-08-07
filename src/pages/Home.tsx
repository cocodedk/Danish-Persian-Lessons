import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { RuledSection } from '../components/RuledSection'
import { SplitCard } from '../components/SplitCard'
import { LessonCard } from '../components/LessonCard'
import { NameCapture } from '../components/NameCapture'
import { SettingsCorner } from '../components/SettingsCorner'
import { StreakLine } from '../components/StreakLine'
import { RewardShelf } from '../components/RewardShelf'
import { TypingRounds } from '../components/TypingRounds'
import { getProfile, setProfile, hasProfileRecord, clearName } from '../progress/profile'
import { getAlphabetProgress, doneCount, ALPHABET_TOTAL } from '../progress/alphabet'
import { isNameLessonDone } from '../progress/nameLesson'
import { vocabUnits } from '../lessons/vocab'
import { unitDoneCount } from '../progress/vocab'
import { getRewards } from '../rewards/engine'
import { DEMO_WORD } from '../content/demoWord'
import { GREETING_ENTRY, GREETING_WITH_NAME_ENTRY, daGreeting } from '../content/greetings'
import { dueReviewQuestions } from '../review/tasks'
import { isRetained, reviewStates } from '../review/scheduler'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  const [profile, setProfileState] = useState(() => getProfile())
  const [needsCapture, setNeedsCapture] = useState(() => !hasProfileRecord())
  const alphabetProgress = getAlphabetProgress()
  const cleared = doneCount(alphabetProgress)

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

  if (!alphabetProgress.orientationSeen && needsCapture) {
    return <Navigate to="/lesson/alphabet/intro" replace />
  }

  // The learner meets their name after the alphabet in the recommended flow.
  // Direct routes remain open, and a skipped name never blocks another lesson.
  if (needsCapture && cleared === ALPHABET_TOTAL) {
    return <NameCapture onSubmit={handleNameSubmit} onSkip={handleSkip} />
  }

  const rewards = getRewards()
  // The name lesson only exists for a learner who has a spelling, so the word
  // units number themselves after whatever is actually on the page.
  const firstWordNumber = profile.faSpelling ? 3 : 2
  const reviewDue = dueReviewQuestions().length
  const reviewHistory = reviewStates()
  const retrieved = reviewHistory.filter((state) => state.successfulRetrievals > 0).length
  const retained = reviewHistory.filter(isRetained).length
  const nextUnit = vocabUnits.find((unit) => unitDoneCount(unit) < unit.words.length)
  const nextStep =
    reviewDue > 0
      ? {
          to: '/repetition',
          title: 'Tag en kort repetition',
          meta: `${reviewDue} ${reviewDue === 1 ? 'opgave venter' : 'opgaver venter'}`,
        }
      : cleared < ALPHABET_TOTAL
      ? {
          to: '/lesson/alphabet',
          title: cleared === 0 ? 'Start med alfabetet' : 'Fortsæt med alfabetet',
          meta: `${ALPHABET_TOTAL - cleared} tegn tilbage`,
        }
      : profile.faSpelling && !isNameLessonDone()
        ? { to: '/lesson/navn', title: 'Fortsæt med dit navn', meta: 'Læs og skriv dit eget navn' }
        : nextUnit
          ? {
              to: `/lesson/ord/${nextUnit.id}`,
              title: `Fortsæt med ${nextUnit.title.toLocaleLowerCase('da')}`,
              meta: `${nextUnit.words.length - unitDoneCount(nextUnit)} ord tilbage`,
            }
          : { to: '/lesson/ord/1/skriv', title: 'Øv din skrivning', meta: 'Gentag en kort skriverunde' }

  return (
    <main className="home">
      <RuledSection>
        <header className="home__masthead">
          <h1 className="home__title">Lær persisk skrift</h1>
          <SettingsCorner
            name={profile.name}
            faSpelling={profile.faSpelling}
            onSave={handleNameSave}
            onDelete={handleNameDelete}
          />
          <Link className="home__continue" to={nextStep.to}>
            <span className="home__continue-label">Fortsæt</span>
            <strong>{nextStep.title}</strong>
            <span>{nextStep.meta}</span>
          </Link>
        </header>
        <div className="home__workspace">
          <section className="home__hero" aria-label="Dagens persiske eksempel">
            <SplitCard
              word={DEMO_WORD}
              greetingEntry={profile.faSpelling ? GREETING_WITH_NAME_ENTRY : GREETING_ENTRY}
              personalSpelling={profile.faSpelling}
              daGreeting={daGreeting(profile.name)}
            />
            <StreakLine streak={rewards.streak} />
            <RewardShelf level={rewards.level} stickers={rewards.stickers} />
          </section>
          <section className="home__learning" aria-labelledby="home-lessons">
            <h2 className="home__lessons" id="home-lessons" lang="da">
              Lektioner
            </h2>
            {reviewHistory.length > 0 && (
              <p className="home__review-summary">
                {reviewHistory.length} mødt · {retrieved} husket mindst én gang · {retained} husket over tid
                {reviewDue > 0 ? ` · ${reviewDue} venter nu` : ''}
              </p>
            )}
            <div className="home__lesson-grid">
              {reviewDue > 0 && (
                <LessonCard
                  number={0}
                  title="Kort repetition"
                  summary="Cirka fem minutter — det, der venter, kommer først"
                  progress={`${reviewDue} ${reviewDue === 1 ? 'opgave venter' : 'opgaver venter'}`}
                  to="/repetition"
                />
              )}
              <LessonCard
                number={1}
                title="Alfabetet"
                summary="Start her: læseretning, 32 bogstaver og seks vokaltegn"
                progress={`${cleared} af ${ALPHABET_TOTAL} set eller øvet`}
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
                  progress={`${unitDoneCount(unit)} af ${unit.words.length} ord gennemgået eller øvet`}
                  to={`/lesson/ord/${unit.id}`}
                />
              ))}
            </div>
            <Link className="home__word-bridges" to="/ord-der-ligner">
              <strong>Ord, der ligner</strong>
              <span>Se ord, som persisk og dansk deler</span>
            </Link>
            <TypingRounds faSpelling={profile.faSpelling} />
          </section>
        </div>
      </RuledSection>
    </main>
  )
}
