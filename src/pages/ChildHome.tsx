import { Link } from 'react-router-dom'
import { childMissions } from '../child/missions'
import { RuledSection } from '../components/RuledSection'
import { lessonImageForEntry, lessonImageUrl } from '../images/catalog'
import { PersianText } from '../components/PersianText'
import { CompactPhraseRow } from '../components/EntryRenderers'
import { LessonImage } from '../components/LessonImage'
import { PronLine } from '../components/PronLine'
import { conversationBasics } from '../lessons/conversation'
import { beginnerNumbers } from '../lessons/numbers'
import { findVocabUnit } from '../lessons/vocab'
import { ColorSwatch } from '../components/ColorSwatch'
import { getChildCollection } from '../progress/childCollection'
import './ChildJourney.css'
import './ChildNumbers.css'
import './ChildColors.css'
import './ChildAnimals.css'

const colorUnit = findVocabUnit('4')!
const animalUnit = findVocabUnit('5')!

function CardImage({ entryId }: { entryId: string }) {
  const image = lessonImageForEntry(entryId)!
  return (
    <span
      className="child-mission-card__image"
      aria-hidden="true"
      style={{
        backgroundImage: `url(${lessonImageUrl(image.cardSrc)})`,
        backgroundPosition: image.focalPoint,
      }}
    />
  )
}

function MissionGrid({
  missions,
  collectedIds,
  showImages,
}: {
  missions: typeof childMissions
  collectedIds: string[]
  showImages: boolean
}) {
  return (
    <div className="child-missions">
      {missions.map((mission) => {
        const collectedWord = collectedIds.includes(mission.id)
        const cardClass = showImages && mission.imageEntryId
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
            {showImages && mission.imageEntryId && (
              <CardImage entryId={mission.imageEntryId} />
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
  const showImages = !/AppleWebKit/.test(navigator.userAgent)
    || /(?:Chrome|Chromium|Edg|OPR|Android)/.test(navigator.userAgent)

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
          <MissionGrid
            missions={childMissions.slice(0, 4)}
            collectedIds={collectedIds}
            showImages={showImages}
          />
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
          <MissionGrid
            missions={childMissions.slice(4)}
            collectedIds={collectedIds}
            showImages={showImages}
          />
        </section>

        <section className="child-colors" aria-labelledby="child-colors-title">
          <h2 id="child-colors-title">Farver</h2>
          <Link className="child-colors__lesson" to="/lesson/ord/4">
            <span className="child-colors__swatches" aria-hidden="true">
              {colorUnit.words.map((word) => (
                word.swatch && <ColorSwatch key={word.id} color={word.swatch} />
              ))}
            </span>
            <span>
              <PersianText entry={colorUnit.titleEntry} />
              <strong>Lær otte farver</strong>
            </span>
          </Link>
        </section>

        <section className="child-colors child-animals" aria-labelledby="child-animals-title">
          <h2 id="child-animals-title">Dyr</h2>
          <Link className="child-animals__lesson" to="/lesson/ord/5">
            <div className="child-animals__title">
              <PersianText entry={animalUnit.titleEntry} />
              <PronLine {...animalUnit.titleEntry.pron} />
            </div>
            <div className="child-animals__photos">
              {animalUnit.words.slice(0, 4).map((word) => (
                <LessonImage key={word.id} entryId={word.entry.id} size="thumbnail" />
              ))}
            </div>
            <strong>Lær otte dyr</strong>
          </Link>
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
