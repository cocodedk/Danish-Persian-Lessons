import type { WordCard } from '../lessons/types'
import { FaSpecimen } from './FaSpecimen'
import { PronLine } from './PronLine'
import { DaWord } from './DaWord'
import { RuleDivider } from './RuleDivider'
import './SplitCard.css'
import type { PersianEntry } from '../catalog/types'
import { PersianText } from './PersianText'
import { PersonalNameText } from './PersonalName'

export interface SplitCardProps {
  word: WordCard
  /** Always «سلام!» in plan 001 — the Persian pane never renders Latin text. */
  greetingEntry?: PersianEntry
  personalSpelling?: string
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
export function SplitCard({ word, greetingEntry, personalSpelling, daGreeting }: SplitCardProps) {
  return (
    <section className="split-card">
      {/* The pane keeps its RTL base direction so the greeting's pieces —
          catalog phrase, learner name, «!» — lay out in reading order; the
          Persian text nodes inside carry their own lang. */}
      <div className="split-card__pane split-card__pane--fa" dir="rtl">
        {greetingEntry && (
          <div className="split-card__greeting">
            <PersianText entry={greetingEntry} />
            {personalSpelling && (
              <>
                {' '}
                <PersonalNameText spelling={personalSpelling} />!
              </>
            )}
            <PronLine {...greetingEntry.pron} />
          </div>
        )}
        <FaSpecimen entry={word.entry} />
        <PronLine {...word.pron} />
      </div>

      <RuleDivider />

      <div className="split-card__pane split-card__pane--da" lang="da">
        {daGreeting && <p className="split-card__greeting">{daGreeting}</p>}
        <DaWord>{word.da}</DaWord>
      </div>
    </section>
  )
}
