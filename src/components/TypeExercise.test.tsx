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
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TypeExercise, type TypeTask } from './TypeExercise'
import { TYPE_WORDS_ENTRY } from '../content/faStrings'
import { DEMO_WORD } from '../content/demoWord'

const task: TypeTask = { id: 'ab', entry: DEMO_WORD.entry, promptDa: 'Skriv ordet »vand«', answer: 'آب' }

function renderExercise() {
  return render(
    <TypeExercise
      title="Skriv ordene"
      eyebrowEntry={TYPE_WORDS_ENTRY}
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

describe('beginner reveal', () => {
  it('hides the answer until checking, then teaches it with optional retry and next', () => {
    renderExercise()
    expect(screen.queryByText(DEMO_WORD.fa)).not.toBeInTheDocument()

    markWrong()
    expect(screen.getAllByText(DEMO_WORD.fa).length).toBeGreaterThan(0)
    expect(screen.getByText(DEMO_WORD.da)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Prøv én gang til' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Afslut runden' })).toBeInTheDocument()
  })
})

describe('an unfinished round', () => {
  it('can be closed without paying, and says only right answers were kept', () => {
    const onComplete = vi.fn()
    render(
      <TypeExercise
        title="Skriv ordene"
        eyebrowEntry={TYPE_WORDS_ENTRY}
        bar={<a href="#/">Til lektionen</a>}
        tasks={[task]}
        onCorrect={() => undefined}
        onComplete={onComplete}
        doneLine="Du skrev hele runden igennem."
      />,
    )
    markWrong()
    fireEvent.click(screen.getByRole('button', { name: 'Afslut runden' }))

    expect(onComplete).not.toHaveBeenCalled()
    expect(
      screen.getByText('Runden er slut. Kun de rigtige svar er markeret som lært.'),
    ).toBeInTheDocument()
    expect(screen.queryByText('Runden er klaret')).not.toBeInTheDocument()
  })
})
