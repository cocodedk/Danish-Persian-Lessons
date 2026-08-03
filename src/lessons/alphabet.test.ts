import { describe, it, expect } from 'vitest'
import { letters, teachingOrder, specimens } from './alphabet'
import { vowelMarks, laterMarks } from './vowelMarks'

/** The seven letters that never join to the left. */
const NON_JOINERS = ['ا', 'د', 'ذ', 'ر', 'ز', 'ژ', 'و']

describe('the Persian alphabet', () => {
  it('has exactly 32 letters, in standard order, alef first and ye last', () => {
    expect(letters).toHaveLength(32)
    expect(letters[0].glyph).toBe('ا')
    expect(letters.at(-1)?.glyph).toBe('ی')
  })

  it('gives every letter a unique id and a unique glyph', () => {
    expect(new Set(letters.map((l) => l.id)).size).toBe(32)
    expect(new Set(letters.map((l) => l.glyph)).size).toBe(32)
    for (const letter of letters) {
      expect(letter.id).toMatch(/^[a-z-]+$/)
    }
  })

  it('marks exactly ا د ذ ر ز ژ و as non-joiners', () => {
    const found = letters.filter((letter) => !letter.joinsLeft).map((letter) => letter.glyph)
    expect(found).toEqual(NON_JOINERS)
  })

  it('gives every letter four positional forms, none empty', () => {
    for (const letter of letters) {
      const forms = Object.values(letter.forms)
      expect(forms).toHaveLength(4)
      for (const form of forms) expect(form.length).toBeGreaterThan(0)
      expect(letter.forms.isolated).toBe(letter.glyph)
    }
  })

  it('gives joiners four distinct shapes and non-joiners only two', () => {
    for (const letter of letters) {
      const distinct = new Set(Object.values(letter.forms)).size
      expect(distinct).toBe(letter.joinsLeft ? 4 : 2)
    }
  })

  it('spells the forms the way a schoolbook prints them', () => {
    const be = letters.find((l) => l.id === 'be')
    expect(be?.forms).toEqual({
      isolated: 'ب',
      initial: 'بـ',
      medial: 'ـبـ',
      final: 'ـب',
    })
    const alef = letters.find((l) => l.id === 'alef')
    expect(alef?.forms).toEqual({
      isolated: 'ا',
      initial: 'ا',
      medial: 'ـا',
      final: 'ـا',
    })
    const kaf = letters.find((l) => l.id === 'kaf')
    expect(kaf?.forms.medial).toBe('ـکـ')
    const he = letters.find((l) => l.id === 'he')
    expect(he?.forms.medial).toBe('ـهـ')
  })

  it('says every letter twice — dansk lydskrift and IPA — from the data', () => {
    for (const letter of letters) {
      expect(letter.sound.da.length).toBeGreaterThan(0)
      expect(letter.sound.ipa.length).toBeGreaterThan(0)
      expect(letter.name.fa.length).toBeGreaterThan(0)
      expect(letter.name.da.length).toBeGreaterThan(0)
    }
  })

  it('anchors the letters the curriculum names to the right Danish sounds', () => {
    const anchors = Object.fromEntries(letters.map((l) => [l.id, l.sound]))
    expect(anchors.kaf).toEqual({ da: 'k i "kat"', ipa: 'k' })
    expect(anchors.be).toEqual({ da: 'b i "bil"', ipa: 'b' })
    expect(anchors.gaf.ipa).toBe('ɡ')
  })

  it('gives ق and غ one sound, because Tehrani Persian says them the same', () => {
    const anchors = Object.fromEntries(letters.map((l) => [l.id, l.sound]))
    expect(anchors.ghaf).toEqual({
      da: 'et dybt g/r bagerst i halsen',
      ipa: 'ɢ~ɣ',
    })
    expect(anchors.gheyn).toEqual(anchors.ghaf)
  })

  it('says the voicing out loud, since a Dane reading "zoo" says [s]', () => {
    const anchors = Object.fromEntries(letters.map((l) => [l.id, l.sound]))
    for (const id of ['zal', 'ze', 'zad', 'za']) {
      expect(anchors[id], id).toEqual({ da: 'stemt s — som engelsk z i "zoo"', ipa: 'z' })
    }
    expect(anchors.zhe.da).toBe('som j i fransk "journal" — stemt sj')
  })

  it('gives the two h-letters the school names, so no two letters answer to one name', () => {
    const names = Object.fromEntries(letters.map((l) => [l.id, l.name.da]))
    expect(names['he-jimi']).toBe('he jimi')
    expect(names.he).toBe('he do-tjeshm')
    expect(new Set(letters.map((l) => l.name.da)).size).toBe(32)
  })

  it('hangs آ on the alef entry, with its own sound and strokes', () => {
    const alef = letters.find((l) => l.id === 'alef')
    expect(alef?.madde?.glyph).toBe('آ')
    expect(alef?.madde?.sound).toEqual({ da: 'å i "år"', ipa: 'ɒː' })
    expect(alef?.madde?.strokes.length).toBeGreaterThan(alef!.strokes.length)
  })
})

describe('teaching order', () => {
  it('opens on آ ا ب د — the letters that spell آب، بابا، باد', () => {
    expect(teachingOrder.slice(0, 4)).toEqual(['alef-madde', 'alef', 'be', 'dal'])
    expect(teachingOrder.slice(0, 4).map((id) => specimens[id].glyph)).toEqual([
      'آ',
      'ا',
      'ب',
      'د',
    ])
  })

  it('covers all 32 letters plus آ exactly once', () => {
    expect(teachingOrder).toHaveLength(33)
    expect(new Set(teachingOrder).size).toBe(33)
    for (const id of teachingOrder) {
      expect(specimens[id]).toBeDefined()
    }
    for (const letter of letters) {
      expect(teachingOrder).toContain(letter.id)
    }
  })

  it('keeps the standard order after the opening four', () => {
    const tail = teachingOrder.slice(4)
    const expected = letters.map((l) => l.id).filter((id) => !['alef', 'be', 'dal'].includes(id))
    expect(tail).toEqual(expected)
  })
})

describe('vowel marks', () => {
  it('teaches the six marks with the Danish anchors the curriculum names', () => {
    expect(vowelMarks.map((mark) => mark.sound)).toEqual([
      { da: 'a i "kat"', ipa: 'æ' },
      { da: 'e i "let"', ipa: 'e' },
      { da: 'o i "foto"', ipa: 'o' },
      { da: 'å i "år"', ipa: 'ɒː' },
      { da: 'u i "du"', ipa: 'uː' },
      { da: 'i i "vi"', ipa: 'iː' },
    ])
  })

  it('writes the short marks on a seat, never loose', () => {
    for (const mark of vowelMarks.slice(0, 3)) {
      expect(mark.glyph.startsWith('ا')).toBe(true)
      expect(mark.glyph.length).toBe(2)
    }
  })

  it('names تشدید and سکون as coming later, with a Danish line each', () => {
    expect(laterMarks.map((mark) => mark.name.fa)).toEqual(['تشدید', 'سکون'])
    for (const mark of laterMarks) {
      expect(mark.hint.length).toBeGreaterThan(0)
    }
  })
})
