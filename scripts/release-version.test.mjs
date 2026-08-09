import { describe, expect, it } from 'vitest'
import {
  highestVersionTag,
  incrementVersion,
  parseVersionTag,
  planRelease,
  releaseBump,
} from './release-version.mjs'

describe('release version planning', () => {
  it('accepts only complete v-prefixed semantic versions', () => {
    expect(parseVersionTag('v2.13.4')).toMatchObject({
      parts: [2, 13, 4],
      version: '2.13.4',
    })
    expect(parseVersionTag('2.13.4')).toBeNull()
    expect(parseVersionTag('v2.13')).toBeNull()
  })

  it('finds the numerically highest reachable release', () => {
    expect(highestVersionTag(['draft', 'v1.9.0', 'v1.10.0'])?.tag)
      .toBe('v1.10.0')
  })

  it('uses the largest conventional commit bump', () => {
    expect(releaseBump(['docs: clarify lesson', 'fix: repair route'])).toBe('patch')
    expect(releaseBump(['fix: repair route', 'feat: add bridge'])).toBe('minor')
    expect(releaseBump(['feat!: revise saved progress'])).toBe('major')
    expect(releaseBump(['feat: revise progress\n\nBREAKING CHANGE: new format']))
      .toBe('major')
  })

  it('finds a conventional PR title inside a merge commit', () => {
    const message = 'Merge pull request #42 from feature\n\nfeat: add release flow'
    expect(releaseBump([message])).toBe('minor')
  })

  it('increments major, minor, and patch versions', () => {
    expect(incrementVersion('1.2.3', 'major')).toBe('2.0.0')
    expect(incrementVersion('1.2.3', 'minor')).toBe('1.3.0')
    expect(incrementVersion('1.2.3', 'patch')).toBe('1.2.4')
  })

  it('starts an unversioned feature history at v0.1.0', () => {
    expect(planRelease({
      tags: [],
      headTags: [],
      messages: ['feat: first feature'],
    })).toEqual({
      bump: 'minor',
      existing: false,
      tag: 'v0.1.0',
      version: '0.1.0',
    })
  })

  it('reuses a release tag already attached to HEAD', () => {
    expect(planRelease({
      tags: ['v1.3.0'],
      headTags: ['v1.3.0'],
      messages: [],
    })).toMatchObject({
      bump: 'existing',
      existing: true,
      tag: 'v1.3.0',
      version: '1.3.0',
    })
  })
})
