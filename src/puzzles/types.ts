import type { PersianEntry } from '../catalog/types'

export type PuzzleKind = 'match' | 'order' | 'missing'

export interface PuzzleTile {
  /** Unique even when two tiles carry the same letter. */
  id: string
  entry: PersianEntry
  glyph: string
}

interface BaseTask {
  id: string
  entry: PersianEntry
}

export interface MatchTask extends BaseTask {
  kind: 'match'
  choices: PersianEntry[]
}

export interface OrderTask extends BaseTask {
  kind: 'order'
  tiles: PuzzleTile[]
}

export interface MissingTask extends BaseTask {
  kind: 'missing'
  missingAt: number
  choices: PersianEntry[]
}

export type PuzzleTask = MatchTask | OrderTask | MissingTask

export interface PuzzleDefinition {
  id: string
  kind: PuzzleKind
  title: string
  backTo: string
  /** Registry ids available before this break; every answer must be in here. */
  introducedEntryIds: string[]
  tasks: PuzzleTask[]
}

export interface PuzzleGroup {
  id: string
  title: string
  itemIds: string[]
  puzzle: PuzzleDefinition
}
