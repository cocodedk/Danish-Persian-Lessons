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
  })
})
