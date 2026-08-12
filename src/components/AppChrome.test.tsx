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

  it('marks lesson screens as part of Skrift', () => {
    renderChrome('/lesson/alphabet')

    expect(screen.getByRole('button', { name: 'Indstillinger' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Skrift' })).toHaveAttribute('aria-current', 'page')
  })

  it('shows the release version and dedication on the About tab', () => {
    renderChrome('/')
    fireEvent.click(screen.getByRole('button', { name: 'Indstillinger' }))

    const settingsTab = screen.getByRole('tab', { name: 'Indstillinger' })
    const aboutTab = screen.getByRole('tab', { name: 'Om' })
    expect(settingsTab).toHaveAttribute('aria-selected', 'true')

    settingsTab.focus()
    fireEvent.keyDown(settingsTab, { key: 'ArrowRight' })

    expect(aboutTab).toHaveFocus()
    expect(screen.getByRole('tabpanel', { name: 'Om' })).toBeVisible()
    expect(screen.getByText(__DPL_APP_VERSION__, { exact: true })).toBeVisible()
    expect(screen.getByText('Tilegnet Persia Bandpey.')).toBeVisible()
  })
})
