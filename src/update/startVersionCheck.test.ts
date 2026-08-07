import { describe, expect, it, vi } from 'vitest'
import { refreshUrl, startVersionCheck } from './startVersionCheck'

describe('release version check', () => {
  it('keeps the route while adding the new version to the page URL', () => {
    const next = refreshUrl(
      'old-release',
      'new-release',
      'https://example.com/app/?name=Sara#/lesson/alphabet',
    )

    expect(next).toBe('https://example.com/app/?name=Sara&app-version=new-release#/lesson/alphabet')
  })

  it('does not reload the current release or repeat the same move', () => {
    expect(refreshUrl('same', 'same', 'https://example.com/app/#/')).toBeNull()
    expect(refreshUrl(
      'old',
      'new',
      'https://example.com/app/?app-version=new#/',
    )).toBeNull()
  })

  it('checks a fresh file and opens the new page without a hard reload', () => {
    const replace = vi.fn()
    const script = startVersionCheck({
      currentVersion: 'old',
      baseUrl: '/app/',
      pageUrl: 'https://example.com/app/#/ord-der-ligner',
      now: () => 123,
      readLatestVersion: () => 'new',
      replace,
    })

    expect(script.src).toBe('https://example.com/app/version.js?check=123')
    script.dispatchEvent(new Event('load'))
    expect(replace).toHaveBeenCalledWith(
      'https://example.com/app/?app-version=new#/ord-der-ligner',
    )
    expect(script).not.toBeInTheDocument()
  })
})
