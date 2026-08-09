import { Link } from 'react-router-dom'
import { childMissions } from '../child/missions'
import { RuledSection } from '../components/RuledSection'
import { LessonImage } from '../components/LessonImage'
import { PersianText } from '../components/PersianText'
import { CompactPhraseRow } from '../components/EntryRenderers'
import { AreaNav } from '../components/AreaNav'
import { getChildCollection } from '../progress/childCollection'
import './ChildJourney.css'

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
        <AreaNav />

        <section className="child-missions" aria-label="Ord du kan vælge">
          {childMissions.map((mission, index) => {
            const collectedWord = collectedIds.includes(mission.id)
            return (
              <Link
                className="child-mission-card"
                key={mission.id}
                to={`/opdag/ord/${mission.id}`}
                aria-label={`Vælg ${mission.word.da}`}
              >
                <LessonImage entryId={mission.imageEntryId} eager={index === 0} />
                <div className="child-mission-card__label">
                  <PersianText entry={mission.word.entry} marked />
                  <strong>{mission.word.da}</strong>
                  <span>{collectedWord ? 'I din samling' : 'Byg ordet'}</span>
                </div>
              </Link>
            )
          })}
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
