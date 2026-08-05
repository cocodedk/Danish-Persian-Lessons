import type { Pron } from '../lessons/types'
import './PronLine.css'

/** Dansk lydskrift + IPA, both from lesson data — never improvised in the UI. */
export type PronLineProps = Pron

/** The one written form of a pronunciation: dansk lydskrift, then IPA in
 * brackets — for the rare spot (a button label) that cannot hold a PronLine. */
export function formatPron({ da, ipa }: Pron): string {
  return `${da} · [${ipa}]`
}

/**
 * Pronunciation, twice: dansk lydskrift first, IPA in brackets. Lives inside
 * the Persian pane but is Danish text, so it carries its own lang and dir.
 * See docs/design/ART-DIRECTION.md "Pronunciation line".
 */
export function PronLine(pron: PronLineProps) {
  return (
    <p className="pron-line" lang="da" dir="ltr">
      {formatPron(pron)}
    </p>
  )
}
