import { FullTeachingCard } from '../components/EntryRenderers'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { wordBridges } from '../lessons/wordBridges'
import './wordBridges.css'

/** A growing set of safe memory clues shared by Persian and Danish. */
export default function WordBridgesScreen() {
  return (
    <LessonSheet title="Ord, der ligner" bar={<BarLink to="/">Til forsiden</BarLink>}>
      <p className="word-bridges__lead">
        Nogle persiske og danske ord ligner hinanden. Nogle er i samme gamle familie.
        De kan hjælpe dig med at huske. Det er et spor, ikke en regel for alle ord.
      </p>

      <div className="word-bridges__list">
        {wordBridges.map((bridge) => (
          <article className="word-bridge" key={bridge.id}>
            <h2>{bridge.titleDa}</h2>
            <div className="word-bridge__pair">
              <FullTeachingCard entry={bridge.entry} showReadingCues={false} />
              <section className="word-bridge__danish" aria-label={`Det danske ord ${bridge.danish}`}>
                <span>Dansk</span>
                <strong>{bridge.danish}</strong>
              </section>
            </div>
            <p className="word-bridge__clue"><strong>Se:</strong> {bridge.clueDa}</p>
            <p className="word-bridge__meaning">{bridge.meaningDa}</p>
          </article>
        ))}
      </div>
    </LessonSheet>
  )
}
