import { useState } from 'react'
import type { Question } from '../lessons/exercises'
import { FaSpecimen } from './FaSpecimen'
import { PronLine } from './PronLine'
import { ProgressTick } from './ProgressTick'
import { Button } from './Button'
import { TRY_AGAIN_FA, WELL_DONE_FA } from '../content/faStrings'
import './ChoiceExercise.css'

export interface ChoiceExerciseProps {
  questions: Question[]
  /** Fires the first time a question is answered right, with the letter's id. */
  onCorrect: (letterId: string) => void
  /** Fires once, when the last question is answered. Plan 007 hooks its rewards here. */
  onComplete: () => void
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

  const question = questions[index]
  const isLast = index === questions.length - 1

  function choose(choiceId: string) {
    if (solved) return
    if (choiceId === question.answerId) {
      setSolved(true)
      onCorrect(question.letterId)
      return
    }
    setMissed((tried) => (tried.includes(choiceId) ? tried : [...tried, choiceId]))
  }

  function advance() {
    if (isLast) {
      setFinished(true)
      onComplete()
      return
    }
    setIndex((current) => current + 1)
    setSolved(false)
    setMissed([])
  }

  if (finished) {
    return (
      <div className="choice-exercise choice-exercise__done">
        <p className="choice-exercise__praise" lang="fa" dir="rtl">
          {WELL_DONE_FA}
        </p>
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
      {question.promptFa && <FaSpecimen fa={question.promptFa} />}
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
                lang="fa"
                dir="rtl"
                onClick={() => choose(choice.id)}
              >
                {choice.glyph}
              </button>
            </li>
          )
        })}
      </ul>

      <div className="choice-exercise__feedback" role="status">
        {solved && (
          <p className="choice-exercise__right">
            <ProgressTick granted label="Rigtigt" />
            <span lang="fa" dir="rtl">
              {WELL_DONE_FA}
            </span>
          </p>
        )}
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
