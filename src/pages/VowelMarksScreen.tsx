import { useState } from 'react'
import { LessonSheet, BarLink } from '../components/LessonSheet'
import { VowelChip } from '../components/VowelChip'
import { ProgressTick } from '../components/ProgressTick'
import { Button } from '../components/Button'
import { Celebration } from '../components/Celebration'
import { RewardOverlays } from '../components/RewardOverlays'
import { CompactPhraseRow, FullTeachingCard } from '../components/EntryRenderers'
import { vowelMarks, laterMarks } from '../lessons/vowelMarks'
import { getAlphabetProgress, markVowelDone } from '../progress/alphabet'
import { useCelebration } from '../rewards/useCelebration'
import './alphabet.css'
import './vowelMarks.css'

/**
 * The six vowel signs. Short vowels ride above or below their letter in the
 * teacher's red; long vowels are letters of their own.
 */
export default function VowelMarksScreen() {
  const [cleared, setCleared] = useState(() => getAlphabetProgress().marks)
  const [justDone, setJustDone] = useState<string | null>(null)
  const celebration = useCelebration()

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
            <VowelChip entry={mark.entry} />
            {/* Name over action: at 360px the chip takes half the line, so
                these two stack instead of squeezing each other. */}
            <div className="marks__side">
              <CompactPhraseRow entry={mark.nameEntry} />
              {done ? (
                <ProgressTick granted label="Klaret" />
              ) : (
                <Button
                  variant="quiet"
                  onClick={() => {
                    setCleared(markVowelDone(mark.id).marks)
                    setJustDone(mark.id)
                    celebration.cheer('item')
                  }}
                >
                  Jeg kan den
                </Button>
              )}
            </div>
            {justDone === mark.id && <Celebration reward={celebration.reward} tickLabel="Klaret" />}
          </div>
        )
      })}
      <RewardOverlays celebration={celebration} />

      <h2 className="alphabet__section-title">Senere</h2>
      <p className="alphabet__note">
        To tegn mere. De giver ingen vokal, så dem tager vi i en senere lektion.
      </p>
      {laterMarks.map((mark) => (
        <div key={mark.id} className="marks__later">
          <FullTeachingCard entry={mark.entry} />
          <CompactPhraseRow entry={mark.nameEntry} />
          <span>{mark.hint}</span>
        </div>
      ))}
    </LessonSheet>
  )
}
