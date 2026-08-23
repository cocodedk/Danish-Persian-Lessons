import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { ProgressTick } from '../components/ProgressTick'
import { Button } from '../components/Button'
import { Celebration } from '../components/Celebration'
import { RewardOverlays } from '../components/RewardOverlays'
import { DetailStrip } from '../components/EntryRenderers'
import { PersianText } from '../components/PersianText'
import { countingLesson } from '../lessons/countingLesson'
import { COUNTING_EXERCISE_TITLES } from '../lessons/countingExercises'
import { getCountingProgress, learnCountingItem } from '../progress/counting'
import { useCelebration } from '../rewards/useCelebration'
import './alphabet.css'
import './alphabetWide.css'
import './vocab.css'

/**
 * "Tæl til tyve": every number from one to twenty on one count-along page.
 * A tap is the primary action: it selects the number — updating the detail
 * strip with the full teaching card (digit, vocalized word, dansk lydskrift,
 * IPA and Danish meaning) — and, when the approved manifest has a clip for
 * that number, plays it at once. Numbers without an approved clip are
 * complete teaching rows that simply have no sound. A tap still writes
 * nothing: saying you have been through a number is a separate, deliberate
 * tap, so the count on this page stays honest. Nothing is ever locked
 * (plan 016).
 */
export default function CountingScreen() {
  const [cleared, setCleared] = useState(() => getCountingProgress().words)
  const [selectedValue, setSelectedValue] = useState(1)
  // The one word whose "done" was just earned here, so the moment belongs to
  // it alone: no second tick beside it, and none left behind when we move on.
  const [justMarked, setJustMarked] = useState<string | null>(null)
  // Every deliberate tile activation raises this by one, including a tap on the
  // number already selected. The player obeys the rise, so re-renders that had
  // nothing to do with the learner never start a clip.
  const [playRequest, setPlayRequest] = useState(0)
  const celebration = useCelebration()

  const selected = countingLesson.numbers[selectedValue - 1]
  const selectedDone = cleared.includes(selected.word.id)
  const done = countingLesson.numbers.filter(({ word }) => cleared.includes(word.id)).length

  /** The learner says this number is done: pay it, then show the new count. */
  function markSelected() {
    const kind = learnCountingItem(selected.word.id)
    setCleared(getCountingProgress().words)
    setJustMarked(selected.word.id)
    celebration.cheer(kind)
  }

  /** One deliberate tap: select the number and ask to hear it. Selecting on
   *  ends the celebration for good, here and on the way back — and it is the
   *  only progress this tap touches. */
  function select(value: number) {
    setSelectedValue(value)
    setJustMarked(null)
    setPlayRequest((asked) => asked + 1)
  }

  return (
    <LessonSheet title={countingLesson.title} bar={<BarLink to="/">Til forsiden</BarLink>}>
      <p className="alphabet__summary">
        <ProgressTick granted={done > 0} label="Gennemgået eller øvet" />
        <span>
          {done} af {countingLesson.numbers.length} tal gennemgået eller øvet
        </span>
      </p>
      <p className="alphabet__lead">
        Tæl med, fra 1 til 20. Tryk på et tal for at se ordet og få hjælp til udtalen.
      </p>

      <div className="lesson-index">
        <DetailStrip
          entry={selected.word}
          className="entry-detail--master"
          live
          playRequest={playRequest}
        />
        <div className="lesson-index__content">
          <div className="letter__done">
            {justMarked === selected.word.id ? (
              <Celebration reward={celebration.reward} tickLabel="Gennemgået" />
            ) : selectedDone ? (
              <>
                <ProgressTick granted label="Gennemgået" />
                <span>Gennemgået</span>
              </>
            ) : (
              <Button onClick={markSelected}>Jeg har gennemgået tallet</Button>
            )}
          </div>

          <ol className="vocab__grid" dir="rtl">
            {countingLesson.numbers.map(({ value, digit, word }) => (
              <li key={value}>
                <button
                  type="button"
                  className={`vocab__cell${cleared.includes(word.id) ? ' vocab__cell--done' : ''}`}
                  aria-label={`Vælg tallet ${word.da}`}
                  aria-pressed={selectedValue === value}
                  onClick={() => select(value)}
                >
                  <PersianText entry={digit} className="vocab__cell-fa" ariaHidden />
                  <span className="vocab__cell-da" lang="da" dir="ltr">{word.da}</span>
                </button>
              </li>
            ))}
          </ol>

          <h2 className="alphabet__section-title">Øvelser</h2>
          <ul className="alphabet__links">
            {Object.entries(COUNTING_EXERCISE_TITLES).map(([kind, title]) => (
              <li key={kind}>
                <Link className="alphabet__link" to={`${countingLesson.path}/ovelse/${kind}`}>
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <RewardOverlays celebration={celebration} />
    </LessonSheet>
  )
}
