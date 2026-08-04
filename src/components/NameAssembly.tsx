import { useMemo, useState } from 'react'
import { LetterBank } from './LetterBank'
import { Button } from './Button'
import { assemblyBank, assembledPrefix, nameGlyphs, type Tile } from '../name/bank'
import { ASSEMBLE_FA } from '../name/copy'
import { TRY_AGAIN_FA } from '../content/faStrings'
import './NameAssembly.css'

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
  const [placed, setPlaced] = useState<string[]>([])
  const [missed, setMissed] = useState(false)
  const done = placed.length === target.length

  function pick(tile: Tile) {
    if (done) return
    if (tile.glyph !== target[placed.length]) {
      setMissed(true)
      return
    }
    const next = [...placed, tile.key]
    setMissed(false)
    setPlaced(next)
    if (next.length === target.length) onDone()
  }

  return (
    <section className="name-assembly">
      <h2 className="alphabet__section-title">Sæt navnet sammen igen</h2>
      <p className="name__ask" lang="fa" dir="rtl">
        {ASSEMBLE_FA}
      </p>
      <p className="alphabet__note">
        Persisk skrives fra højre. Tryk derfor det første bogstav i navnet først. Det lander yderst
        til højre, og de næste stiller sig til venstre for det.
      </p>

      <p className="name__preview name-assembly__line" lang="fa" dir="rtl">
        {assembledPrefix(spelling, placed.length)}
      </p>

      {/* A standing region, like the exercise screens': the gentle line is
          announced when it appears instead of arriving unseen. */}
      <div className="name-assembly__feedback" role="status">
        {missed && !done && (
          <p className="name-assembly__again">
            <span lang="fa" dir="rtl">
              {TRY_AGAIN_FA}
            </span>
            <span lang="da">
              Det bogstav kommer et andet sted i navnet. Prøv igen, du mister ingenting.
            </span>
          </p>
        )}
      </div>

      <LetterBank
        tiles={tiles}
        onPick={pick}
        label="Tryk bogstaverne i navnets rækkefølge"
        usedKeys={placed}
      />

      {placed.length > 0 && !done && (
        <div className="name__actions">
          <Button
            variant="quiet"
            onClick={() => {
              setPlaced([])
              setMissed(false)
            }}
          >
            Start forfra
          </Button>
        </div>
      )}
    </section>
  )
}
