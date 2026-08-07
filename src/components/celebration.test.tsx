import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { StickerStamp } from './StickerStamp'
import { StreakLine } from './StreakLine'
import { InkConfetti } from './InkConfetti'
import { GiftCard } from './GiftCard'
import { GIFT_ENTRY } from '../rewards/copy'
import { RewardShelf } from './RewardShelf'
import { Celebration } from './Celebration'
import { STICKER_LABELS, PRAISE } from '../rewards/copy'
import type { Reward } from '../rewards/types'

/** A reward with nothing loud in it — just enough shape to satisfy the type,
 *  so a test can swap in one field (usually `praise`) and render Celebration
 *  without going through the real engine for something this narrow. Not to be
 *  confused with `reward={null}`, the no-celebration-yet case tested above. */
const QUIET_REWARD: Reward = {
  ticks: 1,
  praise: PRAISE[0],
  stickers: [],
  levelUp: null,
  level: 1,
  points: 1,
  streak: { value: 1, resting: false, today: true },
  wokeUp: false,
  gift: null,
  sounds: ['tick'],
}

const stylesheets = import.meta.glob('./*.css', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/** The declarations inside the reduced-motion block of `css`, if it has one. */
function reducedMotionBlock(css: string): string {
  const match = css.match(/@media \(prefers-reduced-motion: reduce\) \{([\s\S]*?)\n\}/)
  return match?.[1] ?? ''
}

describe('stickers are the marks a teacher actually owns', () => {
  it('stamps آفرین, the ۲۰ mark and the gold star, each named in Danish for a screen reader', () => {
    for (const kind of ['afarin', 'bist', 'star'] as const) {
      const { unmount } = render(<StickerStamp kind={kind} />)
      expect(screen.getByRole('img', { name: STICKER_LABELS[kind].da })).toBeInTheDocument()
      unmount()
    }
  })

  it('writes the Persian on the stamps from the single-sourced STICKER_LABELS, with Persian digits', () => {
    render(<StickerStamp kind="bist" />)
    expect(screen.getByText(STICKER_LABELS.bist.fa)).toBeInTheDocument()
    expect(STICKER_LABELS.bist.fa).toBe('۲۰')
  })

  it('stamps the آفرین mark from STICKER_LABELS too — no JSX literal of its own', () => {
    render(<StickerStamp kind="afarin" />)
    expect(screen.getByText(STICKER_LABELS.afarin.fa)).toBeInTheDocument()
  })
})

describe('the celebration surface never celebrates a null reward', () => {
  it('renders zero ink-confetti when there is no reward yet', () => {
    const { container } = render(<Celebration reward={null} />)
    expect(container.querySelectorAll('.ink-confetti').length).toBe(0)
  })
})

describe('the praise row carries its own pronunciation (plan 009)', () => {
  it('renders fa, then the pron line, then da — the same order as any other specimen', () => {
    const { container } = render(<Celebration reward={null} />)
    const row = [...(container.querySelector('.celebration__praise')?.children ?? [])].map(
      (el) => el.className,
    )
    expect(row).toEqual([
      'progress-tick progress-tick--granted',
      'celebration__fa',
      'pron-line',
      'celebration__da',
    ])

    // The default praise (no reward yet) is PRAISE[0] — آفرین — from data, not improvised.
    expect(screen.getByText(PRAISE[0].fa)).toBeInTheDocument()
    expect(screen.getByText(`${PRAISE[0].pron?.da} · [${PRAISE[0].pron?.ipa}]`)).toBeInTheDocument()
    expect(screen.getByText(PRAISE[0].da)).toBeInTheDocument()
  })

  it('gives every praise pair a real pron line, not just the first', () => {
    for (const praise of PRAISE) {
      const { unmount } = render(<Celebration reward={{ ...QUIET_REWARD, praise }} />)
      expect(screen.getByText(`${praise.pron?.da} · [${praise.pron?.ipa}]`)).toBeInTheDocument()
      unmount()
    }
  })
})

describe('the streak line', () => {
  it('says nothing at all before the first practice day', () => {
    const { container } = render(<StreakLine streak={{ value: 0, resting: false, today: false }} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('marks a day already practised with the red tick, and a resting one without', () => {
    const { unmount } = render(<StreakLine streak={{ value: 3, resting: false, today: true }} />)
    expect(screen.getByLabelText('Øvet i dag')).toBeInTheDocument()
    unmount()

    render(<StreakLine streak={{ value: 3, resting: true, today: false }} />)
    expect(screen.queryByLabelText('Øvet i dag')).not.toBeInTheDocument()
    expect(screen.getByText('Træningen fortsætter stadig')).toBeInTheDocument()
  })
})

describe('the gift', () => {
  it('links into the bonus round and offers a free way out', () => {
    render(
      <MemoryRouter>
        <GiftCard
          gift={{ id: 'g2', ordinal: 2, entry: GIFT_ENTRY }}
          onSkip={() => {}}
        />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Åbn gaven' })).toHaveAttribute(
      'href',
      '/lesson/alphabet/gave/2',
    )
    expect(screen.getByRole('button', { name: 'Gem den til senere' })).toBeInTheDocument()
  })
})

describe('the sticker shelf keeps what was earned', () => {
  it('shows nothing until there is something to show, then mirrors the page line', () => {
    const { container, unmount } = render(<RewardShelf level={1} stickers={[]} />)
    expect(container).toBeEmptyDOMElement()
    unmount()

    render(<RewardShelf level={3} stickers={[{ id: 's1', kind: 'afarin' }]} />)
    expect(screen.getByText('En ny side')).toBeInTheDocument()
    expect(screen.getByText('صفحهٔ تازه')).toBeInTheDocument()
    expect(screen.getByText('safheje tåze · [sæfheje tɒːze]')).toBeInTheDocument()
  })
})

describe('reduced motion drops the animation, never the reward', () => {
  it('turns celebration animations off without hiding a single reward', () => {
    for (const sheet of ['./ProgressTick.css', './StickerStamp.css', './PageFlip.css']) {
      const block = reducedMotionBlock(stylesheets[sheet])
      expect(block, `${sheet} has no reduced-motion block`).toContain('animation: none')
      expect(block, `${sheet} hides a reward under reduced motion`).not.toMatch(
        /display:\s*none|visibility:\s*hidden|opacity:\s*0\b/,
      )
    }
  })

  it('drops the ink confetti, which is decoration and was never the reward', () => {
    // The dots carry aria-hidden, so nothing announced disappears with them.
    const { container } = render(<InkConfetti />)
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(reducedMotionBlock(stylesheets['./InkConfetti.css'])).toContain('display: none')
  })

  it('keeps every reward surface out of the reduced-motion block entirely when it has no animation', () => {
    // Celebration.css and StreakLine.css draw the reward itself; if they ever
    // grow a reduced-motion rule it must not hide anything.
    for (const sheet of ['./Celebration.css', './StreakLine.css', './RewardShelf.css']) {
      expect(reducedMotionBlock(stylesheets[sheet])).not.toMatch(
        /display:\s*none|visibility:\s*hidden/,
      )
    }
  })
})

describe('tap targets stay thumb-sized', () => {
  it('gives every reward control the 44px floor', () => {
    for (const declaration of ['min-block-size: var(--tap-min)']) {
      expect(stylesheets['./GiftCard.css']).toContain(declaration)
    }
    expect(stylesheets['./SettingsCorner.css']).toContain('min-height: var(--tap-min)')
  })
})
