// The rule lesson's rounds (plan 017, fixpoint A item 3), on the real 21-99
// descriptor and a spy-wrapped copy of its real store — the questions are
// countingRuleExercises.test.ts and the tap-by-tap mechanics belong to the two
// exercise components, so this file is only the wiring: what each `:kind`
// puts on the page, what a nonsense kind does, what a whole `byg` round pays,
// and what the `byg` round keeps back until the learner has checked.
//
// The Persian, the lydskrift and the IPA these rows carry are candidate
// drafts, so nothing here asserts that any of them is right. What is asserted
// is that the target's own forms are *absent* before an attempt, and every
// glyph the test taps is read from the real builder rather than written out.
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { CountingRuleExerciseScreen } from './CountingRuleExerciseScreen'
import { counting21to99Lesson as lesson } from '../lessons/counting21to99'
import { counting21to99Progress as realStore } from '../progress/countingRules'
import type { CountingRuleStore } from '../progress/countingRules'
import {
  buildRuleBuildQuestions,
  RULE_BUILD_TITLE,
  RULE_RECOGNITION_TITLES,
} from '../lessons/countingRuleExercises'

const STOP_NOTE = 'Du kan stoppe når som helst. Det, du har øvet, bliver stående.'
/** Stands in for the lesson page, so «went back to the lesson» is observable. */
const LESSON_SENTINEL = 'lektionssiden'

let learn: ReturnType<typeof vi.fn<CountingRuleStore['learn']>>
let store: CountingRuleStore

beforeEach(() => {
  window.localStorage.clear()
  // A wrapper, not a spy on the singleton: the real store still does all the
  // recording, and no other suite inherits a patched module.
  learn = vi.fn((itemId: string) => realStore.learn(itemId))
  store = { ...realStore, learn }
})

function renderRound(kind: string) {
  return render(
    <MemoryRouter initialEntries={[`${lesson.path}/ovelse/${kind}`]}>
      <Routes>
        <Route
          path={`${lesson.path}/ovelse/:kind`}
          element={<CountingRuleExerciseScreen lesson={lesson} store={store} />}
        />
        <Route path={lesson.path} element={<p>{LESSON_SENTINEL}</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

/** A pool button printed with exactly `glyph`, that is not spent already. */
function freeToken(glyph: string): HTMLElement {
  const button = screen
    .getAllByRole('button')
    .find(
      (each) =>
        each.getAttribute('aria-pressed') === 'false'
        && (each.textContent ?? '').replace(/Valgt$/, '') === glyph,
    )
  expect(button, glyph).toBeDefined()
  return button!
}

describe('every round this lesson reserves', () => {
  const titles = [
    ['betydning', RULE_RECOGNITION_TITLES.betydning],
    ['tal', RULE_RECOGNITION_TITLES.tal],
    ['byg', RULE_BUILD_TITLE],
  ] as const

  it.each(titles)('names the round "%s" and costs nothing to leave', (kind, title) => {
    renderRound(kind)

    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
    // Stopping is always one tap away, and is promised in so many words.
    expect(screen.getByText(STOP_NOTE)).toBeVisible()
    expect(screen.getByRole('link', { name: 'Til lektionen' })).toHaveAttribute(
      'href',
      lesson.path,
    )
  })
})

describe('the two recognition rounds', () => {
  it('«Find betydningen» shows the number and keeps the sound of it back', () => {
    const { container } = renderRound('betydning')

    const specimen = container.querySelector('.fa-specimen')
    expect(specimen).toBeInTheDocument()
    expect(specimen).toBeVisible()
    // The pronunciation would say the answer out loud, so it waits for the
    // reveal after the attempt.
    expect(container.querySelector('.pron-line')).not.toBeInTheDocument()
  })

  it('«Find tallet» keeps the specimen off the page — it is the answer', () => {
    const { container } = renderRound('tal')

    expect(container.querySelector('.fa-specimen')).not.toBeInTheDocument()
  })
})

describe('a round this lesson does not reserve', () => {
  it('goes quietly back to the lesson instead of erroring', () => {
    renderRound('hop')

    expect(screen.getByText(LESSON_SENTINEL)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: RULE_BUILD_TITLE })).not.toBeInTheDocument()
    expect(learn).not.toHaveBeenCalled()
  })
})

describe('«Byg tallet» before the learner has checked', () => {
  it('prints nothing of the target but its parts and a Danish prompt', () => {
    const { container } = renderRound('byg')
    const first = buildRuleBuildQuestions(lesson)[0]
    const entry = first.entry
    const markup = container.innerHTML

    // The whole number, its marked form, both pronunciation aids and its
    // Danish meaning are reveal data. Read on the markup rather than the text,
    // so an accessible name or a title attribute cannot smuggle any of them
    // past, and so two adjacent token glyphs cannot be read as the whole word.
    for (const secret of [entry.fa, entry.faMarked, entry.pron.da, entry.pron.ipa, entry.da]) {
      expect(secret, 'reveal data').toBeTruthy()
      expect(markup, secret).not.toContain(secret!)
    }
    // What is allowed: the digits-only prompt and one button per token.
    expect(screen.getByRole('heading', { name: first.promptDa })).toBeInTheDocument()
    for (const token of first.tokens) {
      expect(markup, token.glyph).toContain(token.glyph)
    }
  })
})

describe('a whole «Byg tallet» round, built right every time', () => {
  it('pays each target once and mints nothing extra when the round closes', () => {
    renderRound('byg')
    const questions = buildRuleBuildQuestions(lesson)
    expect(questions.length).toBe(lesson.targets.length)

    questions.forEach((question, index) => {
      // The parts in spoken order: each one the first token still free that
      // carries that part's writing.
      for (const part of question.parts) fireEvent.click(freeToken(part.fa))
      fireEvent.click(screen.getByRole('button', { name: 'Tjek tallet' }))
      const last = index === questions.length - 1
      fireEvent.click(screen.getByRole('button', { name: last ? 'Afslut runden' : 'Næste' }))
    })

    // One payment per target, in lesson order, and each one a first claim.
    expect(learn).toHaveBeenCalledTimes(questions.length)
    expect(learn.mock.calls.map(([itemId]) => itemId)).toEqual(
      lesson.targets.map((target) => target.entry.id),
    )
    expect(learn.mock.results.map((result) => result.value)).toEqual(
      questions.map(() => 'item'),
    )
    // Closing the last assembly is not a second completion: the count above
    // is final, and four of this lesson's sixteen rows cannot finish it, so
    // nothing here has been paid the lesson's single page.
    expect(screen.getByText(/Du byggede hele runden/)).toBeInTheDocument()
    expect(learn).toHaveBeenCalledTimes(questions.length)

    // The lesson's own progress, on the lesson's own key, and only its rows.
    const progress = realStore.get()
    expect(progress.words).toEqual(lesson.targets.map((target) => target.entry.id))
    expect(progress.paid).toBe(false)
    expect(window.localStorage.getItem(`dpl.v1.${lesson.storageKey}`)).not.toBeNull()
  })
})
