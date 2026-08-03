import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'
import buttonCss from './Button.css?raw'
import globalCss from '../styles/global.css?raw'

/** Button.css without its comments — the guards below are about the rules. */
const css = buttonCss.replace(/\/\*[\s\S]*?\*\//g, '')

describe('Button', () => {
  it('labels say what happens, and clicking one does it', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Gem</Button>)
    const button = screen.getByRole('button', { name: 'Gem' })
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('is a plain button unless asked to submit', () => {
    render(<Button>Gem</Button>)
    expect(screen.getByRole('button', { name: 'Gem' })).toHaveAttribute('type', 'button')
  })

  it('submits when it is a form button', () => {
    render(<Button type="submit">Gem</Button>)
    expect(screen.getByRole('button', { name: 'Gem' })).toHaveAttribute('type', 'submit')
  })

  it('is filled pen-blue by default and quiet on request', () => {
    const { container } = render(
      <>
        <Button>Gem</Button>
        <Button variant="quiet">Spring over</Button>
      </>,
    )
    expect(container.querySelector('.btn--primary')).not.toBeNull()
    expect(container.querySelector('.btn--quiet')).not.toBeNull()
  })

  it('holds the 44px tap-target floor', () => {
    expect(css).toContain('min-block-size: var(--tap-min)')
    expect(css).toContain('min-inline-size: var(--tap-min)')
  })

  it('inherits the one focus ring the app owns, and never overrides it', () => {
    expect(globalCss).toContain(':focus-visible')
    expect(globalCss).toContain('outline: 2px solid var(--blue)')
    expect(globalCss).toContain('outline-offset: 2px')
    expect(css).not.toContain('focus-visible')
    expect(css).not.toContain('outline')
  })

  it('never lifts on hover — colour only', () => {
    expect(css).not.toContain('transform')
    expect(css).not.toContain('box-shadow')
  })
})
