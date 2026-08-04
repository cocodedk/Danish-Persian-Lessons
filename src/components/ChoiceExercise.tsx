import { useState } from 'react'
import type { Question } from '../lessons/exercises'
import { FaSpecimen } from './FaSpecimen'
import { PronLine } from './PronLine'
import { Button } from './Button'
import { Celebration } from './Celebration'
import { TRY_AGAIN_FA } from '../content/faStrings'
import type { Reward } from '../rewards/types'
import './ChoiceExercise.css'

export interface ChoiceExerciseProps {
  questions: Question[]
  /** Fires the first time a question is answered right, with the item's id. */
  onCorrect: (itemId: string) => Reward | void
  /** Fires once, when the last question is answered. */
  onComplete: () => Reward | void
}

/**
 * Tap the right letter. A wrong tap costs nothing: it says «دوباره», leaves
 * every choice open and keeps the ticks already earned — CLAUDE.md's
 * generosity rule. There is no score and no timer, by design.
 */
export function ChoiceExercise({ questions, onCorrect, onComplete }: ChoiceExerciseProps) {
  const [index, setIndex] = useState(0)
  const [solved, setSolved] = useState(false)
  const [missed, setMissed] = useState<string[]>([])
  const [finished, setFinished] = useState(false)
  const [reward, setReward] = useState<Reward | null>(null)

  const question = questions[index]
  const isLast = index === questions.length - 1
  // Persian choices read right to left; the Danish meanings of plan 004's
  // vocabulary rounds read left to right. Nothing else about the round changes.
  const choiceLang = question.choiceLang ?? 'fa'
  const choiceDir = choiceLang === 'fa' ? 'rtl' : 'ltr'

  function choose(choiceId: string) {
    if (solved) return
    if (choiceId === question.answerId) {
      setSolved(true)
      setReward(onCorrect(question.itemId) ?? null)
      return
    }
    setMissed((tried) => (tried.includes(choiceId) ? tried : [...tried, choiceId]))
  }

  function advance() {
    if (isLast) {
      setFinished(true)
      setReward(onComplete() ?? null)
      return
    }
    setIndex((current) => current + 1)
    setSolved(false)
    setMissed([])
    setReward(null)
  }

  if (finished) {
    return (
      <div className="choice-exercise choice-exercise__done">
        <Celebration reward={reward} tickLabel="Runden er klaret" />
        <p>Du kom hele runden igennem. Alt, du klarede, står stadig på lektionen.</p>
      </div>
    )
  }

  return (
    <div className="choice-exercise">
      <p className="choice-exercise__count">
        Spørgsmål {index + 1} af {questions.length}
      </p>

      <h2 className="choice-exercise__prompt">{question.promptDa}</h2>
      {question.promptFa && (
        <FaSpecimen fa={question.promptFa} faMarked={question.promptFaMarked} />
      )}
      <PronLine da={question.sound.da} ipa={question.sound.ipa} />

      <ul className="choice-exercise__choices">
        {question.choices.map((choice) => {
          const state = solved && choice.id === question.answerId ? 'right' : ''
          const tried = missed.includes(choice.id) ? 'choice-exercise__choice--missed' : ''
          return (
            <li key={choice.id}>
              <button
                type="button"
                className={`choice-exercise__choice ${tried} ${
                  state ? 'choice-exercise__choice--right' : ''
                }`}
                lang={choiceLang}
                dir={choiceDir}
                onClick={() => choose(choice.id)}
              >
                {choice.glyph}
              </button>
            </li>
          )
        })}
      </ul>

      <div className="choice-exercise__feedback" role="status">
        {solved && <Celebration reward={reward} />}
        {!solved && missed.length > 0 && (
          <p className="choice-exercise__again">
            <span lang="fa" dir="rtl">
              {TRY_AGAIN_FA}
            </span>
            <span> — prøv igen. Du mister ingenting.</span>
          </p>
        )}
      </div>

      {solved && <Button onClick={advance}>{isLast ? 'Afslut runden' : 'Næste'}</Button>}
    </div>
  )
}
