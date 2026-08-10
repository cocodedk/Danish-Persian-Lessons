import { beforeEach, describe, expect, it } from 'vitest'
import { writeJSON } from './storage'
import { getJourneyChoice, hasCourseHistory, setJourneyChoice } from './journey'

beforeEach(() => window.localStorage.clear())

describe('journey preference', () => {
  it('starts without a preferred front door', () => {
    expect(getJourneyChoice()).toBeUndefined()
  })

  it('round-trips each supported choice', () => {
    setJourneyChoice('words')
    expect(getJourneyChoice()).toBe('words')

    setJourneyChoice('script')
    expect(getJourneyChoice()).toBe('script')

    setJourneyChoice('speak')
    expect(getJourneyChoice()).toBe('speak')
  })

  it('migrates old saved choices', () => {
    writeJSON('journey', { choice: 'child' })
    expect(getJourneyChoice()).toBe('words')
    writeJSON('journey', { choice: 'course' })
    expect(getJourneyChoice()).toBe('script')
  })

  it('ignores corrupt and unknown stored choices', () => {
    writeJSON('journey', { choice: 'surprise' })
    expect(getJourneyChoice()).toBeUndefined()

    writeJSON('journey', { choice: 7 })
    expect(getJourneyChoice()).toBeUndefined()
  })

  it('recognizes course records created before the journey choice existed', () => {
    expect(hasCourseHistory()).toBe(false)

    writeJSON('alphabet', { orientationSeen: true })
    expect(hasCourseHistory()).toBe(true)
  })

  it('does not mistake the child collection for course history', () => {
    writeJSON('child-collection', { completedMissionIds: ['ab'] })
    expect(hasCourseHistory()).toBe(false)
  })
})
