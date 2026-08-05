import { useParams, Navigate } from 'react-router-dom'
import { BarLink } from '../components/LessonSheet'
import { TypeExercise, type TypeTask } from '../components/TypeExercise'
import { RewardOverlays } from '../components/RewardOverlays'
import { findVocabUnit } from '../lessons/vocab'
import { typeWordDone, payRound } from '../progress/typing'
import { useCelebration } from '../rewards/useCelebration'
import { TYPE_WORDS_ENTRY } from '../content/faStrings'

/**
 * «کلمه‌ها را بنویس» — one unit's words, written rather than recognized. The
 * prompt is the Danish word and how it sounds; the Persian is what the learner
 * has to produce, so it never appears until they have written it themselves.
 * Leaving early costs nothing (docs/plans/005-persian-keyboard.md step 4).
 */
export default function TypeWordScreen() {
  const { unit: unitId = '' } = useParams()
  const celebration = useCelebration()

  const unit = findVocabUnit(unitId)
  if (!unit) {
    return <Navigate to="/" replace />
  }

  const tasks: TypeTask[] = unit.words.map((word) => ({
    id: word.id,
    entry: word.entry,
    promptDa: `Skriv ordet »${word.da}«`,
    pron: word.pron,
    // The plain spelling, never the vocalized one: the keyboard has no
    // اِعراب keys, so اِعراب can never be part of what is asked for.
    answer: word.fa,
  }))

  return (
    <TypeExercise
      title="Skriv ordene"
      eyebrowEntry={TYPE_WORDS_ENTRY}
      bar={<BarLink to={`/lesson/ord/${unit.id}`}>Til lektionen</BarLink>}
      tasks={tasks}
      onCorrect={(wordId) => celebration.cheer(typeWordDone(unit.id, wordId))}
      onComplete={() => celebration.cheer(payRound(unit.id))}
      doneLine="Du skrev hele runden igennem. Alt, du klarede, står stadig på lektionen."
      overlays={<RewardOverlays celebration={celebration} />}
    />
  )
}
