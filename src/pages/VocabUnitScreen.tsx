import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { ProgressTick } from '../components/ProgressTick'
import { findVocabUnit } from '../lessons/vocab'
import { VOCAB_EXERCISE_TITLES } from '../lessons/vocabExercises'
import { getVocabProgress } from '../progress/vocab'
import './alphabet.css'
import './alphabetWide.css'
import './vocab.css'
import { CompactPhraseRow, DetailStrip } from '../components/EntryRenderers'
import { PersianText } from '../components/PersianText'
import { PuzzleBreakLink } from '../components/PuzzleBreakLink'
import { vocabularyGroups } from '../puzzles/catalog'
import { completedPuzzles } from '../progress/puzzles'
import { connectedPhrases, connectedTexts } from '../lessons/connectedReading'
import { ConnectedReadingLink } from '../components/ConnectedReadingLink'

/**
 * One vocabulary unit: every word in it, how far the learner got, and the two
 * rounds. No unit is ever locked and no word has to come before another — the
 * list is an offer, not a queue (CLAUDE.md, generosity).
 */
export default function VocabUnitScreen() {
  const { unit: unitId = '' } = useParams()
  const unit = findVocabUnit(unitId)
  const [selectedId, setSelectedId] = useState(unit?.words[0]?.id ?? '')
  // Read once per visit: nothing on this screen writes progress, and the
  // selection state re-renders it on every tile tap.
  const cleared = useMemo(() => (unit ? getVocabProgress(unit.id).words : []), [unit])
  const puzzleDone = useMemo(completedPuzzles, [])
  if (!unit) {
    return <Navigate to="/" replace />
  }

  const done = unit.words.filter((word) => cleared.includes(word.id)).length
  const groups = vocabularyGroups[unit.id]
  const selected = unit.words.find((word) => word.id === selectedId) ?? unit.words[0]

  return (
    <LessonSheet title={unit.title} bar={<BarLink to="/">Til forsiden</BarLink>}>
      <p className="alphabet__summary">
        <ProgressTick granted={done > 0} label="Gennemgået eller øvet" />
        <span>
          {done} af {unit.words.length} ord gennemgået eller øvet
        </span>
      </p>
      <CompactPhraseRow entry={unit.titleEntry} />
      <p className="alphabet__lead">{unit.summary}. Følg gerne grupperne, eller hop frit rundt.</p>

      <h2 className="alphabet__section-title">Ord for ord</h2>
      <div className="lesson-index">
        <DetailStrip
          entry={selected.entry}
          to={`/lesson/ord/${unit.id}/${selected.id}`}
          className="entry-detail--master"
          live
        />
        <div className="lesson-index__content">
          {groups.map((group) => (
            <section key={group.id} className="vocab__group">
              <h3>{group.title}</h3>
              <ul className="vocab__grid" dir="rtl">
                {group.itemIds.map((wordId) => {
                  const word = unit.words.find((item) => item.id === wordId)
                  if (!word) return null
                  return (
                    <li key={word.id}>
                      <button
                        type="button"
                        className={`vocab__cell ${cleared.includes(word.id) ? 'vocab__cell--done' : ''}`}
                        aria-pressed={selected.id === word.id}
                        onClick={() => setSelectedId(word.id)}
                      >
                        <PersianText entry={word.entry} className="vocab__cell-fa" ariaHidden />
                        <span className="vocab__cell-da" lang="da" dir="ltr">{word.da}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
              <PuzzleBreakLink puzzleId={group.puzzle.id} done={puzzleDone.includes(group.puzzle.id)} />
              <ConnectedReadingLink
                reading={connectedPhrases.find(
                  (reading) => reading.unitId === unit.id && reading.groupIndex === groups.indexOf(group),
                )!}
              />
            </section>
          ))}
          <h2 className="alphabet__section-title">Øvelser</h2>
          <ul className="alphabet__links">
            {Object.entries(VOCAB_EXERCISE_TITLES).map(([kind, title]) => (
              <li key={kind}>
                <Link className="alphabet__link" to={`/lesson/ord/${unit.id}/ovelse/${kind}`}>
                  {title}
                </Link>
              </li>
            ))}
            {/* The third round: writing the words on the Persian keyboard (plan 005). */}
            <li>
              <Link className="alphabet__link" to={`/lesson/ord/${unit.id}/skriv`}>
                Skriv ordene
              </Link>
            </li>
          </ul>
          <h2 className="alphabet__section-title">Læs sammenhængende</h2>
          <ConnectedReadingLink reading={connectedTexts.find((reading) => reading.unitId === unit.id)!} />
        </div>
      </div>
    </LessonSheet>
  )
}
