import { useState, type ReactNode } from 'react'
import { LessonSheet } from './LessonSheet'
import { PronLine } from './PronLine'
import { Button } from './Button'
import { Celebration } from './Celebration'
import { PersianKeyboard } from './PersianKeyboard'
import { TypeMarks } from './TypeMarks'
import { press } from '../keyboard/buffer'
import { compare, type Divergence } from '../keyboard/diff'
import type { KeyDef } from '../keyboard/layout'
import type { Pron } from '../lessons/types'
import type { Reward } from '../rewards/types'
import './TypeExercise.css'

export interface TypeTask {
  id: string
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
  eyebrowFa: string
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
  const { title, eyebrowFa, bar, tasks, onCorrect, onComplete, help, doneLine, overlays } = props
  const [index, setIndex] = useState(0)
  const [buffer, setBuffer] = useState('')
  const [divergence, setDivergence] = useState<Divergence | null>(null)
  const [solved, setSolved] = useState(false)
  const [finished, setFinished] = useState(false)
  const [reward, setReward] = useState<Reward | null>(null)

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
    setReward(onCorrect(task.id) ?? null)
  }

  function advance() {
    if (isLast) {
      setFinished(true)
      setReward(onComplete() ?? null)
      return
    }
    setIndex((current) => current + 1)
    setBuffer('')
    setDivergence(null)
    setSolved(false)
    setReward(null)
  }

  if (finished) {
    return (
      <LessonSheet title={title} bar={bar}>
        <Celebration reward={reward} tickLabel="Runden er klaret" />
        <p className="type__note">{doneLine}</p>
        {overlays}
      </LessonSheet>
    )
  }

  return (
    <LessonSheet
      title={title}
      bar={bar}
      dock={
        <>
          {/* The line the learner writes on and the button beside it, sharing
              one row pinned directly above the keys — where a phone puts the
              field it is typing into, and where it cannot scroll away from
              the hand that is writing. The button floats rather than sits in
              a flex/grid row with the line: at least one engine in this
              build computes a wildly inflated auto cross-size for a flex or
              grid item whose own font-size is this large (reproduced with
              plain CSS grid too, independent of align-items) — float is the
              one layout mode that measured correctly. No input element
              anywhere near the line itself: the buffer is a string in
              state, so the phone's own keyboard has nothing to open over the
              lesson. Not a live region — announcing every keystroke would be
              noisier than helpful; the marking below is the one moment on
              this screen worth announcing. */}
          <div className="type__line-row">
            <div className="type__action">
              {solved ? (
                <Button onClick={advance}>{isLast ? 'Afslut runden' : 'Næste'}</Button>
              ) : (
                <Button onClick={check}>Se efter</Button>
              )}
            </div>
            <p className="type__line" lang="fa" dir="rtl">
              <span className="type__written">{buffer}</span>
              <span className="type__caret" aria-hidden="true" />
            </p>
          </div>
          {/* Beside the writing line it marks, inside the dock that never
              scrolls away — not on the sheet above, where the dock used to
              cover it (critic round 1: the mark was there but unreachable). */}
          {divergence && <TypeMarks attempt={buffer} divergence={divergence} />}
          {!solved && <PersianKeyboard onPress={handlePress} label="Persisk tastatur" />}
        </>
      }
    >
      <div className="type__meta">
        <p className="type__eyebrow" lang="fa" dir="rtl">
          {eyebrowFa}
        </p>
        {tasks.length > 1 && (
          <p className="type__count">
            Ord {index + 1} af {tasks.length}
          </p>
        )}
      </div>
      <h2 className="type__prompt">{task.promptDa}</h2>
      {task.pron && <PronLine da={task.pron.da} ipa={task.pron.ipa} />}
      {help}

      <p className="type__note">
        Du kan stoppe når som helst. Det, du har skrevet rigtigt, bliver stående.
      </p>

      {solved && <Celebration reward={reward} tickLabel="Rigtigt" />}
      {overlays}
    </LessonSheet>
  )
}
