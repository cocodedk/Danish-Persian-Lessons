import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { ProgressTick } from '../components/ProgressTick'
import { specimens } from '../lessons/alphabet'
import { vowelMarks } from '../lessons/vowelMarks'
import { getAlphabetProgress, doneCount, ALPHABET_TOTAL } from '../progress/alphabet'
import './alphabet.css'
import './alphabetWide.css'
import { DetailStrip } from '../components/EntryRenderers'
import { PersianText } from '../components/PersianText'
import { PuzzleBreakLink } from '../components/PuzzleBreakLink'
import { alphabetGroups } from '../puzzles/catalog'
import { completedPuzzles } from '../progress/puzzles'

/**
 * The lesson index at #/lesson/alphabet: what there is, and how far the
 * learner got. Orientation opens it the first time and can be re-read any
 * time after that.
 */
export default function AlphabetLesson() {
  // Read once per visit: nothing on this screen writes progress, and the
  // selection state re-renders it on every tile tap.
  const [progress] = useState(getAlphabetProgress)
  const [puzzleDone] = useState(completedPuzzles)
  const [selectedId, setSelectedId] = useState(alphabetGroups[0].itemIds[0])
  if (!progress.orientationSeen) {
    return <Navigate to="/lesson/alphabet/intro" replace />
  }

  const done = doneCount(progress)
  const marksDone = progress.marks.length

  return (
    <LessonSheet title="Alfabetet" bar={<BarLink to="/">Til forsiden</BarLink>}>
      <p className="alphabet__summary">
        <ProgressTick granted={done > 0} label="Set eller øvet" />
        <span>
          {done} af {ALPHABET_TOTAL} set eller øvet
        </span>
      </p>
      <p className="alphabet__lead">
        32 bogstaver, tegnet{' '}
        <PersianText entry={specimens['alef-madde'].entry} className="alphabet__lead-fa" /> og seks
        vokaltegn. Rækkefølgen er anbefalet, men alt er åbent fra start.
      </p>

      <h2 className="alphabet__section-title">Tegn for tegn</h2>
      <div className="lesson-index">
        <DetailStrip
          entry={specimens[selectedId].entry}
          to={`/lesson/alphabet/bogstav/${selectedId}`}
          className="entry-detail--master"
          live
        />
        <div className="lesson-index__content">
          {alphabetGroups.map((group) => (
            <section key={group.id} className="alphabet__cluster">
              <h3>{group.title}</h3>
              <ul className="alphabet__grid" dir="rtl">
                {group.itemIds.map((id) => {
                  const specimen = specimens[id]
                  const cleared = progress.letters.includes(id)
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        className={`alphabet__cell ${cleared ? 'alphabet__cell--done' : ''}`}
                        aria-label={cleared ? `${specimen.name.da}, set eller øvet` : specimen.name.da}
                        aria-pressed={selectedId === id}
                        onClick={() => setSelectedId(id)}
                      >
                        <PersianText entry={specimen.entry} ariaHidden />
                      </button>
                    </li>
                  )
                })}
              </ul>
              <PuzzleBreakLink puzzleId={group.puzzle.id} done={puzzleDone.includes(group.puzzle.id)} />
            </section>
          ))}
          <h2 className="alphabet__section-title">Vokaltegn</h2>
          <ul className="alphabet__links">
            <li>
              <Link className="alphabet__link" to="/lesson/alphabet/vokaltegn">
                De seks vokaltegn — {marksDone} af {vowelMarks.length} set eller øvet
              </Link>
            </li>
          </ul>

          <h2 className="alphabet__section-title">Øvelser</h2>
          <ul className="alphabet__links">
            <li>
              <Link className="alphabet__link" to="/lesson/alphabet/ovelse/find">
                Find tegnet
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
        </div>
      </div>
    </LessonSheet>
  )
}
