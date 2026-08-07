import type { PersianEntry, ReadingCue } from '../catalog/types'
import { PronLine } from './PronLine'
import './ReadingCues.css'

/** Contextual orthography help. Unlike alphabet tiles, these cues belong to
 * this exact word and may represent an unwritten vowel or a silent carrier. */
type HeadingLevel = 2 | 3 | 4

function CueHeading({ level }: { level: HeadingLevel }) {
  if (level === 2) return <h2>Læs trin for trin</h2>
  if (level === 3) return <h3>Læs trin for trin</h3>
  return <h4>Læs trin for trin</h4>
}

export function ReadingCues({ entry, headingLevel = 3 }: { entry: PersianEntry; headingLevel?: HeadingLevel }) {
  if (!entry.readingCues?.length) return null
  return <ReadingCueList cues={entry.readingCues} label={`Sådan læses ${entry.da}`} headingLevel={headingLevel} />
}

export function ReadingCueList({ cues, label, headingLevel = 3 }: { cues: ReadingCue[]; label: string; headingLevel?: HeadingLevel }) {
  return (
    <section className="reading-cues" aria-label={label}>
      <CueHeading level={headingLevel} />
      <ol className="reading-cues__list" dir="rtl">
        {cues.map((cue, index) => (
          <li className="reading-cues__cue" key={`${cue.start}-${cue.end}-${index}`}>
            <span className="reading-cues__glyph" lang="fa" dir="rtl">{cue.display}</span>
            {cue.pron && <PronLine {...cue.pron} />}
            <span className="reading-cues__help" lang="da" dir="ltr">{cue.helpDa}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
