import { useRef, useState } from 'react'
import {
  addLocalDays,
  introduceForReview,
  isRetained,
  recordReview,
  reviewStates,
  REVIEW_MAX_TASKS,
} from '../review/scheduler'
import type { ReviewTask } from '../review/tasks'
import { reviewDay } from '../review/days'
import { celebrate } from '../rewards/engine'
import type { Reward } from '../rewards/types'
import { Button } from './Button'
import { Celebration } from './Celebration'
import { ChallengeReveal } from './EntryRenderers'
import { FaSpecimen } from './FaSpecimen'
import { GuidedReviewModel } from './GuidedReviewModel'
import { PersianText } from './PersianText'
import { PronLine } from './PronLine'
import { useRevealInView } from './useRevealInView'
import './ReviewSession.css'

export function ReviewSession({ initialTasks }: { initialTasks: ReviewTask[] }) {
  const [queue, setQueue] = useState(initialTasks.slice(0, REVIEW_MAX_TASKS))
  const [index, setIndex] = useState(0)
  const [modeling, setModeling] = useState(initialTasks[0]?.mode !== 'due')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [reward, setReward] = useState<Reward | null>(null)
  const [finished, setFinished] = useState(false)
  const introduced = useRef(new Set<string>())
  const remembered = useRef(new Set<string>())
  const promptRef = useRef<HTMLHeadingElement>(null)
  const feedbackRef = useRevealInView(attempted)
  const task = queue[index]
  const question = task?.question

  function completeModel() {
    introduced.current.add(question.entry.id)
    // Completing the visible model is exposure, not retrieval or retention.
    introduceForReview(question.entry.id)
    setModeling(false)
    requestAnimationFrame(() => promptRef.current?.focus({ preventScroll: true }))
  }

  function retry() {
    setSelectedId(null)
    setAttempted(false)
    setCorrect(false)
    setReward(null)
    requestAnimationFrame(() => promptRef.current?.focus({ preventScroll: true }))
  }

  function requeueAfterInterveningMaterial() {
    setQueue((current) => {
      if (current.length >= REVIEW_MAX_TASKS) return current
      const following = current.slice(index + 1)
      const different = following.filter((item) => item.question.itemId !== question.itemId)
      if (different.length < 2 || following.some((item) => item.question.itemId === question.itemId)) {
        return current
      }
      const at = Math.min(index + 3, current.length)
      const recovery: ReviewTask = { ...task, mode: 'due' }
      return [...current.slice(0, at), recovery, ...current.slice(at)]
    })
  }

  function choose(choiceId: string) {
    if (attempted) return
    const isCorrect = choiceId === question.answerId
    setSelectedId(choiceId)
    setAttempted(true)
    setCorrect(isCorrect)
    recordReview(question.itemId, isCorrect ? 'correct' : 'wrong')
    if (isCorrect) {
      remembered.current.add(question.itemId)
      setReward(celebrate('answer'))
    } else requeueAfterInterveningMaterial()
  }

  function advance() {
    if (index >= queue.length - 1) return setFinished(true)
    const next = queue[index + 1]
    setIndex((value) => value + 1)
    setModeling(next.mode !== 'due')
    setSelectedId(null)
    setAttempted(false)
    setCorrect(false)
    setReward(null)
    requestAnimationFrame(() => promptRef.current?.focus({ preventScroll: true }))
  }

  if (finished) {
    const states = reviewStates()
    const retained = states.filter(isRetained).length
    const today = reviewDay(new Date())
    const tomorrow = today ? addLocalDays(today, 1) : ''
    const dueTomorrow = states.filter((state) => state.dueDay === tomorrow).length
    return (
      <section className="review-session review-session--done">
        <h2>Dagens repetition er færdig</h2>
        <p>{introduced.current.size} nyt introduceret.</p>
        <p>{remembered.current.size} husket i denne session.</p>
        <p>{retained} husket over tid · {dueTomorrow} venter i morgen.</p>
      </section>
    )
  }

  if (modeling) {
    return <GuidedReviewModel task={task} onReady={completeModel} onStop={() => setFinished(true)} />
  }

  const choiceLang = question.choiceLang ?? 'fa'
  return (
    <section className="review-session">
      <p className="review-session__count">Opgave {index + 1} af {queue.length}</p>
      <h2 ref={promptRef} className="review-session__prompt" tabIndex={-1}>{question.promptDa}</h2>
      {question.showsFa && <FaSpecimen entry={question.entry} />}
      {question.showsPron !== false && <PronLine {...question.entry.pron} />}
      <ul className="review-session__choices">
        {question.choices.map((choice) => {
          const selected = selectedId === choice.id
          const right = correct && choice.id === question.answerId
          return (
            <li key={choice.id}>
              <button
                type="button"
                className={`${selected ? 'review-session__choice--selected' : ''} ${right ? 'review-session__choice--right' : ''}`}
                lang={choiceLang === 'da' ? 'da' : undefined}
                dir={choiceLang === 'fa' ? 'rtl' : 'ltr'}
                aria-pressed={selected}
                onClick={() => choose(choice.id)}
              >
                {choiceLang === 'fa' ? <PersianText entry={choice.entry} display={choice.glyph} /> : choice.glyph}
                {selected && <strong>{right ? '✓ Husket' : 'Valgt'}</strong>}
              </button>
            </li>
          )
        })}
      </ul>
      <div ref={feedbackRef} className="review-session__feedback" role="status" aria-live="polite">
        {attempted && (
          <ChallengeReveal
            entry={question.entry}
            imageEntryId={question.entry.id}
          />
        )}
        {correct && <Celebration reward={reward} tickLabel="Husket" />}
        {attempted && !correct && <p>Nu har du hele hjælpen. Opgaven kommer igen efter noget andet — eller i morgen.</p>}
      </div>
      {attempted && (
        <div className="review-session__actions">
          <Button onClick={advance}>{index >= queue.length - 1 ? 'Afslut' : 'Fortsæt'}</Button>
          {!correct && <Button variant="quiet" onClick={retry}>Prøv igen nu</Button>}
          <Button variant="quiet" onClick={() => setFinished(true)}>Stop for i dag</Button>
        </div>
      )}
    </section>
  )
}
