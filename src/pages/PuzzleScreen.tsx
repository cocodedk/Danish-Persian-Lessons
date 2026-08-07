import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { Celebration } from '../components/Celebration'
import { ChallengeReveal } from '../components/EntryRenderers'
import { LearnerPersianInput } from '../components/LearnerPersianInput'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { PersianText } from '../components/PersianText'
import { PronLine, formatPron } from '../components/PronLine'
import { RetryActions } from '../components/RetryActions'
import { RewardOverlays } from '../components/RewardOverlays'
import { payPuzzle } from '../progress/puzzles'
import { findPuzzle } from '../puzzles/catalog'
import type { MissingTask, PuzzleTask } from '../puzzles/types'
import { useRoundOutcome } from '../components/useRoundOutcome'
import { useCelebration } from '../rewards/useCelebration'
import { useRevealInView } from '../components/useRevealInView'
import { useChallengeFocus } from '../components/useChallengeFocus'
import './puzzle.css'

function MissingPrompt({ task }: { task: MissingTask }) {
  const shown = [...task.entry.fa]
  shown[task.missingAt] = '□'
  return <PersianText entry={task.entry} display={shown.join('')} className="puzzle__word" />
}

function TaskPrompt({ task }: { task: PuzzleTask }) {
  if (task.kind === 'match') {
    return <PersianText entry={task.entry} className="puzzle__word" />
  }
  if (task.kind === 'missing') return <MissingPrompt task={task} />
  return (
    <div className="puzzle__meaning">
      <p>{task.entry.da}</p>
      <PronLine {...task.entry.pron} />
    </div>
  )
}

export default function PuzzleScreen() {
  const { id = '' } = useParams()
  const puzzle = findPuzzle(id)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [attempted, setAttempted] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const round = useRoundOutcome(puzzle?.tasks.length ?? 0)
  const celebration = useCelebration()
  const feedbackRef = useRevealInView(attempted)
  const [promptRef, focusPrompt] = useChallengeFocus<HTMLDivElement>()

  if (!puzzle) return <Navigate to="/" replace />
  const activePuzzle = puzzle
  const task = activePuzzle.tasks[index]

  // Buttons stay enabled after an attempt — disabling the focused control
  // would drop keyboard focus to <body> (same rule as ChoiceExercise). Taps
  // after the attempt simply do nothing.
  function answer(isCorrect: boolean, choiceId?: string) {
    if (attempted) return
    setSelectedChoice(choiceId ?? null)
    setAttempted(true)
    setCorrect(isCorrect)
    if (isCorrect) round.recordSuccess()
  }

  function retry() {
    setSelected([])
    setAttempted(false)
    setCorrect(false)
    setSelectedChoice(null)
    focusPrompt()
  }

  function advance() {
    if (index === activePuzzle.tasks.length - 1) {
      if (round.finish()) celebration.cheer(payPuzzle(activePuzzle.id))
      return
    }
    setIndex((value) => value + 1)
    retry()
  }

  function restart() {
    setIndex(0)
    round.reset()
    retry()
    // A replay is a fresh round: a page-flip earned by the previous completion
    // must not resurface on this one's finish screen. The gift stays — saving
    // it for later is the whole point of the card.
    celebration.levelSeen()
  }

  if (round.finished) {
    const completed = round.completed
    return (
      <LessonSheet className="lesson--task" title={activePuzzle.title} bar={<BarLink to={activePuzzle.backTo}>Til lektionen</BarLink>}>
        {completed ? (
          <Celebration reward={celebration.reward} tickLabel="Puslespillet er klaret" />
        ) : (
          <p>God pause. Du kan prøve hele puslespillet igen, når du har lyst.</p>
        )}
        <Button onClick={restart}>Spil igen</Button>
        <RewardOverlays celebration={celebration} />
      </LessonSheet>
    )
  }

  const ordered = task.kind === 'order' ? selected.map((tileId) => task.tiles.find((tile) => tile.id === tileId)?.glyph ?? '').join('') : ''

  return (
    <LessonSheet className="lesson--task" title={activePuzzle.title} bar={<BarLink to={activePuzzle.backTo}>Spring over</BarLink>}>
      <p className="puzzle__count">Lille pause {index + 1} af {activePuzzle.tasks.length}</p>
      <div ref={promptRef} tabIndex={-1} role="group" aria-label="Aktiv opgave">
        <TaskPrompt task={task} />
      </div>

      {task.kind === 'match' && (
        <div className="puzzle__choices">
          {task.choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              className={selectedChoice === choice.id ? 'puzzle__choice--selected' : undefined}
              aria-pressed={selectedChoice === choice.id}
              onClick={() => answer(choice.id === task.entry.id, choice.id)}
            >
              <span>{choice.da}</span>
              <span>{formatPron(choice.pron)}</span>
              {selectedChoice === choice.id && <strong>{correct ? '✓ Rigtigt' : 'Valgt'}</strong>}
            </button>
          ))}
        </div>
      )}

      {task.kind === 'missing' && (
        <div className="puzzle__choices puzzle__choices--letters" dir="rtl">
          {task.choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              className={selectedChoice === choice.id ? 'puzzle__choice--selected' : undefined}
              aria-label={choice.da}
              aria-pressed={selectedChoice === choice.id}
              onClick={() => answer(choice.fa === [...task.entry.fa][task.missingAt], choice.id)}
            >
              <PersianText entry={choice} ariaHidden />
              {selectedChoice === choice.id && (
                <span className="puzzle__choice-state">{correct ? '✓ Rigtigt' : 'Valgt'}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {task.kind === 'order' && (
        <>
          <LearnerPersianInput as="p" className="puzzle__assembled">{ordered}</LearnerPersianInput>
          <div className="puzzle__tiles" dir="rtl">
            {task.tiles.map((tile) => (
              <button
                key={tile.id}
                type="button"
                aria-label={tile.entry.da}
                aria-pressed={selected.includes(tile.id)}
                onClick={() =>
                  setSelected((items) => (items.includes(tile.id) ? items : [...items, tile.id]))
                }
              >
                <PersianText entry={tile.entry} display={tile.glyph} ariaHidden />
              </button>
            ))}
          </div>
          {!attempted && selected.length === task.tiles.length && (
            <Button onClick={() => answer(ordered === task.entry.fa)}>Se efter</Button>
          )}
        </>
      )}

      {/* A standing region, like the exercise screens': the reveal is
          announced when it appears instead of arriving unseen. */}
      <div ref={feedbackRef} className="puzzle__feedback" role="status" aria-live="polite">
        {attempted && <ChallengeReveal entry={task.entry} />}
      </div>
      {attempted && (
        <RetryActions
          className="puzzle__actions"
          solved={correct}
          onRetry={retry}
          onAdvance={advance}
          advanceLabel={index === activePuzzle.tasks.length - 1 ? 'Afslut pausen' : 'Næste'}
        />
      )}
    </LessonSheet>
  )
}
