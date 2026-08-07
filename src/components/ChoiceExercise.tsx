import { useState } from 'react'
import type { Question } from '../lessons/exercises'
import { FaSpecimen } from './FaSpecimen'
import { PronLine } from './PronLine'
import { RetryActions } from './RetryActions'
import { Celebration } from './Celebration'
import { TRY_AGAIN_ENTRY } from '../content/faStrings'
import type { Reward } from '../rewards/types'
import { ChallengeReveal, CompactPhraseRow } from './EntryRenderers'
import { PersianText } from './PersianText'
import { useRoundOutcome } from './useRoundOutcome'
import { useRevealInView } from './useRevealInView'
import { useChallengeFocus } from './useChallengeFocus'
import './ChoiceExercise.css'

export interface ChoiceExerciseProps {
  questions: Question[]
  /** Fires the first time a question is answered right, with the item's id. */
  onCorrect: (itemId: string) => Reward | void
  /** Fires once, when the last question is answered. */
  onComplete: () => Reward | void
  showLessonImages?: boolean
}

/**
 * Tap the right letter. A wrong tap costs nothing: it says «دوباره», leaves
 * every choice open and keeps the ticks already earned — CLAUDE.md's
 * generosity rule. There is no score and no timer, by design.
 */
export function ChoiceExercise({
  questions,
  onCorrect,
  onComplete,
  showLessonImages,
}: ChoiceExerciseProps) {
  const [index, setIndex] = useState(0)
  const [solved, setSolved] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const round = useRoundOutcome(questions.length)
  const [reward, setReward] = useState<Reward | null>(null)
  const feedbackRef = useRevealInView(attempted)
  const [promptRef, focusPrompt] = useChallengeFocus<HTMLHeadingElement>()

  const question = questions[index]
  const isLast = index === questions.length - 1
  // Persian choices read right to left; the Danish meanings of plan 004's
  // vocabulary rounds read left to right. Nothing else about the round changes.
  const choiceLang = question.choiceLang ?? 'fa'
  const choiceDir = choiceLang === 'fa' ? 'rtl' : 'ltr'

  function choose(choiceId: string) {
    if (attempted) return
    setSelectedId(choiceId)
    if (choiceId === question.answerId) {
      setSolved(true)
      setAttempted(true)
      round.recordSuccess()
      setReward(onCorrect(question.itemId) ?? null)
      return
    }
    setAttempted(true)
  }

  function advance() {
    if (isLast) {
      if (round.finish()) setReward(onComplete() ?? null)
      return
    }
    setIndex((current) => current + 1)
    setSolved(false)
    setAttempted(false)
    setSelectedId(null)
    setReward(null)
  }

  if (round.finished) {
    return (
      <div className="choice-exercise choice-exercise__done">
        {round.completed && <Celebration reward={reward} tickLabel="Runden er klaret" />}
        <p>
          {round.completed
            ? 'Du kom hele runden igennem. Alt, du klarede, står stadig på lektionen.'
            : 'Runden er slut. Kun de svar, du fandt, er markeret som øvet.'}
        </p>
      </div>
    )
  }

  return (
    <div className="choice-exercise">
      <p className="choice-exercise__count">
        Spørgsmål {index + 1} af {questions.length}
      </p>

      <h2 ref={promptRef} tabIndex={-1} className="choice-exercise__prompt">{question.promptDa}</h2>
      {question.showsFa && <FaSpecimen entry={question.entry} />}
      <PronLine {...question.entry.pron} />

      <ul className="choice-exercise__choices">
        {question.choices.map((choice) => {
          const right = solved && choice.id === question.answerId
          const selected = selectedId === choice.id
          return (
            <li key={choice.id}>
              {/* The Persian glyph IS the accessible name — naming the choice
                  by its Danish meaning would hand a screen-reader user the
                  answer (plan 010: hide answer metadata while an attempt is
                  active). The buttons also stay enabled: choose() ignores taps
                  after an attempt, and disabling the focused button would drop
                  keyboard focus to <body>. */}
              <button
                type="button"
                className={`choice-exercise__choice ${
                  right ? 'choice-exercise__choice--right' : ''
                } ${selected ? 'choice-exercise__choice--selected' : ''}`}
                dir={choiceDir}
                lang={choiceLang === 'da' ? 'da' : undefined}
                aria-pressed={selected}
                onClick={() => choose(choice.id)}
              >
                {choiceLang === 'fa' ? (
                  <PersianText entry={choice.entry} display={choice.glyph} />
                ) : (
                  choice.glyph
                )}
                {selected && (
                  <span className="choice-exercise__state">
                    {right ? '✓ Rigtigt' : 'Valgt'}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>

      <div ref={feedbackRef} className="choice-exercise__feedback" role="status" aria-live="polite">
        {attempted && (
          <ChallengeReveal
            entry={question.entry}
            imageEntryId={showLessonImages ? question.entry.id : undefined}
          />
        )}
        {solved && <Celebration reward={reward} />}
        {attempted && !solved && (
          <div className="choice-exercise__again">
            <CompactPhraseRow entry={TRY_AGAIN_ENTRY} />
          </div>
        )}
      </div>

      {attempted && (
        <RetryActions
          solved={solved}
          onRetry={() => {
            setAttempted(false)
            setSelectedId(null)
            focusPrompt()
          }}
          onAdvance={advance}
          advanceLabel={isLast ? 'Afslut runden' : 'Næste'}
        />
      )}
    </div>
  )
}
