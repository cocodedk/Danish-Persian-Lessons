import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppChrome } from './AppChrome'

beforeEach(() => window.localStorage.clear())

function renderChrome(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppChrome />
    </MemoryRouter>,
  )
}

describe('AppChrome', () => {
  it('keeps the gear and parent destination visible on child word pages', () => {
    renderChrome('/opdag/ord/ab')

    const settings = screen.getByRole('button', { name: 'Indstillinger' })
    expect(settings).toBeVisible()
    expect(settings).toHaveTextContent('⚙')
    expect(screen.getByRole('link', { name: 'Ord' })).toHaveAttribute('aria-current', 'page')

    fireEvent.click(settings)
    expect(screen.getByRole('heading', { name: 'Indstillinger' })).toBeVisible()
  })

  it('marks lesson screens as part of Lektioner', () => {
    renderChrome('/lesson/alphabet')

    expect(screen.getByRole('button', { name: 'Indstillinger' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Lektioner' })).toHaveAttribute('aria-current', 'page')
  })
})
