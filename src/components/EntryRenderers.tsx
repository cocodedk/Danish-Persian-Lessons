import { Link } from 'react-router-dom'
import type { PersianEntry } from '../catalog/types'
import { specimenIdForEntryId } from '../lessons/alphabet'
import { DaWord } from './DaWord'
import { FaSpecimen } from './FaSpecimen'
import { PersianText } from './PersianText'
import { PronLine } from './PronLine'
import { ReadingCues } from './ReadingCues'
import { OptionalAudioControl } from './OptionalAudioControl'
import './EntryRenderers.css'

/** The letter screen that teaches `entryId` — undefined when no screen does,
 * which DetailStrip renders as "no lesson to open". */
export function letterLessonPath(entryId: string): string | undefined {
  const specimenId = specimenIdForEntryId(entryId)
  return specimenId ? `/lesson/alphabet/bogstav/${specimenId}` : undefined
}

export function FullTeachingCard({ entry }: { entry: PersianEntry }) {
  return (
    <section className="entry-card" data-entry-id={entry.id}>
      <FaSpecimen entry={entry} />
      <PronLine {...entry.pron} />
      <OptionalAudioControl audioId={entry.audioId} />
      <DaWord>{entry.da}</DaWord>
      {entry.readingCues && <ReadingCues entry={entry} />}
    </section>
  )
}

export function CompactPhraseRow({ entry }: { entry: PersianEntry }) {
  return (
    <div className="entry-phrase" data-entry-id={entry.id}>
      <PersianText entry={entry} className="entry-phrase__fa" />
      <PronLine {...entry.pron} />
      <OptionalAudioControl audioId={entry.audioId} />
      {/* Danish keeps its own direction even inside an RTL frame (the Kit's
          mirrored sample), like PronLine does. */}
      <span lang="da" dir="ltr">
        {entry.da}
      </span>
    </div>
  )
}

export interface DetailStripProps {
  entry: PersianEntry
  to?: string
  className?: string
  /** Announce updates to assistive tech. For deliberate browse selections
   * (the lesson indexes) — never for strips that change on every keystroke
   * or tile tap, where the announcements would drown the exercise. */
  live?: boolean
}

export function DetailStrip({ entry, to, className = '', live }: DetailStripProps) {
  return (
    <aside
      className={`entry-detail ${className}`}
      aria-live={live ? 'polite' : undefined}
      data-entry-id={entry.id}
    >
      <PersianText entry={entry} className="entry-detail__fa" />
      <div className="entry-detail__help">
        <PronLine {...entry.pron} />
        <OptionalAudioControl audioId={entry.audioId} />
        <span lang="da" dir="ltr">
          {entry.da}
        </span>
      </div>
      {to && (
        <Link className="entry-detail__link" to={to}>
          Åbn hele lektionen
        </Link>
      )}
    </aside>
  )
}

export function ChallengeReveal({ entry }: { entry: PersianEntry }) {
  return (
    <div className="entry-reveal">
      <h3 className="entry-reveal__label">Se hele tegnet eller ordet</h3>
      <FullTeachingCard entry={entry} />
    </div>
  )
}
