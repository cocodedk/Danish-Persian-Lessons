// The moves both typing suites make: a fresh app at a hash, tapping keys on the
// on-screen keyboard by their Danish names, and walking a whole round. Test-only
// — not named *.test.tsx, so vitest collects nothing from it and nothing in the
// app imports it.
import { beforeEach } from 'vitest'
import { screen, render, fireEvent } from '@testing-library/react'
import App from '../App'
import { setProfile } from '../progress/profile'
import { markLetterDone, markOrientationSeen, markVowelDone } from '../progress/alphabet'
import { teachingOrder } from '../lessons/alphabet'
import { findVocabUnit } from '../lessons/vocab'
import { vowelMarks } from '../lessons/vowelMarks'
import { KEYBOARD_KEYS } from '../keyboard/layout'
import { PRAISE } from '../rewards/copy'

/** Registers the per-test reset: empty storage, no hash, no name. */
export function freshTypingState(): void {
  beforeEach(() => {
    window.localStorage.clear()
    window.location.hash = ''
    setProfile({})
    markOrientationSeen()
  })
}

/** Every letter and vowel mark cleared — the state after the whole alphabet. */
export function completeAlphabet(): void {
  for (const id of teachingOrder) markLetterDone(id)
  for (const mark of vowelMarks) markVowelDone(mark.id)
}

export function open(hash: string) {
  window.location.hash = hash
  return render(<App />)
}

export function tap(label: string): void {
  fireEvent.click(screen.getByRole('button', { name: label }))
}

/** The label the keyboard gives the key that writes `char`. */
export function keyFor(char: string): string {
  const key = KEYBOARD_KEYS.find((each) => each.glyph === char)
  if (!key) throw new Error(`no key writes "${char}"`)
  return key.label
}

/** Writes `text` the way a learner would: one key at a time, in order. */
export function write(text: string): void {
  for (const char of text) tap(keyFor(char))
}

/** What is currently on the writing line. */
export function written(container: HTMLElement): string {
  return container.querySelector('.type__written')?.textContent ?? ''
}

export function praiseOnScreen(): boolean {
  return PRAISE.some((line) => screen.queryAllByText(line.fa).length > 0)
}

/** Writes every word of a unit's round correctly, and closes the round. */
export function finishTypeRound(unitId: string): void {
  const unit = findVocabUnit(unitId)!
  unit.words.forEach((word, index) => {
    write(word.fa)
    tap('Se efter')
    tap(index === unit.words.length - 1 ? 'Afslut runden' : 'Næste')
  })
}
