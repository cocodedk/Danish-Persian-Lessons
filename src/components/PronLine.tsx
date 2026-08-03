import type { Pron } from '../lessons/types'
import './PronLine.css'

/** Dansk lydskrift + IPA, both from lesson data — never improvised in the UI. */
export type PronLineProps = Pron

/**
 * Pronunciation, twice: dansk lydskrift first, IPA in brackets. Lives inside
 * the Persian pane but is Danish text, so it carries its own lang and dir.
 * See docs/design/ART-DIRECTION.md "Pronunciation line".
 */
export function PronLine({ da, ipa }: PronLineProps) {
  return (
    <p className="pron-line" lang="da" dir="ltr">
      {da} · [{ipa}]
    </p>
  )
}
