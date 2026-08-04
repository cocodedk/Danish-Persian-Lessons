import { Link, Navigate, useParams } from 'react-router-dom'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { ProgressTick } from '../components/ProgressTick'
import { findVocabUnit } from '../lessons/vocab'
import { VOCAB_EXERCISE_TITLES } from '../lessons/vocabExercises'
import { getVocabProgress } from '../progress/vocab'
import './alphabet.css'
import './vocab.css'

/**
 * One vocabulary unit: every word in it, how far the learner got, and the two
 * rounds. No unit is ever locked and no word has to come before another — the
 * list is an offer, not a queue (CLAUDE.md, generosity).
 */
export default function VocabUnitScreen() {
  const { unit: unitId = '' } = useParams()
  const unit = findVocabUnit(unitId)
  if (!unit) {
    return <Navigate to="/" replace />
  }

  const cleared = getVocabProgress(unit.id).words
  const done = unit.words.filter((word) => cleared.includes(word.id)).length

  return (
    <LessonSheet title={unit.title} bar={<BarLink to="/">Til forsiden</BarLink>}>
      <p className="alphabet__summary">
        <ProgressTick granted={done > 0} label="Klaret" />
        <span>
          {done} af {unit.words.length} ord klaret
        </span>
      </p>
      <p className="vocab__title-fa" lang="fa" dir="rtl">
        {unit.titleFa}
      </p>
      <p className="alphabet__lead">{unit.summary}. Tag ordene i den rækkefølge, du vil.</p>

      <h2 className="alphabet__section-title">Ord for ord</h2>
      {/* The list reads the way Persian does, from the right. */}
      <ul className="vocab__grid" dir="rtl">
        {unit.words.map((word) => (
          <li key={word.id}>
            <Link
              className={`vocab__cell ${cleared.includes(word.id) ? 'vocab__cell--done' : ''}`}
              to={`/lesson/ord/${unit.id}/${word.id}`}
            >
              <span className="vocab__cell-fa" lang="fa" dir="rtl">
                {word.fa}
              </span>
              <span className="vocab__cell-da" lang="da" dir="ltr">
                {word.da}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="alphabet__section-title">Øvelser</h2>
      <ul className="alphabet__links">
        {Object.entries(VOCAB_EXERCISE_TITLES).map(([kind, title]) => (
          <li key={kind}>
            <Link className="alphabet__link" to={`/lesson/ord/${unit.id}/ovelse/${kind}`}>
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </LessonSheet>
  )
}
