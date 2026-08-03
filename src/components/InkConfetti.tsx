import './InkConfetti.css'

/**
 * Ink dots flicked across the paper, red and blue, the way a pen spatters.
 * Positions come off the index, never Math.random: the same celebration looks
 * the same every time, and a test can name what it sees.
 */
const DOTS = Array.from({ length: 14 }, (_, i) => ({
  /** Spread across the width, with the odd ones offset so it never reads as a row. */
  x: 4 + ((i * 37) % 92) + (i % 2 === 0 ? 0 : 3),
  /** Three drop distances, cycling. */
  drop: 34 + (i % 3) * 22,
  size: i % 4 === 0 ? 5 : 3.5,
  ink: i % 2 === 0 ? 'red' : 'blue',
  delay: (i % 5) * 40,
}))

/** Decorative only — the reward itself is the tick, the praise and the sticker. */
export function InkConfetti() {
  return (
    <span className="ink-confetti" aria-hidden="true">
      {DOTS.map((dot, index) => (
        <span
          key={index}
          className={`ink-confetti__dot ink-confetti__dot--${dot.ink}`}
          style={{
            insetInlineStart: `${dot.x}%`,
            inlineSize: `${dot.size}px`,
            blockSize: `${dot.size}px`,
            animationDelay: `${dot.delay}ms`,
            '--drop': `${dot.drop}px`,
          } as React.CSSProperties}
        />
      ))}
    </span>
  )
}
