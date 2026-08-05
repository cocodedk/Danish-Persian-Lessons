import { readJSON, writeJSON } from './storage'

const KEY = 'puzzles'

function normalize(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((id): id is string => typeof id === 'string')
}

/** `dpl.v1.puzzles`: append-only ids, safe under denied or corrupt storage. */
export function completedPuzzles(): string[] {
  return normalize(readJSON<unknown>(KEY, []))
}

/** True only on the first completion; replays stay completed and pay no item reward. */
function completePuzzle(id: string): boolean {
  const current = completedPuzzles()
  if (current.includes(id)) return false
  writeJSON(KEY, [...current, id])
  return true
}

export function payPuzzle(id: string): 'item' | 'replay' {
  return completePuzzle(id) ? 'item' : 'replay'
}
