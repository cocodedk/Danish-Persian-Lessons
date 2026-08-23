import { useState } from 'react'
import type { BuildQuestion } from '../lessons/countingRuleTypes'
import { isBuildSolved } from '../lessons/countingRuleExercises'
import { Button } from './Button'
import { Celebration } from './Celebration'
import { ChallengeReveal, CompactPhraseRow } from './EntryRenderers'
import { PersianText } from './PersianText'
import { RetryActions } from './RetryActions'
import { TRY_AGAIN_ENTRY } from '../content/faStrings'
import type { Reward } from '../rewards/types'
import { useChallengeFocus } from './useChallengeFocus'
import { useRevealInView } from './useRevealInView'
import { useRoundOutcome } from './useRoundOutcome'
import './ChoiceExercise.css'

export interface CompositionExerciseProps {
  questions: BuildQuestion[]
  /** Fires the first time an assembly is built right, with the item's id. */
  onCorrect: (itemId: string) => Reward | void
  /** Fires once, when the last assembly is closed. */
  onComplete: () => Reward | void
}

/**
 * The `byg` round: a Danish prompt, a pool of Persian parts in an
 * answer-blind order, and nothing else until the learner checks. Picking a
 * part costs nothing and can be undone; a wrong check costs nothing either —
 * it says «دوباره», reveals the whole number and offers another try, per
 * CLAUDE.md's generosity rule. There is no score and no timer.
 *
 * Stop and every other way out of the round belong to the screen that renders
 * this component (plan 017 lists retry, reveal and stop together; only the
 * first two are this component's to own).
 */
export function CompositionExercise({ questions, onCorrect, onComplete }: CompositionExerciseProps) {
  const [index, setIndex] = useState(0)
  const [placed, setPlaced] = useState<string[]>([])
  const [solved, setSolved] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const round = useRoundOutcome(questions.length)
  const [reward, setReward] = useState<Reward | null>(null)
  const feedbackRef = useRevealInView(attempted)
  const [promptRef, focusPrompt] = useChallengeFocus<HTMLHeadingElement>()

  if (questions.length === 0) {
    return (
      <div className="choice-exercise choice-exercise__done">
        <p>Der er ingen tal at bygge her lige nu.</p>
      </div>
    )
  }

  const question = questions[index]
  const isLast = index === questions.length - 1
  const ready = placed.length === question.parts.length

  function toggle(tokenId: string) {
    if (attempted) return
    setPlaced((current) =>
      current.includes(tokenId)
        ? current.filter((id) => id !== tokenId)
        : [...current, tokenId],
    )
  }

  function check() {
    if (attempted || !ready) return
    setAttempted(true)
    if (!isBuildSolved(question, placed)) return
    setSolved(true)
    round.recordSuccess()
    setReward(onCorrect(question.itemId) ?? null)
  }

  function advance() {
    if (isLast) {
      if (round.finish()) setReward(onComplete() ?? null)
      return
    }
    setIndex((current) => current + 1)
    setPlaced([])
    setSolved(false)
    setAttempted(false)
    setReward(null)
  }

  if (round.finished) {
    return (
      <div className="choice-exercise choice-exercise__done">
        {round.completed && <Celebration reward={reward} tickLabel="Runden er klaret" />}
        <p>
          {round.completed
            ? 'Du byggede hele runden. Alt, du klarede, står stadig på lektionen.'
            : 'Runden er slut. Kun de tal, du byggede, er markeret som øvet.'}
        </p>
      </div>
    )
  }

  return (
    <div className="choice-exercise">
      <p className="choice-exercise__count">
        Opgave {index + 1} af {questions.length}
      </p>

      <h2 ref={promptRef} tabIndex={-1} className="choice-exercise__prompt">
        {question.promptDa}
      </h2>

      {/* What the learner has laid out, in their own order. Read-only: the
          undo lives on the pool button, which never leaves the page. */}
      <ol className="choice-exercise__choices" aria-label="Dit tal indtil videre">
        {placed.map((tokenId) => {
          const token = question.tokens.find((candidate) => candidate.id === tokenId)
          return token ? (
            <li key={tokenId} className="choice-exercise__choice">
              <PersianText entry={token.entry} display={token.glyph} />
            </li>
          ) : null
        })}
      </ol>

      <ul className="choice-exercise__choices">
        {/* A part carries its Persian and nothing else: a Danish name — even
            an accessible one — would hand over the meaning the round asks
            for. The buttons also stay enabled after a check, exactly as
            ChoiceExercise's do, so focus never drops to <body>. */}
        {question.tokens.map((token) => {
          const spent = placed.includes(token.id)
          return (
            <li key={token.id}>
              <button
                type="button"
                className={`choice-exercise__choice ${
                  spent ? 'choice-exercise__choice--selected' : ''
                }`}
                dir="rtl"
                aria-pressed={spent}
                onClick={() => toggle(token.id)}
              >
                <PersianText entry={token.entry} display={token.glyph} />
                {spent && <span className="choice-exercise__state">Valgt</span>}
              </button>
            </li>
          )
        })}
      </ul>

      {/* The check appears only once the parts are laid out — Button has no
          disabled state to borrow, and an offer that cannot be taken is worse
          than no offer. */}
      {!attempted && ready && <Button onClick={check}>Tjek tallet</Button>}

      <div ref={feedbackRef} className="choice-exercise__feedback" role="status" aria-live="polite">
        {attempted && <ChallengeReveal entry={question.entry} />}
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
            setPlaced([])
            setAttempted(false)
            focusPrompt()
          }}
          onAdvance={advance}
          advanceLabel={isLast ? 'Afslut runden' : 'Næste'}
        />
      )}
    </div>
  )
}
