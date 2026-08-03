// The stroke sequence for every letter, keyed by letter id.
//
// Two rules hold for every entry, and both are unit-tested:
//   1. the body strokes come first, ALL of them, before any dot;
//   2. letters that look like one shape with different dots ARE one shape here
//      — they share the identical body constant (see BODY_GROUPS).
import type { Stroke } from '../types'
import {
  dot,
  twoDots,
  threeDots,
  ALEF,
  MADDE,
  BE,
  JIM,
  DAL,
  RE,
  SIN,
  SAD,
  TA,
  TA_BAR,
  EYN,
  FE,
  QAF,
  KAF,
  KAF_SERIF,
  SARKASH,
  LAM,
  MIM,
  NUN,
  VAV,
  HE,
  YE,
} from './bodies'

export const STROKES: Record<string, Stroke[]> = {
  alef: [ALEF],
  'alef-madde': [ALEF, MADDE],

  be: [BE, dot(50, 79)],
  pe: [BE, ...threeDots(50, 76, 10)],
  te: [BE, ...twoDots(50, 30)],
  se: [BE, ...threeDots(50, 32, -10)],

  jim: [JIM, dot(52, 62)],
  che: [JIM, ...threeDots(50, 58, 10)],
  'he-jimi': [JIM],
  khe: [JIM, dot(58, 20)],

  dal: [DAL],
  zal: [DAL, dot(58, 16)],

  re: [RE],
  ze: [RE, dot(60, 18)],
  zhe: [RE, ...threeDots(60, 18, -10)],

  sin: [SIN],
  shin: [SIN, ...threeDots(66, 32, -10)],

  sad: [SAD],
  zad: [SAD, dot(66, 32)],

  ta: [TA, TA_BAR],
  za: [TA, TA_BAR, dot(48, 34)],

  eyn: [EYN],
  gheyn: [EYN, dot(56, 14)],

  fe: [FE, dot(64, 22)],
  ghaf: [QAF, ...twoDots(64, 22)],

  kaf: [KAF, KAF_SERIF],
  gaf: [KAF, SARKASH],

  lam: [LAM],
  mim: [MIM],
  nun: [NUN, dot(50, 28)],
  vav: [VAV],
  he: [HE],
  ye: [YE],
}

/**
 * The families that share one body — the reason dots matter. The orientation
 * lesson teaches this, and the "Find bogstavet" exercise draws its distractors
 * from here, so a learner is asked to tell ب from ت, never ب from ل.
 */
export const BODY_GROUPS: string[][] = [
  ['be', 'pe', 'te', 'se'],
  ['jim', 'che', 'he-jimi', 'khe'],
  ['dal', 'zal'],
  ['re', 'ze', 'zhe'],
  ['sin', 'shin'],
  ['sad', 'zad'],
  ['ta', 'za'],
  ['eyn', 'gheyn'],
  ['kaf', 'gaf'],
]

/** The ids that share `id`'s body, `id` itself excluded. Empty for a lone shape. */
export function sameBodyAs(id: string): string[] {
  const group = BODY_GROUPS.find((ids) => ids.includes(id))
  return group ? group.filter((other) => other !== id) : []
}
