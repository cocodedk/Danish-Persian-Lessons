import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { FaSpecimen } from '../components/FaSpecimen'
import { PronLine } from '../components/PronLine'
import { LetterForms } from '../components/LetterForms'
import { LetterDraw } from '../components/LetterDraw'
import { ProgressTick } from '../components/ProgressTick'
import { Button } from '../components/Button'
import { penMarkClass } from '../components/penMark'
import { teachingOrder, specimens, isLetter } from '../lessons/alphabet'
import { getAlphabetProgress, markLetterDone } from '../progress/alphabet'
import { getProfile } from '../progress/profile'
import { NAME_LETTER_FA } from '../content/faStrings'
import '../styles/pen.css'
import './alphabet.css'

/** One letter: its shape, its sound, its four positions, and how it is written. */
export default function LetterScreen() {
  const { id = '' } = useParams()
  const [cleared, setCleared] = useState(() => getAlphabetProgress().letters.includes(id))

  const specimen = specimens[id]
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
        <FaSpecimen fa={specimen.glyph} />
        <p className="letter__names">
          <span
            className={penMarkClass('letter__name-fa', specimen.name.fa)}
            lang="fa"
            dir="rtl"
          >
            {specimen.name.fa}
          </span>
          <span className="letter__name-da">{specimen.name.da}</span>
        </p>
        <PronLine da={specimen.sound.da} ipa={specimen.sound.ipa} />
      </div>

      {inMyName && (
        <p className="letter__badge">
          <ProgressTick granted label="I dit navn" />
          <span className="letter__badge-fa" lang="fa" dir="rtl">
            {NAME_LETTER_FA}
          </span>
          <span>Dette bogstav er i dit navn</span>
        </p>
      )}

      {letter && (
        <div className="letter__block">
          <LetterForms forms={letter.forms} joinsLeft={letter.joinsLeft} />
        </div>
      )}

      <div className="letter__block">
        <LetterDraw strokes={specimen.strokes} name={specimen.name.da} />
      </div>

      {letter?.hint && <p className="letter__hint">{letter.hint}</p>}

      <div className="letter__done">
        {cleared ? (
          <>
            <ProgressTick granted label="Klaret" />
            <span>Klaret</span>
          </>
        ) : (
          <Button
            onClick={() => {
              markLetterDone(id)
              setCleared(true)
            }}
          >
            Jeg kan den
          </Button>
        )}
      </div>
    </LessonSheet>
  )
}
