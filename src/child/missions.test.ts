import { describe, expect, it } from 'vitest'
import { childMissions, findChildMission, tilesForMission } from './missions'

describe('child word missions', () => {
  it('starts with useful words for meeting people and immediate needs', () => {
    expect(childMissions.map(({ id }) => id)).toEqual([
      'salam', 'man', 'to', 'dust', 'ab', 'nan', 'baba',
      'madar', 'khane', 'in', 'an', 'ma', 'u',
    ])
    expect(childMissions.filter(({ imageEntryId }) => imageEntryId).map(({ id }) => id))
      .toEqual(childMissions.map(({ id }) => id))
  })

  it('finds only known mission ids', () => {
    expect(findChildMission('nan')?.word.da).toBe('brød')
    expect(findChildMission('unknown')).toBeUndefined()
  })

  it('gives every source letter a stable id and target position', () => {
    const nan = findChildMission('nan')!
    const tiles = tilesForMission(nan)

    expect(tiles.map((tile) => tile.glyph)).not.toEqual(Array.from(nan.word.fa))
    expect(tiles.map((tile) => tile.targetIndex).sort()).toEqual([0, 1, 2])
    expect(new Set(tiles.map((tile) => tile.id)).size).toBe(3)
  })
})
