import { useState } from 'react'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { ReviewSession } from '../components/ReviewSession'
import { Button } from '../components/Button'
import { reviewSessionTasks } from '../review/tasks'

export default function ReviewScreen() {
  const [allTasks] = useState(() => reviewSessionTasks())
  const [onlyReview, setOnlyReview] = useState(false)
  const dueTasks = allTasks.filter((task) => task.mode === 'due')
  const tasks = onlyReview ? dueTasks : allTasks
  const canChooseOnlyReview = dueTasks.length > 0 && allTasks.some((task) => task.mode !== 'due')
  return (
    <LessonSheet className="lesson--task" title="Kort repetition" bar={<BarLink to="/">Til forsiden</BarLink>}>
      {tasks.length > 0 ? (
        <>
          <p className="alphabet__lead">Cirka fem minutter og højst 12 korte opgaver. Det, der venter, kommer først; nyt stof bliver altid vist før opgaven.</p>
          {canChooseOnlyReview && !onlyReview && (
            <Button variant="quiet" onClick={() => setOnlyReview(true)}>Kun repetition</Button>
          )}
          <ReviewSession key={onlyReview ? 'due' : 'mixed'} initialTasks={tasks} />
        </>
      ) : (
        <section>
          <h2>Intet venter i dag</h2>
          <p>Du har ingen tidligere opgaver, der venter. Vælg den korte session for at møde nyt stof med hjælp.</p>
          <Button onClick={() => setOnlyReview(false)}>Start kort session</Button>
        </section>
      )}
    </LessonSheet>
  )
}
