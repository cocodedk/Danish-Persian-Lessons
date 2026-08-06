import { useState } from 'react'
import type { ReviewTask } from '../review/tasks'
import { Button } from './Button'
import { FullTeachingCard } from './EntryRenderers'
import { PersianText } from './PersianText'
import { PronLine } from './PronLine'
import { useRevealInView } from './useRevealInView'

function kindLabel(task: ReviewTask): string {
  if (task.mode === 'transfer') return 'Ny læsebro'
  if (task.question.entry.kind === 'word') return 'Nyt ord'
  if (task.question.entry.kind === 'mark') return 'Nyt vokaltegn'
  return 'Nyt tegn'
}

function MiniEntry({ task, answer }: { task: ReviewTask; answer: boolean }) {
  const choice = answer
    ? task.question.choices.find((item) => item.id === task.question.answerId)
    : task.question.choices.find(
        (item) => item.id !== task.question.answerId && item.entry.id !== task.question.entry.id,
      )
  if (!choice) return null
  return (
    <article className="guided-model__comparison-card">
      <strong>{answer ? 'Det nye' : 'Sammenlign med'}</strong>
      <PersianText entry={choice.entry} />
      <PronLine {...choice.entry.pron} />
      <span lang="da">{choice.entry.da}</span>
    </article>
  )
}

export function GuidedReviewModel({
  task,
  onReady,
  onStop,
}: {
  task: ReviewTask
  onReady: () => void
  onStop: () => void
}) {
  const [phase, setPhase] = useState<'model' | 'compare' | 'guide' | 'guided'>('model')
  const answer = task.question.choices.find((choice) => choice.id === task.question.answerId)!
  const hasComparison = task.question.choices.some(
    (choice) => choice.id !== task.question.answerId && choice.entry.id !== task.question.entry.id,
  )
  const title = `${kindLabel(task)}: ${task.question.entry.da}`
  const revealRef = useRevealInView(phase === 'model' ? false : phase)

  return (
    <section className="guided-model" aria-labelledby="guided-model-title">
      <p className="review-session__count">Se først · øv med hjælp · prøv selv</p>
      <h2 id="guided-model-title">{title}</h2>
      <p>Se formen, lydhjælpen og betydningen, før svaret bliver skjult.</p>
      {task.supportEntries?.map((entry) => (
        <section className="guided-model__support" key={entry.id}>
          <h3>Et lille ord, du skal bruge</h3>
          <FullTeachingCard entry={entry} />
        </section>
      ))}
      <FullTeachingCard entry={task.question.entry} />
      {phase === 'model' && (
        <Button onClick={() => setPhase(hasComparison ? 'compare' : 'guide')}>
          {hasComparison ? 'Se forskellen' : 'Øv med hjælp'}
        </Button>
      )}
      {phase !== 'model' && (
        <div ref={revealRef} className="guided-model__next">
          {hasComparison && (
            <section className="guided-model__comparison" aria-labelledby="guided-comparison-title">
              <h3 id="guided-comparison-title">Se forskellen</h3>
              <p>Læs begge lydlinjer, og læg mærke til formen og prikkerne.</p>
              <div className="guided-model__comparison-grid">
                <MiniEntry task={task} answer />
                <MiniEntry task={task} answer={false} />
              </div>
              {phase === 'compare' && <Button onClick={() => setPhase('guide')}>Øv med hjælp</Button>}
            </section>
          )}
          {(phase === 'guide' || phase === 'guided') && (
            <section className="guided-model__guide" aria-labelledby="guided-action-title">
              <h3 id="guided-action-title">Prøv med hjælp</h3>
              <p>{task.question.promptDa}</p>
              {phase === 'guide' ? (
                <Button onClick={() => setPhase('guided')}>
                  Peg på svaret med hjælp:{' '}
                  <span lang={task.question.choiceLang === 'da' ? 'da' : 'fa'} dir="auto">{answer.glyph}</span>
                </Button>
              ) : (
                <>
                  <p role="status">Godt. Nu skjuler vi hjælpen, så du kan hente svaret frem selv.</p>
                  <Button onClick={onReady}>Prøv uden hjælp</Button>
                </>
              )}
            </section>
          )}
        </div>
      )}
      <Button variant="quiet" onClick={onStop}>Stop for i dag</Button>
    </section>
  )
}
