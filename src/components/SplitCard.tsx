import type { WordCard } from '../lessons/types'
import './SplitCard.css'

export interface SplitCardProps {
  word: WordCard
  /** Always «سلام!» in plan 001 — the Persian pane never renders Latin text. */
  faGreeting: string
  /** "Hej {name}!" once a name exists, else "Hej!". */
  daGreeting: string
}

/**
 * The split-screen shell: Persian pane on top (~55%, RTL, Naskh display),
 * a notebook-rule divider, Danish pane below. See docs/design/ART-DIRECTION.md.
 */
export function SplitCard({ word, faGreeting, daGreeting }: SplitCardProps) {
  const renderedFa = word.faMarked ?? word.fa
  return (
    <section className="split-card">
      <div className="split-card__pane split-card__pane--fa" lang="fa" dir="rtl">
        <p className="split-card__greeting">{faGreeting}</p>
        <p
          className={
            renderedFa.includes('آ')
              ? 'split-card__word split-card__word--madde'
              : 'split-card__word'
          }
        >
          {renderedFa}
        </p>
        <p className="split-card__pron" lang="da" dir="ltr">
          {word.pron.da} · [{word.pron.ipa}]
        </p>
      </div>

      <hr className="split-card__rule" />

      <div className="split-card__pane split-card__pane--da" lang="da">
        <p className="split-card__greeting">{daGreeting}</p>
        <p className="split-card__word">{word.da}</p>
      </div>
    </section>
  )
}
