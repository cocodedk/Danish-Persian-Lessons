// The moves both halves of the vocabulary-screens suite make: reset storage
// and the profile before each case, open a route on a fresh App, read whether
// praise is on screen, and walk a whole unit's word screens tapping "Jeg kan
// det". Test-only — the file is not named *.test.tsx, so vitest collects
// nothing from it and nothing in the app imports it. It exists so the two
// suites can stay under the line cap without keeping two copies of the same
// four helpers.
import { beforeEach } from 'vitest'
import { screen, render, fireEvent } from '@testing-library/react'
import App from '../App'
import { setProfile } from '../progress/profile'
import { markOrientationSeen } from '../progress/alphabet'
import { findVocabUnit } from '../lessons/vocab'
import { PRAISE } from '../rewards/copy'

/** Registers the per-test reset: empty storage, no hash, no name, orientation seen. */
export function freshVocabState(): void {
  beforeEach(() => {
    window.localStorage.clear()
    window.location.hash = ''
    setProfile({})
    markOrientationSeen()
  })
}

/** A fresh App at `hash`. */
export function open(hash: string) {
  window.location.hash = hash
  return render(<App />)
}

export function praiseOnScreen(): boolean {
  return PRAISE.some((line) => screen.queryAllByText(line.fa).length > 0)
}

/** Walks a unit's word screens and taps "Jeg kan det" on every one of them. */
export function clearWholeUnit(unitId: string): void {
  for (const word of findVocabUnit(unitId)!.words) {
    const view = open(`#/lesson/ord/${unitId}/${word.id}`)
    const button = screen.queryByRole('button', { name: 'Jeg kan det' })
    if (button) fireEvent.click(button)
    view.unmount()
  }
}
