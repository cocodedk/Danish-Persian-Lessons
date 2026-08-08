import { findVocabUnit } from '../lessons/vocab'
import type { VocabWord } from '../lessons/vocab'

export interface ChildMission {
  id: string
  word: VocabWord
  imageEntryId: string
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
  return { id, word, imageEntryId: word.entry.id, trayOrder }
}

export const childMissions: ChildMission[] = [
  mission('ab', '1', 'ab', [1, 0]),
  mission('nan', '1', 'nan', [1, 2, 0]),
  mission('gol', '3', 'gol', [1, 0]),
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
