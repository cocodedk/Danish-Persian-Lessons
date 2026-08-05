import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { CompactPhraseRow, FullTeachingCard } from '../components/EntryRenderers'
import { LetterForms } from '../components/LetterForms'
import { LetterDraw } from '../components/LetterDraw'
import { ProgressTick } from '../components/ProgressTick'
import { Button } from '../components/Button'
import { Celebration } from '../components/Celebration'
import { RewardOverlays } from '../components/RewardOverlays'
import { teachingOrder, specimens, isLetter } from '../lessons/alphabet'
import { getAlphabetProgress, markLetterDone } from '../progress/alphabet'
import { getProfile } from '../progress/profile'
import { useCelebration } from '../rewards/useCelebration'
import { NAME_LETTER_ENTRY } from '../content/faStrings'
import './alphabet.css'

/** One letter: its shape, its sound, its four positions, and how it is written. */
export default function LetterScreen() {
  const { id = '' } = useParams()
  const [cleared, setCleared] = useState(() => getAlphabetProgress().letters.includes(id))
  const celebration = useCelebration()

  // Own-key check: the id comes from the URL, and on a plain object a hash
  // like #/…/bogstav/toString would answer with an inherited function.
  const specimen = Object.hasOwn(specimens, id) ? specimens[id] : undefined
  if (!specimen) {
    return <Navigate to="/lesson/alphabet" replace />
  }

  // آ is a taught sign, not the 33rd letter — the heading says which it is.
  const letter = isLetter(specimen) ? specimen : undefined
  const index = teachingOrder.indexOf(id)
  const previous = teachingOrder[index - 1]
  const next = teachingOrder[index + 1]
  const inMyName = getProfile().faSpelling?.includes(specimen.glyph) ?? false

  return (
    <LessonSheet
      title={`${letter ? 'Bogstavet' : 'Tegnet'} ${specimen.name.da}`}
      bar={
        <>
          {previous && <BarLink to={`/lesson/alphabet/bogstav/${previous}`}>Forrige</BarLink>}
          <BarLink to="/lesson/alphabet">Alle bogstaver</BarLink>
          {next && <BarLink to={`/lesson/alphabet/bogstav/${next}`}>Næste</BarLink>}
        </>
      }
    >
      {/* "Tegn", not "bogstav": the 33 are the 32 letters plus the sign آ. */}
      <p className="letter__eyebrow">
        Tegn {index + 1} af {teachingOrder.length}
      </p>

      <div className="letter__specimen">
        <FullTeachingCard entry={specimen.entry} />
        <CompactPhraseRow entry={specimen.nameEntry} />
      </div>

      {inMyName && (
        <div className="letter__badge">
          <ProgressTick granted label="I dit navn" />
          <CompactPhraseRow entry={NAME_LETTER_ENTRY} />
        </div>
      )}

      {letter && (
        <div className="letter__block">
          <LetterForms forms={letter.forms} joinsLeft={letter.joinsLeft} entry={letter.entry} />
        </div>
      )}

      <div className="letter__block">
        <LetterDraw strokes={specimen.strokes} name={specimen.name.da} />
      </div>

      {letter?.hint && <p className="letter__hint">{letter.hint}</p>}

      <div className="letter__done">
        {!cleared && (
          <Button
            onClick={() => {
              markLetterDone(id)
              setCleared(true)
              celebration.cheer('item')
            }}
          >
            Jeg kan den
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
