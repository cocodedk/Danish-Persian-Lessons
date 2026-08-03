import { Link, Navigate } from 'react-router-dom'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { ProgressTick } from '../components/ProgressTick'
import { teachingOrder, specimens } from '../lessons/alphabet'
import { vowelMarks } from '../lessons/vowelMarks'
import { getAlphabetProgress, doneCount, ALPHABET_TOTAL } from '../progress/alphabet'
import './alphabet.css'

/**
 * The lesson index at #/lesson/alphabet: what there is, and how far the
 * learner got. Orientation opens it the first time and can be re-read any
 * time after that.
 */
export default function AlphabetLesson() {
  const progress = getAlphabetProgress()
  if (!progress.orientationSeen) {
    return <Navigate to="/lesson/alphabet/intro" replace />
  }

  const done = doneCount(progress)
  const marksDone = progress.marks.length

  return (
    <LessonSheet title="Alfabetet" bar={<BarLink to="/">Til forsiden</BarLink>}>
      <p className="alphabet__summary">
        <ProgressTick granted={done > 0} label="Klaret" />
        <span>
          {done} af {ALPHABET_TOTAL} klaret
        </span>
      </p>
      <p className="alphabet__lead">
        32 bogstaver, tegnet{' '}
        <span className="alphabet__lead-fa" lang="fa" dir="rtl">
          {specimens['alef-madde'].glyph}
        </span>{' '}
        og seks vokaltegn. Tag dem i den rækkefølge, du vil.
      </p>

      <h2 className="alphabet__section-title">Bogstaverne</h2>
      {/* The chart reads the way Persian does: آ ا ب … from the right. */}
      <ul className="alphabet__grid" dir="rtl">
        {teachingOrder.map((id) => {
          const specimen = specimens[id]
          const cleared = progress.letters.includes(id)
          return (
            <li key={id}>
              <Link
                className={`alphabet__cell ${cleared ? 'alphabet__cell--done' : ''}`}
                to={`/lesson/alphabet/bogstav/${id}`}
                aria-label={cleared ? `${specimen.name.da}, klaret` : specimen.name.da}
              >
                <span lang="fa" dir="rtl">
                  {specimen.glyph}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>

      <h2 className="alphabet__section-title">Vokaltegn</h2>
      <ul className="alphabet__links">
        <li>
          <Link className="alphabet__link" to="/lesson/alphabet/vokaltegn">
            De seks vokaltegn — {marksDone} af {vowelMarks.length} klaret
          </Link>
        </li>
      </ul>

      <h2 className="alphabet__section-title">Øvelser</h2>
      <ul className="alphabet__links">
        <li>
          <Link className="alphabet__link" to="/lesson/alphabet/ovelse/find">
            Find bogstavet
          </Link>
        </li>
        <li>
          <Link className="alphabet__link" to="/lesson/alphabet/ovelse/match">
            Match formerne
          </Link>
        </li>
        <li>
          <Link className="alphabet__link" to="/lesson/alphabet/intro">
            Læs introduktionen igen
          </Link>
        </li>
      </ul>
    </LessonSheet>
  )
}
