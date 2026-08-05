import type { WordCard } from '../lessons/types'
import { FaSpecimen } from './FaSpecimen'
import { PronLine } from './PronLine'
import { DaWord } from './DaWord'
import { RuleDivider } from './RuleDivider'
import './SplitCard.css'

export interface SplitCardProps {
  word: WordCard
  /** Always «سلام!» in plan 001 — the Persian pane never renders Latin text. */
  faGreeting?: string
  /** "Hej {name}!" once a name exists, else "Hej!". */
  daGreeting?: string
}

/**
 * The split-screen shell: Persian pane on top (~55%, RTL, Naskh display),
 * a notebook-rule divider, Danish pane below. A thin composition of the
 * typography kit. See docs/design/ART-DIRECTION.md.
 *
 * The greetings belong to the forside. A word screen (plan 004) is the same
 * card with nothing above the word, so both lines are optional.
 */
export function SplitCard({ word, faGreeting, daGreeting }: SplitCardProps) {
  return (
    <section className="split-card">
      <div className="split-card__pane split-card__pane--fa" lang="fa" dir="rtl">
        {faGreeting && <p className="split-card__greeting">{faGreeting}</p>}
        <FaSpecimen fa={word.fa} faMarked={word.faMarked} />
        <PronLine da={word.pron.da} ipa={word.pron.ipa} />
      </div>

      <RuleDivider />

      <div className="split-card__pane split-card__pane--da" lang="da">
        {daGreeting && <p className="split-card__greeting">{daGreeting}</p>}
        <DaWord>{word.da}</DaWord>
      </div>
    </section>
  )
}
