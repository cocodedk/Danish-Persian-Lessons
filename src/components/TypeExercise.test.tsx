// The dock/live-region structure this fix depends on (critic round 1): the
// marking lives inside the sticky dock, not the scrolling sheet — which is
// what the dock covered at 360×640 when the marking lived in the sheet
// instead — and exactly one announcement surface exists once something is
// worth announcing. Direct render, no router or storage: both are structural
// facts about this one component, not about a whole screen.
//
// Pixel visibility itself is not jsdom-checkable — it computes no layout —
// and was verified in headless Chromium instead (see the plan's critic-round
// log). This is the regression guard that at least breaks a future test if
// the structure it depends on moves.
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TypeExercise, type TypeTask } from './TypeExercise'

const task: TypeTask = { id: 'ab', promptDa: 'Skriv ordet »vand«', answer: 'آب' }

function renderExercise() {
  return render(
    <TypeExercise
      title="Skriv ordene"
      eyebrowFa="کلمه‌ها را بنویس"
      bar={<a href="#/">Til lektionen</a>}
      tasks={[task]}
      onCorrect={() => undefined}
      onComplete={() => undefined}
      doneLine="Du skrev hele runden igennem."
    />,
  )
}

/** A wrong "Se efter" with nothing typed: a deterministic "missing" mark. */
function markWrong(): void {
  fireEvent.click(screen.getByRole('button', { name: 'Se efter' }))
}

describe('where the marking lives', () => {
  it('renders inside the sticky dock, never inside the scrolling sheet', () => {
    const { container } = renderExercise()
    markWrong()

    const dock = container.querySelector('.lesson-foot')
    const sheet = container.querySelector('.ruled-section')
    expect(dock?.querySelector('.type__feedback')).not.toBeNull()
    expect(sheet?.querySelector('.type__feedback')).toBeNull()
  })
})

describe('how many things announce themselves', () => {
  it('is none before anything has happened', () => {
    const { container } = renderExercise()
    expect(container.querySelectorAll('[aria-live], [role="status"]')).toHaveLength(0)
  })

  it('is exactly one once a wrong attempt is marked', () => {
    const { container } = renderExercise()
    markWrong()
    expect(container.querySelectorAll('[aria-live], [role="status"]')).toHaveLength(1)
  })
})
