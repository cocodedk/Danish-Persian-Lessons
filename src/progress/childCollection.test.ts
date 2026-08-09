import { beforeEach, describe, expect, it } from 'vitest'
import { writeJSON } from './storage'
import { addCollectedMission, getChildCollection } from './childCollection'

beforeEach(() => window.localStorage.clear())

describe('child collection', () => {
  it('starts empty and appends a mission once', () => {
    expect(getChildCollection()).toEqual([])

    expect(addCollectedMission('nan')).toBe(true)
    expect(addCollectedMission('nan')).toBe(false)
    expect(getChildCollection()).toEqual(['nan'])
  })

  it('keeps canonical order and ignores unknown or duplicate stored ids', () => {
    writeJSON('child-collection', {
      completedMissionIds: ['ab', 'unknown', 'salam', 'ab'],
    })

    expect(getChildCollection()).toEqual(['salam', 'ab'])
  })

  it('does not add an unknown mission', () => {
    expect(addCollectedMission('unknown')).toBe(false)
    expect(getChildCollection()).toEqual([])
  })
})
