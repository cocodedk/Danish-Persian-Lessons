import { useState } from 'react'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { VowelChip } from '../components/VowelChip'
import { ProgressTick } from '../components/ProgressTick'
import { Button } from '../components/Button'
import { vowelMarks, laterMarks } from '../lessons/vowelMarks'
import { getAlphabetProgress, markVowelDone } from '../progress/alphabet'
import './alphabet.css'

/**
 * The six vowel signs. Short vowels ride above or below their letter in the
 * teacher's red; long vowels are letters of their own.
 */
export default function VowelMarksScreen() {
  const [cleared, setCleared] = useState(() => getAlphabetProgress().marks)

  return (
    <LessonSheet title="Vokaltegn" bar={<BarLink to="/lesson/alphabet">Til lektionen</BarLink>}>
      <p className="alphabet__lead">
        Vokalerne står ikke i linjen som på dansk. De tre korte skrives som små tegn over eller
        under bogstavet — her på et alef, så du kan se hvor de sidder. De tre lange er bogstaver i
        sig selv.
      </p>

      {vowelMarks.map((mark) => {
        const done = cleared.includes(mark.id)
        return (
          <div key={mark.id} className="marks__row">
            <VowelChip glyph={mark.glyph} caption={mark.sound} />
            <span className="marks__names">
              <span className="marks__name-fa" lang="fa" dir="rtl">
                {mark.name.fa}
              </span>
              <span>{mark.name.da}</span>
            </span>
            {done ? (
              <ProgressTick granted label="Klaret" />
            ) : (
              <Button
                variant="quiet"
                onClick={() => setCleared(markVowelDone(mark.id).marks)}
              >
                Jeg kan den
              </Button>
            )}
          </div>
        )
      })}

      <h2 className="alphabet__section-title">Senere</h2>
      <p className="alphabet__note">
        To tegn mere. De giver ingen vokal, så dem tager vi i en senere lektion.
      </p>
      {laterMarks.map((mark) => (
        <p key={mark.id} className="marks__later">
          <span className="marks__later-glyph" lang="fa" dir="rtl">
            {mark.glyph}
          </span>
          <span className="marks__name-fa" lang="fa" dir="rtl">
            {mark.name.fa}
          </span>
          <span>{mark.hint}</span>
        </p>
      ))}
    </LessonSheet>
  )
}
