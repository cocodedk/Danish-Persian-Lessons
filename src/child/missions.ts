import { findVocabUnit } from '../lessons/vocab'
import type { VocabWord } from '../lessons/vocab'
import { lessonImageForEntry } from '../images/catalog'

export interface ChildMission {
  id: string
  word: VocabWord
  imageEntryId?: string
  trayOrder: number[]
}

export interface MissionTile {
  id: string
  glyph: string
  targetIndex: number
}

function mission(id: string, unitId: string, wordId: string, trayOrder: number[]): ChildMission {
  const word = findVocabUnit(unitId)?.words.find((entry) => entry.id === wordId)
  if (!word) throw new Error(`Missing child mission word: ${unitId}/${wordId}`)
  const imageEntryId = lessonImageForEntry(word.entry.id) ? word.entry.id : undefined
  return { id, word, imageEntryId, trayOrder }
}

export const childMissions: ChildMission[] = [
  mission('salam', '2', 'salam', [2, 0, 3, 1]),
  mission('man', '1', 'man', [1, 0]),
  mission('to', '1', 'to', [1, 0]),
  mission('dust', '2', 'dust', [2, 0, 3, 1]),
  mission('ab', '1', 'ab', [1, 0]),
  mission('nan', '1', 'nan', [1, 2, 0]),
  mission('baba', '1', 'baba', [1, 2, 3, 0]),
  mission('madar', '1', 'madar', [2, 0, 3, 1]),
  mission('khane', '3', 'khane', [2, 0, 3, 1]),
  mission('in', '1', 'in', [2, 0, 1]),
  mission('an', '1', 'an', [1, 0]),
  mission('ma', '1', 'ma', [1, 0]),
  mission('u', '1', 'u', [1, 0]),
]

export function findChildMission(id: string): ChildMission | undefined {
  return childMissions.find((entry) => entry.id === id)
}

export function tilesForMission(entry: ChildMission): MissionTile[] {
  const letters = Array.from(entry.word.fa)
  return entry.trayOrder.map((targetIndex) => ({
    id: `${entry.id}-${targetIndex}`,
    glyph: letters[targetIndex],
    targetIndex,
  }))
}
