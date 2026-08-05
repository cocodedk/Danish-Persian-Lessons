import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { SplitCard } from '../components/SplitCard'
import { ProgressTick } from '../components/ProgressTick'
import { Button } from '../components/Button'
import { Celebration } from '../components/Celebration'
import { RewardOverlays } from '../components/RewardOverlays'
import { findVocabUnit } from '../lessons/vocab'
import { getVocabProgress, learnWord } from '../progress/vocab'
import { getProfile } from '../progress/profile'
import { useCelebration } from '../rewards/useCelebration'
import { NAME_LETTER_IN_WORD_ENTRY, NAME_LETTERS_IN_WORD_ENTRY } from '../content/faStrings'
import { PersonalNameText } from '../components/PersonalName'
import { CompactPhraseRow } from '../components/EntryRenderers'
import './alphabet.css'
import './vocab.css'

/** The letters this word and the learner's own name have in common. */
function sharedWithName(fa: string, spelling: string | undefined): string[] {
  if (!spelling) return []
  return [...new Set(fa)].filter((letter) => spelling.includes(letter))
}

/** One word: the specimen with its اِعراب, said twice, and its Danish meaning. */
export default function WordScreen() {
  const { unit: unitId = '', word: wordId = '' } = useParams()
  const [cleared, setCleared] = useState(() => getVocabProgress(unitId).words.includes(wordId))
  const celebration = useCelebration()

  const unit = findVocabUnit(unitId)
  const index = unit ? unit.words.findIndex((word) => word.id === wordId) : -1
  if (!unit || index < 0) {
    return <Navigate to="/" replace />
  }

  const word = unit.words[index]
  const previous = unit.words[index - 1]
  const next = unit.words[index + 1]
  const shared = sharedWithName(word.fa, getProfile().faSpelling)
  const only = shared.length === 1
  const unitPath = `/lesson/ord/${unit.id}`

  return (
    <LessonSheet
      title={`Ordet ${word.da}`}
      bar={
        <>
          {previous && <BarLink to={`${unitPath}/${previous.id}`}>Forrige</BarLink>}
          <BarLink to={unitPath}>Alle ord</BarLink>
          {next && <BarLink to={`${unitPath}/${next.id}`}>Næste</BarLink>}
        </>
      }
    >
      <p className="letter__eyebrow">
        Ord {index + 1} af {unit.words.length} — {unit.title}
      </p>

      <SplitCard word={word} />

      {shared.length > 0 && (
        <div className="letter__badge vocab__badge">
          <ProgressTick granted label="I dit navn" />
          <CompactPhraseRow
            entry={only ? NAME_LETTER_IN_WORD_ENTRY : NAME_LETTERS_IN_WORD_ENTRY}
          />
          <span>
            {only ? 'Ét af bogstaverne her' : 'Nogle af bogstaverne her'} er også i dit navn:{' '}
            <PersonalNameText spelling={shared.join(' ')} />
          </span>
        </div>
      )}

      <div className="letter__done">
        {!cleared && (
          <Button
            onClick={() => {
              setCleared(true)
              celebration.cheer(learnWord(unit, word.id))
            }}
          >
            Jeg kan det
          </Button>
        )}
        {cleared && celebration.reward === null && (
          <>
            <ProgressTick granted label="Klaret" />
            <span>Klaret</span>
          </>
        )}
      </div>
      {celebration.reward !== null && (
        <Celebration reward={celebration.reward} tickLabel="Klaret" />
      )}
      <RewardOverlays celebration={celebration} />
    </LessonSheet>
  )
}
