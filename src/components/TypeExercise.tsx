import { useState, type ReactNode } from 'react'
import { LessonSheet } from './LessonSheet'
import { PronLine } from './PronLine'
import { Button } from './Button'
import { RetryActions } from './RetryActions'
import { Celebration } from './Celebration'
import { PersianKeyboard } from './PersianKeyboard'
import { TypeMarks } from './TypeMarks'
import { press } from '../keyboard/buffer'
import { compare, type Divergence } from '../keyboard/diff'
import type { KeyDef } from '../keyboard/layout'
import type { Pron } from '../lessons/types'
import type { Reward } from '../rewards/types'
import type { PersianEntry } from '../catalog/types'
import { ChallengeReveal, CompactPhraseRow } from './EntryRenderers'
import { LearnerPersianInput } from './LearnerPersianInput'
import { PersonalNameCompanion, type PersonalName } from './PersonalName'
import { useRoundOutcome } from './useRoundOutcome'
import { useRevealInView } from './useRevealInView'
import { useChallengeFocus } from './useChallengeFocus'
import './TypeExercise.css'
import './TypeExerciseWide.css'

export interface TypeTask {
  id: string
  /** Catalog answer, except a learner's dynamic personal spelling. */
  entry?: PersianEntry
  personalName?: PersonalName
  /** What to write, asked in Danish. Never the Persian answer — that is the exercise. */
  promptDa: string
  /** How it sounds, twice: the bridge from the Danish word to the Persian one. */
  pron?: Pron
  /** What the learner has to write. */
  answer: string
}

export interface TypeExerciseProps {
  title: string
  /** The round's Persian name, under the title. */
  eyebrowEntry: PersianEntry
  bar: ReactNode
  tasks: TypeTask[]
  /** Fires every time a task is written correctly, with its id. */
  onCorrect: (taskId: string) => Reward | void
  /** Fires once, when the last task is written. */
  onComplete: () => Reward | void
  /** Optional disclosure under the prompt — the capstone's «see my name». */
  help?: ReactNode
  /** The closing line, once the round is through. */
  doneLine: string
  /**
   * The page-flip and the gift card. They ride inside the sheet rather than
   * beside it: the gift is a card laid on the paper, and a card rendered
   * outside the sheet would sit below the fold where nobody finds it.
   */
  overlays?: ReactNode
}

/**
 * Writing, not choosing: the learner reads a Danish word, hears it in the
 * pronunciation line, and writes the Persian on the keyboard docked in the
 * thumb zone. Nothing on this screen ever prints the answer.
 *
 * A wrong word costs nothing at all — the writing stays on the line, the marks
 * point at the first place it goes wrong, and the learner fixes that one letter
 * instead of starting over (docs/plans/005-persian-keyboard.md step 3).
 */
export function TypeExercise(props: TypeExerciseProps) {
  const { title, eyebrowEntry, bar, tasks, onCorrect, onComplete, help, doneLine, overlays } = props
  const [index, setIndex] = useState(0)
  const [buffer, setBuffer] = useState('')
  const [divergence, setDivergence] = useState<Divergence | null>(null)
  const [solved, setSolved] = useState(false)
  const [reward, setReward] = useState<Reward | null>(null)
  const round = useRoundOutcome(tasks.length)
  const feedbackRef = useRevealInView(solved || divergence !== null)
  const [promptRef, focusPrompt] = useChallengeFocus<HTMLHeadingElement>()
  const task = tasks[index]
  const isLast = index === tasks.length - 1

  function handlePress(key: KeyDef) {
    if (solved) return
    // The pen moves, so the old marking is stale — it goes the moment a key does.
    setDivergence(null)
    setBuffer((current) => press(current, key.kind, key.glyph))
  }

  function check() {
    const found = compare(buffer, task.answer)
    if (found.kind !== 'match') {
      setDivergence(found)
      return
    }
    setSolved(true)
    round.recordSuccess()
    setReward(onCorrect(task.id) ?? null)
  }

  function advance() {
    if (isLast) {
      if (round.finish()) setReward(onComplete() ?? null)
      return
    }
    setIndex((current) => current + 1)
    setBuffer('')
    setDivergence(null)
    setSolved(false)
    setReward(null)
  }

  if (round.finished) {
    return (
      <LessonSheet title={title} bar={bar}>
        {round.completed && (
          <Celebration
            reward={reward}
            tickLabel="Runden er klaret"
            personalName={task.personalName}
          />
        )}
        <p className="type__note">
          {round.completed ? doneLine : 'Runden er slut. Kun de rigtige svar er markeret som skrevet.'}
        </p>
        {overlays}
      </LessonSheet>
    )
  }

  return (
    <LessonSheet
      title={title}
      bar={bar}
      className="lesson--typing"
      dock={
        <>
          <div className="type__line-row">
            <div className="type__action">
              {solved ? (
                <Button onClick={advance}>{isLast ? 'Afslut runden' : 'Næste'}</Button>
              ) : (
                <Button onClick={check}>Se efter</Button>
              )}
            </div>
            <LearnerPersianInput as="p" className="type__line">
              <span className="type__written">{buffer}</span>
              <span className="type__caret" aria-hidden="true" />
            </LearnerPersianInput>
          </div>
          {divergence && <TypeMarks attempt={buffer} divergence={divergence} />}
          {!solved && !divergence && (
            <PersianKeyboard onPress={handlePress} label="Persisk tastatur" />
          )}
        </>
      }
    >
      <div className="type__meta">
        <CompactPhraseRow entry={eyebrowEntry} />
        {tasks.length > 1 && (
          <p className="type__count">
            Ord {index + 1} af {tasks.length}
          </p>
        )}
      </div>
      <h2 ref={promptRef} tabIndex={-1} className="type__prompt">{task.promptDa}</h2>
      {task.pron && <PronLine {...task.pron} />}
      {help}

      <p className="type__note">
        Du kan stoppe når som helst. Det, du har skrevet rigtigt, bliver stående.
      </p>

      <div ref={feedbackRef} className="type__reveal">
        {(solved || divergence) && task.entry && <ChallengeReveal entry={task.entry} />}
        {(solved || divergence) && task.personalName && (
          <PersonalNameCompanion
            spelling={task.personalName.spelling}
            original={task.personalName.original}
          />
        )}
        {solved && (
          <Celebration reward={reward} tickLabel="Rigtigt" personalName={task.personalName} />
        )}
        {divergence && !solved && (
          <RetryActions
            solved={false}
            // Only the marking goes — the writing stays on the line, so the
            // learner fixes the one letter instead of starting over.
            onRetry={() => {
              setDivergence(null)
              focusPrompt()
            }}
            onAdvance={advance}
            advanceLabel={isLast ? 'Afslut runden' : 'Næste'}
          />
        )}
      </div>
      {overlays}
    </LessonSheet>
  )
}
