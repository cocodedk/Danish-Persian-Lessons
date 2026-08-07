import { describe, expect, it } from 'vitest'
import { wordBridges } from './wordBridges'
import { wordBridgeSources } from './wordBridgeSources'

describe('Persian and Danish word bridges', () => {
  it('keeps every pair unique, sourced, and ready for a full word reading', () => {
    expect(new Set(wordBridges.map((bridge) => bridge.id)).size).toBe(wordBridges.length)
    for (const bridge of wordBridges) {
      expect(wordBridgeSources[bridge.id]?.length).toBeGreaterThanOrEqual(2)
      expect(bridge.entry.readingCues?.some((cue) => cue.role !== 'whole')).toBe(true)
      expect(bridge.entry.pron.ipa).toBeTruthy()
      expect(bridge.clueDa.toLocaleLowerCase('da')).not.toContain('altid')
    }
  })

  it('keeps the exact and changed meanings apart', () => {
    const byId = Object.fromEntries(wordBridges.map((bridge) => [bridge.id, bridge]))
    expect(byId['dandan-tand']).toMatchObject({
      entry: { fa: 'دندان', da: 'tand', pron: { da: 'dandån', ipa: 'dænˈdɒːn' } },
      danish: 'tand',
      meaningDa: 'De betyder det samme i dag: tand.',
    })
    expect(byId['setad-sted']).toMatchObject({
      entry: { fa: 'ستاد', da: 'hovedkontor', pron: { da: 'setåd', ipa: 'seˈtɒːd' } },
      danish: 'sted',
    })
    expect(byId['setad-sted'].meaningDa).toContain('ikke det samme')
    expect(byId['band-baand']).toMatchObject({
      entry: {
        fa: 'بند',
        faMarked: 'بَند',
        da: 'bånd eller mur i vand',
        pron: { da: 'band', ipa: 'bænd' },
      },
      danish: 'bånd',
      clueDa: 'Begge ord hænger sammen med at binde.',
    })
    expect(byId['band-baand'].meaningDa).toContain('betyder ikke vand eller flod')
    expect(byId['seyl-sejle']).toMatchObject({
      entry: {
        fa: 'سیل',
        faMarked: 'سِیل',
        da: 'meget vand på land',
        pron: { da: 'seyl', ipa: 'sejl' },
      },
      danish: 'sejle',
      clueDa: 'Seyl og sejle lyder næsten ens.',
    })
    expect(byId['seyl-sejle'].meaningDa).toContain('Byen sejlede i vand')
    expect(byId['pedar-fader']).toMatchObject({
      entry: {
        fa: 'پدر',
        faMarked: 'پِدَر',
        da: 'far',
        pron: { da: 'pedar', ipa: 'peˈdæɾ' },
      },
      danish: 'fader eller far',
      clueDa: 'P i pedar svarer til f i fader.',
    })
    expect(byId['setareh-stjerne']).toMatchObject({
      entry: {
        fa: 'ستاره',
        faMarked: 'سِتاره',
        da: 'stjerne',
        pron: { da: 'setåre', ipa: 'seˈtɒːɾe' },
      },
      danish: 'stjerne',
    })
    expect(byId['mah-maane']).toMatchObject({
      entry: {
        fa: 'ماه',
        da: 'måne',
        pron: { da: 'måh', ipa: 'mɒːh' },
        audioId: 'word-bridge-mah',
      },
      danish: 'måne',
    })
    expect(byId['dar-doer']).toMatchObject({
      entry: {
        fa: 'در',
        faMarked: 'دَر',
        da: 'dør',
        pron: { da: 'dar', ipa: 'dæɾ' },
        audioId: 'word-bridge-dar',
      },
      danish: 'dør',
      clueDa: 'D og r går igen i dar og dør.',
    })
    expect(byId['pedar-fader'].meaningDa).toContain('samme gamle familie')
    expect(byId['setareh-stjerne'].meaningDa).toContain('samme gamle familie')
    expect(byId['mah-maane'].meaningDa).toContain('samme gamle familie')
    expect(byId['dar-doer'].meaningDa).toContain('samme gamle familie')
  })
})
