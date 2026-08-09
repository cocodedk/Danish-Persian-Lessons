import { OptionalAudioControl } from '../components/OptionalAudioControl'
import { PersianText } from '../components/PersianText'
import type { WordBridge } from '../lessons/wordBridges'

export function WordBridgeRow({ bridge, featured = false }: { bridge: WordBridge; featured?: boolean }) {
  return (
    <details className="word-bridge" data-entry-id={bridge.entry.id} open={featured}>
      <summary className="word-bridge__summary">
        <span className="word-bridge__word word-bridge__word--fa">
          <span className="word-bridge__language">Persisk</span>
          <PersianText entry={bridge.entry} className="word-bridge__fa" />
          <span className="word-bridge__pron">{bridge.entry.pron.da}</span>
          <span className="word-bridge__gloss">{bridge.entry.da}</span>
        </span>
        <span className="word-bridge__span" aria-hidden="true"><span>↔</span></span>
        <span className="word-bridge__word word-bridge__word--da" lang="da" dir="ltr">
          <span className="word-bridge__language">Dansk</span>
          <strong className="word-bridge__da">{bridge.danish}</strong>
          <span className="word-bridge__gloss">{bridge.danishGlossDa}</span>
        </span>
      </summary>
      <div className="word-bridge__details">
        <p>
          <strong>Udtale</strong>
          <span>
            Persisk [{bridge.entry.pron.ipa}]
            {bridge.danishIpa && <> · dansk [{bridge.danishIpa}]</>}
          </span>
        </p>
        <p><strong>Se efter</strong><span>{bridge.clueDa}</span></p>
        <p><strong>Betydning</strong><span>{bridge.meaningDa}</span></p>
        <p><strong>Ordhistorie</strong><span>{bridge.historyDa}</span></p>
        <OptionalAudioControl audioId={bridge.entry.audioId} />
      </div>
    </details>
  )
}
