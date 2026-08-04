// The shape of the name lesson: who it exists for, the letter-by-letter
// walkthrough, and what it does with a sign it never taught. The exercise
// underneath — tapping the name back together — is nameLessonAssembly.test.tsx.
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { setProfile } from '../progress/profile'
import { nameLetters } from '../name/forms'
import { specimens } from '../lessons/alphabet'
import { freshAppPerTest, open, assemble, wantsLessMotion } from './nameLessonHarness'
import walkCss from '../components/NameWalkthrough.css?raw'
import assemblyCss from '../components/NameAssembly.css?raw'

freshAppPerTest()

describe('#/lesson/navn — write your name', () => {
  it('exists only for a learner who has a Persian spelling', () => {
    setProfile({ name: 'Sara' })
    open('#/lesson/navn')
    expect(screen.queryByRole('heading', { name: 'Skriv dit navn' })).not.toBeInTheDocument()
    expect(screen.getByText('Hej Sara!')).toBeInTheDocument()
  })

  it('walks the name letter by letter, each letter in the form it takes there', () => {
    setProfile({ name: 'Sara', faSpelling: 'سارا' })
    open('#/lesson/navn')

    expect(screen.getByRole('heading', { name: 'Skriv dit navn' })).toBeInTheDocument()
    expect(screen.getByText('نامِ خود را بنویس')).toBeInTheDocument()

    // One numbered step per letter, naming the letter and its position.
    // The same alef twice, in two different forms: bound after س, free after ر.
    expect(screen.getByText('Bogstav 1: sin står først')).toBeInTheDocument()
    expect(screen.getByText('Bogstav 2: alef står sidst')).toBeInTheDocument()
    expect(screen.getByText('Bogstav 3: re står alene')).toBeInTheDocument()
    expect(screen.getByText('Bogstav 4: alef står alene')).toBeInTheDocument()

    // The name as it grows, and the one-line why under each step.
    const grown = [...document.querySelectorAll('.name-walk__grown')].map((el) => el.textContent)
    expect(grown).toEqual(['س', 'سا', 'سار', 'سارا'])
    expect(screen.getAllByText(/binder videre til bogstavet efter/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/binder ikke til venstre/).length).toBeGreaterThan(0)
  })

  it('says how every letter of the name sounds, in the alphabet lesson’s own words', () => {
    setProfile({ name: 'Sara', faSpelling: 'سارا' })
    open('#/lesson/navn')

    const said = (letter: { sound?: { da: string; ipa: string } }) =>
      `${letter.sound?.da} · [${letter.sound?.ipa}]`
    const lines = [...document.querySelectorAll('.name-walk__step .pron-line')].map(
      (element) => element.textContent,
    )

    expect(lines).toEqual(nameLetters('سارا').map(said))
    // …and those words are the letter data's, not this screen's.
    expect(lines[0]).toBe(said(specimens.sin))
    expect(lines[2]).toBe(said(specimens.re))
  })

  it('names a sign outside the alphabet in Danish, never by printing the sign', () => {
    // لوئیزه (Louise) carries ئ, which the lesson never teaches. «Bogstav 3: ئ»
    // asks a beginner to read the very thing they cannot read yet.
    setProfile({ name: 'Louise', faSpelling: 'لوئیزه' })
    open('#/lesson/navn')

    expect(screen.getByText('Bogstav 3: særligt tegn står først')).toBeInTheDocument()
    expect(screen.getByText(/særligt tegn binder videre til bogstavet efter/)).toBeInTheDocument()
    expect(screen.getAllByLabelText('særligt tegn').length).toBeGreaterThan(0)
    expect(screen.queryByLabelText('ئ')).not.toBeInTheDocument()

    // It has no taught sound either, so the lesson claims none for it: five
    // pronunciation lines under six letters.
    expect(document.querySelectorAll('.name-walk__step')).toHaveLength(6)
    expect(document.querySelectorAll('.name-walk__step .pron-line')).toHaveLength(5)
  })

  it('under prefers-reduced-motion the lesson is whole and the reward still lands', () => {
    wantsLessMotion()
    setProfile({ name: 'Sara', faSpelling: 'سارا' })
    open('#/lesson/navn')

    expect(document.querySelectorAll('.name-walk__step')).toHaveLength(4)
    assemble('سارا')
    expect(screen.getByText('آفرین، سارا!')).toBeInTheDocument()
    expect(screen.getByLabelText('Klaret')).toBeInTheDocument()
  })

  it('drops the letter-by-letter animation under reduced motion without hiding a step', () => {
    const block = walkCss.slice(walkCss.indexOf('@media (prefers-reduced-motion: reduce)'))
    expect(block).toContain('animation: none')
    expect(block).not.toMatch(/display:\s*none|visibility:\s*hidden|opacity:\s*0\b/)
  })

  it('stacks the two languages of the gentle line instead of setting them side by side', () => {
    // jsdom computes no layout, so the decision is guarded at its source. Both
    // hint sentences are sentences; in a row they wrapped into each other at
    // phone width, RTL and LTR interleaved. See NameAssembly.css.
    const block = assemblyCss.slice(
      assemblyCss.indexOf('.name-assembly__again {'),
      assemblyCss.indexOf('.name-assembly__again ['),
    )
    expect(block).toContain('flex-direction: column')
    expect(block).not.toMatch(/flex-direction:\s*row|white-space:\s*nowrap/)
  })
})
