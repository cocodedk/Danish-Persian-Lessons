import type { Pronunciation, ReadingCue } from '../catalog/types'
import { specimens } from './alphabet'

const byGlyph = new Map(Object.values(specimens).map((specimen) => [specimen.glyph, specimen]))
const sound = (da: string, ipa: string): Pronunciation => ({ da, ipa })

function consonant(start: number, glyph: string): ReadingCue {
  const specimen = byGlyph.get(glyph)
  if (!specimen) throw new Error(`No alphabet entry for reading cue ${glyph}`)
  return {
    start,
    end: start + 1,
    display: glyph,
    role: 'consonant',
    helpDa: `${specimen.name.da}: ${specimen.sound.da}`,
    pron: specimen.sound,
  }
}

function longVowel(start: number, glyph: string, da: string, ipa: string, helpDa: string): ReadingCue {
  return { start, end: start + 1, display: glyph, role: 'long-vowel', helpDa, pron: sound(da, ipa) }
}

function writtenVowel(start: number, glyph: string, da: string, ipa: string, helpDa: string): ReadingCue {
  return { start, end: start + 1, display: glyph, role: 'written-vowel', helpDa, pron: sound(da, ipa) }
}

function shortVowel(start: number, mark: '◌َ' | '◌ِ' | '◌ُ', da: string, ipa: string): ReadingCue {
  return {
    start,
    end: start,
    display: mark,
    role: 'short-vowel',
    helpDa: 'Den korte vokal høres, men tegnet udelades normalt i almindelig skrift',
    pron: sound(da, ipa),
  }
}

function carrier(start: number, glyph = 'ا'): ReadingCue {
  return {
    start,
    end: start + 1,
    display: glyph,
    role: 'carrier',
    helpDa: 'Alef bærer vokalen først i ordet; den har ikke en ekstra lyd her',
  }
}

const aa = (start: number, glyph = 'ا') => longVowel(start, glyph, 'å i “år”', 'ɒː', glyph === 'آ' ? 'Alef med madde skriver langt å' : 'Alef skriver langt å her')
const ii = (start: number) => longVowel(start, 'ی', 'i i “vi”', 'iː', 'Ye skriver langt i her')
const uu = (start: number) => longVowel(start, 'و', 'u i “du”', 'uː', 'Vav skriver langt u her')

const CUES: Record<string, ReadingCue[]> = {
  ab: [aa(0, 'آ'), consonant(1, 'ب')],
  baba: [consonant(0, 'ب'), aa(1), consonant(2, 'ب'), aa(3)],
  bad: [consonant(0, 'ب'), aa(1), consonant(2, 'د')],
  abi: [aa(0, 'آ'), consonant(1, 'ب'), ii(2)],
  nan: [consonant(0, 'ن'), aa(1), consonant(2, 'ن')],
  madar: [consonant(0, 'م'), aa(1), consonant(2, 'د'), shortVowel(3, '◌َ', 'a i “kat”', 'æ'), consonant(3, 'ر')],
  man: [consonant(0, 'م'), shortVowel(1, '◌َ', 'a i “kat”', 'æ'), consonant(1, 'ن')],
  to: [consonant(0, 'ت'), writtenVowel(1, 'و', 'o i “foto”', 'o', 'I dette ord skriver vav lyden o')],
  ma: [consonant(0, 'م'), aa(1)],
  u: [carrier(0), uu(1)],
  in: [carrier(0), ii(1), consonant(2, 'ن')],
  an: [aa(0, 'آ'), consonant(1, 'ن')],
  medad: [consonant(0, 'م'), shortVowel(1, '◌ِ', 'e i “let”', 'e'), consonant(1, 'د'), aa(2), consonant(3, 'د')],
  ketab: [consonant(0, 'ک'), shortVowel(1, '◌ِ', 'e i “let”', 'e'), consonant(1, 'ت'), aa(2), consonant(3, 'ب')],
  miz: [consonant(0, 'م'), ii(1), consonant(2, 'ز')],
  dar: [consonant(0, 'د'), shortVowel(1, '◌َ', 'a i “kat”', 'æ'), consonant(1, 'ر')],
  dast: [consonant(0, 'د'), shortVowel(1, '◌َ', 'a i “kat”', 'æ'), consonant(1, 'س'), consonant(2, 'ت')],
  dust: [consonant(0, 'د'), uu(1), consonant(2, 'س'), consonant(3, 'ت')],
  madrese: [consonant(0, 'م'), shortVowel(1, '◌َ', 'a i “kat”', 'æ'), consonant(1, 'د'), consonant(2, 'ر'), shortVowel(3, '◌ِ', 'e i “let”', 'e'), consonant(3, 'س'), writtenVowel(4, 'ه', 'e i “let”', 'e', 'He sidst i dette ord skriver lyden e')],
  salam: [consonant(0, 'س'), shortVowel(1, '◌َ', 'a i “kat”', 'æ'), consonant(1, 'ل'), aa(2), consonant(3, 'م')],
  khane: [consonant(0, 'خ'), aa(1), consonant(2, 'ن'), writtenVowel(3, 'ه', 'e i “let”', 'e', 'He sidst i dette ord skriver lyden e')],
  baran: [consonant(0, 'ب'), aa(1), consonant(2, 'ر'), aa(3), consonant(4, 'ن')],
  aseman: [aa(0, 'آ'), consonant(1, 'س'), shortVowel(2, '◌ِ', 'e i “let”', 'e'), consonant(2, 'م'), aa(3), consonant(4, 'ن')],
  mah: [consonant(0, 'م'), aa(1), consonant(2, 'ه')],
  shab: [consonant(0, 'ش'), shortVowel(1, '◌َ', 'a i “kat”', 'æ'), consonant(1, 'ب')],
  gol: [consonant(0, 'گ'), shortVowel(1, '◌ُ', 'o i “foto”', 'o'), consonant(1, 'ل')],
  sabz: [consonant(0, 'س'), shortVowel(1, '◌َ', 'a i “kat”', 'æ'), consonant(1, 'ب'), consonant(2, 'ز')],
  zard: [consonant(0, 'ز'), shortVowel(1, '◌َ', 'a i “kat”', 'æ'), consonant(1, 'ر'), consonant(2, 'د')],
}

export function vocabReadingCues(id: string): ReadingCue[] {
  const cues = CUES[id]
  if (!cues) throw new Error(`Missing contextual vocabulary cues for ${id}`)
  return cues
}
