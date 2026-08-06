import { useMemo, useState } from 'react'
import { LetterBank } from './LetterBank'
import { Button } from './Button'
import { assemblyBank, assembledPrefix, nameGlyphs, type Tile } from '../name/bank'
import { ASSEMBLE_ENTRY, NOT_IN_NAME_ENTRY, LATER_IN_NAME_DA } from '../name/copy'
import { TRY_AGAIN_ENTRY } from '../content/faStrings'
import { CompactPhraseRow, ChallengeReveal } from './EntryRenderers'
import { RetryActions } from './RetryActions'
import { PersonalNameText } from './PersonalName'
import { PersianText } from './PersianText'
import { nameLetters } from '../name/forms'
import { PronLine } from './PronLine'
import { useChallengeFocus } from './useChallengeFocus'
import './NameAssembly.css'

/** What the last wrong tap was: a letter of the name, or one of the strangers. */
type Missed = 'later' | 'stranger'

export interface NameAssemblyProps {
  spelling: string
  /** Called the moment the last letter lands. */
  onDone: () => void
}

/**
 * Put the name back together from a tray of its own letters and two strangers.
 * The letters join as they land, so the learner watches the shapes change the
 * way the walkthrough just explained. A wrong letter costs nothing: it simply
 * does not stick, and the line underneath says «دوباره» — try again.
 */
export function NameAssembly({ spelling, onDone }: NameAssemblyProps) {
  const target = useMemo(() => nameGlyphs(spelling), [spelling])
  const tiles = useMemo(() => assemblyBank(spelling), [spelling])
  const inName = useMemo(() => new Set(target), [target])
  const letters = useMemo(() => nameLetters(spelling), [spelling])
  const [placed, setPlaced] = useState<string[]>([])
  const [missed, setMissed] = useState<Missed | null>(null)
  const [skipped, setSkipped] = useState(false)
  const done = placed.length === target.length
  const missEntry = missed === 'later' ? TRY_AGAIN_ENTRY : NOT_IN_NAME_ENTRY
  const expected = letters[placed.length]
  const [promptRef, focusPrompt] = useChallengeFocus<HTMLHeadingElement>()

  function pick(tile: Tile) {
    if (done) return
    if (tile.glyph !== target[placed.length]) {
      setMissed(inName.has(tile.glyph) ? 'later' : 'stranger')
      return
    }
    const next = [...placed, tile.key]
    setMissed(null)
    setPlaced(next)
    if (next.length === target.length && !skipped) onDone()
  }

  function skipCurrent() {
    const tile = tiles.find(
      (candidate) => candidate.glyph === target[placed.length] && !placed.includes(candidate.key),
    )
    if (!tile) return
    setPlaced((current) => [...current, tile.key])
    setMissed(null)
    setSkipped(true)
  }

  return (
    <section className="name-assembly">
      <h2 ref={promptRef} tabIndex={-1} className="alphabet__section-title">Sæt navnet sammen igen</h2>
      <CompactPhraseRow entry={ASSEMBLE_ENTRY} />
      <p className="alphabet__note">
        Persisk skrives fra højre. Tryk derfor det første bogstav i navnet først. Det lander yderst
        til højre, og de næste stiller sig til venstre for det.
      </p>

      <PersonalNameText
        spelling={assembledPrefix(spelling, placed.length)}
        as="p"
        className="name__preview name-assembly__line"
      />

      {/* A standing region, like the exercise screens': the gentle line is
          announced when it appears instead of arriving unseen. It says which
          kind of wrong tap it was, because "try again" would send a learner
          hunting for a letter that is not in the tray to find. */}
      <div className="name-assembly__feedback" role="status">
        {missed !== null && !done && (
          <div className="name-assembly__again">
            <PersianText entry={missEntry} />
            <PronLine {...missEntry.pron} />
            <span lang="da">{missed === 'later' ? LATER_IN_NAME_DA : NOT_IN_NAME_ENTRY.da}</span>
          </div>
        )}
      </div>
      {missed !== null && expected?.entry && <ChallengeReveal entry={expected.entry} />}
      {missed !== null && !done && (
        <RetryActions
          className="name__actions"
          solved={false}
          onRetry={() => {
            setMissed(null)
            focusPrompt()
          }}
          onAdvance={skipCurrent}
          advanceLabel="Næste"
        />
      )}

      <LetterBank
        tiles={tiles}
        onPick={pick}
        label="Tryk bogstaverne i navnets rækkefølge"
        usedKeys={placed}
      />

      {placed.length > 0 && (!done || skipped) && (
        <div className="name__actions">
          <Button
            variant="quiet"
            onClick={() => {
              setPlaced([])
              setMissed(null)
              setSkipped(false)
            }}
          >
            {done ? 'Prøv hele navnet igen' : 'Start forfra'}
          </Button>
        </div>
      )}
    </section>
  )
}
