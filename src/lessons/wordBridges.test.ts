import { describe, expect, it } from 'vitest'
import { wordBridges } from './wordBridges'
import { wordBridgeSources } from './wordBridgeSources'

const suppliedPairs = [
  ['pedar-fader', 'پدر', 'peˈdæɾ', 'fader', 'ˈfæːðʌ'],
  ['madar-moder', 'مادر', 'mɒːˈdæɾ', 'moder', 'ˈmoːðʌ'],
  ['baradar-broder', 'برادر', 'bæɾɒːˈdæɾ', 'broder', 'ˈbʁoːðʌ'],
  ['doxtar-datter', 'دختر', 'doxˈtæɾ', 'datter', 'ˈdadʌ'],
  ['dar-doer', 'در', 'dæɾ', 'dør', 'ˈdɶˀɐ̯'],
  ['nam-navn', 'نام', 'nɒːm', 'navn', 'ˈnɑwˀn'],
  ['mush-mus', 'موش', 'muːʃ', 'mus', 'ˈmuˀs'],
  ['garm-varm', 'گرم', 'ɡæɾm', 'varm', 'ˈvɑːm'],
  ['now-ny', 'نو', 'nou̯', 'ny', 'ˈnyˀ'],
  ['do-to', 'دو', 'do', 'to', 'ˈtoˀ'],
  ['shesh-seks', 'شش', 'ʃeʃ', 'seks', 'ˈsɛgs'],
  ['noh-ni', 'نه', 'noh', 'ni', 'ˈniˀ'],
  ['dandan-tand', 'دندان', 'dænˈdɒːn', 'tand', 'ˈtanˀ'],
  ['naf-navle', 'ناف', 'nɒːf', 'navle', 'ˈnɑwlə'],
  ['mah-maane', 'ماه', 'mɒːh', 'måne', 'ˈmɔːnə'],
  ['setareh-stjerne', 'ستاره', 'seˈtɒːɾe', 'stjerne', 'ˈsdjæɐ̯nə'],
  ['band-baand', 'بند', 'bænd', 'bånd', 'ˈbɔnˀ'],
] as const

describe('Persian and Danish word bridges', () => {
  it('keeps every pair unique, sourced, and ready for a full word reading', () => {
    expect(wordBridges).toHaveLength(23)
    expect(new Set(wordBridges.map((bridge) => bridge.id)).size).toBe(wordBridges.length)
    for (const bridge of wordBridges) {
      expect(wordBridgeSources[bridge.id]?.length).toBeGreaterThanOrEqual(2)
      expect(bridge.entry.readingCues?.some((cue) => cue.role !== 'whole')).toBe(true)
      expect(bridge.entry.pron.ipa).toBeTruthy()
      expect(bridge.clueDa.toLocaleLowerCase('da')).not.toContain('altid')
      expect(bridge.historyDa).toBeTruthy()
    }
  })

  it('keeps the seventeen supplied cognates and IPA transcriptions intact', () => {
    const byId = Object.fromEntries(wordBridges.map((bridge) => [bridge.id, bridge]))
    for (const [id, fa, persianIpa, danish, danishIpa] of suppliedPairs) {
      expect(byId[id]).toMatchObject({ entry: { fa, pron: { ipa: persianIpa } }, danish, danishIpa })
    }
  })

  it('labels the three extra teaching bridges without overstating them', () => {
    const byId = Object.fromEntries(wordBridges.map((bridge) => [bridge.id, bridge]))
    expect(byId['setad-sted']).toMatchObject({
      category: 'everyday', entry: { fa: 'ستاد', da: 'hovedkontor' }, danish: 'sted',
    })
    expect(byId['setad-sted'].meaningDa).toContain('ikke det samme')
    expect(byId['seyl-sejle']).toMatchObject({
      category: 'memory', entry: { fa: 'سیل', da: 'oversvømmelse' }, danish: 'sejle',
    })
    expect(byId['seyl-sejle'].historyDa).toContain('ikke i samme gamle familie')
    expect(byId['dust-dus']).toMatchObject({
      category: 'memory', entry: { fa: 'دوست', da: 'ven', pron: { ipa: 'duːst' } },
      danish: 'dus', danishIpa: 'ˈdus',
    })
    expect(byId['dust-dus'].historyDa).toContain('ikke et fælles ophav')
  })

  it('keeps the three requested bridges as qualified memory clues', () => {
    const byId = Object.fromEntries(wordBridges.map((bridge) => [bridge.id, bridge]))
    expect(byId['pas-pas-paa']).toMatchObject({
      category: 'memory', entry: { fa: 'پاس', da: 'vagt, beskyttelse eller omsorg' },
      danish: 'pas på',
    })
    expect(byId['pas-pas-paa'].meaningDa).toContain('movåzeb båsh')
    expect(byId['mord-mord']).toMatchObject({
      category: 'memory', entry: { fa: 'مرد', faMarked: 'مُرد', da: 'døde' }, danish: 'mord',
    })
    expect(byId['mord-mord'].meaningDa).toContain('ikke det samme')
    expect(byId['leng-lang']).toMatchObject({
      category: 'memory', entry: { fa: 'لنگ', faMarked: 'لِنگ', da: 'ben' },
      danish: 'lang, længe, langt',
    })
    expect(byId['leng-lang'].historyDa).toContain('ikke dokumenteret som et historisk dansk længdemål')
  })
})
