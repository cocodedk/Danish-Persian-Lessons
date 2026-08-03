import type { ReactNode } from 'react'
import { RuledSection } from '../components/RuledSection'
import { RuleDivider } from '../components/RuleDivider'
import { Button } from '../components/Button'
import { VowelChip } from '../components/VowelChip'
import { ProgressTick } from '../components/ProgressTick'
import { FaSpecimen } from '../components/FaSpecimen'
import { PronLine } from '../components/PronLine'
import { DaWord } from '../components/DaWord'
import { DEMO_WORD } from '../content/demoWord'
import { KIT_VOWELS, KIT_SHEET_FA, KIT_SHEET_DA } from '../content/kitSamples'

function Sample({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="kit__sample">
      <h3 className="kit__label" lang="da" dir="ltr">
        {label}
      </h3>
      {children}
    </div>
  )
}

/** Every kit component, once. Rendered four times by Kit: light/dark × ltr/rtl. */
export function KitSamples({ dir }: { dir: 'ltr' | 'rtl' }) {
  const rtl = dir === 'rtl'

  return (
    <>
      <Sample label="RuledSection — arket">
        <RuledSection dir={dir} lang={rtl ? 'fa' : 'da'}>
          {rtl ? KIT_SHEET_FA : KIT_SHEET_DA}
        </RuledSection>
      </Sample>

      <Sample label="FaSpecimen · PronLine · RuleDivider · DaWord">
        <FaSpecimen fa={DEMO_WORD.fa} faMarked={DEMO_WORD.faMarked} />
        <PronLine da={DEMO_WORD.pron.da} ipa={DEMO_WORD.pron.ipa} />
        <RuleDivider />
        <DaWord>{DEMO_WORD.da}</DaWord>
      </Sample>

      <Sample label="VowelChip — vokaltegn">
        <div className="kit__row">
          {KIT_VOWELS.map((vowel) => (
            <VowelChip key={vowel.glyph} glyph={vowel.glyph} caption={vowel.caption} />
          ))}
        </div>
      </Sample>

      <Sample label="Button">
        <div className="kit__row">
          <Button>Gem</Button>
          <Button variant="quiet">Spring over</Button>
        </div>
      </Sample>

      <Sample label="ProgressTick — givet og endnu ikke givet">
        <div className="kit__row">
          <ProgressTick granted />
          <ProgressTick granted={false} />
        </div>
      </Sample>
    </>
  )
}
