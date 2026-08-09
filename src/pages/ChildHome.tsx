import { Link } from 'react-router-dom'
import { childMissions } from '../child/missions'
import { RuledSection } from '../components/RuledSection'
import { LessonImage } from '../components/LessonImage'
import { PersianText } from '../components/PersianText'
import { CompactPhraseRow } from '../components/EntryRenderers'
import { PronLine } from '../components/PronLine'
import { conversationBasics } from '../lessons/conversation'
import { beginnerNumbers } from '../lessons/numbers'
import { getChildCollection } from '../progress/childCollection'
import './ChildJourney.css'
import './ChildNumbers.css'

function MissionGrid({
  missions,
  collectedIds,
}: {
  missions: typeof childMissions
  collectedIds: string[]
}) {
  return (
    <div className="child-missions">
      {missions.map((mission, index) => {
        const collectedWord = collectedIds.includes(mission.id)
        const cardClass = mission.imageEntryId
          ? 'child-mission-card child-mission-card--image'
          : 'child-mission-card'
        return (
          <Link
            className={cardClass}
            key={mission.id}
            to={`/opdag/ord/${mission.id}`}
            aria-label={`Vælg ${mission.word.da}`}
            aria-describedby={`mission-pron-${mission.id}`}
          >
            {mission.imageEntryId && (
              <LessonImage entryId={mission.imageEntryId} eager={index === 0} />
            )}
            <div className="child-mission-card__label">
              <PersianText entry={mission.word.entry} marked />
              <strong>{mission.word.da}</strong>
              <PronLine id={`mission-pron-${mission.id}`} {...mission.word.pron} />
              <span>{collectedWord ? 'I din samling' : 'Byg ordet'}</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default function ChildHome() {
  const collectedIds = getChildCollection()
  const collected = childMissions.filter(({ id }) => collectedIds.includes(id))

  return (
    <main className="child-home" lang="da">
      <RuledSection>
        <header className="child-header">
          <div>
            <p className="child-eyebrow">Ordværksted</p>
            <h1>Vælg et persisk ord</h1>
          </div>
        </header>
        <section aria-label="Startord du kan vælge">
          <MissionGrid missions={childMissions.slice(0, 4)} collectedIds={collectedIds} />
        </section>

        <section className="child-conversation" aria-labelledby="child-conversation-title">
          <h2 id="child-conversation-title">Hils og præsenter dig</h2>
          <ol>
            {conversationBasics.map((entry) => (
              <li key={entry.id}>
                <CompactPhraseRow entry={entry} marked />
              </li>
            ))}
          </ol>
        </section>

        <section className="child-more" aria-labelledby="child-more-title">
          <h2 id="child-more-title">Flere enkle ord</h2>
          <MissionGrid missions={childMissions.slice(4)} collectedIds={collectedIds} />
        </section>

        <section className="child-numbers" aria-labelledby="child-numbers-title">
          <h2 id="child-numbers-title">Tal fra 1 til 10</h2>
          <ol>
            {beginnerNumbers.map(({ value, digit, word }) => (
              <li key={value}>
                <PersianText entry={digit} className="child-number__digit" />
                <CompactPhraseRow entry={word} marked />
              </li>
            ))}
          </ol>
        </section>

        <section className="child-collection" aria-labelledby="child-collection-title">
          <h2 id="child-collection-title">Mine persiske ord</h2>
          {collected.length === 0 ? (
            <p>Dit første ord venter ovenfor.</p>
          ) : (
            <ul>
              {collected.map((mission) => (
                <li key={mission.id}>
                  <CompactPhraseRow entry={mission.word.entry} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </RuledSection>
    </main>
  )
}
