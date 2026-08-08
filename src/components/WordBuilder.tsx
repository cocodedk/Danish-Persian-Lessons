import { useMemo, useRef, useState } from 'react'
import type { ChildMission, MissionTile } from '../child/missions'
import { tilesForMission } from '../child/missions'
import { PersianText } from './PersianText'
import { PronLine } from './PronLine'
import { Button } from './Button'
import './WordBuilder.css'

interface WordBuilderProps {
  mission: ChildMission
  guided: boolean
  onComplete: () => void
  onContinue: () => void
}

export function WordBuilder({ mission, guided, onComplete, onContinue }: WordBuilderProps) {
  const letters = useMemo(() => Array.from(mission.word.fa), [mission])
  const tiles = useMemo(() => tilesForMission(mission), [mission])
  const [placed, setPlaced] = useState<number[]>([])
  const [wrong, setWrong] = useState<MissionTile | null>(null)
  const [status, setStatus] = useState(guided ? 'Det næste tegn er markeret.' : 'Byg fra højre.')
  const groupRef = useRef<HTMLDivElement>(null)
  const nextIndex = placed.length

  function choose(tile: MissionTile) {
    if (wrong) return
    if (tile.targetIndex !== nextIndex) {
      setWrong(tile)
      setStatus(`Du valgte ${tile.glyph}. Et andet tegn kommer først.`)
      return
    }

    const nextPlaced = [...placed, tile.targetIndex]
    setPlaced(nextPlaced)
    if (nextPlaced.length === letters.length) {
      onComplete()
      return
    }
    setStatus(`${tile.glyph} er på plads.`)
  }

  function retry() {
    setWrong(null)
    setStatus(guided ? 'Det næste tegn er markeret.' : 'Prøv igen fra samme sted.')
    groupRef.current?.focus()
  }

  const available = tiles.filter((tile) => !placed.includes(tile.targetIndex))
  const built = placed.map((index) => letters[index]).join('')

  return (
    <section className="word-builder" aria-label={`Byg ${mission.word.da}`}>
      <p className="word-builder__instruction">
        {guided ? '1 af 2 · Følg markeringen fra højre.' : '2 af 2 · Byg ordet uden hjælp.'}
      </p>
      <div className="word-builder__slots" dir="rtl" aria-label={`Bygget: ${built || 'tomt'}`}>
        {letters.map((glyph, index) => (
          <span className="word-builder__slot" key={`${mission.id}-slot-${index}`}>
            {placed.includes(index) ? glyph : ''}
          </span>
        ))}
      </div>

      <div className="word-builder__tray" ref={groupRef} tabIndex={-1} aria-label="Tegn du kan vælge">
        {available.map((tile) => {
          const next = guided && tile.targetIndex === nextIndex
          const selectedWrong = wrong?.id === tile.id
          return (
            <button
              type="button"
              className={`word-builder__tile${next ? ' word-builder__tile--next' : ''}`}
              key={tile.id}
              aria-label={`Vælg ${tile.glyph}${next ? ', næste tegn' : ''}`}
              aria-pressed={selectedWrong}
              aria-disabled={wrong !== null}
              onClick={() => choose(tile)}
            >
              {tile.glyph}
              {next && <span className="visually-hidden">Næste tegn</span>}
            </button>
          )
        })}
      </div>

      <p className="word-builder__status" aria-live="polite">{status}</p>

      {wrong && (
        <div className="word-builder__reveal">
          <strong>Et andet tegn kommer først.</strong>
          <PersianText entry={mission.word.entry} marked />
          <PronLine {...mission.word.pron} />
          <span>{mission.word.da}</span>
          <div className="word-builder__recovery">
            <Button onClick={retry}>Prøv igen</Button>
            <Button variant="quiet" onClick={onContinue}>Gå videre</Button>
          </div>
        </div>
      )}
    </section>
  )
}
