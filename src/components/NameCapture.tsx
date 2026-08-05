import { useState, type FormEvent } from 'react'
import { CAPTURE_PROMPT_ENTRY } from '../content/faStrings'
import { RuledSection } from './RuledSection'
import { CompactPhraseRow } from './EntryRenderers'
import './NameCapture.css'

export interface NameCaptureProps {
  onSubmit: (name: string) => void
  onSkip: () => void
}

/**
 * First-run, skippable name capture. Skipping is permanent-quiet — the caller
 * is responsible for persisting a profile record either way, so the app
 * never asks again.
 */
export function NameCapture({ onSubmit, onSkip }: NameCaptureProps) {
  const [value, setValue] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(value)
  }

  return (
    <main className="name-capture">
      <RuledSection>
        <div className="name-capture__pane name-capture__pane--fa">
          <CompactPhraseRow entry={CAPTURE_PROMPT_ENTRY} />
        </div>

        <hr className="name-capture__rule" />

        <div className="name-capture__pane name-capture__pane--da" lang="da">
          <form onSubmit={handleSubmit}>
            <label htmlFor="learner-name">Hvad hedder du?</label>
            <input
              id="learner-name"
              name="learner-name"
              type="text"
              autoComplete="given-name"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Dit navn"
            />
            <p className="name-capture__hint">
              Så appen kan hilse på dig. Du kan altid ændre eller slette det senere.
            </p>
            <div className="name-capture__actions">
              <button type="submit">Gem</button>
              <button type="button" className="name-capture__skip" onClick={onSkip}>
                Spring over
              </button>
            </div>
          </form>
        </div>
      </RuledSection>
    </main>
  )
}
